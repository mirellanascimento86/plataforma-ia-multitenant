'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RoboDetalhe() {
  const { id } = useParams() as { id: string };
  const [prompt, setPrompt] = useState('');
  const [whatsappToken, setWhatsappToken] = useState('');
  const [phoneId, setPhoneId] = useState('');

  useEffect(() => {
    carregarRobo();
  }, [id]);

  async function carregarRobo() {
    const { data } = await supabase.from('robos').select('*').eq('id', id).single();
    if (data) {
      setPrompt(data.prompt || '');
      setWhatsappToken(data.whatsapp_token || '');
      setPhoneId(data.whatsapp_phone_id || '');
    }
  }

  async function salvarPrompt() {
    await supabase.from('robos').update({ prompt }).eq('id', id);
    alert('✅ Prompt salvo! O robô agora está treinado.');
  }

  async function salvarWhatsApp() {
    await supabase.from('robos').update({
      whatsapp_token: whatsappToken,
      whatsapp_phone_id: phoneId
    }).eq('id', id);
    alert('✅ WhatsApp conectado! Agora configure o webhook no Meta.');
  }

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold">Gerenciando Robô</h1>

      <div className="grid grid-cols-2 gap-10 mt-12">
        <div className="bg-zinc-900 p-8 rounded-3xl">
          <h2 className="text-2xl font-bold mb-6">Treinar o Robô</h2>
          <textarea value={prompt} onChange={e => setPrompt(e.target.value)} className="w-full h-96 p-6 bg-black border border-white/20 rounded-3xl" />
          <button onClick={salvarPrompt} className="mt-6 w-full py-5 bg-green-600 rounded-3xl text-white font-bold">Salvar Treinamento</button>
        </div>

        <div className="bg-zinc-900 p-8 rounded-3xl">
          <h2 className="text-2xl font-bold mb-6">Conectar WhatsApp</h2>
          <input value={whatsappToken} onChange={e => setWhatsappToken(e.target.value)} placeholder="WhatsApp Token" className="w-full p-6 bg-black border border-white/20 rounded-3xl mb-4" />
          <input value={phoneId} onChange={e => setPhoneId(e.target.value)} placeholder="Phone ID" className="w-full p-6 bg-black border border-white/20 rounded-3xl mb-6" />
          <button onClick={salvarWhatsApp} className="w-full py-5 bg-blue-600 rounded-3xl text-white font-bold">Salvar Conexão</button>
        </div>
      </div>
    </div>
  );
}
