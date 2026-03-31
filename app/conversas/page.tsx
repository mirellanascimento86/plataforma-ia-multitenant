'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export default function ConversasPage() {
  const router = useRouter()
  const [conversas, setConversas] = useState<any[]>([])
  const [conversaSelecionada, setConversaSelecionada] = useState<any>(null)
  const [mensagens, setMensagens] = useState<any[]>([])
  const [novaMensagem, setNovaMensagem] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadConversas()
  }, [])

  async function loadConversas() {
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
      .from('conversas')
      .select('*')
      .eq('empresa_id', usuario?.empresa_id)
      .order('criada_em', { ascending: false })

    setConversas(data || [])
    setLoading(false)
  }

  async function enviarMensagem(e: React.FormEvent) {
    e.preventDefault()
    if (!novaMensagem.trim() || !conversaSelecionada) return

    await supabase.from('mensagens').insert({
      conversa_id: conversaSelecionada.id,
      conteudo: novaMensagem,
      remetente: 'humano',
      empresa_id: conversaSelecionada.empresa_id
    })

    setNovaMensagem('')
  }

  if (loading) return <div className="p-8">Carregando...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">Conversas</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 h-[calc(100vh-12rem)]">
            
            {/* Lista de conversas */}
            <div className="border-r border-gray-200 overflow-y-auto">
              {conversas.map((conversa) => (
                <button
                  key={conversa.id}
                  onClick={() => setConversaSelecionada(conversa)}
                  className={`w-full p-4 text-left border-b hover:bg-gray-50 ${
                    conversaSelecionada?.id === conversa.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <p className="font-medium text-gray-900">{conversa.cliente_nome || 'Cliente'}</p>
                  <p className="text-sm text-gray-500 truncate">{conversa.ultima_mensagem || 'Nova conversa'}</p>
                </button>
              ))}
              {conversas.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <p>Nenhuma conversa ainda</p>
                </div>
              )}
            </div>

            {/* Área de chat */}
            <div className="lg:col-span-2 flex flex-col">
              {conversaSelecionada ? (
                <>
                  <div className="p-4 border-b">
                    <h3 className="font-semibold">{conversaSelecionada.cliente_nome || 'Cliente'}</h3>
                    <p className="text-sm text-gray-500">{conversaSelecionada.cliente_telefone}</p>
                  </div>
                  
                  <div className="flex-1 p-4 overflow-y-auto">
                    <p className="text-gray-400 text-center">Histórico de mensagens...</p>
                  </div>

                  <form onSubmit={enviarMensagem} className="p-4 border-t flex space-x-2">
                    <input
                      type="text"
                      value={novaMensagem}
                      onChange={(e) => setNovaMensagem(e.target.value)}
                      placeholder="Digite sua mensagem..."
                      className="flex-1 px-4 py-2 border rounded-lg"
                    />
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                      Enviar
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  <p>Selecione uma conversa</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
