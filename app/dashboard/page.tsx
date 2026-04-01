'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Bot, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Zap,
  MoreVertical,
  Play,
  Pause,
  Settings,
  Trash2,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const [bots, setBots] = useState<any[]>([])
  const [empresa, setEmpresa] = useState<any>(null)
  const [stats, setStats] = useState({
    totalConversas: 0,
    leadsGerados: 0,
    tempoEconomizado: 0
  })
  const [loading, setLoading] = useState(true)
  const [modoTempestade, setModoTempestade] = useState(false)
  
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    carregarDados()
    
    // Verificar modo tempestade (alto volume)
    const interval = setInterval(() => {
      verificarVolume()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  async function carregarDados() {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      router.push('/login')
      return
    }

    // Carregar empresa
    const { data: membro } = await supabase
      .from('membros_empresa')
      .select('empresa_id, cargo, empresas:empresa_id (*)')
      .eq('usuario_id', session.user.id)
      .eq('ativo', true)
      .single()

    if (membro) {
      setEmpresa(membro.empresas)
      
      // Carregar bots
      const { data: botsData } = await supabase
        .from('bots')
        .select('*')
        .eq('empresa_id', membro.empresa_id)
        .order('criado_em', { ascending: false })
      
      setBots(botsData || [])
      
      // Calcular stats (simulados por enquanto)
      const totalConversas = botsData?.reduce((acc, bot) => acc + (bot.total_conversas || 0), 0) || 0
      setStats({
        totalConversas,
        leadsGerados: Math.floor(totalConversas * 0.3),
        tempoEconomizado: totalConversas * 5 // 5 minutos por conversa
      })
    }
    
    setLoading(false)
  }

  function verificarVolume() {
    // Simular detecção de alto volume
    const volumeAlto = stats.totalConversas > 100 && Math.random() > 0.7
    setModoTempestade(volumeAlto)
  }

  const criarAgente = () => {
    router.push('/agente/novo')
  }

  const toggleStatus = async (botId: string, statusAtual: string) => {
    const novoStatus = statusAtual === 'ativo' ? 'pausado' : 'ativo'
    await supabase.from('bots').update({ status: novoStatus }).eq('id', botId)
    carregarDados()
  }

  const excluirBot = async (botId: string) => {
    if (!confirm('Tem certeza que deseja excluir este agente?')) return
    await supabase.from('bots').delete().eq('id', botId)
    carregarDados()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <Zap size={48} className="text-blue-600" />
        </motion.div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-slate-50 transition-all duration-500 ${modoTempestade ? 'bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50' : ''}`}>
      {/* Modo Tempestade Alert */}
      {modoTempestade && (
        <motion.div
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 flex items-center justify-center gap-2"
        >
          <Zap size={18} className="animate-pulse" />
          <span className="font-medium">⚡ Modo Tempestade Ativado - Alto volume de mensagens detectado</span>
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Bem-vindo à Thunder AI, {empresa?.nome?.split(' ')[0]}
          </h1>
          <p className="text-slate-600">
            Gerencie seus agentes de IA e acompanhe os resultados
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <MessageSquare size={24} className="text-blue-600" />
              </div>
              <span className="text-sm text-green-600 font-medium">+12%</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.totalConversas}</p>
            <p className="text-slate-600">Conversas este mês</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users size={24} className="text-purple-600" />
              </div>
              <span className="text-sm text-green-600 font-medium">+8%</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.leadsGerados}</p>
            <p className="text-slate-600">Leads qualificados</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp size={24} className="text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">{Math.floor(stats.tempoEconomizado / 60)}h</p>
            <p className="text-slate-600">Tempo economizado</p>
          </motion.div>
        </div>

        {/* Ações Rápidas */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Seus Agentes</h2>
          <button
            onClick={criarAgente}
            className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all"
          >
            <Plus size={20} />
            Criar novo agente
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Zap size={16} className="opacity-0 group-hover:opacity-100" />
            </motion.span>
          </button>
        </div>

        {/* Lista de Bots */}
        {bots.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot size={40} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Nenhum agente criado ainda</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Crie seu primeiro agente de IA para começar a automatizar seu atendimento no WhatsApp.
            </p>
            <button
              onClick={criarAgente}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all"
            >
              Criar meu primeiro agente
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bots.map((bot, index) => (
              <motion.div
                key={bot.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-blue-500/10 transition-all"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Bot size={28} className="text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        bot.status === 'ativo' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {bot.status === 'ativo' ? 'Ativo' : 'Pausado'}
                      </span>
                      <div className="relative group/menu">
                        <button className="p-2 hover:bg-slate-100 rounded-lg">
                          <MoreVertical size={18} className="text-slate-400" />
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10">
                          <Link
                            href={`/agente/${bot.id}`}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-sm text-slate-700"
                          >
                            <Settings size={16} />
                            Configurar
                          </Link>
                          <Link
                            href={`/agente/${bot.id}/treinar`}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-sm text-slate-700"
                          >
                            <Zap size={16} />
                            Treinar
                          </Link>
                          <button
                            onClick={() => toggleStatus(bot.id, bot.status)}
                            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-sm text-slate-700"
                          >
                            {bot.status === 'ativo' ? <Pause size={16} /> : <Play size={16} />}
                            {bot.status === 'ativo' ? 'Pausar' : 'Ativar'}
                          </button>
                          <button
                            onClick={() => excluirBot(bot.id)}
                            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-sm text-red-600"
                          >
                            <Trash2 size={16} />
                            Excluir
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="font-semibold text-lg text-slate-900 mb-1">{bot.nome}</h3>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2">{bot.descricao || 'Sem descrição'}</p>

                  <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                    <div className="flex items-center gap-1">
                      <MessageSquare size={14} />
                      <span>{bot.total_conversas || 0} conversas</span>
                    </div>
                    {bot.numero_whatsapp && (
                      <div className="flex items-center gap-1 text-green-600">
                        <Zap size={14} />
                        <span>Conectado</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/agente/${bot.id}`}
                      className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors text-center"
                    >
                      Gerenciar
                    </Link>
                    <Link
                      href={`/conversas?bot=${bot.id}`}
                      className="px-3 py-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <ExternalLink size={18} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}