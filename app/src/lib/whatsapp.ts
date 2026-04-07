const WHATSAPP_API_VERSION = 'v18.0';

export async function sendWhatsAppMessage(phoneNumberId: string, accessToken: string, to: string, message: string) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: to,
          type: 'text',
          text: { body: message },
        }),
      }
    );

    return await response.json();
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    throw error;
  }
}

export async function sendWhatsAppTemplate(
  phoneNumberId: string, 
  accessToken: string, 
  to: string, 
  templateName: string,
  languageCode: string = 'pt_BR',
  components: any[] = []
) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: to,
          type: 'template',
          template: {
            name: templateName,
            language: { code: languageCode },
            components: components,
          },
        }),
      }
    );

    return await response.json();
  } catch (error) {
    console.error('Erro ao enviar template:', error);
    throw error;
  }
}

export async function downloadMedia(mediaId: string, accessToken: string) {
  try {
    // Primeiro, pega a URL do media
    const mediaResponse = await fetch(
      `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${mediaId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );
    
    const mediaData = await mediaResponse.json();
    
    // Download do arquivo
    const fileResponse = await fetch(mediaData.url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    return await fileResponse.blob();
  } catch (error) {
    console.error('Erro ao baixar mídia:', error);
    return null;
  }
}
