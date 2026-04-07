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
    personality: 'Atendente virtual profissional, rápida, empática e eficiente. Busca resolver na primeira interação sempre.',
    greeting_message: 'Olá! Sou a Ana, sua assistente virtual especializada em serviços técnicos. Como posso ajudar você hoje? 😊',
    services: [
      { 
        type: 'refrigeração', 
        name: 'Refrigeração', 
        questions: ['Quantos BTUs?', 'Marca e modelo?', 'Qual o problema?'] 
      },
      { 
        type: 'pintura', 
        name: 'Pintura Residencial', 
        questions: ['Metragem quadrada?', 'Quantos cômodos?', 'Tipo de superfície?'] 
      },
      { 
        type: 'maquina_lavar', 
        name: 'Máquina de Lavar', 
        questions: ['Marca e modelo?', 'Liga mas não funciona?', 'Apresenta algum erro?'] 
      },
    ],
    negotiation_script: `Quando cliente reclamar de preço:
1. Validar: "Entendo perfeitamente, orçamento é importante"
2. Justificar: "Inclui garantia 90 dias + peças originais"
3. Oferecer: "5% desconto à vista"
4. Limite: "10% é o máximo autorizado"`
  });

  const [whatsappConfig, setWhatsappConfig] = useState({
    phone_number_id: '',
    access_token: '',
    webhook_verify_token: '',
    business_account_id: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('personality');

  useEffect(() => {
    loadConfigs();
  }, []);

  async function loadConfigs() {
    // Carregar config do agente
    const { data: agentData } = await supabase
      .from('agent_configs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (agentData) {
      setConfig(prev => ({
        ...prev,
        ...agentData,
        services: agentData.services || prev.services
      }));
    }

    // Carregar config do WhatsApp
    const { data: whatsappData } = await supabase
      .from('whatsapp_configs')
      .select('*')
      .limit(1)
      .single();

    if (whatsappData) {
      setWhatsappConfig(whatsappData);
    }
  }

  async function saveAgentConfig() {
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
      setMessage('❌ Erro ao salvar: ' + error.message);
    } else {
      setMessage('✅ Configuração do agente salva!');
    }
    
    setIsSaving(false);
    setTimeout(() => setMessage(''), 3000);
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
      setMessage('❌ Erro WhatsApp: ' + error.message);
    } else {
      setMessage('✅ WhatsApp conectado! Configure o webhook na Meta.');
    }
    
    setIsSaving(false);
    setTimeout(() => setMessage(''), 5000);
  }

  const addService = () => {
    setConfig({
      ...config,
      services: [...config.services, { type: '', name: '', questions: [''] }]
    });
  };

  const updateService = (index: number, field: string, value: string) => {
    const newServices = [...config.services];
    newServices[index] = { ...newServices[index], [field]: value };
    setConfig({ ...config, services: newServices });
  };

  const addQuestion = (serviceIndex: number) => {
    const newServices = [...config.services];
    newServices[serviceIndex].questions.push('');
    setConfig({ ...config, services: newServices });
  };

  const updateQuestion = (serviceIndex: number, qIndex: number, value: string) => {
    const newServices = [...config.services];
    newServices[serviceIndex].questions[qIndex] = value;
    setConfig({ ...config, services: newServices });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">🤖 Treinamento do Agente de IA</h1>
          <p className="text-gray-600 mt-2">Configure como sua atendente virtual deve se comportar</p>
        </div>

        {message && (
          <div className={`p-4 mb-6 rounded-lg ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}

        {/* Abas */}
        <div className="flex space-x-4 mb-6 border-b">
          {[
            { id: 'personality', label: '🎭 Personalidade', icon: '🎭' },
            { id: 'services', label: '🔧 Serviços', icon: '🔧' },
            { id: 'negotiation', label: '💰 Negociação', icon: '💰' },
            { id: 'whatsapp', label: '📱 WhatsApp', icon: '📱' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-4 font-medium transition-colors ${
                activeTab === tab.id 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Conteúdo das Abas */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          
          {/* ABA: PERSONALIDADE */}
          {activeTab === 'personality' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome do Agente
                </label>
                <input
                  type="text"
                  value={config.name}
                  onChange={(e) => setConfig({...config, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Personalidade & Comportamento
                </label>
                <textarea
                  value={config.personality}
                  onChange={(e) => setConfig({...config, personality: e.target.value})}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descreva como o agente deve se comportar..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mensagem de Saudação Inicial
                </label>
                <textarea
                  value={config.greeting_message}
                  onChange={(e) => setConfig({...config, greeting_message: e.target.value})}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={saveAgentConfig}
                disabled={isSaving}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isSaving ? '💾 Salvando...' : '💾 Salvar Personalidade'}
              </button>
            </div>
          )}

          {/* ABA: SERVIÇOS */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Tipos de Serviço Atendidos</h3>
                <button
                  onClick={addService}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  + Adicionar Serviço
                </button>
              </div>

              {config.services.map((service, sIndex) => (
                <div key={sIndex} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Tipo (ID)</label>
                      <input
                        type="text"
                        value={service.type}
                        onChange={(e) => updateService(sIndex, 'type', e.target.value)}
                        placeholder="ex: refrigeracao"
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Nome (Exibição)</label>
                      <input
                        type="text"
                        value={service.name}
                        onChange={(e) => updateService(sIndex, 'name', e.target.value)}
                        placeholder="ex: Refrigeração"
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-600">Perguntas Específicas:</label>
                    {service.questions.map((q, qIndex) => (
                      <input
                        key={qIndex}
                        type="text"
                        value={q}
                        onChange={(e) => updateQuestion(sIndex, qIndex, e.target.value)}
                        placeholder={`Pergunta ${qIndex + 1}`}
                        className="w-full p-2 border rounded text-sm"
                      />
                    ))}
                    <button
                      onClick={() => addQuestion(sIndex)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      + Adicionar pergunta
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={saveAgentConfig}
                disabled={isSaving}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {isSaving ? '💾 Salvando...' : '💾 Salvar Serviços'}
              </button>
            </div>
          )}

          {/* ABA: NEGOCIAÇÃO */}
          {activeTab === 'negotiation' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Script de Negociação (Quando cliente reclamar de preço)
                </label>
                <textarea
                  value={config.negotiation_script}
                  onChange={(e) => setConfig({...config, negotiation_script: e.target.value})}
                  rows={8}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                />
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Dica:</strong> O agente vai seguir este script quando detectar palavras como "caro", "preço alto", "desconto", etc.
                </p>
              </div>

              <button
                onClick={saveAgentConfig}
                disabled={isSaving}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {isSaving ? '💾 Salvando...' : '💾 Salvar Script'}
              </button>
            </div>
          )}

          {/* ABA: WHATSAPP */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <h4 className="font-semibold text-blue-900 mb-2">📋 Instruções Meta Developers</h4>
                <ol className="text-sm text-blue-800 list-decimal list-inside space-y-1">
                  <li>Acesse <a href="https://developers.facebook.com" target="_blank" className="underline">developers.facebook.com</a></li>
                  <li>Crie app do tipo "Business"</li>
                  <li>Adicione produto "WhatsApp"</li>
                  <li>Em Webhook, use esta URL:</li>
                </ol>
                <code className="block bg-gray-800 text-green-400 p-3 rounded mt-2 text-xs break-all">
                  https://plataforma-ia-mul-git-3ebc63-mirellanascimento86-3324s-projects.vercel.app/api/webhook/whatsapp
                </code>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number ID
                  </label>
                  <input
                    type="text"
                    value={whatsappConfig.phone_number_id}
                    onChange={(e) => setWhatsappConfig({...whatsappConfig, phone_number_id: e.target.value})}
                    placeholder="123456789012345"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Access Token (Meta)
                  </label>
                  <input
                    type="password"
                    value={whatsappConfig.access_token}
                    onChange={(e) => setWhatsappConfig({...whatsappConfig, access_token: e.target.value})}
                    placeholder="EAAxxxxxxxx..."
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Webhook Verify Token (crie um segredo)
                  </label>
                  <input
                    type="text"
                    value={whatsappConfig.webhook_verify_token}
                    onChange={(e) => setWhatsappConfig({...whatsappConfig, webhook_verify_token: e.target.value})}
                    placeholder="meu_token_secreto_123"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Account ID (opcional)
                  </label>
                  <input
                    type="text"
                    value={whatsappConfig.business_account_id}
                    onChange={(e) => setWhatsappConfig({...whatsappConfig, business_account_id: e.target.value})}
                    placeholder="1234567890"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <button
                onClick={connectWhatsApp}
                disabled={isSaving}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
              >
                {isSaving ? '🔗 Conectando...' : '🔗 Conectar WhatsApp Business'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
