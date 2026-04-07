'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Monitor() {
  const [orders, setOrders] = useState<any[]>([])
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    loadOrders()
    
    const subscription = supabase
      .channel('service_orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'service_orders' }, 
        () => loadOrders()
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function loadOrders() {
    const { data } = await supabase
      .from('service_orders')
      .select('*, technicians(name, phone)')
      .order('created_at', { ascending: false })
    
    if (data) setOrders(data)
  }

  async function loadMessages(orderId: string) {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('service_order_id', orderId)
      .order('created_at', { ascending: true })
    
    if (data) setMessages(data)
  }

  async function intervene(orderId: string) {
    await supabase
      .from('service_orders')
      .update({ human_intervention_needed: true })
      .eq('id', orderId)
    
    alert('Intervenção humana ativada!')
  }

  async function sendAsHuman(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedOrder || !newMessage.trim()) return

    await supabase.from('messages').insert({
      service_order_id: selectedOrder.id,
      sender_type: 'human',
      sender_name: 'Atendente Humano',
      content: newMessage,
    })

    setNewMessage('')
    loadMessages(selectedOrder.id)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">📊 Monitoramento em Tempo Real</h1>
        
        <div className="grid grid-cols-3 gap-6 h-[80vh]">
          {/* Lista de Atendimentos */}
          <div className="col-span-1 bg-white rounded-lg shadow-md p-4 overflow-y-auto">
            <h2 className="font-semibold mb-4">Atendimentos Ativos ({orders.length})</h2>
            
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => {
                  setSelectedOrder(order)
                  loadMessages(order.id)
                }}
                className={`p-4 rounded-lg mb-3 cursor-pointer transition-colors ${
                  selectedOrder?.id === order.id ? 'bg-blue-100 border-blue-500' : 'bg-gray-50 hover:bg-gray-100'
                } ${order.human_intervention_needed ? 'border-l-4 border-red-500' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{order.client_name || 'Cliente'}</p>
                    <p className="text-sm text-gray-600">{order.service_type || 'Novo'}</p>
                    <p className="text-xs text-gray-500">{order.neighborhood || 'Bairro não informado'}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    order.status === 'novo' ? 'bg-yellow-200' :
                    order.status === 'fechado' ? 'bg-green-200' : 'bg-blue-200'
                  }`}>
                    {order.status}
                  </span>
                </div>
                
                {order.human_intervention_needed && (
                  <p className="text-xs text-red-600 mt-2 font-semibold">⚠️ Precisa de ajuda</p>
                )}
              </div>
            ))}
          </div>

          {/* Conversa */}
          <div className="col-span-2 bg-white rounded-lg shadow-md p-4 flex flex-col">
            {selectedOrder ? (
              <>
                <div className="border-b pb-4 mb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="font-semibold text-lg">{selectedOrder.client_name || 'Cliente'}</h2>
                      <p className="text-sm text-gray-600">
                        {selectedOrder.service_type} • {selectedOrder.neighborhood} • 
                        Téc: {selectedOrder.technicians?.name || 'Não atribuído'}
                      </p>
                    </div>
                    <button
                      onClick={() => intervene(selectedOrder.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600"
                    >
                      🚨 Intervir
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${
                        msg.sender_type === 'client' ? 'justify-start' : 'justify-end'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          msg.sender_type === 'client' ? 'bg-gray-200' :
                          msg.sender_type === 'human' ? 'bg-red-100' : 'bg-blue-100'
                        }`}
                      >
                        <p className="text-xs font-semibold mb-1">
                          {msg.sender_name}
                        </p>
                        <p className="text-sm">{msg.content}</p>
                        {msg.media_url && (
                          <p className="text-xs text-blue-600 mt-1">📎 Mídia anexada</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <form onSubmit={sendAsHuman} className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Digite sua mensagem como atendente humano..."
                      className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                    >
                      Enviar
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Selecione um atendimento para visualizar
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
