'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/ssr'
import { Plus } from 'lucide-react'

const supabase = createClientComponentClient()

export default function Dashboard() {
  const [robos, setRobos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregarRobos() {
      const { data } = await supabase
        .from('robos')
        .select('*')
        .order('created_at', { ascending: false })
      
      setRobos(data || [])
      setLoading(false)
    }
    carregarRobos()
  }, [])

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Bem-vindo ao Thunder AI</h1>
          <p className="text-gray-600 mt-2">Aqui você gerencia todos os seus agentes de IA</p>
        </div>
        <Link 
          href="/robos"
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl hover:bg-indigo-700 transition"
        >
          <Plus size={20} />
          Criar Novo Robô
        </Link>
      </div>

      <h2 className="text-2xl font-semibold mb-6">Seus Robôs</h2>

      {loading ? (
        <p>Carregando...</p>
      ) : robos.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-3xl p-16 text-center">
          <p className="text-2xl text-gray-400 mb-4">Você ainda não tem nenhum robô</p>
          <Link 
            href="/robos"
            className="inline-block bg-black text-white px-8 py-4 rounded-2xl text-lg hover:bg-gray-800"
          >
            Criar meu primeiro robô agora →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {robos.map((robo) => (
            <Link 
              key={robo.id} 
              href={`/robos/${robo.id}`}
              className="bg-white p-6 rounded-3xl border hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-semibold">{robo.nome}</h3>
                  <p className="text-gray-500 mt-1">{robo.descricao || 'Sem descrição'}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${robo.status === 'ativo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {robo.status}
                </span>
              </div>
              {robo.whatsapp_numero && (
                <p className="text-sm text-green-600 mt-4">📱 Conectado: {robo.whatsapp_numero}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}