'use client';

import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Navbar minimalista */}
      <nav className="border-b border-white/10 bg-black/90 backdrop-blur-md fixed w-full z-50">
        <div className="max-w-screen-2xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">⚡</div>
            <span className="text-3xl font-black tracking-tighter">Thunder AI</span>
          </div>
          <div className="flex items-center gap-8 text-sm font-medium">
            <a href="#recursos" className="hover:text-blue-400 transition">Recursos</a>
            <a href="#como-funciona" className="hover:text-blue-400 transition">Como funciona</a>
          </div>
          <div className="flex gap-4">
            <button onClick={() => router.push('/login')} className="px-6 py-3 text-sm font-medium hover:text-blue-400">Entrar</button>
            <button onClick={() => router.push('/cadastro')} className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl font-semibold text-white hover:brightness-110 transition">Criar agente grátis</button>
          </div>
        </div>
      </nav>

      {/* Hero centralizado */}
      <div className="flex-1 flex items-center justify-center pt-20 px-8 text-center max-w-4xl mx-auto">
        <div className="space-y-8">
          <h1 className="text-7xl font-black tracking-tighter leading-none">
            Automatize seu WhatsApp<br />
            com agentes de IA em minutos
          </h1>
          <p className="text-2xl text-gray-300 max-w-2xl mx-auto">
            Robôs que atendem 24h, conversam com técnicos, geram leads e substituem humanos.
          </p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => router.push('/cadastro')}
              className="px-12 py-6 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl text-white hover:scale-105 transition-all"
            >
              Criar meu primeiro agente
            </button>
          </div>
          <p className="text-sm text-gray-400">Grátis • Sem cartão • WhatsApp Business oficial</p>
        </div>
      </div>
    </div>
  );
}