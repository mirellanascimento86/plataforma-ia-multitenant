import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-indigo-600">Thunder AI</span>
        </div>
        <div className="flex gap-4">
          <Link href="/auth/login" className="px-6 py-3 text-sm font-medium border rounded-2xl hover:bg-gray-100">
            Entrar
          </Link>
          <Link href="/auth/cadastro" className="px-6 py-3 text-sm font-medium bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700">
            Criar conta grátis
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto text-center pt-24 pb-16 px-6">
        <h1 className="text-6xl font-bold leading-tight text-gray-900">
          Agentes de IA no WhatsApp<br />em minutos, 100% grátis
        </h1>
        <p className="text-2xl text-gray-600 mt-6 max-w-2xl mx-auto">
          Crie robôs inteligentes, conecte com token do WhatsApp, treine, intervenha e convide sua equipe.
        </p>
        <div className="flex gap-4 justify-center mt-10">
          <Link href="/auth/cadastro" className="px-10 py-5 bg-indigo-600 text-white text-xl rounded-3xl hover:bg-indigo-700 flex items-center gap-3">
            Começar agora grátis →
          </Link>
          <Link href="/auth/login" className="px-10 py-5 border-2 border-gray-300 text-xl rounded-3xl hover:bg-gray-100">
            Já tenho conta
          </Link>
        </div>
      </div>

      <footer className="text-center py-12 text-gray-500 text-sm">
        Thunder AI © 2026 • 100% grátis
      </footer>
    </div>
  )
}
