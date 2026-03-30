'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Calendar, Plus, Clock, User, CheckCircle, XCircle } from 'lucide-react'

export default function AgendamentosPage() {
  const [agendamentos, setAgendamentos] = useState<any[]>([])
  const [modalAberto, setModalAberto] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAgendamentos()
  }, [])

  async function loadAgendamentos() {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) return

    const { data: usuario } = await supabase
      .from('usuarios')
      .select('empresa_id')
      .eq('id', userData.user.id)
      .single()

    const { data } = await supabase
      .from('agendamentos')
      .select('*')
      .eq('empresa_id', usuario?.empresa_id)
      .order('data', { ascending: true })

    setAgendamentos(data || [])
    setLoading(false)
  }

  // Criar agendamento de exemplo se não tiver nenhum
  async function criarAgendamentoExemplo() {
    const { data: userData } = await supabase.auth.getUser()
    const { data: usuario } = await supabase
      .from('usuarios')
      .select('empresa_id')
      .eq('id', userData.user!.id)
      .single()

    const hoje = new Date()
    const amanha = new Date(hoje)
    amanha.setDate(amanha.getDate() + 1)

    await supabase.from('agendamentos').insert({
      empresa_id: usuario?.empresa_id,
      cliente_nome: 'Cliente Exemplo',
      cliente_telefone: '(11) 99999-9999',
      servico: 'Consulta Inicial',
      data: amanha.toISOString().split('T')[0],
      horario_inicio: '14:00',
      status: 'confirmado'
    })

    loadAgendamentos()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Agendamentos</h1>
        <button
          onClick={() => setModalAberto(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Agendamento
        </button>
      </div>

      {/* Calendário simplificado */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Próximos Agendamentos</h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">Hoje</button>
            <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full">Semana</button>
            <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full">Mês</button>
          </div>
        </div>

        {agendamentos.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg mb-4">Nenhum agendamento ainda</p>
            <button
              onClick={criarAgendamentoExemplo}
              className="text-blue-600 hover:underline"
            >
              Criar agendamento de exemplo
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {agendamentos.map((ag) => (
              <div key={ag.id} className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex flex-col items-center justify-center mr-4">
                  <span className="text-xs text-blue-600 font-medium">
                    {new Date(ag.data).toLocaleDateString('pt-BR', { month: 'short' })}
                  </span>
                  <span className="text-xl font-bold text-blue-700">
                    {new Date(ag.data).getDate()}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{ag.servico}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1 space-x-4">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {ag.horario_inicio}
                    </span>
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {ag.cliente_nome}
                    </span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  ag.status === 'confirmado' ? 'bg-green-100 text-green-700' :
                  ag.status === 'pendente' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {ag.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
