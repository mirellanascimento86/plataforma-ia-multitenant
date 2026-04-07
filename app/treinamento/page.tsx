'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface AgenteConfig {
  id?: string;
  nome: string;
  instrucoes: string;
  temperatura: number;
  modelo: string;
  saudacao: string;
  whatsapp_token?: string;
  whatsapp_number_id?: string;
  webhook_verified?: boolean;
}

export default function TreinamentoPage() {
  const [config, setConfig] = useState<AgenteConfig>({
    nome: 'Assistente Virtual',
    instrucoes: '',
    temperatura: 0.7,
    modelo: 'llama3-70b-8192',
    saudacao: 'Olá! Sou seu assistente virtual. Como posso ajudar?'
  });
  const [loading, setLoading] = useState(false);
  const [whatsappToken, setWhatsappToken] = useState('');
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [webhookStatus, setWebhookStatus] = useState<'pending' | 'verified' | 'error'>('pending');
  const supabase = createClientComponentClient();

  useEffect(() => {
    carregarConfig();
  }, []);

  const carregarConfig = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('agentes')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setConfig(data);
      setWhatsappToken(data.whatsapp_token || '');
      setPhoneNumberId(data.whatsapp_number_id || '');
      setWebhookStatus(data.webhook_verified ? 'verified' : 'pending');
    }
  };

  const salvarConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const payload = {
      ...config,
      user_id: user.id,
      whatsapp_token: whatsappToken,
      whatsapp_number_id: phoneNumberId,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('agentes')
      .upsert(payload, { onConflict: 'user_id' });

    setLoading(false);
    
    if (!error) {
      alert('Configurações salvas com sucesso!');
    } else {
      alert('Erro ao salvar: ' + error.message);
    }
  };

  const verificarWebhook = async () => {
    setLoading(true);
    
    try {
      // Simular verificação do webhook
      const response = await fetch('/api/webhook/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token: whatsappToken, 
          phoneNumberId 
        })
      });

      if (response.ok) {
        setWebhookStatus('verified');
        await supabase
          .from('agentes')
          .update({ webhook_verified: true })
          .eq('whatsapp_number_id', phoneNumberId);
      } else {
        setWebhookStatus('error');
      }
    } catch (error) {
      setWebhookStatus('error');
    }
    
    setLoading(false);
  };

  const enviarMensagemTeste = async () => {
    if (!phoneNumberId || !whatsappToken) {
      alert('Configure o token do WhatsApp primeiro!');
      return;
    }

    const numeroTeste = prompt('Digite o número de telefone para teste (com código do país):');
    if (!numeroTeste) return;

    setLoading(true);
    
    try {
      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: numeroTeste,
          message: config.saudacao,
          phoneNumberId,
          token: whatsappToken
        })
      });

      if (response.ok) {
        alert('Mensagem de teste enviada!');
      } else {
        alert('Erro ao enviar mensagem');
      }
    } catch (error) {
      alert('Erro na conexão');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🤖 Treinamento do Agente de IA
        </h1>

        <div className="grid gap-6">
          {/* Configurações do Agente */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Personalidade do Agente</h2>
            
            <form onSubmit={salvarConfig} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Agente
                </label>
                <input
                  type="text"
                  value={config.nome}
                  onChange={(e) => setConfig({...config, nome: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Assistente de Vendas"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instruções de Sistema (Prompt)
                </label>
                <textarea
                  value={config.instrucoes}
                  onChange={(e) => setConfig({...config, instrucoes: e.target.value})}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Você é um assistente especializado em..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Defina aqui o comportamento, tom de voz e conhecimentos do seu agente
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Saudação Inicial
                </label>
                <input
                  type="text"
                  value={config.saudacao}
                  onChange={(e) => setConfig({...config, saudacao: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Olá! Como posso ajudar?"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Modelo
                  </label>
                  <select
                    value={config.modelo}
                    onChange={(e) => setConfig({...config, modelo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="llama3-70b-8192">Llama 3 70B</option>
                    <option value="llama3-8b-8192">Llama 3 8B</option>
                    <option value="mixtral-8x7b-32768">Mixtral 8x7B</option>
                    <option value="gemma-7b-it">Gemma 7B</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Criatividade (Temperatura)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={config.temperatura}
                    onChange={(e) => setConfig({...config, temperatura: parseFloat(e.target.value)})}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-600">{config.temperatura}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Salvando...' : '💾 Salvar Configurações'}
              </button>
            </form>
          </div>

          {/* Integração WhatsApp */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">📱 Integração WhatsApp Business</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Token de Acesso (Meta Developers)
                </label>
                <input
                  type="password"
                  value={whatsappToken}
                  onChange={(e) => setWhatsappToken(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  placeholder="EAAB..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Token gerado em developers.facebook.com → WhatsApp → API Setup
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number ID
                </label>
                <input
                  type="text"
                  value={phoneNumberId}
                  onChange={(e) => setPhoneNumberId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  placeholder="123456789012345"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium text-gray-900 mb-2">Webhook URL para Meta:</h3>
                <code className="bg-gray-200 px-2 py-1 rounded text-sm break-all">
                  https://plataforma-ia-mul-git-3ebc63-mirellanascimento86-3324s-projects.vercel.app/api/webhook/whatsapp
                </code>
                <p className="text-xs text-gray-600 mt-2">
                  Token de verificação: <strong>meu_bot_whatsapp_2024</strong>
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={verificarWebhook}
                  disabled={loading || !whatsappToken || !phoneNumberId}
                  className={`flex-1 py-2 px-4 rounded-md text-white ${
                    webhookStatus === 'verified' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : webhookStatus === 'error'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-gray-600 hover:bg-gray-700'
                  } disabled:opacity-50`}
                >
                  {webhookStatus === 'verified' ? '✅ Conectado' : 
                   webhookStatus === 'error' ? '❌ Erro - Tentar Novamente' : 
                   '🔗 Verificar Conexão'}
                </button>

                <button
                  onClick={enviarMensagemTeste}
                  disabled={loading || webhookStatus !== 'verified'}
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50"
                >
                  🧪 Enviar Teste
                </button>
              </div>
            </div>
          </div>

          {/* Preview do Agente */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">👁️ Preview do Agente</h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {config.nome.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{config.nome}</p>
                  <p className="text-xs text-green-600">● Online</p>
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="text-gray-800">{config.saudacao}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
