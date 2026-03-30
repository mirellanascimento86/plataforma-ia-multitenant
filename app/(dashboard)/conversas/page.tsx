'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { MessageSquare, Send, User, Bot, AlertCircle } from 'lucide-react'

export default function ConversasPage() {
  const [conversas, setConversas] = useState<any[]>([])
  const [conversaSelecionada, setConversaSelecionada] = useState<any>(null)
  const [mensagens, setMensagens] = useState<any[]>([])
  const [novaMensagem, setNovaMensagem] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadConversas()
  }, [])

  async function loadConversas() {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) return

    const { data: usuario } = await supabase
      .from('usuarios')
      .select('empresa_id')
      .eq('id', userData.user.id)
      .single()

    const { data } = await supabase
      .from('conversas')
      .select('*')
      .eq('empresa_id', usuario?.empresa_id)
      .order('criada_em', { ascending: false })

    setConversas(data || [])
    setLoading(false)
  }

  async function loadMensagens(conversaId: string) {
    const { data } = await supabase
      .from('mensagens')
      .select('*')
      .eq('conversa_id', conversaId)
      .order('criada_em', { ascending: true })

    setMensagens(data || [])
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
    loadMensagens(conversaSelecionada.id)
  }

  if (loading) return <div className="p-8">Carregando...</div>

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Lista de Conversas */}
      <div className="w-80 border-r">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Conversas</h2>
        </div>
        <div className="overflow-y-auto">
          {conversas.map((conversa) => (
            <button
              key={conversa.id}
              onClick={() => {
                setConversaSelecionada(conversa)
                loadMensagens(conversa.id)
              }}
              className={`w-full p-4 text-left border-b hover:bg-gray-50 ${conversaSelecionada?.id === conversa.id ? 'bg-blue-50' : ''}`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{conversa.cliente_nome || 'Cliente'}</p>
                  <p className="text-sm text-gray-500 truncate">{conversa.ultima_mensagem || 'Nova conversa'}</p>
                </div>
              </div>
            </button>
          ))}
          {conversas.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Nenhuma conversa ainda</p>
            </div>
          )}
        </div>
      </div>

      {/* Área de Chat */}
      <div className="flex-1 flex flex-col">
        {conversaSelecionada ? (
          <>
            <div className="p-4 border-b">
              <h3 className="font-semibold">{conversaSelecionada.cliente_nome || 'Cliente'}</h3>
              <p className="text-sm text-gray-500">{conversaSelecionada.cliente_telefone}</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {mensagens.map((msg) => (
                <div key={msg.id} className={`flex ${msg.remetente === 'cliente' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[70%] px-4 py-2 rounded-lg ${msg.remetente === 'cliente' ? 'bg-gray-100' : 'bg-blue-600 text-white'}`}>
                    <p>{msg.conteudo}</p>
                  </div>
                </div>
              ))}
              {mensagens.length === 0 && (
                <div className="text-center text-gray-400 mt-8">
                  <Bot className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>Nenhuma mensagem ainda</p>
                </div>
              )}
            </div>

            <form onSubmit={enviarMensagem} className="p-4 border-t flex space-x-2">
              <input
                type="text"
                value={novaMensagem}
                onChange={(e) => setNovaMensagem(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Send className="w-5 h-5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>Selecione uma conversa para começar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
