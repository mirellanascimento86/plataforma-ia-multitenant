'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AgentTraining() {
  const [config, setConfig] = useState({
    name: 'Ana',
    personality: 'Profissional, rápida, empática e eficiente. Sempre busca resolver na primeira interação.',
    greeting_message: 'Olá! Sou a Ana, sua assistente virtual. Em que posso ajudar você hoje? 😊',
    services: [
      { type: 'refrigeracao', name: 'Refrigeração', questions: ['Quantos BTUs?', 'Marca e modelo?', 'Problema apresentado?'] },
      { type: 'pintura', name: 'Pintura', questions: ['Metragem quadrada?', 'Tipo de superfície?', 'Quantos cômodos?'] },
      { type: 'maquina_lavar', name: 'Máquina de Lavar', questions: ['Marca e modelo?', 'Problema apresentado?', 'Liga mas não funciona?'] },
    ],
    negotiation_script: `Quando cliente reclamar de preço:
1. Validar: "Entendo perfeitamente sua preocupação"
2. Justificar: "O valor inclui garantia de 90 dias e peças originais"
3. Oferecer: "Posso conseguir 5% de desconto para pagamento à vista"
4. Máximo: "10% é o máximo que consigo autorizar"`
  });

  const [whatsappConfig, setWhatsappConfig] = useState({
    phone_number_id: '',
    access_token: '',
    webhook_verify_token: '',
    business_account_id: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadConfig();
  }, []);

  async function loadConfig() {
    // Carregar configuração existente
    const { data: agentData } = await supabase
      .from('agent_configs')
      .select('*')
      .single();

    if (agentData) {
      setConfig({
        ...config,
        ...agentData,
        services: agentData.services || config.services
      });
    }

    const { data: whatsappData } = await supabase
      .from('whatsapp_configs')
      .select('*')
      .single();

    if (whatsappData) {
      setWhatsappConfig(whatsappData);
    }
  }

  async function saveConfig() {
    setIsSaving(true);
    
    const { error } = await supabase
      .from('agent_configs')
      .upsert({
        name: config.name,
        personality: config.personality,
        greeting_message: config.greeting_message,
        services: config.services,
        negotiation_script: config.negotiation_script,
      });

    if (error) {
      setMessage('Erro ao salvar: ' + error.message);
    } else {
      setMessage('Configuração salva com sucesso! ✅');
    }
    
    setIsSaving(false);
  }

  async function connectWhatsApp() {
    setIsSaving(true);
    
    const { error } = await supabase
      .from('whatsapp_configs')
      .upsert({
        phone_number_id: whatsappConfig.phone_number_id,
        access_token: whatsappConfig.access_token,
        webhook_verify_token: whatsappConfig.webhook_verify_token,
        business_account_id: whatsappConfig.business_account_id,
        status: 'active'
      });

    if (error) {
      setMessage('Erro ao conectar WhatsApp: ' + error.message);
    } else {
      setMessage('WhatsApp conectado! Configure o webhook na Meta Developers com a URL: ' + 
        `${window.location.origin}/api/webhook/whatsapp`);
    }
    
    setIsSaving(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🤖 Treinamento do Agente de IA</h1>
        
        {message && (
          <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-6 rounded">
            <p className="text-blue-700">{message}</p>
          </div>
        )}

        {/* Configuração da Personalidade */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">🎭 Personalidade do Agente</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nome do Agente</label>
              <input
                type="text"
                value={config.name}
                onChange={(e) => setConfig({...config, name: e.target.value})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Personalidade</label>
              <textarea
                value={config.personality}
                onChange={(e) => setConfig({...config, personality: e.target.value})}
                rows={3}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Mensagem de Saudação</label>
              <textarea
                value={config.greeting_message}
                onChange={(e) => setConfig({...config, greeting_message: e.target.value})}
                rows={2}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Configuração de Serviços */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">🔧 Tipos de Serviço</h2>
          
          {config.services.map((service, index) => (
            <div key={index} className="border rounded-lg p-4 mb-4 bg-gray-50">
              <div className="grid grid-cols-2 gap-4 mb-3">
                <input
                  type="text"
                  placeholder="Tipo (ex: refrigeracao)"
                  value={service.type}
                  onChange={(e) => {
                    const newServices = [...config.services];
                    newServices[index].type = e.target.value;
                    setConfig({...config, services: newServices});
                  }}
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Nome (ex: Refrigeração)"
                  value={service.name}
                  onChange={(e) => {
                    const newServices = [...config.services];
                    newServices[index].name = e.target.value;
                    setConfig({...config, services: newServices});
                  }}
                  className="p-2 border rounded"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Perguntas específicas:</label>
                {service.questions.map((q, qIndex) => (
                  <input
                    key={qIndex}
                    type="text"
                    value={q}
                    onChange={(e) => {
                      const newServices = [...config.services];
                      newServices[index].questions[qIndex] = e.target.value;
                      setConfig({...config, services: newServices});
                    }}
                    className="w-full p-2 border rounded text-sm"
                  />
                ))}
              </div>
            </div>
          ))}
          
          <button
            onClick={() => setConfig({
              ...config, 
              services: [...config.services, { type: '', name: '', questions: [''] }]
            })}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            + Adicionar Serviço
          </button>
        </div>

        {/* Script de Negociação */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">💰 Script de Negociação</h2>
          <textarea
            value={config.negotiation_script}
            onChange={(e) => setConfig({...config, negotiation_script: e.target.value})}
            rows={6}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={saveConfig}
          disabled={isSaving}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 mb-8"
        >
          {isSaving ? 'Salvando...' : '💾 Salvar Configuração do Agente'}
        </button>

        {/* Conexão WhatsApp Business */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">📱 Conectar WhatsApp Business</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number ID</label>
              <input
                type="text"
                value={whatsappConfig.phone_number_id}
                onChange={(e) => setWhatsappConfig({...whatsappConfig, phone_number_id: e.target.value})}
                placeholder="123456789012345"
                className="w-full p-3 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Access Token (Meta)</label>
              <input
                type="password"
                value={whatsappConfig.access_token}
                onChange={(e) => setWhatsappConfig({...whatsappConfig, access_token: e.target.value})}
                placeholder="EAAxxxxxxxx..."
                className="w-full p-3 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Webhook Verify Token</label>
              <input
                type="text"
                value={whatsappConfig.webhook_verify_token}
                onChange={(e) => setWhatsappConfig({...whatsappConfig, webhook_verify_token: e.target.value})}
                placeholder="seu_token_secreto_aqui"
                className="w-full p-3 border rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">Crie um token aleatório forte</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Business Account ID (opcional)</label>
              <input
                type="text"
                value={whatsappConfig.business_account_id}
                onChange={(e) => setWhatsappConfig({...whatsappConfig, business_account_id: e.target.value})}
                placeholder="1234567890"
                className="w-full p-3 border rounded-lg"
              />
            </div>
          </div>

          <button
            onClick={connectWhatsApp}
            disabled={isSaving}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 mt-6"
          >
            {isSaving ? 'Conectando...' : '🔗 Conectar WhatsApp Business'}
          </button>

          <div className="mt-4 p-4 bg-yellow-50 rounded-lg text-sm">
            <p className="font-semibold mb-2">📋 Instruções Meta Developers:</p>
            <ol className="list-decimal list-inside space-y-1 text-gray-700">
              <li>Acesse: developers.facebook.com</li>
              <li>Crie um app do tipo "Business"</li>
              <li>Adicione o produto "WhatsApp"</li>
              <li>Em Configurações {'>'} Webhook, use esta URL:</li>
              <code className="block bg-gray-200 p-2 rounded mt-1 break-all">
                https://plataforma-ia-mul-git-3ebc63-mirellanascimento86-3324s-projects.vercel.app/api/webhook/whatsapp
              </code>
              <li>Use o Verify Token que você criou acima</li>
              <li>Assine os campos: messages, message_deliveries, message_reads</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
