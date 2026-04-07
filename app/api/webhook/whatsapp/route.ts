import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateResponse, analyzeMedia } from '@/lib/groq';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Verificação do webhook (GET) - Meta Developers vai chamar isso
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
    
    // Extrair dados da mensagem do WhatsApp
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];
    
    if (!message) {
      return NextResponse.json({ status: 'no_message' });
    }

    const phoneNumberId = value.metadata.phone_number_id;
    const from = message.from; // Número do cliente (ex: 5511999999999)
    const messageType = message.type; // text, image, video, audio
    
    // Buscar configuração do WhatsApp no Supabase
    const { data: config } = await supabase
      .from('whatsapp_configs')
      .select('*, tenants(id)')
      .eq('phone_number_id', phoneNumberId)
      .single();

    if (!config) {
      return NextResponse.json({ error: 'Config not found' }, { status: 404 });
    }

    // Buscar ou criar ordem de serviço para este cliente
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

      if (error) {
        console.error('Erro criando ordem:', error);
        throw error;
      }
      serviceOrder = newOrder;
    }

    // Processar mídia (foto, vídeo, áudio) ou texto
    let mediaAnalysis = '';
    let messageContent = '';

    if (messageType === 'image' || messageType === 'video') {
      const mediaId = message[messageType].id;
      const mediaUrl = message[messageType].link || ''; // URL temporária da Meta
      
      // Análise com IA (Groq)
      mediaAnalysis = await analyzeMedia(
        mediaUrl, 
        messageType, 
        `Serviço: ${serviceOrder.service_type || 'Não definido ainda'}`
      );
      
      messageContent = `[${messageType.toUpperCase()} ENVIADO - Análise: ${mediaAnalysis}]`;
      
      // Atualizar ordem com análise
      await supabase
        .from('service_orders')
        .update({ media_analysis: mediaAnalysis })
        .eq('id', serviceOrder.id);
        
    } else if (messageType === 'audio') {
      messageContent = '[ÁUDIO RECEBIDO]';
      // Futuramente: transcrever com Whisper
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

    // Atualizar histórico da conversa na ordem de serviço
    const updatedHistory = [
      ...(serviceOrder.conversation_history as any[] || []),
      { role: 'user', content: messageContent, timestamp: new Date().toISOString() }
    ];

    await supabase
      .from('service_orders')
      .update({ conversation_history: updatedHistory })
      .eq('id', serviceOrder.id);

    // VERIFICAR SE PRECISA DE HUMANO (palavras-chave)
    const palavrasHumanas = ['atendente', 'humano', 'pessoa', 'reclamação', 'protesto', 'cancelar'];
    const precisaHumano = palavrasHumanas.some(palavra => 
      messageContent.toLowerCase().includes(palavra)
    );

    if (precisaHumano) {
      await supabase
        .from('service_orders')
        .update({ 
          human_intervention_needed: true,
          human_intervention_reason: 'Cliente solicitou atendente humano'
        })
        .eq('id', serviceOrder.id);

      await sendWhatsAppMessage(
        config.phone_number_id,
        config.access_token,
        from,
        "Entendo! Vou transferir você para um atendente humano agora mesmo. Por favor, aguarde um momento. 🙋‍♀️"
      );
      
      // Notificar humano via WhatsApp/Telegram
      await notificarHumano(serviceOrder, config.tenant_id);
      
      return NextResponse.json({ status: 'human_escalation' });
    }

    // GERAR RESPOSTA COM IA (Groq)
    const aiResponse = await generateResponse(serviceOrder, messageContent, updatedHistory);

    // Enviar resposta ao cliente via WhatsApp
    await sendWhatsAppMessage(
      config.phone_number_id,
      config.access_token,
      from,
      aiResponse
    );

    // Salvar resposta da IA no banco
    await supabase.from('messages').insert({
      service_order_id: serviceOrder.id,
      sender_type: 'bot',
      sender_name: 'Ana (IA)',
      content: aiResponse,
    });

    // Atualizar histórico com resposta da IA
    updatedHistory.push({ 
      role: 'assistant', 
      content: aiResponse, 
      timestamp: new Date().toISOString() 
    });

    await supabase
      .from('service_orders')
      .update({ conversation_history: updatedHistory })
      .eq('id', serviceOrder.id);

    // LÓGICA DE NEGÓCIO: Identificar serviço, bairro, técnico
    await processarLogicaServico(serviceOrder, messageContent, config);

    return NextResponse.json({ status: 'success' });

  } catch (error) {
    console.error('Erro no webhook WhatsApp:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// Função auxiliar: Processar lógica do serviço
async function processarLogicaServico(serviceOrder: any, message: string, config: any) {
  const lowerMsg = message.toLowerCase();
  
  // 1. Identificar tipo de serviço se ainda não tiver
  if (!serviceOrder.service_type) {
    const servicos = [
      { nome: 'refrigeração', keywords: ['geladeira', 'freezer', 'ar condicionado', 'btu', 'frio'] },
      { nome: 'pintura', keywords: ['pintar', 'parede', 'tinta', 'cor', 'metragem'] },
      { nome: 'máquina de lavar', keywords: ['lava', 'roupa', 'eletrolux', 'brastemp', 'centrifuga'] },
      { nome: 'encanamento', keywords: ['vazamento', 'cano', 'água', 'encanador', 'pia'] },
      { nome: 'elétrica', keywords: ['luz', 'tomada', 'disjuntor', 'fiação', 'eletricista'] }
    ];

    for (const servico of servicos) {
      if (servico.keywords.some(k => lowerMsg.includes(k))) {
        await supabase
          .from('service_orders')
          .update({ service_type: servico.nome })
          .eq('id', serviceOrder.id);
        
        // Perguntar detalhes específicos
        let perguntaEspecifica = '';
        if (servico.nome === 'refrigeração') perguntaEspecifica = 'Quantos BTUs tem o aparelho? E qual a marca?';
        else if (servico.nome === 'pintura') perguntaEspecifica = 'Qual a metragem quadrada aproximada?';
        else if (servico.nome === 'máquina de lavar') perguntaEspecifica = 'Qual a marca e modelo? E qual o problema?';
        
        if (perguntaEspecifica) {
          await sendWhatsAppMessage(
            config.phone_number_id,
            config.access_token,
            serviceOrder.client_phone,
            perguntaEspecifica
          );
        }
        break;
      }
    }
  }

  // 2. Identificar bairro se ainda não tiver
  if (!serviceOrder.neighborhood && serviceOrder.service_type) {
    // Lista de bairros comuns (adicione os seus)
    const bairros = ['centro', 'ipanema', 'copacabana', 'tijuca', 'madureira', 'barra', 'recreio'];
    
    for (const bairro of bairros) {
      if (lowerMsg.includes(bairro)) {
        await supabase
          .from('service_orders')
          .update({ neighborhood: bairro })
          .eq('id', serviceOrder.id);
        
        // Buscar técnico para este bairro e serviço
        await atribuirTecnico(serviceOrder.id, serviceOrder.service_type, bairro, config);
        break;
      }
    }
  }
}

// Função auxiliar: Atribuir técnico
async function atribuirTecnico(orderId: string, specialty: string, neighborhood: string, config: any) {
  // Buscar técnicos que atendem este bairro e especialidade
  const { data: tecnicos } = await supabase
    .from('technicians')
    .select('*')
    .eq('tenant_id', config.tenant_id)
    .eq('specialty', specialty)
    .eq('active', true)
    .contains('neighborhoods', [neighborhood]);

  if (tecnicos && tecnicos.length > 0) {
    // Pegar o primeiro disponível (ou implementar lógica de agenda)
    const tecnico = tecnicos[0];
    
    await supabase
      .from('service_orders')
      .update({ technician_id: tecnico.id })
      .eq('id', orderId);

    // Notificar técnico no WhatsApp ou grupo
    await notificarTecnico(tecnico, orderId);
  }
}

// Função auxiliar: Notificar técnico
async function notificarTecnico(tecnico: any, orderId: string) {
  // Implementar envio de mensagem para o técnico
  console.log(`🔔 Notificando técnico ${tecnico.name} sobre ordem ${orderId}`);
  // Aqui você pode enviar WhatsApp direto para o técnico ou para um grupo
}

// Função auxiliar: Notificar atendente humano
async function notificarHumano(serviceOrder: any, tenantId: string) {
  // Buscar config de notificação do tenant
  const { data: tenantConfig } = await supabase
    .from('tenant_configs')
    .select('notification_phone, notification_telegram')
    .eq('tenant_id', tenantId)
    .single();

  if (tenantConfig?.notification_phone) {
    // Enviar WhatsApp para atendente humano avisando
    console.log(`🚨 ALERTA HUMANO: Atendimento ${serviceOrder.id} precisa de intervenção`);
  }
}
