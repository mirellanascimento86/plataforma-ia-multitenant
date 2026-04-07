import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateResponse, analyzeMedia } from '@/lib/groq';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Verificação do webhook (GET)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  // Buscar configuração do tenant pelo verify_token
  const { data: config } = await supabase
    .from('whatsapp_configs')
    .select('*')
    .eq('webhook_verify_token', token)
    .single();

  if (mode === 'subscribe' && config) {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse('Forbidden', { status: 403 });
}

// Recebimento de mensagens (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Extrair dados da mensagem
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];
    
    if (!message) {
      return NextResponse.json({ status: 'no_message' });
    }

    const phoneNumberId = value.metadata.phone_number_id;
    const from = message.from; // Número do cliente
    const messageType = message.type;
    
    // Buscar configuração do WhatsApp
    const { data: config } = await supabase
      .from('whatsapp_configs')
      .select('*, tenants(id)')
      .eq('phone_number_id', phoneNumberId)
      .single();

    if (!config) {
      return NextResponse.json({ error: 'Config not found' }, { status: 404 });
    }

    // Buscar ou criar ordem de serviço
    let { data: serviceOrder } = await supabase
      .from('service_orders')
      .select('*, technicians(*)')
      .eq('client_phone', from)
      .eq('tenant_id', config.tenant_id)
      .in('status', ['novo', 'visita_agendada', 'orcamento_enviado', 'negociacao'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Se não existe ordem ativa, criar nova
    if (!serviceOrder) {
      const { data: newOrder, error } = await supabase
        .from('service_orders')
        .insert({
          tenant_id: config.tenant_id,
          client_phone: from,
          status: 'novo',
          conversation_history: [],
        })
        .select()
        .single();

      if (error) throw error;
      serviceOrder = newOrder;
    }

    // Processar mídia (foto, vídeo, áudio)
    let mediaAnalysis = '';
    let messageContent = '';

    if (messageType === 'image' || messageType === 'video') {
      const mediaId = message[messageType].id;
      // Download e análise da mídia
      mediaAnalysis = await analyzeMedia(
        mediaId, 
        messageType, 
        `Serviço: ${serviceOrder.service_type || 'Não definido'}`
      );
      
      messageContent = `[${messageType.toUpperCase()} ENVIADO]`;
      
      // Atualizar ordem com análise
      await supabase
        .from('service_orders')
        .update({ media_analysis: mediaAnalysis })
        .eq('id', serviceOrder.id);
        
    } else if (messageType === 'audio') {
      messageContent = '[ÁUDIO - Transcrição necessária]';
      // Aqui você pode integrar com serviço de transcrição
    } else if (messageType === 'text') {
      messageContent = message.text.body;
    }

    // Salvar mensagem no histórico
    await supabase.from('messages').insert({
      service_order_id: serviceOrder.id,
      sender_type: 'client',
      sender_name: serviceOrder.client_name || 'Cliente',
      content: messageContent,
      media_url: message[messageType]?.id || null,
      media_type: messageType !== 'text' ? messageType : null,
    });

    // Atualizar histórico da conversa
    const updatedHistory = [
      ...(serviceOrder.conversation_history as any[] || []),
      { role: 'user', content: messageContent, timestamp: new Date().toISOString() }
    ];

    await supabase
      .from('service_orders')
      .update({ conversation_history: updatedHistory })
      .eq('id', serviceOrder.id);

    // Verificar se precisa de intervenção humana
    if (messageContent.toLowerCase().includes('atendente') || 
        messageContent.toLowerCase().includes('humano') ||
        messageContent.toLowerCase().includes('reclamação')) {
      
      await supabase
        .from('service_orders')
        .update({ 
          human_intervention_needed: true,
          human_intervention_reason: 'Solicitação explícita de atendente humano'
        })
        .eq('id', serviceOrder.id);

      await sendWhatsAppMessage(
        config.phone_number_id,
        config.access_token,
        from,
        "Entendo perfeitamente! Vou chamar um de nossos atendentes humanos agora mesmo. Por favor, aguarde um momento. ⏱️"
      );
      
      // Notificar humano via Telegram/WhatsApp
      await notifyHuman(serviceOrder, config.tenant_id);
      
      return NextResponse.json({ status: 'human_escalation' });
    }

    // Gerar resposta com IA
    const aiResponse = await generateResponse(serviceOrder, messageContent, updatedHistory);

    // Enviar resposta ao cliente
    await sendWhatsAppMessage(
      config.phone_number_id,
      config.access_token,
      from,
      aiResponse
    );

    // Salvar resposta da IA
    await supabase.from('messages').insert({
      service_order_id: serviceOrder.id,
      sender_type: 'bot',
      sender_name: 'Ana (IA)',
      content: aiResponse,
    });

    // Atualizar histórico com resposta
    updatedHistory.push({ 
      role: 'assistant', 
      content: aiResponse, 
      timestamp: new Date().toISOString() 
    });

    await supabase
      .from('service_orders')
      .update({ conversation_history: updatedHistory })
      .eq('id', serviceOrder.id);

    // Lógica de agendamento e técnico
    await processServiceLogic(serviceOrder, messageContent, config);

    return NextResponse.json({ status: 'success' });

  } catch (error) {
    console.error('Erro no webhook:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// Função para processar lógica do serviço
async function processServiceLogic(serviceOrder: any, message: string, config: any) {
  const lowerMsg = message.toLowerCase();
  
  // Identificar tipo de serviço
  if (!serviceOrder.service_type) {
    const services = ['refrigeração', 'ar condicionado', 'pintura', 'máquina de lavar', 'encanamento', 'elétrica'];
    for (const service of services) {
      if (lowerMsg.includes(service)) {
        let updateData: any = { service_type: service };
        
        // Perguntar detalhes específicos
        if (service.includes('refrigeração') || service.includes('ar')) {
          // Aguardar BTUs
        } else if (service.includes('pintura')) {
          // Aguardar metragem
        }
        
        await supabase
          .from('service_orders')
          .update(updateData)
          .eq('id', serviceOrder.id);
        break;
      }
    }
  }

  // Identificar bairro (simplificado - ideal usar API de endereços)
  if (!serviceOrder.neighborhood && serviceOrder.service_type) {
    const bairros = ['centro', 'zona sul', 'zona norte', 'zona leste', 'zona oeste', 'ipanema', 'copacabana'];
    for (const bairro of bairros) {
      if (lowerMsg.includes(bairro)) {
        await supabase
          .from('service_orders')
          .update({ neighborhood: bairro })
          .eq('id', serviceOrder.id);
        
        // Buscar técnico disponível
        await assignTechnician(serviceOrder.id, serviceOrder.service_type, bairro, config);
        break;
      }
    }
  }
}

// Função para atribuir técnico
async function assignTechnician(orderId: string, specialty: string, neighborhood: string, config: any) {
  // Buscar técnicos disponíveis
  const { data: technicians } = await supabase
    .from('technicians')
    .select('*')
    .eq('tenant_id', config.tenant_id)
    .eq('specialty', specialty)
    .eq('active', true)
    .contains('neighborhoods', [neighborhood]);

  if (technicians && technicians.length > 0) {
    // Pegar o primeiro disponível (ideal: verificar agenda)
    const technician = technicians[0];
    
    await supabase
      .from('service_orders')
      .update({ technician_id: technician.id })
      .eq('id', orderId);

    // Notificar técnico
    await notifyTechnician(technician, orderId);
  }
}

// Notificar técnico
async function notifyTechnician(technician: any, orderId: string) {
  // Implementar envio para grupo WhatsApp ou Telegram do técnico
  console.log(`Notificando técnico ${technician.name} sobre ordem ${orderId}`);
}

// Notificar humano
async function notifyHuman(serviceOrder: any, tenantId: string) {
  // Buscar config de notificação
  const { data: config } = await supabase
    .from('tenant_configs')
    .select('notification_whatsapp, notification_telegram')
    .eq('tenant_id', tenantId)
    .single();

  if (config?.notification_whatsapp) {
    // Enviar WhatsApp para atendente humano
  }
  
  if (config?.notification_telegram) {
    // Enviar Telegram
  }
}
