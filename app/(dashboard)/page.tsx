'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { MessageSquare, Users, Bot, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    conversas: 0,
    robos: 0,
    clientes: 0,
  })

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) return

    const { data: usuario } = await supabase
      .from('usuarios')
      .select('empresa_id')
      .eq('id', userData.user.id)
      .single()

    const empresaId = usuario?.empresa_id

    const [conversas, robos] = await Promise.all([
      supabase.from('conversas').select('*', { count: 'exact' }).eq('empresa_id', empresaId),
      supabase.from('robos').select('*', { count: 'exact' }).eq('empresa_id', empresaId),
    ])

    setStats({
      conversas: conversas.count || 0,
      robos: robos.count || 0,
      clientes: 0,
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{stats.conversas}</p>
              <p className="text-gray-500">Conversas</p>
            </div>
            <MessageSquare className="w-10 h-10 text-blue-200" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{stats.robos}</p>
              <p className="text-gray-500">Robôs Ativos</p>
            </div>
            <Bot className="w-10 h-10 text-green-200" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{stats.clientes}</p>
              <p className="text-gray-500">Clientes</p>
            </div>
            <Users className="w-10 h-10 text-purple-200" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Bem-vindo à sua plataforma!</h2>
        <p className="text-gray-600">
          Comece conectando seu WhatsApp e treinando seu robô para atender seus clientes automaticamente.
        </p>
      </div>
    </div>
  )
}
