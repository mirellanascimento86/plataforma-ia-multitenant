'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { 
  MessageSquare, 
  Bot, 
  Calendar, 
  Users, 
  FileSpreadsheet, 
  Phone, 
  LogOut,
  Settings,
  TrendingUp
} from 'lucide-react'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [empresa, setEmpresa] = useState<any>(null)
  const [stats, setStats] = useState({
    conversas: 0,
    robos: 0,
    clientes: 0,
    agendamentos: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserData()
  }, [])

  async function loadUserData() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login')
        return
      }

      const { data: userData } = await supabase
        .from('usuarios')
        .select('*, empresas(*)')
        .eq('id', session.user.id)
        .single()

      if (!userData) {
        router.push('/login')
        return
      }

      setUser(userData)
      setEmpresa(userData.empresas)

      // Carregar estatísticas
      const { count: conversasCount } = await supabase
        .from('conversas')
        .select('*', { count: 'exact', head: true })
        .eq('empresa_id', userData.empresa_id)

      const { count: robosCount } = await supabase
        .from('robos')
        .select('*', { count: 'exact', head: true })
        .eq('empresa_id', userData.empresa_id)

      setStats({
        conversas: conversasCount || 0,
        robos: robosCount || 0,
        clientes: 0,
        agendamentos: 0
      })

    } catch (error) {
      console.error('Erro:', error)
    } finally {
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
                Olá, {user?.nome}
              </span>
              <button
                onClick={handleLogout}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-500 mt-1">Visão geral do seu atendimento</p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Conversas"
            value={stats.conversas}
            icon={MessageSquare}
            color="blue"
            href="/conversas"
          />
          <StatCard
            title="Robôs"
            value={stats.robos}
            icon={Bot}
            color="green"
            href="/robos"
          />
          <StatCard
            title="Clientes"
            value={stats.clientes}
            icon={Users}
            color="purple"
            href="/clientes"
          />
          <StatCard
            title="Agendamentos"
            value={stats.agendamentos}
            icon={Calendar}
            color="orange"
            href="/agendamentos"
          />
        </div>

        {/* Menu Principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickAction
            title="Conectar WhatsApp"
            description="Conecte seu número do WhatsApp Business"
            icon={Phone}
            href="/whatsapp"
            color="from-green-500 to-green-600"
          />
          <QuickAction
            title="Meus Robôs"
            description="Crie e treine assistentes virtuais"
            icon={Bot}
            href="/robos"
            color="from-blue-500 to-blue-600"
          />
          <QuickAction
            title="Conversas"
            description="Atenda clientes em tempo real"
            icon={MessageSquare}
            href="/conversas"
            color="from-indigo-500 to-indigo-600"
          />
          <QuickAction
            title="Agendamentos"
            description="Gerencie sua agenda e compromissos"
            icon={Calendar}
            href="/agendamentos"
            color="from-purple-500 to-purple-600"
          />
          <QuickAction
            title="Clientes"
            description="Base de clientes e histórico"
            icon={Users}
            href="/clientes"
            color="from-orange-500 to-orange-600"
          />
          <QuickAction
            title="Planilhas"
            description="Exporte relatórios e dados"
            icon={FileSpreadsheet}
            href="/planilhas"
            color="from-yellow-500 to-yellow-600"
          />
        </div>

        {/* Dica */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Primeiros passos
          </h4>
          <ol className="list-decimal list-inside space-y-2 text-blue-800 text-sm">
            <li>Conecte seu WhatsApp em "Conectar WhatsApp"</li>
            <li>Crie seu primeiro robô em "Meus Robôs"</li>
            <li>Treine o robô com perguntas frequentes</li>
            <li>Teste enviando mensagem no WhatsApp conectado</li>
          </ol>
        </div>
      </main>
    </div>
  )
}

// Componentes auxiliares
function StatCard({ title, value, icon: Icon, color, href }: any) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  }

  return (
    <Link href={href} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className="text-gray-500 text-sm mt-1">{title}</p>
        </div>
        <div className={`p-3 rounded-lg ${colors[color as keyof typeof colors]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Link>
  )
}

function QuickAction({ title, description, icon: Icon, href, color }: any) {
  return (
    <Link 
      href={href} 
      className={`block p-6 rounded-xl bg-gradient-to-br ${color} text-white hover:opacity-90 transition-opacity group`}
    >
      <Icon className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-white/80 mt-1">{description}</p>
    </Link>
  )
}
