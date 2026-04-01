'use client'

import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    const shake = () => {
      document.documentElement.classList.add('thunder-shake')
      setTimeout(() => document.documentElement.classList.remove('thunder-shake'), 1200)
    }
    shake()
  }, [])

  return (
    <div className="thunder-bg min-h-screen p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4">
          <span className="text-7xl">⚡</span>
          <div>
            <h1 className="text-7xl font-black tracking-tighter text-yellow-300">THUNDER AI CORPORATION</h1>
            <p className="text-3xl text-blue-300">Robôs WhatsApp com IA que tremem como trovão</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          {[
            { title: "Conversas", link: "/conversas", desc: "Intervenha ao vivo" },
            { title: "Meus Robôs", link: "/robos", desc: "Crie e treine" },
            { title: "Agendamentos", link: "/agendamentos", desc: "Calendário inteligente" },
            { title: "Clientes", link: "/clientes", desc: "Dados e planilhas" }
          ].map((item) => (
            <a
              key={item.title}
              href={item.link}
              className="bg-zinc-900 border border-yellow-400 hover:border-blue-400 p-8 rounded-3xl hover:scale-105 transition-all group"
            >
              <h2 className="text-3xl font-bold text-yellow-300 group-hover:text-white">{item.title}</h2>
              <p className="text-zinc-400 mt-3">{item.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}