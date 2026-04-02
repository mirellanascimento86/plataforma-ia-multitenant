'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RobosPage() {
  const [robos, setRobos] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    carregarRobos();
  }, []);

  async function carregarRobos() {
    const { data } = await supabase.from('robos').select('*');
    setRobos(data || []);
  }

  async function criarRobo() {
    if (!nome) return alert("Nome do robô é obrigatório");

    const { error } = await supabase.from('robos').insert({
      nome,
      descricao: descricao || 'Robô de atendimento',
      prompt: 'Você é um atendente profissional, educado e útil.',
      status: 'inativo'
    });

    if (error) {
      alert("Erro: " + error.message);
    } else {
      setShowModal(false);
      setNome('');
      setDescricao('');
      carregarRobos();
    }
  }

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">Meus Robôs</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-3xl text-white font-medium"
        >
          <Plus size={20} /> Novo Robô
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {robos.length === 0 && <p className="col-span-3 text-gray-400 text-center py-10">Nenhum robô criado ainda. Clique em "Novo Robô".</p>}
        {robos.map((robo) => (
          <div key={robo.id} className="bg-zinc-900 border border-white/10 p-8 rounded-3xl hover:border-blue-500 transition-all">
            <h3 className="text-2xl font-semibold">{robo.nome}</h3>
            <p className="text-gray-400 mt-3">{robo.descricao}</p>
            <button 
              onClick={() => router.push(`/robos/${robo.id}`)}
              className="mt-8 w-full py-4 bg-blue-600 rounded-2xl text-white"
            >
              Gerenciar / Treinar
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-10 rounded-3xl w-full max-w-md">
            <h2 className="text-3xl font-bold mb-6">Criar Novo Robô</h2>
            <input 
              value={nome} 
              onChange={(e) => setNome(e.target.value)} 
              placeholder="Nome do robô" 
              className="w-full p-5 bg-black border border-white/20 rounded-2xl mb-4"
            />
            <textarea 
              value={descricao} 
              onChange={(e) => setDescricao(e.target.value)} 
              placeholder="Descrição (opcional)" 
              className="w-full p-5 bg-black border border-white/20 rounded-2xl h-32"
            />
            <div className="flex gap-4 mt-8">
              <button onClick={() => setShowModal(false)} className="flex-1 py-4 border border-white/30 rounded-2xl">Cancelar</button>
              <button onClick={criarRobo} className="flex-1 py-4 bg-blue-600 rounded-2xl">Criar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}