const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Analisar fotos/vídeos com IA
export async function analyzeMedia(mediaUrl: string, mediaType: 'image' | 'video', context: string) {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.2-11b-vision-preview',
        messages: [
          {
            role: 'system',
            content: `Você é técnico especialista. Analise ${mediaType} e responda:
1. Problema identificado
2. Gravidade (leve/moderado/grave)  
3. Causas prováveis
4. Peças necessárias
5. Tempo estimado
Contexto: ${context}`
          },
          {
            role: 'user',
            content: mediaType === 'image' 
              ? [{ type: 'image_url', image_url: { url: mediaUrl } }]
              : `Analise: ${mediaUrl}`
          }
        ],
        max_tokens: 800,
      }),
    });

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Não foi possível analisar';
  } catch (error) {
    console.error('Erro Groq:', error);
    return 'Erro na análise técnica';
  }
}

// Gerar respostas do atendente virtual
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
            content: `Você é "Ana", atendente virtual especializada em serviços técnicos.

REGRAS:
- Seja rápida, direta e simpática
- Use emojis com moderação
- Colete: serviço, bairro, detalhes técnicos (BTUs, metragem, marca)
- NUNCA dê preços antes da visita
- Negocie até 10% desconto quando reclamarem de preço
- Confirme com técnico antes de confirmar cliente

STATUS: ${context.status}
SERVIÇO: ${context.service_type || 'Não identificado'}
BAIRRO: ${context.neighborhood || 'Não informado'}
TÉCNICO: ${context.technicians?.name || 'Não atribuído'}

HISTÓRICO: ${JSON.stringify(history.slice(-3))}`
          },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 400,
      }),
    });

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Desculpe, não entendi. Pode repetir?';
  } catch (error) {
    console.error('Erro:', error);
    return 'Desculpe, tive um problema. Atendente humano notificado! 🚨';
  }
}
