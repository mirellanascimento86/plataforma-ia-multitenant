'use client';

import { useEffect } from 'react';

export default function Dashboard() {
  useEffect(() => {
    // Flash sutil de raio só uma vez
    const flash = document.getElementById('flash');
    if (flash) flash.style.opacity = '1';
  }, []);

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      {/* MENU MINIMALISTA */}
      <div className="w-64 bg-zinc-900 border-r border-white/10 p-6 flex flex-col">
        <div className="text-3xl font-black mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Thunder AI</div>
        
        <nav className="flex-1 space-y-2">
          <a href="/conversas" className="block px-6 py-4 hover:bg-white/10 rounded-2xl text-lg font-medium transition">Conversas</a>
          <a href="/robos" className="block px-6 py-4 hover:bg-white/10 rounded-2xl text-lg font-medium transition">Meus Robôs</a>
          <a href="/whatsapp" className="block px-6 py-4 hover:bg-white/10 rounded-2xl text-lg font-medium transition">Conectar WhatsApp</a>
          <a href="/agendamentos" className="block px-6 py-4 hover:bg-white/10 rounded-2xl text-lg font-medium transition">Calendário</a>
          <a href="/clientes" className="block px-6 py-4 hover:bg-white/10 rounded-2xl text-lg font-medium transition">Clientes</a>
          <a href="/planilhas" className="block px-6 py-4 hover:bg-white/10 rounded-2xl text-lg font-medium transition">Planilhas</a>
          <a href="/desempenho" className="block px-6 py-4 hover:bg-white/10 rounded-2xl text-lg font-medium transition">Desempenho & Gráficos</a>
        </nav>
      </div>

      {/* CONTEÚDO */}
      <div className="flex-1 p-10">
        <h1 className="text-5xl font-black">Bem-vindo à Thunder AI Corporation</h1>
        <p className="text-xl text-gray-400 mt-4">Seu robô já está pronto para trabalhar 24h.</p>
        
        <div className="mt-12 grid grid-cols-3 gap-6">
          <div className="bg-zinc-900 p-8 rounded-3xl border border-white/10">Criar novo robô</div>
          <div className="bg-zinc-900 p-8 rounded-3xl border border-white/10">Ver conversas ativas</div>
          <div className="bg-zinc-900 p-8 rounded-3xl border border-white/10">Conectar WhatsApp</div>
        </div>
      </div>
    </div>
  );
}
