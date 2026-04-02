'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { Plus, Bot } from 'lucide-react'

export default function Dashboard() {
  const [robos, setRobos] = useState<any[]>([])
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    supabase
      .from('robos')
      .select('*')
      .then(({ data }) => setRobos(data || []))
  }, [supabase])

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Bem-vindo ao seu Workspace</h1>
          <p className="text-gray-600 mt-2">Crie e gerencie seus agentes de IA para WhatsApp</p>
        </div>
        <Link 
          href="/robos" 
          className="flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-3xl text-lg hover:bg-indigo-700 transition"
        >
          <Plus size={24} /> Criar Novo Robô
        </Link>
      </div>

      {robos.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-300 rounded-3xl bg-white">
          <Bot size={80} className="mx-auto text-gray-300 mb-6" />
          <h3 className="text-2xl font-medium text-gray-400 mb-4">Você ainda não tem nenhum robô criado</h3>
          <Link 
            href="/robos" 
            className="inline-block bg-black text-white px-10 py-5 rounded-3xl text-lg hover:bg-gray-800"
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
              className="bg-white p-8 rounded-3xl border hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <h3 className="text-2xl font-semibold">{robo.nome}</h3>
              <p className="text-gray-500 mt-1">{robo.descricao || 'Sem descrição'}</p>
              {robo.whatsapp_numero && (
                <p className="text-green-600 text-sm mt-4">📱 Conectado ao WhatsApp</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
