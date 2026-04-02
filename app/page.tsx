import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-indigo-600">Thunder AI</span>
        </div>
        <div className="flex items-center gap-8 text-sm font-medium">
          <a href="#recursos" className="hover:text-indigo-600">Recursos</a>
          <a href="#precos" className="hover:text-indigo-600">Preços</a>
          <a href="#faq" className="hover:text-indigo-600">FAQ</a>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-6 py-3 text-sm font-medium border rounded-2xl hover:bg-gray-100">
            Entrar
          </Link>
          <Link href="/cadastro" className="px-6 py-3 text-sm font-medium bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700">
            Criar conta grátis
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-5xl mx-auto text-center pt-24 pb-16 px-6">
        <h1 className="text-6xl font-bold leading-tight text-gray-900">
          Agentes de IA no WhatsApp<br />em minutos, 100% grátis
        </h1>
        <p className="text-2xl text-gray-600 mt-6 max-w-2xl mx-auto">
          Crie robôs inteligentes, conecte com token do WhatsApp, treine, intervenha e convide sua equipe.
        </p>
        <div className="flex gap-4 justify-center mt-10">
          <Link href="/cadastro" className="px-10 py-5 bg-indigo-600 text-white text-xl rounded-3xl hover:bg-indigo-700 flex items-center gap-3">
            Começar agora grátis →
          </Link>
          <Link href="/login" className="px-10 py-5 border-2 border-gray-300 text-xl rounded-3xl hover:bg-gray-100">
            Já tenho conta
          </Link>
        </div>
      </div>

      {/* Recursos */}
      <div id="recursos" className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Tudo que você precisa em um só lugar</h2>
          <div className="grid grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm">
              <h3 className="font-semibold text-2xl mb-3">Conexão com Token</h3>
              <p className="text-gray-600">Conecte seu WhatsApp usando token (Evolution API ou Baileys) em segundos.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm">
              <h3 className="font-semibold text-2xl mb-3">Treine seu Robô</h3>
              <p className="text-gray-600">Carregue PDFs, textos e faça o robô aprender o seu negócio.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm">
              <h3 className="font-semibold text-2xl mb-3">Intervenção Humana</h3>
              <p className="text-gray-600">Entre nas conversas a qualquer momento e assuma o controle.</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="text-center py-12 text-gray-500 text-sm">
        Thunder AI © 2026 • 100% grátis para sempre
      </footer>
    </div>
  )
}
