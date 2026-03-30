'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Users, Search, Phone, Mail, Calendar } from 'lucide-react'

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

    // Por enquanto, vamos buscar de conversas (depois criamos tabela clientes)
    const { data } = await supabase
      .from('conversas')
      .select('*')
      .eq('empresa_id', usuario?.empresa_id)

    // Transformar conversas em "clientes" temporários
    const clientesUnicos = data?.reduce((acc: any[], conv: any) => {
      if (!acc.find((c) => c.telefone === conv.cliente_telefone)) {
        acc.push({
          id: conv.id,
          nome: conv.cliente_nome || 'Sem nome',
          telefone: conv.cliente_telefone,
          ultimo_contato: conv.criada_em,
        })
      }
      return acc
    }, []) || []

    setClientes(clientesUnicos)
    setLoading(false)
  }

  const clientesFiltrados = clientes.filter((c) =>
    c.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    c.telefone?.includes(busca)
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
        <div className="text-sm text-gray-500">
          Total: {clientes.length} clientes
        </div>
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome ou telefone..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Lista de Clientes */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 text-sm font-medium text-gray-600">
          <div className="col-span-4">Nome</div>
          <div className="col-span-3">Telefone</div>
          <div className="col-span-3">Último Contato</div>
          <div className="col-span-2">Ações</div>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">Carregando...</div>
        ) : clientesFiltrados.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Nenhum cliente encontrado</p>
          </div>
        ) : (
          clientesFiltrados.map((cliente) => (
            <div key={cliente.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
              <div className="col-span-4 flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium">
                    {cliente.nome?.charAt(0) || '?'}
                  </span>
                </div>
                <span className="font-medium text-gray-900">{cliente.nome}</span>
              </div>
              <div className="col-span-3 flex items-center text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                {cliente.telefone}
              </div>
              <div className="col-span-3 flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(cliente.ultimo_contato).toLocaleDateString('pt-BR')}
              </div>
              <div className="col-span-2">
                <button className="text-blue-600 hover:underline text-sm">
                  Ver histórico
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
