'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/ssr'

export default function RoboDetalhe() {
  const { id } = useParams()
  const [robo, setRobo] = useState<any>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    supabase.from('robos').select('*').eq('id', id).single().then(({ data }) => setRobo(data))
  }, [id])

  if (!robo) return <p>Carregando robô...</p>

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">{robo.nome}</h1>
      <p className="text-gray-500 mb-10">{robo.descricao}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl border">
          <h3 className="font-semibold text-xl mb-6">Conectar WhatsApp</h3>
          <button className="w-full py-6 bg-green-600 text-white rounded-2xl text-lg hover:bg-green-700">
            📱 Conectar Número do WhatsApp
          </button>
          <p className="text-center text-sm text-gray-500 mt-4">100% grátis • Multi-device</p>
        </div>

        <div className="bg-white p-8 rounded-3xl border">
          <h3 className="font-semibold text-xl mb-6">Treinar Robô</h3>
          <button className="w-full py-6 bg-black text-white rounded-2xl text-lg hover:bg-gray-800">
            Treinar com documentos / textos
          </button>
        </div>

        <div className="bg-white p-8 rounded-3xl border">
          <h3 className="font-semibold text-xl mb-6">Intervir nas Conversas</h3>
          <button className="w-full py-6 border-2 border-indigo-600 text-indigo-600 rounded-2xl text-lg hover:bg-indigo-50">
            Abrir Chat ao Vivo
          </button>
        </div>

        <div className="bg-white p-8 rounded-3xl border">
          <h3 className="font-semibold text-xl mb-6">Desempenho</h3>
          <p className="text-5xl font-bold text-green-600">98%</p>
          <p className="text-gray-500">Taxa de resolução</p>
        </div>
      </div>
    </div>
  )
}