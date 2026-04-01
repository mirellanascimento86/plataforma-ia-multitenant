'use client'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/ssr'
import { Plus, Bot, Phone, Trash2 } from 'lucide-react'

const supabase = createClientComponentClient()

export default function RobosPage() {
  const [robos, setRobos] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [novoRobo, setNovoRobo] = useState({ nome: '', descricao: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregarRobos()
  }, [])

  async function carregarRobos() {
    const { data } = await supabase.from('robos').select('*').order('created_at', { ascending: false })
    setRobos(data || [])
    setLoading(false)
  }

  async function criarRobo() {
    if (!novoRobo.nome) return alert("Nome é obrigatório")

    const { error } = await supabase
      .from('robos')
      .insert([{ nome: novoRobo.nome, descricao: novoRobo.descricao, status: 'inativo' }])

    if (error) alert("Erro ao criar: " + error.message)
    else {
      setShowModal(false)
      setNovoRobo({ nome: '', descricao: '' })
      carregarRobos()
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Meus Robôs</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-2xl hover:bg-indigo-700"
        >
          <Plus size={24} /> Novo Robô
        </button>
      </div>

      {loading ? <p>Carregando...</p> : robos.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed">
          <Bot size={80} className="mx-auto text-gray-300 mb-4" />
          <p className="text-2xl text-gray-400">Nenhum robô criado ainda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {robos.map(robo => (
            <div key={robo.id} className="bg-white p-8 rounded-3xl border hover:shadow-xl transition">
              <h3 className="text-2xl font-bold mb-2">{robo.nome}</h3>
              <p className="text-gray-500 mb-6">{robo.descricao || 'Sem descrição'}</p>
              
              <div className="flex gap-3">
                <a href={`/robos/${robo.id}`} className="flex-1 bg-indigo-600 text-white text-center py-4 rounded-2xl hover:bg-indigo-700">
                  Abrir Robô
                </a>
                <button className="px-6 py-4 border rounded-2xl hover:bg-gray-50">
                  <Phone size={22} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL DE CRIAR ROBÔ */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-10 w-full max-w-md">
            <h2 className="text-3xl font-bold mb-6">Criar Novo Robô</h2>
            
            <input
              type="text"
              placeholder="Nome do Robô"
              className="w-full p-4 border rounded-2xl mb-4"
              value={novoRobo.nome}
              onChange={(e) => setNovoRobo({...novoRobo, nome: e.target.value})}
            />
            
            <textarea
              placeholder="Descrição (opcional)"
              className="w-full p-4 border rounded-2xl h-32 mb-8"
              value={novoRobo.descricao}
              onChange={(e) => setNovoRobo({...novoRobo, descricao: e.target.value})}
            />

            <div className="flex gap-4">
              <button onClick={() => setShowModal(false)} className="flex-1 py-4 border rounded-2xl">
                Cancelar
              </button>
              <button onClick={criarRobo} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl">
                Criar Robô
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}