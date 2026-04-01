'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function Dashboard() {
  const [robos, setRobos] = useState<any[]>([])
  const [workspace, setWorkspace] = useState('Meu Workspace')

  useEffect(() => {
    // buscar robôs do workspace atual (vamos ajustar depois com RLS)
    supabase.from('robos').select('*').then(({ data }) => setRobos(data || []))
  }, [])

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Bem-vindo de volta!</h1>
          <p className="text-gray-500">Workspace: <span className="font-semibold">{workspace}</span></p>
        </div>
        <button onClick={() => {/* criar workspace modal */}} className="px-6 py-3 bg-indigo-600 text-white rounded-2xl">
          + Novo Workspace
        </button>
      </div>

      <h2 className="text-2xl mb-4">Seus Agentes de IA</h2>
      {robos.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-3xl p-12 text-center">
          <p className="text-xl text-gray-500">Você ainda não tem nenhum robô.</p>
          <Link href="/robos" className="mt-6 inline-block px-8 py-4 bg-black text-white rounded-2xl text-lg">
            Criar meu primeiro robô agora
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {robos.map(r => (
            <Link key={r.id} href={`/robos/${r.id}`} className="block bg-white p-6 rounded-3xl hover:shadow-xl">
              <h3 className="text-2xl font-semibold">{r.nome}</h3>
              <p className="text-green-500">Conectado ao WhatsApp</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}