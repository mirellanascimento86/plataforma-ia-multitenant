'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Calendar, Plus, Clock, CheckCircle, XCircle } from 'lucide-react'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

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

  async function criarAgendamentoExemplo() {
    const { data: userData } = await supabase.auth.getUser()
    const { data: usuario } = await supabase
      .from('usuarios')
      .select('empresa_id')
      .eq('id', userData.user!.id)
      .single()

    const amanha = new Date()
    amanha.setDate(amanha.getDate() + 1)

    await supabase.from('agendamentos').insert({
      empresa_id: usuario?.empresa_id,
      cliente_nome: 'Cliente Exemplo',
      cliente_telefone: '(11) 99999-9999',
      servico: 'Consulta',
      data: amanha.toISOString().split('T')[0],
      horario_inicio: '14:00',
      status: 'confirmado'
    })

    loadAgendamentos()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">Agendamentos</h1>
            <button
              onClick={() => setModalAberto(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Novo
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {agendamentos.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum agendamento</h3>
            <p className="text-gray-500 mb-4">Crie seu primeiro agendamento</p>
            <button
              onClick={criarAgendamentoExemplo}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Criar exemplo
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {agendamentos.map((ag) => (
              <div key={ag.id} className="bg-white rounded-xl shadow-sm p-6 flex items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex flex-col items-center justify-center mr-4">
                  <span className="text-xs text-blue-600 font-medium">
                    {new Date(ag.data).toLocaleDateString('pt-BR', { month: 'short' })}
                  </span>
                  <span className="text-2xl font-bold text-blue-700">
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
                    <span>{ag.cliente_nome}</span>
                  </div>
                </div>
                
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  ag.status === 'confirmado' ? 'bg-green-100 text-green-700' :
                  ag.status === 'pendente' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {ag.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
