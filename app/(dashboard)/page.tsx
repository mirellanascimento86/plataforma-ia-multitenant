'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Criar cliente Supabase manualmente para evitar erro de importação
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [empresa, setEmpresa] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    loadUserData()
  }, [])

  async function loadUserData() {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session) {
        console.log('Sem sessão, redirecionando...')
        router.push('/login')
        return
      }

      console.log('Buscando usuário:', session.user.id)
      
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('*, empresas(*)')
        .eq('id', session.user.id)
        .single()

      if (userError) {
        console.error('Erro ao buscar usuário:', userError)
        setErro('Erro ao carregar dados. Tente fazer login novamente.')
        setLoading(false)
        return
      }

      if (!userData) {
        console.log('Usuário não encontrado no banco')
        setErro('Usuário não encontrado. Contate o suporte.')
        setLoading(false)
        return
      }

      console.log('Dados carregados:', userData)
      setUser(userData)
      setEmpresa(userData.empresas)
      setLoading(false)
      
    } catch (error: any) {
      console.error('Erro geral:', error)
      setErro('Erro inesperado: ' + error.message)
      setLoading(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  if (erro) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Ops!</h2>
          <p className="text-gray-600 mb-6">{erro}</p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/login')}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Voltar para Login
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-blue-600">
                {empresa?.nome || 'Minha Empresa'}
              </h1>
              <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                {empresa?.plano || 'Gratuito'}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden sm:block">
                Olá, {user?.nome || 'Usuário'}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-sm font-medium transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-500 mt-1">Gerencie sua plataforma de atendimento</p>
        </div>
        
        {/* Cards de Navegação */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card Robôs */}
          <Link 
            href="/robos" 
            className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-blue-200"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">Meus Robôs</h3>
            <p className="text-gray-500 text-sm mt-2">Crie e treine assistentes virtuais para seu atendimento</p>
            <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
              Acessar
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Card Conversas */}
          <Link 
            href="/conversas" 
            className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-green-200"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-green-600 transition-colors">Conversas</h3>
            <p className="text-gray-500 text-sm mt-2">Atenda clientes e monitore conversas em tempo real</p>
            <div className="mt-4 flex items-center text-green-600 text-sm font-medium">
              Acessar
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Card WhatsApp */}
          <Link 
            href="/whatsapp" 
            className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-green-200"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-green-500 transition-colors">WhatsApp</h3>
            <p className="text-gray-500 text-sm mt-2">Conecte seu número do WhatsApp Business</p>
            <div className="mt-4 flex items-center text-green-500 text-sm font-medium">
              Conectar
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Card Agendamentos */}
          <Link 
            href="/agendamentos" 
            className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-purple-200"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl">📅</span>
            </div>
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-purple-600 transition-colors">Agendamentos</h3>
            <p className="text-gray-500 text-sm mt-2">Gerencie sua agenda e compromissos</p>
            <div className="mt-4 flex items-center text-purple-600 text-sm font-medium">
              Acessar
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Card Clientes */}
          <Link 
            href="/clientes" 
            className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-orange-200"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-orange-600 transition-colors">Clientes</h3>
            <p className="text-gray-500 text-sm mt-2">Base de clientes e histórico de atendimentos</p>
            <div className="mt-4 flex items-center text-orange-600 text-sm font-medium">
              Acessar
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Card Planilhas */}
          <Link 
            href="/planilhas" 
            className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-yellow-200"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-yellow-600 transition-colors">Planilhas</h3>
            <p className="text-gray-500 text-sm mt-2">Exporte relatórios e dados em Excel/CSV</p>
            <div className="mt-4 flex items-center text-yellow-600 text-sm font-medium">
              Exportar
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

        </div>

        {/* Dica rápida */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Primeiros passos</h4>
          <ol className="list-decimal list-inside space-y-2 text-blue-800 text-sm">
            <li>Conecte seu WhatsApp na aba "WhatsApp"</li>
            <li>Crie e treine seu robô em "Meus Robôs"</li>
            <li>Teste enviando mensagem no número conectado</li>
            <li>Acompanhe as conversas em "Conversas"</li>
          </ol>
        </div>
      </main>
    </div>
  )
}
