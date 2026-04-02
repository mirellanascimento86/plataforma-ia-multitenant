import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white">
      <div className="text-center max-w-2xl px-6">
        <h1 className="text-6xl font-bold mb-6">Thunder AI</h1>
        <p className="text-2xl mb-10">Sua plataforma de agentes de IA para WhatsApp 100% grátis</p>
        <div className="flex gap-6 justify-center">
          <Link href="/auth/login" className="px-10 py-4 bg-white text-indigo-700 rounded-3xl text-xl font-semibold hover:bg-gray-100">
            Entrar
          </Link>
          <Link href="/auth/cadastro" className="px-10 py-4 border-2 border-white rounded-3xl text-xl font-semibold hover:bg-white/10">
            Criar conta grátis
          </Link>
        </div>
      </div>
    </div>
  )
}
