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
    personality: 'Atendente virtual profissional, rápida, empática e eficiente.',
    greeting_message: 'Olá! Sou a Ana, sua assistente virtual. Como posso ajudar? 😊',
    services: [
      { type: 'refrigeração', name: 'Refrigeração', questions: ['BTUs?', 'Marca?', 'Problema?'] },
      { type: 'pintura', name: 'Pintura', questions: ['Metragem?', 'Cômodos?', 'Superfície?'] },
    ],
    negotiation_script: 'Quando reclamar de preço: 1) Validar 2) Justificar garantia 3) Oferecer 5% 4) Máx 10%'
  });

  const [whatsapp, setWhatsapp] = useState({
    phone_number_id: '',
    access_token: '',
    webhook_verify_token: '',
    business_account_id: ''
  });

  const [msg, setMsg] = useState('');
  const [tab, setTab] = useState('agent');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: agent } = await supabase.from('agent_configs').select('*').limit(1).single();
    if (agent) setConfig({...config, ...agent, services: agent.services || config.services});
    
    const { data: wa } = await supabase.from('whatsapp_configs').select('*').limit(1).single();
    if (wa) setWhatsapp(wa);
  }

  async function saveAgent() {
    const { error } = await supabase.from('agent_configs').upsert(config);
    setMsg(error ? '❌ Erro' : '✅ Salvo!');
    setTimeout(() => setMsg(''), 3000);
  }

  async function saveWhatsApp() {
    const { error } = await supabase.from('whatsapp_configs').upsert({...whatsapp, status: 'active'});
    setMsg(error ? '❌ Erro WhatsApp' : '✅ WhatsApp conectado!');
    setTimeout(() => setMsg(''), 5000);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🤖 Treinamento do Agente IA</h1>
        
        {msg && <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-6">{msg}</div>}

        <div className="flex space-x-4 mb-6 border-b">
          <button onClick={() => setTab('agent')} className={`pb-2 px-4 ${tab === 'agent' ? 'border-b-2 border-blue-600 text-blue-600' : ''}`}>🎭 Agente</button>
          <button onClick={() => setTab('whatsapp')} className={`pb-2 px-4 ${tab === 'whatsapp' ? 'border-b-2 border-blue-600 text-blue-600' : ''}`}>📱 WhatsApp</button>
        </div>

        {tab === 'agent' ? (
          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            <div>
              <label className="block font-medium mb-2">Nome do Agente</label>
              <input className="w-full p-3 border rounded-lg" value={config.name} onChange={e => setConfig({...config, name: e.target.value})} />
            </div>
            <div>
              <label className="block font-medium mb-2">Personalidade</label>
              <textarea className="w-full p-3 border rounded-lg" rows={3} value={config.personality} onChange={e => setConfig({...config, personality: e.target.value})} />
            </div>
            <div>
              <label className="block font-medium mb-2">Saudação Inicial</label>
              <textarea className="w-full p-3 border rounded-lg" rows={2} value={config.greeting_message} onChange={e => setConfig({...config, greeting_message: e.target.value})} />
            </div>
            <button onClick={saveAgent} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">💾 Salvar Agente</button>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg text-sm">
              <p className="font-semibold mb-2">📋 Configuração Meta Developers:</p>
              <p>Webhook URL: <code className="bg-gray-200 px-2 py-1 rounded">https://plataforma-ia-mul-git-3ebc63-mirellanascimento86-3324s-projects.vercel.app/api/webhook/whatsapp</code></p>
            </div>
            
            <input className="w-full p-3 border rounded-lg" placeholder="Phone Number ID" value={whatsapp.phone_number_id} onChange={e => setWhatsapp({...whatsapp, phone_number_id: e.target.value})} />
            <input className="w-full p-3 border rounded-lg" type="password" placeholder="Access Token" value={whatsapp.access_token} onChange={e => setWhatsapp({...whatsapp, access_token: e.target.value})} />
            <input className="w-full p-3 border rounded-lg" placeholder="Verify Token (crie um segredo)" value={whatsapp.webhook_verify_token} onChange={e => setWhatsapp({...whatsapp, webhook_verify_token: e.target.value})} />
            
            <button onClick={saveWhatsApp} className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">🔗 Conectar WhatsApp</button>
          </div>
        )}
      </div>
    </div>
  );
}
