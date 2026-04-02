'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/ssr'
import { Plus, Bot } from 'lucide-react'

const supabase = createClientComponentClient()

export default function Dashboard() {
  const [robos, setRobos] = useState<any[]>([])

  useEffect(() => {
    supabase.from('robos').select('*').then(({ data }) => setRobos(data || []))
  }, [])

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold">Olá, bem-vindo ao seu Workspace!</h1>
          <p className="text-gray-600 mt-2">Crie e gerencie seus agentes de IA</p>
        </div>
        <Link href="/robos" className="flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-3xl text-lg hover:bg-indigo-700">
          <Plus size={24} /> Criar Novo Robô
        </Link>
      </div>

      {robos.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-3xl">
          <Bot size={80} className="mx-auto text-gray-300 mb-6" />
          <h3 className="text-2xl font-medium text-gray-400">Você ainda não tem nenhum robô</h3>
          <Link href="/robos" className="mt-8 inline-block bg-black text-white px-10 py-5 rounded-3xl text-lg">
            Criar meu primeiro robô agora
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {robos.map((robo) => (
            <Link key={robo.id} href={`/robos/${robo.id}`} className="block bg-white p-8 rounded-3xl hover:shadow-xl">
              <h3 className="text-3xl font-semibold">{robo.nome}</h3>
              <p className="text-green-600 mt-2">✅ Conectado</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
