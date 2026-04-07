'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bot, Save, Phone, Wrench, User } from 'lucide-react'

export default function AgentPage() {
  const [activeTab, setActiveTab] = useState('personality')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bot className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Treinamento do Agente</h1>
              <p className="text-xs text-gray-500">Configure sua IA para atendimento</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/monitor" className="text-gray-600 hover:text-gray-900 text-sm">
              Monitor →
            </Link>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center space-x-2">
              <Save className="w-4 h-4" />
              <span>Salvar</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('personality')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition ${
                  activeTab === 'personality' 
                    ? 'bg-blue-100 text-blue-700 font-medium' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <User className="w-5 h-5" />
                <span>Personalidade</span>
              </button>
              
              <button
                onClick={() => setActiveTab('services')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition ${
                  activeTab === 'services' 
                    ? 'bg-blue-100 text-blue-700 font-medium' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Wrench className="w-5 h-5" />
                <span>Serviços</span>
              </button>
              
              <button
                onClick={() => setActiveTab('whatsapp')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition ${
                  activeTab === 'whatsapp' 
                    ? 'bg-blue-100 text-blue-700 font-medium' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Phone className="w-5 h-5" />
                <span>WhatsApp</span>
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              
              {/* Tab: Personalidade */}
              {activeTab === 'personality' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Personalidade do Agente</h2>
                    <p className="text-gray-600">Defina como seu agente deve se comportar.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome do Agente
                      </label>
                      <input
                        type="text"
                        defaultValue="Ana"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: Ana, Carlos, Maria"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Saudação Inicial
                      </label>
                      <textarea
                        defaultValue="Olá! Sou a Ana, sua assistente virtual especializada em serviços técnicos. Como posso ajudar você hoje?"
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Personalidade
                      </label>
                      <textarea
                        defaultValue="Profissional, rápida, empática e eficiente. Sempre busca resolver na primeira interação."
                        rows={4}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Serviços */}
              {activeTab === 'services' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Tipos de Serviço</h2>
                    <p className="text-gray-600">Configure os serviços que seu agente vai atender.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <h3 className="font-semibold text-gray-900 mb-2">Refrigeração</h3>
                      <p className="text-sm text-gray-600 mb-3">Perguntas: BTUs, Marca, Problema</p>
                      <div className="flex gap-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Geladeira</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Ar Condicionado</span>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <h3 className="font-semibold text-gray-900 mb-2">Pintura</h3>
                      <p className="text-sm text-gray-600 mb-3">Perguntas: Metragem, Cômodos, Superfície</p>
                      <div className="flex gap-2">
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Residencial</span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Comercial</span>
                      </div>
                    </div>

                    <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 transition">
                      + Adicionar Novo Serviço
                    </button>
                  </div>
                </div>
              )}

              {/* Tab: WhatsApp */}
              {activeTab === 'whatsapp' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Conectar WhatsApp Business</h2>
                    <p className="text-gray-600">Integre com a API oficial do WhatsApp.</p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Webhook URL</h3>
                    <code className="block bg-gray-800 text-green-400 p-3 rounded text-xs break-all">
                      https://plataforma-ia-mul-git-3ebc63-mirellanascimento86-3324s-projects.vercel.app/api/webhook/whatsapp
                    </code>
                    <p className="text-sm text-blue-800 mt-2">
                      Configure esta URL no Meta Developers
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number ID
                      </label>
                      <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="123456789012345"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Access Token
                      </label>
                      <input
                        type="password"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="EAAxxxxxxxx..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Verify Token
                      </label>
                      <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="meu_token_secreto"
                      />
                    </div>
                  </div>

                  <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition">
                    Conectar WhatsApp
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
