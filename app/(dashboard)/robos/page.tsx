'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Bot, Plus, Power } from 'lucide-react'

interface Robo {
  id: string
  nome: string
  descricao: string
  ativo: boolean
}

export default function RobosPage() {
  const [robos, setRobos] = useState<Robo[]>([])
  const [modalAberto, setModalAberto] = useState(false)
  const [novoRobo, setNovoRobo] = useState({ nome: '', descricao: '' })

  useEffect(() => {
    loadRobos()
  }, [])

  async function loadRobos() {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) return

    const { data: usuario } = await supabase
      .from('usuarios')
      .select('empresa_id')
      .eq('id', userData.user.id)
      .single()

    const { data } = await supabase
      .from('robos')
      .select('*')
      .eq('empresa_id', usuario?.empresa_id)

    setRobos(data || [])
  }

  async function criarRobo(e: React.FormEvent) {
    e.preventDefault()
    
    const { data: userData } = await supabase.auth.getUser()
    const { data: usuario } = await supabase
      .from('usuarios')
      .select('empresa_id')
      .eq('id', userData.user!.id)
      .single()

    await supabase.from('robos').insert({
      empresa_id: usuario?.empresa_id,
      nome: novoRobo.nome,
      descricao: novoRobo.descricao,
    })

    setModalAberto(false)
    setNovoRobo({ nome: '', descricao: '' })
    loadRobos()
  }

  async function toggleRobo(id: string, ativo: boolean) {
    await supabase.from('robos').update({ ativo: !ativo }).eq('id', id)
    loadRobos()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Meus Robôs</h1>
        <button
          onClick={() => setModalAberto(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Robô
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {robos.map((robo) => (
          <div key={robo.id} className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-blue-600" />
              </div>
              <button
                onClick={() => toggleRobo(robo.id, robo.ativo)}
                className={`p-2 rounded-lg ${robo.ativo ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
              >
                <Power className="w-4 h-4" />
              </button>
            </div>
            <h3 className="font-semibold text-lg">{robo.nome}</h3>
            <p className="text-gray-500 text-sm mt-1">{robo.descricao}</p>
            <div className="mt-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${robo.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                {robo.ativo ? 'Ativo' : 'Inativo'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Criar Novo Robô</h3>
            <form onSubmit={criarRobo} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={novoRobo.nome}
                  onChange={(e) => setNovoRobo({ ...novoRobo, nome: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  value={novoRobo.descricao}
                  onChange={(e) => setNovoRobo({ ...novoRobo, descricao: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={3}
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg"
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
