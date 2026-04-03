'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [robos, setRobos] = useState<any[]>([]);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    carregarRobos();
  }, []);

  async function carregarRobos() {
    const { data } = await supabase.from('robos').select('*');
    setRobos(data || []);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-5xl font-black">Dashboard Thunder AI</h1>
          <button 
            onClick={() => router.push('/robos')}
            className="flex items-center gap-3 bg-blue-600 px-8 py-4 rounded-3xl text-white font-medium"
          >
            <Plus /> Novo Robô
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {robos.length === 0 ? (
            <p className="col-span-3 text-center py-20 text-gray-400 text-xl">
              Nenhum robô criado ainda.<br />
              Clique em "Novo Robô" para começar.
            </p>
          ) : (
            robos.map((robo) => (
              <div 
                key={robo.id} 
                className="bg-zinc-900 p-8 rounded-3xl border border-white/10 hover:border-blue-500 transition-all cursor-pointer"
                onClick={() => router.push(`/robos/${robo.id}`)}
              >
                <h3 className="text-2xl font-semibold">{robo.nome}</h3>
                <p className="text-gray-400 mt-3">{robo.descricao || 'Sem descrição'}</p>
                <div className="mt-8 text-blue-400">Treinar / Conectar WhatsApp →</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
