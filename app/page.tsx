'use client'

import { useEffect } from 'react'

export default function Dashboard() {
  useEffect(() => {
    document.documentElement.classList.add('thunder-shake')
    setTimeout(() => {
      document.documentElement.classList.remove('thunder-shake')
    }, 1200)
  }, [])

  return (
    <div className="thunder-bg min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-6xl font-black tracking-tighter text-yellow-300 flex items-center gap-4">
          ⚡ Thunder AI Corporation
        </h1>
        <p className="text-blue-300 text-2xl mt-2">Seu robô WhatsApp já está tremendo de poder</p>

        {/* Menu deslizante premium */}
        <div className="mt-12 grid grid-cols-4 gap-6">
          <a href="/conversas" className="bg-zinc-900 border border-yellow-400 hover:border-blue-400 rounded-3xl p-8 hover:scale-105 transition-all">
            <h2 className="text-2xl font-bold">Conversas</h2>
            <p className="text-zinc-400">Intervenha ao vivo</p>
          </a>
          <a href="/robos" className="bg-zinc-900 border border-yellow-400 hover:border-blue-400 rounded-3xl p-8 hover:scale-105 transition-all">
            <h2 className="text-2xl font-bold">Meus Robôs</h2>
          </a>
          <a href="/agendamentos" className="bg-zinc-900 border border-yellow-400 hover:border-blue-400 rounded-3xl p-8 hover:scale-105 transition-all">
            <h2 className="text-2xl font-bold">Calendário</h2>
          </a>
          <a href="/clientes" className="bg-zinc-900 border border-yellow-400 hover:border-blue-400 rounded-3xl p-8 hover:scale-105 transition-all">
            <h2 className="text-2xl font-bold">Clientes</h2>
          </a>
        </div>
      </div>
    </div>
  )
}
