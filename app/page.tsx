'use client'

import { useEffect } from 'react'

export default function Dashboard() {
  useEffect(() => {
    // Som de trovão real (substitua pela URL do seu arquivo MP3 se quiser)
    const audio = new Audio('https://freesound.org/data/previews/276/276208_5121236-lq.mp3')
    audio.volume = 0.4
    audio.play().catch(() => {})

    document.documentElement.classList.add('thunder-shake')
    setTimeout(() => document.documentElement.classList.remove('thunder-shake'), 1500)
  }, [])

  return (
    <div className="thunder-bg min-h-screen flex">
      {/* MENU LATERAL PREMIUM */}
      <div className="w-72 bg-black border-r border-amber-400 p-6 flex flex-col">
        <div className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-blue-400 mb-12">
          THUNDER AI
        </div>

        <nav className="flex-1 space-y-2">
          <a href="/conversas" className="flex items-center gap-4 px-6 py-5 hover:bg-zinc-900 rounded-2xl text-lg font-medium transition-all">📡 Conversas ao vivo</a>
          <a href="/robos" className="flex items-center gap-4 px-6 py-5 hover:bg-zinc-900 rounded-2xl text-lg font-medium transition-all">🤖 Meus Robôs</a>
          <a href="/agendamentos" className="flex items-center gap-4 px-6 py-5 hover:bg-zinc-900 rounded-2xl text-lg font-medium transition-all">📅 Calendário</a>
          <a href="/clientes" className="flex items-center gap-4 px-6 py-5 hover:bg-zinc-900 rounded-2xl text-lg font-medium transition-all">👥 Clientes</a>
          <a href="/planilhas" className="flex items-center gap-4 px-6 py-5 hover:bg-zinc-900 rounded-2xl text-lg font-medium transition-all">📊 Planilhas</a>
          <a href="/whatsapp" className="flex items-center gap-4 px-6 py-5 hover:bg-zinc-900 rounded-2xl text-lg font-medium transition-all">🔌 Conectar WhatsApp</a>
          <a href="/desempenho" className="flex items-center gap-4 px-6 py-5 hover:bg-zinc-900 rounded-2xl text-lg font-medium transition-all">⚡ Desempenho da IA</a>
        </nav>

        <div className="mt-auto text-sm text-zinc-500">Thunder AI Corporation © 2026</div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex-1 p-10">
        <h1 className="text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-blue-400">
          Bem-vindo à Thunder AI
        </h1>
        <p className="text-2xl text-blue-300 mt-4">Seu robô já está pronto para substituir humanos no atendimento.</p>

        <div className="mt-16 grid grid-cols-3 gap-8">
          <div className="bg-zinc-900 border border-amber-400 rounded-3xl p-8 hover:scale-105 transition-all">
            <h2 className="text-3xl font-bold">Robôs Autônomos</h2>
            <p className="text-zinc-400 mt-4">IA que conversa com cliente e técnico, calcula valores e agenda.</p>
          </div>
          <div className="bg-zinc-900 border border-amber-400 rounded-3xl p-8 hover:scale-105 transition-all">
            <h2 className="text-3xl font-bold">Intervenção Humana</h2>
            <p className="text-zinc-400 mt-4">Assuma qualquer conversa em 1 clique.</p>
          </div>
          <div className="bg-zinc-900 border border-amber-400 rounded-3xl p-8 hover:scale-105 transition-all">
            <h2 className="text-3xl font-bold">WABA Oficial</h2>
            <p className="text-zinc-400 mt-4">WhatsApp Business API na nuvem do Meta.</p>
          </div>
        </div>
      </div>
    </div>
  )
}