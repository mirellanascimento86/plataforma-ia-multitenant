const WHATSAPP_VERSION = 'v18.0';

// Enviar mensagem de texto
export async function sendWhatsAppMessage(phoneNumberId: string, accessToken: string, to: string, message: string) {
  try {
    // Formata número brasileiro (remove 9º dígito se necessário)
    const formattedTo = to.startsWith('55') && to.length === 13 
      ? to.slice(0, 4) + to.slice(5) 
      : to;

    const res = await fetch(`https://graph.facebook.com/${WHATSAPP_VERSION}/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: formattedTo,
        type: 'text',
        text: { body: message },
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message);
    return data;
  } catch (error) {
    console.error('Erro WhatsApp:', error);
    throw error;
  }
}

// Enviar template (fora da janela 24h)
export async function sendTemplate(phoneNumberId: string, accessToken: string, to: string, templateName: string) {
  const res = await fetch(`https://graph.facebook.com/${WHATSAPP_VERSION}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: to,
      type: 'template',
      template: { name: templateName, language: { code: 'pt_BR' } },
    }),
  });
  return res.json();
}
