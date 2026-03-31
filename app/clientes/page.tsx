'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Users, Search, Phone, Mail } from 'lucide-react'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export default function ClientesPage() {
  const [clientes, setClientes] = useState<any[]>([])
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadClientes()
  }, [])

  async function loadClientes() {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) return

    const { data: usuario } = await supabase
      .from('usuarios')
      .select('empresa_id')
      .eq('id', userData.user.id)
      .single()

    // Buscar de conversas (clientes únicos)
    const { data } = await supabase
      .from('conversas')
      .select('*')
      .eq('empresa_id', usuario?.empresa_id)

    const unicos = data?.reduce((acc: any[], conv: any) => {
      if (!acc.find((c) => c.telefone === conv.cliente_telefone)) {
        acc.push({
          id: conv.id,
          nome: conv.cliente_nome || 'Sem nome',
          telefone: conv.cliente_telefone,
          ultimo_contato: conv.atualizada_em || conv.criada_em,
        })
      }
      return acc
    }, []) || []

    setClientes(unicos)
    setLoading(false)
  }

  const filtrados = clientes.filter((c) =>
    c.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    c.telefone?.includes(busca)
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">Clientes</h1>
            <span className="text-sm text-gray-500">{clientes.length} total</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Busca */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome ou telefone..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Lista */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {filtrados.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Nenhum cliente encontrado</p>
            </div>
          ) : (
            filtrados.map((cliente) => (
              <div key={cliente.id} className="p-4 border-b hover:bg-gray-50 flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-medium">
                    {cliente.nome?.charAt(0) || '?'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{cliente.nome}</p>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    {cliente.telefone}
                  </p>
                </div>
                <span className="text-sm text-gray-400">
                  {new Date(cliente.ultimo_contato).toLocaleDateString('pt-BR')}
                </span>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
