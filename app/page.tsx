import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="px-8 py-6 border-b flex justify-between">
        <span className="text-4xl font-bold text-indigo-600">Thunder AI</span>
        <div className="flex gap-4">
          <Link href="/login" className="px-8 py-3 border rounded-2xl">Entrar</Link>
          <Link href="/cadastro" className="px-8 py-3 bg-indigo-600 text-white rounded-2xl">Criar conta grátis</Link>
        </div>
      </nav>
      <div className="flex-1 flex items-center justify-center text-center px-6 pt-20">
        <div>
          <h1 className="text-6xl font-bold">Seu Robô de IA no WhatsApp</h1>
          <p className="text-2xl mt-6">Crie, treine e conecte agora</p>
          <Link href="/cadastro" className="mt-10 inline-block px-12 py-6 bg-indigo-600 text-white text-2xl rounded-3xl">
            Começar Agora
          </Link>
        </div>
      </div>
    </div>
  )
}
