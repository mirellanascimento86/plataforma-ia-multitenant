'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MessageSquare, User, Bot as BotIcon, AlertCircle } from 'lucide-react'

export default function MonitorPage() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null)

  const chats = [
    { id: 1, name: 'Cliente 1', service: 'Refrigeração', status: 'novo', unread: 2 },
    { id: 2, name: 'Cliente 2', service: 'Pintura', status: 'aguardando', unread: 0 },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold">Monitoramento</h1>
          <Link href="/agent" className="text-blue-600">← Voltar ao Treinamento</Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-3 gap-4 h-[80vh]">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b font-semibold">Conversas</div>
            <div className="overflow-y-auto">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${selectedChat === chat.id ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{chat.name}</span>
                    {chat.unread > 0 && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{chat.unread}</span>}
                  </div>
                  <p className="text-sm text-gray-600">{chat.service}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-2 bg-white rounded-lg shadow flex flex-col">
            {selectedChat ? (
              <>
                <div className="p-4 border-b flex justify-between items-center">
                  <div>
                    <h2 className="font-semibold">Cliente {selectedChat}</h2>
                    <p className="text-sm text-gray-600">Refrigeração • Centro</p>
                  </div>
                  <button className="bg-red-500 text-white px-4 py-2 rounded text-sm">Intervir</button>
                </div>
                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                  <div className="flex justify-start">
                    <div className="bg-gray-200 rounded-lg p-3 max-w-[70%]">
                      <p className="text-xs font-semibold mb-1">Cliente</p>
                      <p>Olá, preciso de ajuda com minha geladeira</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-blue-600 text-white rounded-lg p-3 max-w-[70%]">
                      <p className="text-xs font-semibold mb-1">Ana (IA)</p>
                      <p>Olá! Claro que posso ajudar. Quantos BTUs tem sua geladeira?</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <input className="flex-1 p-3 border rounded-lg" placeholder="Responder como humano..." />
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg">Enviar</button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                Selecione uma conversa
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
