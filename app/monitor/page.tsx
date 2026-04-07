'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Monitor() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [filter, setFilter] = useState('all'); // all, needs_human, active, closed

  useEffect(() => {
    loadOrders();
    
    // Inscrever em mudanças em tempo real
    const subscription = supabase
      .channel('service_orders_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'service_orders' 
      }, (payload) => {
        console.log('Mudança detectada:', payload);
        loadOrders();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function loadOrders() {
    let query = supabase
      .from('service_orders')
      .select('*, technicians(name, phone, specialty)')
      .order('created_at', { ascending: false });

    if (filter === 'needs_human') {
      query = query.eq('human_intervention_needed', true);
    } else if (filter === 'active') {
      query = query.in('status', ['novo', 'visita_agendada', 'orcamento_enviado', 'negociacao']);
    } else if (filter === 'closed') {
      query = query.in('status', ['fechado', 'concluido', 'cancelado']);
    }

    const { data } = await query;
    if (data) setOrders(data);
  }

  async function loadMessages(orderId: string) {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('service_order_id', orderId)
      .order('created_at', { ascending: true });
    
    if (data) setMessages(data);
  }

  function selectOrder(order: any) {
    setSelectedOrder(order);
    loadMessages(order.id);
  }

  async function intervene() {
    if (!selectedOrder) return;

    await supabase
      .from('service_orders')
      .update({ 
        human_intervention_needed: true,
        human_intervention_reason: 'Intervenção manual do atendente'
      })
      .eq('id', selectedOrder.id);

    alert('🚨 Intervenção humana ativada! O bot vai notificar o cliente.');
    loadOrders();
  }

  async function sendAsHuman(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedOrder || !newMessage.trim()) return;

    // Salvar mensagem no banco
    await supabase.from('messages').insert({
      service_order_id: selectedOrder.id,
      sender_type: 'human',
      sender_name: 'Atendente Humano',
      content: newMessage,
    });

    // Aqui você chamaria a API de envio de WhatsApp
    // await fetch('/api/send-message', {...})

    setNewMessage('');
    loadMessages(selectedOrder.id);
  }

  async function updateStatus(newStatus: string) {
    if (!selectedOrder) return;

    await supabase
      .from('service_orders')
      .update({ status: newStatus })
      .eq('id', selectedOrder.id);

    loadOrders();
    setSelectedOrder({...selectedOrder, status: newStatus});
  }

  const statusColors: any = {
    'novo': 'bg-yellow-100 text-yellow-800',
    'visita_agendada': 'bg-blue-100 text-blue-800',
    'orcamento_enviado': 'bg-purple-100 text-purple-800',
    'negociacao': 'bg-orange-100 text-orange-800',
    'fechado': 'bg-green-100 text-green-800',
    'concluido': 'bg-gray-100 text-gray-800',
    'cancelado': 'bg-red-100 text-red-800',
  };

  const statusLabels: any = {
    'novo': 'Novo',
    'visita_agendada': 'Visita Agendada',
    'orcamento_enviado': 'Orçamento Enviado',
    'negociacao': 'Em Negociação',
    'fechado': 'Fechado',
    'concluido': 'Concluído',
    'cancelado': 'Cancelado',
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800">📊 Monitoramento de Atendimentos</h1>
          <div className="flex space-x-2">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'active', label: 'Ativos' },
              { id: 'needs_human', label: 'Precisa de Humano' },
              { id: 'closed', label: 'Encerrados' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => { setFilter(f.id); loadOrders(); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-3 gap-6 h-[calc(100vh-140px)]">
          
          {/* Lista de Atendimentos */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b bg-gray-50">
              <h2 className="font-semibold text-gray-700">
                Atendimentos ({orders.length})
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {orders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => selectOrder(order)}
                  className={`p-4 border-b cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedOrder?.id === order.id ? 'bg-blue-50 border-blue-200' : ''
                  } ${order.human_intervention_needed ? 'border-l-4 border-l-red-500' : ''}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {order.client_name || 'Cliente'}
                      </p>
                      <p className="text-sm text-gray-500">{order.client_phone}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>🔧 {order.service_type || 'Serviço não identificado'}</p>
                    <p>📍 {order.neighborhood || 'Bairro não informado'}</p>
                    <p>👨‍🔧 {order.technicians?.name || 'Técnico não atribuído'}</p>
                  </div>

                  {order.human_intervention_needed && (
                    <div className="mt-2 flex items-center text-red-600 text-xs font-semibold">
                      <span className="mr-1">🚨</span> Precisa de atendente humano
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Detalhes e Conversa */}
          <div className="col-span-2 bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
            {selectedOrder ? (
              <>
                {/* Header do Atendimento */}
                <div className="p-4 border-b bg-gray-50 flex justify-between items-start">
                  <div>
                    <h2 className="font-bold text-lg text-gray-800">
                      {selectedOrder.client_name || 'Cliente'}
                    </h2>
                    <div className="flex space-x-4 text-sm text-gray-600 mt-1">
                      <span>📱 {selectedOrder.client_phone}</span>
                      <span>🔧 {selectedOrder.service_type || 'Não definido'}</span>
                      <span>📍 {selectedOrder.neighborhood || 'Não informado'}</span>
                    </div>
                    {selectedOrder.technicians && (
                      <div className="mt-2 text-sm">
                        <span className="text-gray-600">Técnico: </span>
                        <span className="font-medium">{selectedOrder.technicians.name}</span>
                        <span className="text-gray-500 ml-2">({selectedOrder.technicians.phone})</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => updateStatus(e.target.value)}
                      className="text-sm border rounded-lg px-3 py-2 bg-white"
                    >
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                    
                    <button
                      onClick={intervene}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                    >
                      🚨 Intervir
                    </button>
                  </div>
                </div>

                {/* Mensagens */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${
                        msg.sender_type === 'client' ? 'justify-start' : 'justify-end'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-2xl shadow-sm ${
                          msg.sender_type === 'client' 
                            ? 'bg-white text-gray-800 rounded-bl-none' 
                            : msg.sender_type === 'human'
                              ? 'bg-red-600 text-white rounded-br-none'
                              : 'bg-blue-600 text-white rounded-br-none'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-semibold opacity-90">
                            {msg.sender_name}
                          </span>
                          <span className="text-xs opacity-70">
                            {new Date(msg.created_at).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                        
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        
                        {msg.media_url && (
                          <div className="mt-2 p-2 bg-black bg-opacity-10 rounded text-xs">
                            📎 Mídia: {msg.media_type}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input de Mensagem */}
                <div className="p-4 border-t bg-white">
                  <form onSubmit={sendAsHuman} className="flex space-x-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Digite sua mensagem como atendente humano..."
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Enviar
                    </button>
                  </form>
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Você está respondendo como atendente humano. O cliente será notificado.
                  </p>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <p className="text-4xl mb-4">📋</p>
                  <p>Selecione um atendimento para visualizar</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
