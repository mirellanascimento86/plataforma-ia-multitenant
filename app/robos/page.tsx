'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RobosPage() {
  const [robos, setRobos] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const router = useRouter();

  useEffect(() => {
    carregarRobos();
  }, []);

  async function carregarRobos() {
    const { data } = await supabase.from('robos').select('*');
    setRobos(data || []);
  }

  async function criarRobo() {
    if (!nome) return alert("Nome é obrigatório");

    const { error } = await supabase.from('robos').insert({
      nome,
      descricao: descricao || '',
      prompt: 'Você é um atendente profissional e útil.',
      status: 'inativo'
    });

    if (error) alert("Erro: " + error.message);
    else {
      setShowModal(false);
      setNome('');
      setDescricao('');
      carregarRobos();
    }
  }

  return (
    <div className="p-10">
      <div className="flex justify-between mb-10">
        <h1 className="text-4xl font-bold">Meus Robôs</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-3 bg-blue-600 px-8 py-4 rounded-3xl text-white">
          <Plus /> Novo Robô
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {robos.length === 0 && <p className="col-span-3 text-gray-400">Nenhum robô criado ainda.</p>}
        {robos.map(robo => (
          <div key={robo.id} className="bg-zinc-900 p-8 rounded-3xl border border-white/10 hover:border-blue-400">
            <h3 className="text-2xl font-semibold">{robo.nome}</h3>
            <p className="text-gray-400">{robo.descricao}</p>
            <button onClick={() => router.push(`/robos/${robo.id}`)} className="mt-8 w-full py-4 bg-blue-600 rounded-2xl text-white">
              Gerenciar / Treinar
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-10 rounded-3xl w-full max-w-md">
            <h2 className="text-3xl font-bold mb-6">Criar Novo Robô</h2>
            <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome do robô" className="w-full p-5 bg-black border border-white/20 rounded-2xl mb-4" />
            <textarea value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Descrição" className="w-full p-5 bg-black border border-white/20 rounded-2xl h-32" />
            <button onClick={criarRobo} className="mt-6 w-full py-6 bg-blue-600 text-white rounded-3xl">Criar Robô</button>
          </div>
        </div>
      )}
    </div>
  );
}
