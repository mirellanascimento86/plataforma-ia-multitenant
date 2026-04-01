'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    // Flash sutil de raio no hero (só 1x no carregamento)
    const hero = document.getElementById('hero');
    if (hero) {
      hero.classList.add('hero-flash');
      setTimeout(() => hero.classList.remove('hero-flash'), 3000);
    }
  }, []);

  return (
    <div className="thunder-bg min-h-screen">
      {/* NAVBAR */}
      <nav className="border-b border-white/10 bg-black/80 backdrop-blur-lg fixed w-full z-50">
        <div className="max-w-screen-2xl mx-auto px-10 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#0066FF] to-[#6A00FF] rounded-2xl flex items-center justify-center text-white font-bold text-2xl">⚡</div>
            <span className="text-3xl font-black tracking-tighter text-white">Thunder AI</span>
          </div>

          <div className="hidden md:flex items-center gap-10 text-sm font-medium">
            <a href="#recursos" className="hover:text-[#0066FF] transition-colors">Recursos</a>
            <a href="#como-funciona" className="hover:text-[#0066FF] transition-colors">Como funciona</a>
            <a href="#precos" className="hover:text-[#0066FF] transition-colors">Preços</a>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/login')}
              className="px-6 py-3 text-sm font-semibold hover:text-[#0066FF] transition-colors"
            >
              Entrar
            </button>
            <button
              onClick={() => router.push('/cadastro')}
              className="px-8 py-3 bg-white text-black font-semibold rounded-3xl hover:bg-[#0066FF] hover:text-white transition-all"
            >
              Criar agente grátis
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section id="hero" className="pt-28 pb-20 px-10 max-w-screen-2xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <h1 className="text-7xl md:text-8xl font-black tracking-tighter leading-none">
            Automatize seu WhatsApp<br />
            com <span className="bg-gradient-to-r from-[#0066FF] to-[#6A00FF] bg-clip-text text-transparent">agentes de IA</span><br />
            em minutos
          </h1>

          <p className="text-2xl text-gray-300 max-w-lg">
            Crie robôs inteligentes que atendem clientes 24h, geram leads e substituem humanos no atendimento.
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/cadastro')}
              className="px-10 py-6 bg-gradient-to-r from-[#0066FF] to-[#6A00FF] text-white font-bold text-xl rounded-3xl hover:scale-105 transition-all shadow-2xl shadow-[#0066FF]/50"
            >
              Criar meu agente grátis
            </button>
            <button
              onClick={() => router.push('/login')}
              className="px-8 py-6 border border-white/30 hover:border-white/70 text-white font-medium rounded-3xl transition-all"
            >
              Já tenho conta
            </button>
          </div>

          <div className="flex items-center gap-8 text-sm text-gray-400">
            <div>✅ Sem cartão</div>
            <div>✅ Plano gratuito para sempre</div>
            <div>✅ WhatsApp Business API oficial</div>
          </div>
        </div>

        {/* DEMO CHAT */}
        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 shadow-2xl max-w-md mx-auto md:mx-0">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <p className="text-sm font-medium">Agente Thunder • Online agora</p>
          </div>

          <div className="space-y-6">
            <div className="bg-[#6A00FF]/10 p-4 rounded-2xl text-right">
              <p className="text-sm">Olá, qual o valor da visita técnica para reforma de banheiro?</p>
            </div>
            <div className="bg-white/10 p-4 rounded-2xl max-w-[80%]">
              <p className="text-sm">Olá! O técnico está disponível amanhã às 14h. O valor da visita é R$ 180. Quer agendar?</p>
            </div>
            <div className="text-xs text-gray-400 text-center">IA respondeu em 1,8s • 98% de precisão</div>
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="py-20 bg-black/60 border-t border-white/10">
        <div className="max-w-screen-2xl mx-auto px-10">
          <h2 className="text-5xl font-bold text-center mb-16">Por que empresas estão escolhendo Thunder AI</h2>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-zinc-900/50 border border-white/10 p-8 rounded-3xl hover:border-[#0066FF]/50 transition-all">
              <div className="text-[#0066FF] text-5xl mb-6">24h</div>
              <h3 className="text-2xl font-semibold">Atendimento 24 horas</h3>
              <p className="text-gray-400 mt-4">Seu robô responde clientes mesmo enquanto você dorme.</p>
            </div>
            <div className="bg-zinc-900/50 border border-white/10 p-8 rounded-3xl hover:border-[#6A00FF]/50 transition-all">
              <div className="text-[#6A00FF] text-5xl mb-6">📈</div>
              <h3 className="text-2xl font-semibold">Geração de leads automática</h3>
              <p className="text-gray-400 mt-4">Converte conversas em agendamentos e vendas sem esforço.</p>
            </div>
            <div className="bg-zinc-900/50 border border-white/10 p-8 rounded-3xl hover:border-[#0066FF]/50 transition-all">
              <div className="text-[#0066FF] text-5xl mb-6">🤖</div>
              <h3 className="text-2xl font-semibold">Substitui humanos</h3>
              <p className="text-gray-400 mt-4">Conversa com cliente e técnico, calcula valores e agenda.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black border-t border-white/10 py-12">
        <div className="max-w-screen-2xl mx-auto px-10 text-center text-sm text-gray-500">
          Thunder AI Corporation © 2026 • Plataforma gratuita para começar
        </div>
      </footer>
    </div>
  );
}