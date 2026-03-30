'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { MessageSquare, Users, Bot, Calendar, TrendingUp, Phone, FileSpreadsheet } from 'lucide-react'

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

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Bem-vindo, {user?.nome}!</p>
        </div>
        <div className="text-sm text-gray-500">
          Empresa: <span className="font-medium text-gray-900">{empresa?.nome}</span>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Conversas Ativas"
          value={stats.conversas}
          icon={MessageSquare}
          color="blue"
          href="/conversas"
        />
        <StatCard
          title="Robôs Ativos"
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

      {/* Menu Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <QuickAction
          title="Conectar WhatsApp"
          description="Conecte seu número do WhatsApp Business"
          icon={Phone}
          href="/whatsapp"
          color="green"
        />
        <QuickAction
          title="Treinar Robô"
          description="Ensine seu robô a responder perguntas"
          icon={Bot}
          href="/robos"
          color="blue"
        />
        <QuickAction
          title="Ver Planilhas"
          description="Exporte dados de clientes e conversas"
          icon={FileSpreadsheet}
          href="/planilhas"
          color="purple"
        />
      </div>

      {/* Ações Recentes */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Próximos Passos</h3>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-blue-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">1</div>
            <div>
              <p className="font-medium text-gray-900">Conectar WhatsApp</p>
              <p className="text-sm text-gray-500">Vá em "WhatsApp" no menu lateral</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">2</div>
            <div>
              <p className="font-medium text-gray-900">Treinar seu Robô</p>
              <p className="text-sm text-gray-500">Adicione perguntas e respostas frequentes</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">3</div>
            <div>
              <p className="font-medium text-gray-900">Testar Atendimento</p>
              <p className="text-sm text-gray-500">Mande mensagem no WhatsApp conectado</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente de Card de Estatística
function StatCard({ title, value, icon: Icon, color, href }: any) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  }

  return (
    <a href={href} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className="text-gray-500 text-sm mt-1">{title}</p>
        </div>
        <div className={`p-3 rounded-lg ${colors[color as keyof typeof colors]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </a>
  )
}

// Componente de Ação Rápida
function QuickAction({ title, description, icon: Icon, href, color }: any) {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
  }

  return (
    <a href={href} className={`block p-6 rounded-xl bg-gradient-to-br ${colors[color as keyof typeof colors]} text-white hover:opacity-90 transition-opacity`}>
      <Icon className="w-8 h-8 mb-3" />
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-white/80 mt-1">{description}</p>
    </a>
  )
}
