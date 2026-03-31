'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export default function TreinamentoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const roboId = searchParams.get('robo')

  const [intencoes, setIntencoes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalAberto, setModalAberto] = useState(false)
  const [novaIntencao, setNovaIntencao] = useState({
    pergunta: '',
    resposta: '',
    categoria: 'geral'
  })

  useEffect(() => {
    if (roboId) {
      loadIntencoes()
    } else {
      setLoading(false)
    }
  }, [roboId])

  async function loadIntencoes() {
    const { data } = await supabase
      .from('robo_conhecimento')
      .select('*')
      .eq('robo_id', roboId)
      .order('criado_em', { ascending: false })

    setIntencoes(data || [])
    setLoading(false)
  }

  async function salvarIntencao(e: React.FormEvent) {
    e.preventDefault()
    
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    await supabase.from('robo_conhecimento').insert({
      robo_id: roboId,
      pergunta: novaIntencao.pergunta,
      resposta: novaIntencao.resposta,
      categoria: novaIntencao.categoria,
      ativa: true
    })

    setModalAberto(false)
    setNovaIntencao({ pergunta: '', resposta: '', categoria: 'geral' })
    loadIntencoes()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!roboId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Selecione um Robô</h2>
          <p className="text-gray-600 mb-6">Escolha qual robô você quer treinar</p>
          <button
            onClick={() => router.push('/robos')}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Ver Meus Robôs
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">Treinar Robô</h1>
            <button
              onClick={() => setModalAberto(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              + Nova Intenção
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {intencoes.map((intencao) => (
            <div key={intencao.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                {intencao.categoria}
              </span>
              <h3 className="font-medium text-gray-900 mt-3">{intencao.pergunta}</h3>
              <p className="text-gray-600 text-sm mt-2">{intencao.resposta}</p>
            </div>
          ))}
          
          {intencoes.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              <p>Nenhuma intenção cadastrada</p>
              <p className="text-sm mt-2">Clique em "+ Nova Intenção" para começar</p>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Nova Intenção</h3>
            <form onSubmit={salvarIntencao} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pergunta</label>
                <input
                  type="text"
                  value={novaIntencao.pergunta}
                  onChange={(e) => setNovaIntencao({...novaIntencao, pergunta: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Ex: Qual o horário de funcionamento?"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resposta</label>
                <textarea
                  value={novaIntencao.resposta}
                  onChange={(e) => setNovaIntencao({...novaIntencao, resposta: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                  placeholder="Digite a resposta que o robô deve dar..."
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="flex-1 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
