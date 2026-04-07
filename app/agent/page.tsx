'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bot, Save, Phone, MessageSquare, Wrench } from 'lucide-react'

export default function AgentPage() {
  const [tab, setTab] = useState('personality')
  const [saving, setSaving] = useState(false)

  const tabs = [
    { id: 'personality', label: 'Personalidade', icon: Bot },
    { id: 'services', label: 'Serviços', icon: Wrench },
    { id: 'whatsapp', label: 'WhatsApp', icon: Phone },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="w-8 h-8 text-blue-600" />
            <h1 className="text-xl font-bold">Treinamento do Agente</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/monitor" className="text-gray-600 hover:text-gray-900">Monitor →</Link>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <Save className="w-4 h-4" />
              <span>Salvar</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-3">
            <nav className="space-y-1">
              {tabs.map((t) => {
                const Icon = t.icon
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
                      tab === t.id ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{t.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="col-span-9">
            <div className="bg-white rounded-xl shadow p-6">
              {tab === 'personality' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Personalidade do Agente</h2>
                  <div>
                    <label className="block text-sm font-medium mb-2">Nome</label>
                    <input className="w-full p-3 border rounded-lg" defaultValue="Ana" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Saudação</label>
                    <textarea className="w-full p-3 border rounded-lg" rows={3} defaultValue="Olá! Sou a Ana, sua assistente virtual." />
                  </div>
                </div>
              )}

              {tab === 'services' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Serviços</h2>
                  <p className="text-gray-600">Configure os tipos de serviço que o agente vai atender.</p>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="font-semibold">Refrigeração</h3>
                    <p className="text-sm text-gray-600">BTUs, Marca, Problema</p>
                  </div>
                </div>
              )}

              {tab === 'whatsapp' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Conectar WhatsApp</h2>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800 mb-2">Webhook URL:</p>
                    <code className="bg-gray-800 text-green-400 p-2 rounded text-xs block">
                      https://plataforma-ia-mul-git-3ebc63-mirellanascimento86-3324s-projects.vercel.app/api/webhook/whatsapp
                    </code>
                  </div>
                  <input className="w-full p-3 border rounded-lg" placeholder="Phone Number ID" />
                  <input className="w-full p-3 border rounded-lg" placeholder="Access Token" type="password" />
                  <button className="w-full bg-green-600 text-white py-3 rounded-lg">Conectar WhatsApp</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
