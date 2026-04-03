'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Robos() {
  const [robos, setRobos] = useState<any[]>([]);
  const [nome, setNome] = useState('');
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadRobos();
  }, []);

  async function loadRobos() {
    const { data } = await supabase.from('robos').select('*');
    setRobos(data || []);
  }

  async function criarRobo() {
    if (!nome) return alert('Digite o nome do robô');

    const { error } = await supabase.from('robos').insert({
      nome,
      prompt: 'Você é um atendente profissional, educado e útil.'
    });

    if (error) alert(error.message);
    else {
      setNome('');
      setShowModal(false);
      loadRobos();
    }
  }

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-8">Meus Robôs</h1>

      <button onClick={() => setShowModal(true)} className="mb-8 bg-blue-600 px-8 py-4 rounded-3xl text-white">
        + Criar Novo Robô
      </button>

      <div className="grid grid-cols-3 gap-6">
        {robos.map(r => (
          <div key={r.id} className="bg-zinc-900 p-8 rounded-3xl" onClick={() => router.push(`/robos/${r.id}`)}>
            <h3 className="text-2xl font-bold">{r.nome}</h3>
            <button className="mt-6 text-blue-400">Treinar / Conectar WhatsApp →</button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
          <div className="bg-zinc-900 p-10 rounded-3xl w-96">
            <h2 className="text-2xl mb-6">Novo Robô</h2>
            <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome do robô" className="w-full p-4 bg-black rounded-2xl mb-6" />
            <button onClick={criarRobo} className="w-full py-5 bg-blue-600 rounded-3xl text-white">Criar</button>
          </div>
        </div>
      )}
    </div>
  );
}
