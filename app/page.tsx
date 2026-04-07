'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Bot, 
  MessageSquare, 
  Zap, 
  Shield, 
  BarChart3, 
  Globe, 
  CheckCircle2,
  ArrowRight,
  Menu,
  X,
  Play,
  Star,
  Users,
  Clock,
  Smartphone
} from 'lucide-react'

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const features = [
    {
      icon: <Bot className="w-8 h-8 text-blue-600" />,
      title: "Agentes de IA Inteligentes",
      description: "Crie assistentes virtuais treinados para seu negócio com personalidade única."
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-green-600" />,
      title: "WhatsApp Business API",
      description: "Conecte-se ao WhatsApp oficial da Meta com número verificado."
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      title: "Respostas Instantâneas",
      description: "Atendimento 24/7 com velocidade superior à humana."
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-600" />,
      title: "Segurança Enterprise",
      description: "Dados criptografados e conformidade com LGPD."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-red-600" />,
      title: "Analytics Avançado",
      description: "Métricas de atendimento, conversão e satisfação em tempo real."
    },
    {
      icon: <Globe className="w-8 h-8 text-indigo-600" />,
      title: "Multi-tenant",
      description: "Gerencie múltiplos clientes e projetos em uma única plataforma."
    }
  ]

  const plans = [
    {
      name: "Starter",
      price: "Grátis",
      period: "para sempre",
      description: "Perfeito para testar e começar",
      features: [
        "1 agente de IA",
        "100 conversas/mês",
        "Integração WhatsApp",
        "Dashboard básico",
        "Suporte por email"
      ],
      cta: "Começar Grátis",
      highlighted: false
    },
    {
      name: "Pro",
      price: "R$ 97",
      period: "/mês",
      description: "Para empresas em crescimento",
      features: [
        "5 agentes de IA",
        "Conversas ilimitadas",
        "Análise de mídia (foto/vídeo)",
        "Escalonamento humano",
        "API de integração",
        "Suporte prioritário"
      ],
      cta: "Assinar Pro",
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "R$ 297",
      period: "/mês",
      description: "Para grandes operações",
      features: [
        "Agentes ilimitados",
        "White label",
        "Banco de dados dedicado",
        "Onboarding personalizado",
        "SLA garantido",
        "Suporte 24/7"
      ],
      cta: "Falar com Vendas",
      highlighted: false
    }
  ]

  const stats = [
    { number: "10M+", label: "Mensagens processadas" },
    { number: "500+", label: "Empresas ativas" },
    { number: "98%", label: "Satisfação dos clientes" },
    { number: "24/7", label: "Disponibilidade" }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Bot className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Agente IA Pro</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#recursos" className="text-gray-600 hover:text-gray-900 transition">Recursos</a>
              <a href="#planos" className="text-gray-600 hover:text-gray-900 transition">Planos</a>
              <a href="#sobre" className="text-gray-600 hover:text-gray-900 transition">Sobre</a>
              <Link href="/login" className="text-gray-600 hover:text-gray-900 transition">Login</Link>
              <Link 
                href="/cadastro" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Começar Grátis
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-3">
              <a href="#recursos" className="block text-gray-600 py-2">Recursos</a>
              <a href="#planos" className="block text-gray-600 py-2">Planos</a>
              <a href="#sobre" className="block text-gray-600 py-2">Sobre</a>
              <Link href="/login" className="block text-gray-600 py-2">Login</Link>
              <Link href="/cadastro" className="block bg-blue-600 text-white px-4 py-2 rounded-lg text-center">
                Começar Grátis
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              <span>Novo: Análise de vídeo com IA</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Atendimento com IA que{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                vende 24 horas
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Crie agentes de IA para WhatsApp Business em minutos. 
              Treine, conecte e automatize seu atendimento com a velocidade da Groq IA.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link 
                href="/cadastro"
                className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center space-x-2"
              >
                <span>Criar Agente Grátis</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <button className="w-full sm:w-auto bg-white text-gray-700 border-2 border-gray-200 px-8 py-4 rounded-xl text-lg font-semibold hover:border-gray-300 transition flex items-center justify-center space-x-2">
                <Play className="w-5 h-5" />
                <span>Ver Demonstração</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-gray-600 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="recursos" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Recursos Poderosos</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tudo que você precisa para escalar seu atendimento sem aumentar sua equipe
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition group">
                <div className="mb-4 p-3 bg-white rounded-xl inline-block shadow-sm group-hover:scale-110 transition">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Como Funciona</h2>
            <p className="text-xl text-gray-400">Configure em 3 passos simples</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Crie seu Agente",
                description: "Defina a personalidade, saudação e treine com suas informações de negócio.",
                icon: <Bot className="w-8 h-8" />
              },
              {
                step: "02",
                title: "Conecte WhatsApp",
                description: "Integre com WhatsApp Business API da Meta em poucos cliques.",
                icon: <Smartphone className="w-8 h-8" />
              },
              {
                step: "03",
                title: "Comece a Atender",
                description: "Seu agente responde automaticamente enquanto você monitora tudo.",
                icon: <Clock className="w-8 h-8" />
              }
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="bg-gray-800 rounded-2xl p-8 h-full">
                  <div className="text-6xl font-bold text-gray-700 mb-4">{item.step}</div>
                  <div className="mb-4 text-blue-400">{item.icon}</div>
                  <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="planos" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Planos e Preços</h2>
            <p className="text-xl text-gray-600">Comece grátis e escale conforme cresce</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, idx) => (
              <div 
                key={idx} 
                className={`rounded-2xl p-8 ${plan.highlighted ? 'bg-blue-600 text-white scale-105 shadow-2xl' : 'bg-white text-gray-900 shadow-lg'}`}
              >
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className={`mb-4 ${plan.highlighted ? 'text-blue-100' : 'text-gray-600'}`}>
                  {plan.description}
                </p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className={plan.highlighted ? 'text-blue-200' : 'text-gray-500'}>{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-center space-x-3">
                      <CheckCircle2 className={`w-5 h-5 ${plan.highlighted ? 'text-blue-200' : 'text-green-500'}`} />
                      <span className={plan.highlighted ? 'text-blue-50' : 'text-gray-600'}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/cadastro"
                  className={`block w-full py-3 rounded-xl text-center font-semibold transition ${
                    plan.highlighted 
                      ? 'bg-white text-blue-600 hover:bg-gray-100' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Por que escolher a Agente IA Pro?
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Somos uma plataforma completa de automação de atendimento via WhatsApp. 
                Nossa tecnologia usa modelos de IA avançados (Groq) para oferecer 
                respostas instantâneas e naturais.
              </p>
              <div className="space-y-4">
                {[
                  "Processamento de imagem e vídeo para diagnósticos",
                  "Integração nativa com WhatsApp Business API",
                  "Escalonamento inteligente para humanos",
                  "Gestão completa de técnicos e agendamentos"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
                <div className="flex items-center space-x-3 pb-4 border-b">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Ana (IA)</div>
                    <div className="text-sm text-gray-500">Online agora</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                    Olá! Sou a Ana. Vi que você tem interesse em automação de atendimento. Posso tirar suas dúvidas? 😊
                  </div>
                  <div className="bg-blue-600 text-white rounded-lg p-3 max-w-[80%] ml-auto">
                    Sim! Quero saber como funciona para empresa de refrigeração.
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                    Perfeito! Para refrigeração, posso ajudar a qualificar leads, agendar visitas e até analisar fotos dos equipamentos. Quer ver uma demo?
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Pronto para automatizar seu atendimento?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Junte-se a centenas de empresas que já escalaram seu atendimento com IA
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/cadastro"
              className="w-full sm:w-auto bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition"
            >
              Criar Conta Grátis
            </Link>
            <Link 
              href="/login"
              className="w-full sm:w-auto bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-800 transition"
            >
              Já tenho conta
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 text-white mb-4">
                <Bot className="w-6 h-6" />
                <span className="text-lg font-bold">Agente IA Pro</span>
              </div>
              <p className="text-sm">
                Plataforma completa de automação de atendimento via WhatsApp com IA.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#recursos" className="hover:text-white transition">Recursos</a></li>
                <li><a href="#planos" className="hover:text-white transition">Planos</a></li>
                <li><Link href="/dashboard/agent" className="hover:text-white transition">Treinar Agente</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#sobre" className="hover:text-white transition">Sobre</a></li>
                <li><Link href="/politicas" className="hover:text-white transition">Políticas de Privacidade</Link></li>
                <li><Link href="/termos" className="hover:text-white transition">Termos de Uso</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contato</h4>
              <ul className="space-y-2 text-sm">
                <li>suporte@agenteiapro.com</li>
                <li>WhatsApp: (11) 99999-9999</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            © 2026 Agente IA Pro. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
