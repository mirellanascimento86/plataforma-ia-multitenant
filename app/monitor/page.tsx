'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Monitor() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [reply, setReply] = useState('');

  useEffect(() => {
    loadOrders();
    const sub = supabase.channel('orders').on('postgres_changes', { event: '*', schema: 'public', table: 'service_orders' }, loadOrders).subscribe();
    return () => { sub.unsubscribe(); };
  }, []);

  async function loadOrders() {
    const { data } = await supabase.from('service_orders').select('*, technicians(name)').order('created_at', { ascending: false });
    if (data) setOrders(data);
  }

  async function selectOrder(order: any) {
    setSelected(order);
    const { data } = await supabase.from('messages').select('*').eq('service_order_id', order.id).order('created_at');
    if (data) setMessages(data);
  }

  async function intervene() {
    if (!selected) return;
    await supabase.from('service_orders').update({ human_intervention_needed: true }).eq('id', selected.id);
    alert('🚨 Intervenção humana ativada!');
    loadOrders();
  }

  async function sendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !reply.trim()) return;
    
    await supabase.from('messages').insert({
      service_order_id: selected.id,
      sender_type: 'human',
      sender_name: 'Atendente',
      content: reply,
    });
    
    setReply('');
    selectOrder(selected);
  }

  const statusColors: any = {
    'novo': 'bg-yellow-100',
    'visita_agendada': 'bg-blue-100',
    'orcamento_enviado': 'bg-purple-100',
    'negociacao': 'bg-orange-100',
    'fechado': 'bg-green-100',
    'concluido': 'bg-gray-100'
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">📊 Monitoramento de Atendimentos</h1>
      
      <div className="grid grid-cols-3 gap-6 h-[80vh]">
        {/* Lista */}
        <div className="bg-white rounded-xl shadow overflow-hidden flex flex-col">
          <div className="p-4 border-b font-semibold">Atendimentos ({orders.length})</div>
          <div className="flex-1 overflow-y-auto">
            {orders.map(o => (
              <div key={o.id} onClick={() => selectOrder(o)} className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${selected?.id === o.id ? 'bg-blue-50' : ''} ${o.human_intervention_needed ? 'border-l-4 border-red-500' : ''}`}>
                <div className="flex justify-between">
                  <span className="font-medium">{o.client_name || 'Cliente'}</span>
                  <span className={`text-xs px-2 py-1 rounded ${statusColors[o.status] || 'bg-gray-100'}`}>{o.status}</span>
                </div>
                <p className="text-sm text-gray-600">{o.service_type} • {o.neighborhood}</p>
                {o.human_intervention_needed && <p className="text-xs text-red-600 mt-1">🚨 Precisa de humano</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Conversa */}
        <div className="col-span-2 bg-white rounded-xl shadow overflow-hidden flex flex-col">
          {selected ? (
            <>
              <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                <div>
                  <h2 className="font-bold">{selected.client_name || 'Cliente'}</h2>
                  <p className="text-sm text-gray-600">{selected.service_type} • {selected.neighborhood}</p>
                </div>
                <button onClick={intervene} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700">🚨 Intervir</button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.sender_type === 'client' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[70%] p-3 rounded-lg ${m.sender_type === 'client' ? 'bg-white' : m.sender_type === 'human' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`}>
                      <p className="text-xs font-semibold mb-1">{m.sender_name}</p>
                      <p className="text-sm">{m.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={sendReply} className="p-4 border-t flex gap-2">
                <input className="flex-1 p-3 border rounded-lg" placeholder="Responder como humano..." value={reply} onChange={e => setReply(e.target.value)} />
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">Enviar</button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">Selecione um atendimento</div>
          )}
        </div>
      </div>
    </div>
  );
}

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
