'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [workspace, setWorkspace] = useState('Meu Workspace');
  const [robos, setRobos] = useState<any[]>([]);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    // Carrega robôs (por enquanto fake — depois conectamos ao banco)
    setRobos([
      { id: 1, nome: 'Atendente Reforma', objetivo: 'Agendar visitas técnicas' },
      { id: 2, nome: 'Suporte Técnico', objetivo: 'Responder dúvidas de clientes' }
    ]);
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      {/* MENU LATERAL MINIMALISTA */}
      <div className="w-64 bg-zinc-900 border-r border-white/10 p-6">
        <div className="flex items-center justify-between mb-10">
          <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Thunder AI</div>
        </div>

        <nav className="space-y-1">
          <a href="/dashboard" className="flex items-center gap-3 px-5 py-4 bg-white/10 rounded-2xl text-lg font-medium">🏠 Lar</a>
          <a href="/robos" className="flex items-center gap-3 px-5 py-4 hover:bg-white/10 rounded-2xl text-lg font-medium">🤖 Robôs</a>
          <a href="/conversas" className="flex items-center gap-3 px-5 py-4 hover:bg-white/10 rounded-2xl text-lg font-medium">💬 Conversas</a>
          <a href="/whatsapp" className="flex items-center gap-3 px-5 py-4 hover:bg-white/10 rounded-2xl text-lg font-medium">📱 WhatsApp</a>
          <a href="/agendamentos" className="flex items-center gap-3 px-5 py-4 hover:bg-white/10 rounded-2xl text-lg font-medium">📅 Calendário</a>
          <a href="/planilhas" className="flex items-center gap-3 px-5 py-4 hover:bg-white/10 rounded-2xl text-lg font-medium">📊 Planilhas</a>
          <a href="/desempenho" className="flex items-center gap-3 px-5 py-4 hover:bg-white/10 rounded-2xl text-lg font-medium">📈 Desempenho</a>
        </nav>

        <div className="mt-auto pt-8">
          <button onClick={logout} className="w-full py-4 text-red-400 hover:bg-white/10 rounded-2xl text-lg">Sair da conta</button>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex-1">
        {/* TOP BAR */}
        <div className="h-16 border-b border-white/10 bg-black/90 flex items-center px-8 justify-between">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-xl">{workspace}</span>
            <button className="text-blue-400 text-sm">Trocar workspace ↓</button>
          </div>

          <div className="flex items-center gap-6">
            <button>🛎️</button>
            <button>💬</button>
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white">👤</div>
          </div>
        </div>

        <div className="p-10">
          <h1 className="text-5xl font-black">Olá, bem-vindo de volta!</h1>
          <p className="text-gray-400 mt-2">Aqui estão seus agentes de IA</p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {robos.length === 0 ? (
              <p className="text-gray-400">Nenhum robô criado ainda. Vá em "Robôs" e crie o primeiro!</p>
            ) : (
              robos.map((robo) => (
                <div key={robo.id} className="bg-zinc-900 p-8 rounded-3xl border border-white/10 hover:border-blue-400 transition-all cursor-pointer" onClick={() => router.push(`/robos/${robo.id}`)}>
                  <h3 className="text-2xl font-semibold">{robo.nome}</h3>
                  <p className="text-gray-400 mt-2">{robo.objetivo}</p>
                  <div className="mt-6 text-blue-400 text-sm">Clique para gerenciar →</div>
                </div>
              ))
            )}
          </div>

          <button onClick={() => router.push('/robos')} className="mt-10 px-10 py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-3xl text-xl font-bold">
            + Criar novo robô
          </button>
        </div>
      </div>
    </div>
  );
}