'use client'

export default function Dashboard() {
  return (
    <div className="thunder-bg min-h-screen p-10">
      <h1 className="text-6xl font-black text-yellow-300">⚡ Thunder AI Corporation</h1>
      <p className="text-blue-300 text-2xl mt-4">Bem-vindo! Sua plataforma de robôs WhatsApp está pronta.</p>
      <div className="mt-12 grid grid-cols-2 gap-6">
        <a href="/conversas" className="block bg-zinc-900 p-8 rounded-3xl border border-yellow-400 hover:border-blue-400">Conversas ao vivo</a>
        <a href="/robos" className="block bg-zinc-900 p-8 rounded-3xl border border-yellow-400 hover:border-blue-400">Meus Robôs</a>
      </div>
    </div>
  )
}