import { headers } from 'next/headers';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function analyzeMedia(mediaUrl: string, mediaType: 'image' | 'video' | 'audio', context: string) {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.2-11b-vision-preview', // Modelo com visão para imagens
        messages: [
          {
            role: 'system',
            content: `Você é um assistente técnico especializado em análise de ${mediaType} para serviços de reparo. 
            Analise o conteúdo e forneça:
            1. Diagnóstico do problema
            2. Estimativa de gravidade (leve/moderado/grave)
            3. Possíveis causas
            4. Recomendações para o técnico
            5. Peças que provavelmente serão necessárias
            Contexto do cliente: ${context}`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analise este conteúdo e forneça um relatório técnico detalhado:'
              },
              {
                type: mediaType === 'image' ? 'image_url' : 'text',
                [mediaType === 'image' ? 'image_url' : 'text']: mediaType === 'image' ? { url: mediaUrl } : `URL do ${mediaType}: ${mediaUrl}`
              }
            ]
          }
        ],
        max_tokens: 1024,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Erro na análise Groq:', error);
    return null;
  }
}

export async function generateResponse(context: any, message: string, history: any[]) {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `Você é uma atendente virtual profissional chamada "Ana" de uma empresa de marketing digital que intermedi serviços técnicos.
            
            REGRAS ABSOLUTAS:
            1. Seja rápida, direta e profissional
            2. Sempre colete: tipo de serviço, bairro, e detalhes específicos (BTUs, metragem, marca/modelo)
            3. Nunca dê valores de orçamento sem visita técnica
            4. Negocie valores quando o cliente reclamar do preço (máximo 10% de desconto)
            5. Sempre confirme agenda com técnico antes de confirmar com cliente
            6. Mantenha tom humano, mas eficiente
            
            STATUS ATUAL DO ATENDIMENTO: ${context.status}
            SERVIÇO: ${context.service_type || 'Não definido'}
            TÉCNICO: ${context.technician_name || 'Não alocado'}
            
            HISTÓRICO: ${JSON.stringify(history.slice(-5))}`
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Erro na geração de resposta:', error);
    return "Desculpe, tive um problema técnico. Um atendente humano entrará em contato em breve.";
  }
}
