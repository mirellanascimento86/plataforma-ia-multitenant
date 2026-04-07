import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { 
  Bot, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Settings,
  ArrowRight,
  Plus
} from 'lucide-react'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Buscar dados do usuário
  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  // Buscar estatísticas
  const { data: orders } = await supabase
    .from('service_orders')
    .select('status')
    .eq('tenant_id', user.id)

  const stats = {
    total: orders?.length || 0,
    active: orders?.filter(o => ['novo', 'visita_agendada'].includes(o.status)).length || 0,
    completed: orders?.filter(o => o.status === 'concluido').length || 0
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Olá, {userData?.full_name || user.email?.split('@')[0]}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Bem-vindo à sua plataforma de atendimento com IA
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Atendimentos</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Atendimentos Ativos</p>
              <p className="text-3xl font-bold text-gray-900">{stats.active}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Concluídos</p>
              <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Link 
          href="/dashboard/agent"
          className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-xl hover:shadow-lg transition group"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">Treinar Agente de IA</h3>
              <p className="text-blue-100 mb-4">
                Configure a personalidade, saudação e conecte ao WhatsApp Business
              </p>
              <span className="inline-flex items-center text-sm font-medium">
                Configurar agora <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition" />
              </span>
            </div>
            <div className="p-3 bg-white/20 rounded-lg">
              <Bot className="w-8 h-8" />
            </div>
          </div>
        </Link>

        <Link 
          href="/monitor"
          className="bg-white border-2 border-gray-200 p-6 rounded-xl hover:border-blue-500 hover:shadow-lg transition group"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Monitorar Atendimentos</h3>
              <p className="text-gray-600 mb-4">
                Acompanhe conversas em tempo real e intervenha quando necessário
              </p>
              <span className="inline-flex items-center text-sm font-medium text-blue-600">
                Acessar monitor <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition" />
              </span>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Atividade Recente</h3>
          <Link href="/conversas" className="text-blue-600 hover:text-blue-700 text-sm">
            Ver todas
          </Link>
        </div>
        
        {stats.total === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8" />
            </div>
            <p className="mb-4">Nenhum atendimento ainda</p>
            <Link 
              href="/dashboard/agent"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Bot className="w-5 h-5" />
              <span>Criar primeiro agente</span>
            </Link>
          </div>
        ) : (
          <p className="text-gray-600">Você tem {stats.active} atendimentos em andamento.</p>
        )}
      </div>
    </div>
  )
}
