'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export default function RobosPage() {
  const router = useRouter()
  const [robos, setRobos] = useState<any[]>([])
  const [modalAberto, setModalAberto] = useState(false)
  const [novoRobo, setNovoRobo] = useState({ nome: '', descricao: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRobos()
  }, [])

  async function loadRobos() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/login')
      return
    }

    const { data: usuario } = await supabase
      .from('usuarios')
      .select('empresa_id')
      .eq('id', session.user.id)
      .single()

    const { data } = await supabase
      .from('robos')
      .select('*')
      .eq('empresa_id', usuario?.empresa_id)

    setRobos(data || [])
    setLoading(false)
  }

  async function criarRobo(e: React.FormEvent) {
    e.preventDefault()
    
    const { data: { session } } = await supabase.auth.getSession()
    const { data: usuario } = await supabase
      .from('usuarios')
      .select('empresa_id')
      .eq('id', session!.user.id)
      .single()

    await supabase.from('robos').insert({
      empresa_id: usuario?.empresa_id,
      nome: novoRobo.nome,
      descricao: novoRobo.descricao,
      ativo: true
    })

    setModalAberto(false)
    setNovoRobo({ nome: '', descricao: '' })
    loadRobos()
  }

  async function toggleRobo(id: string, ativo: boolean) {
    await supabase.from('robos').update({ ativo: !ativo }).eq('id', id)
    loadRobos()
  }

  if (loading) return <div className="p-8">Carregando...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header simples */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">Meus Robôs</h1>
            <button
              onClick={() => setModalAberto(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              + Novo Robô
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {robos.map((robo) => (
            <div key={robo.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                <button
                  onClick={() => toggleRobo(robo.id, robo.ativo)}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    robo.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {robo.ativo ? 'Ativo' : 'Inativo'}
                </button>
              </div>
              <h3 className="font-semibold text-lg text-gray-900">{robo.nome}</h3>
              <p className="text-gray-500 text-sm mt-1">{robo.descricao || 'Sem descrição'}</p>
            </div>
          ))}
          
          {robos.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              <p>Nenhum robô criado ainda</p>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Criar Novo Robô</h3>
            <form onSubmit={criarRobo} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={novoRobo.nome}
                  onChange={(e) => setNovoRobo({...novoRobo, nome: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  value={novoRobo.descricao}
                  onChange={(e) => setNovoRobo({...novoRobo, descricao: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
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
                  Criar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
