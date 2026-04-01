'use client';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function Robos() {
  const [nome, setNome] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const criarRobo = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('robos').insert({
      nome,
      workspace_id: 'uuid-do-workspace-aqui', // vamos melhorar depois
      objetivo: 'Atendimento geral',
      prompt: 'Você é um atendente profissional...'
    });

    alert('Robô criado com sucesso!');
    router.push('/dashboard');
  };

  return (
    <div className="p-10">
      <h1 className="text-4xl font-black">Meus Robôs</h1>
      <div className="mt-8 max-w-md">
        <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome do robô" className="w-full bg-zinc-900 border border-white/20 p-5 rounded-3xl" />
        <button onClick={criarRobo} className="mt-6 w-full py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-3xl text-xl">Criar robô agora</button>
      </div>
    </div>
  );
}