import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b px-8 py-5 flex items-center justify-between bg-white sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="text-4xl font-bold text-indigo-600">Thunder AI</span>
        </div>
        <div className="flex gap-4">
          <Link 
            href="/login" 
            className="px-8 py-3 text-sm font-medium border rounded-2xl hover:bg-gray-100"
          >
            Entrar
          </Link>
          <Link 
            href="/cadastro" 
            className="px-8 py-3 text-sm font-medium bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700"
          >
            Criar conta grátis
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto text-center pt-28 pb-20 px-6">
        <h1 className="text-6xl font-bold text-gray-900 leading-tight">
          Agentes de IA no WhatsApp<br />100% grátis e profissional
        </h1>
        <p className="text-2xl text-gray-600 mt-6">
          Crie, treine e conecte seu robô em minutos.
        </p>
        <div className="flex gap-5 justify-center mt-12">
          <Link 
            href="/cadastro" 
            className="px-12 py-5 bg-indigo-600 text-white text-xl rounded-3xl hover:bg-indigo-700 font-semibold"
          >
            Começar Agora Grátis
          </Link>
          <Link 
            href="/login" 
            className="px-12 py-5 border-2 border-gray-300 text-xl rounded-3xl hover:bg-gray-100 font-semibold"
          >
            Já tenho conta
          </Link>
        </div>
      </div>
    </div>
  )
}
