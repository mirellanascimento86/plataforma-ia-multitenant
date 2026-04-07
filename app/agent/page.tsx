'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { 
  Bot, 
  Save, 
  MessageSquare, 
  Phone, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Trash2,
  Settings,
  Users,
  Wrench
} from 'lucide-react'
import Link from 'next/link'

const supabase = createClient()

export default function AgentTraining() {
  const [activeTab, setActiveTab] = useState('personality')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [config, setConfig] = useState({
    name: 'Ana',
    personality: 'Atendente virtual profissional, rápida, empática e eficiente. Sempre busca resolver na primeira interação.',
    greeting_message: 'Olá! Sou a Ana, sua assistente virtual especializada em serviços técnicos. Como posso ajudar você hoje? 😊',
    services: [
      { type: 'refrigeracao', name: 'Refrigeração', questions: ['Quantos BTUs?', 'Marca e modelo?', 'Qual o problema apresentado?'] },
      { type: 'pintura', name: 'Pintura Residencial', questions: ['Metragem quadrada?', 'Quantos cômodos?', 'Tipo de superfície?'] },
      { type: 'maquina_lavar', name: 'Máquina de Lavar', questions: ['Marca e modelo?', 'Liga mas não funciona?', 'Apresenta algum erro na tela?'] },
    ],
    negotiation_script: `Quando cliente reclamar de preço:
1. Validar: "Entendo perfeitamente sua preocupação com o orçamento"
2. Justificar: "Nosso valor inclui garantia de 90 dias e peças originais"
3. Oferecer: "Posso aplicar 5% de desconto para pagamento à vista"
4. Limite máximo: "10% é o máximo de desconto que consigo autorizar sem consultar"`
  })

  const [whatsappConfig, setWhatsappConfig] = useState({
    phone_number_id: '',
    access_token: '',
    webhook_verify_token: '',
    business_account_id: ''
  })

  const [technicians, setTechnicians] = useState<any[]>([])

  useEffect(() => {
    loadConfigs()
    loadTechnicians()
  }, [])

  async function loadConfigs() {
    const { data: agentData } = await supabase
      .from('agent_configs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (agentData) {
      setConfig(prev => ({
        ...prev,
        ...agentData,
        services: agentData.services || prev.services
      }))
    }

    const { data: waData } = await supabase
      .from('whatsapp_configs')
      .select('*')
      .limit(1)
      .single()

    if (waData) setWhatsappConfig(waData)
  }

  async function loadTechnicians() {
    const { data } = await supabase.from('technicians').select('*').eq('active', true)
    if (data) setTechnicians(data)
  }

  async function saveAgentConfig() {
    setSaving(true)
    const { error } = await supabase.from('agent_configs').upsert({
      ...config,
      updated_at: new Date().toISOString()
    })

    if (error) {
      setMessage('❌ Erro ao salvar: ' + error.message)
    } else {
      setMessage('✅ Configuração do agente salva com sucesso!')
    }
    setSaving(false)
    setTimeout(() => setMessage(''), 3000)
  }

  async function saveWhatsAppConfig() {
    setSaving(true)
    const { error } = await supabase.from('whatsapp_configs').upsert({
      ...whatsappConfig,
      status: 'active',
      updated_at: new Date().toISOString()
    })

    if (error) {
      setMessage('❌ Erro ao conectar WhatsApp: ' + error.message)
    } else {
      setMessage('✅ WhatsApp Business conectado! Configure o webhook na Meta Developers.')
    }
    setSaving(false)
    setTimeout(() => setMessage(''), 5000)
  }

  const addService = () => {
    setConfig({
      ...config,
      services: [...config.services, { type: '', name: '', questions: [''] }]
    })
  }

  const updateService = (index: number, field: string, value: string) => {
    const newServices = [...config.services]
    newServices[index] = { ...newServices[index], [field]: value }
    setConfig({ ...config, services: newServices })
  }

  const addQuestion = (serviceIndex: number) => {
    const newServices = [...config.services]
    newServices[serviceIndex].questions.push('')
    setConfig({ ...config, services: newServices })
  }

  const updateQuestion = (serviceIndex: number, qIndex: number, value: string) => {
    const newServices = [...config.services]
    newServices[serviceIndex].questions[qIndex] = value
    setConfig({ ...config, services: newServices })
  }

  const removeService = (index: number) => {
    const newServices = config.services.filter((_, i) => i !== index)
    setConfig({ ...config, services: newServices })
  }

  const tabs = [
    { id: 'personality', label: '🎭 Personalidade', icon: Bot },
    { id: 'services', label: '🔧 Serviços', icon: Wrench },
    { id: 'negotiation', label: '💰 Negociação', icon: MessageSquare },
    { id: 'whatsapp', label: '📱 WhatsApp', icon: Phone },
    { id: 'technicians', label: '👨‍🔧 Técnicos', icon: Users },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
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
              <button
                onClick={saveAgentConfig}
                disabled={saving}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Salvando...' : 'Salvar Tudo'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
            message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.includes('✅') ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span>{message}</span>
          </div>
        )}

        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="col-span-12 md:col-span-3">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition ${
                      activeTab === tab.id 
                        ? 'bg-blue-100 text-blue-700 font-medium' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">💡 Dica</h4>
              <p className="text-sm text-blue-800">
                Treine seu agente com informações específicas do seu negócio para melhores resultados.
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="col-span-12 md:col-span-9">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              
              {/* ABA: PERSONALIDADE */}
              {activeTab === 'personality' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">🎭 Personalidade do Agente</h2>
                    <p className="text-gray-600 mb-6">Defina como seu agente deve se comportar com os clientes.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Agente</label>
                      <input
                        type="text"
                        value={config.name}
                        onChange={(e) => setConfig({...config, name: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: Ana, Carlos, Maria"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Personalidade & Comportamento</label>
                      <textarea
                        value={config.personality}
                        onChange={(e) => setConfig({...config, personality: e.target.value})}
                        rows={4}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Descreva o tom de voz, comportamento e características..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mensagem de Saudação</label>
                      <textarea
                        value={config.greeting_message}
                        onChange={(e) => setConfig({...config, greeting_message: e.target.value})}
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Primeira mensagem que o cliente recebe..."
                      />
                      <p className="text-xs text-gray-500 mt-1">Esta é a primeira mensagem que seus clientes verão.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ABA: SERVIÇOS */}
              {activeTab === 'services' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">🔧 Tipos de Serviço</h2>
                      <p className="text-gray-600">Configure os serviços que seu agente vai atender.</p>
                    </div>
                    <button
                      onClick={addService}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Adicionar Serviço</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {config.services.map((service, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-semibold text-gray-900">Serviço {index + 1}</h3>
                          <button
                            onClick={() => removeService(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Tipo (ID único)</label>
                            <input
                              type="text"
                              value={service.type}
                              onChange={(e) => updateService(index, 'type', e.target.value)}
                              placeholder="ex: refrigeracao"
                              className="w-full p-2 border rounded text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Nome de exibição</label>
                            <input
                              type="text"
                              value={service.name}
                              onChange={(e) => updateService(index, 'name', e.target.value)}
                              placeholder="ex: Refrigeração"
                              className="w-full p-2 border rounded text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-2">Perguntas específicas:</label>
                          <div className="space-y-2">
                            {service.questions.map((q, qIndex) => (
                              <input
                                key={qIndex}
                                type="text"
                                value={q}
                                onChange={(e) => updateQuestion(index, qIndex, e.target.value)}
                                placeholder={`Pergunta ${qIndex + 1}`}
                                className="w-full p-2 border rounded text-sm"
                              />
                            ))}
                          </div>
                          <button
                            onClick={() => addQuestion(index)}
                            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                          >
                            + Adicionar pergunta
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ABA: NEGOCIAÇÃO */}
              {activeTab === 'negotiation' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">💰 Script de Negociação</h2>
                    <p className="text-gray-600 mb-6">
                      Defina como seu agente deve lidar com objeções de preço e negociações.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instruções para Negociação
                    </label>
                    <textarea
                      value={config.negotiation_script}
                      onChange={(e) => setConfig({...config, negotiation_script: e.target.value})}
                      rows={10}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    />
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Dica:</strong> O agente detecta automaticamente quando o cliente reclama de preço 
                      (palavras como "caro", "desconto", "negociar") e aplica estas instruções.
                    </p>
                  </div>
                </div>
              )}

              {/* ABA: WHATSAPP */}
              {activeTab === 'whatsapp' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">📱 Conectar WhatsApp Business</h2>
                    <p className="text-gray-600 mb-6">
                      Integre com a API oficial do WhatsApp Business da Meta.
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-blue-900 mb-2">📋 Instruções Meta Developers:</h3>
                    <ol className="text-sm text-blue-800 list-decimal list-inside space-y-1">
                      <li>Acesse <a href="https://developers.facebook.com" target="_blank" className="underline">developers.facebook.com</a></li>
                      <li>Crie um app do tipo "Business"</li>
                      <li>Adicione o produto "WhatsApp"</li>
                      <li>Configure o webhook com esta URL:</li>
                    </ol>
                    <code className="block bg-gray-800 text-green-400 p-3 rounded mt-2 text-xs break-all">
                      https://plataforma-ia-mul-git-3ebc63-mirellanascimento86-3324s-projects.vercel.app/api/webhook/whatsapp
                    </code>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number ID</label>
                      <input
                        type="text"
                        value={whatsappConfig.phone_number_id}
                        onChange={(e) => setWhatsappConfig({...whatsappConfig, phone_number_id: e.target.value})}
                        placeholder="123456789012345"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Access Token (Meta)</label>
                      <input
                        type="password"
                        value={whatsappConfig.access_token}
                        onChange={(e) => setWhatsappConfig({...whatsappConfig, access_token: e.target.value})}
                        placeholder="EAAxxxxxxxx..."
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Webhook Verify Token</label>
                      <input
                        type="text"
                        value={whatsappConfig.webhook_verify_token}
                        onChange={(e) => setWhatsappConfig({...whatsappConfig, webhook_verify_token: e.target.value})}
                        placeholder="Crie um token seguro"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      />
                      <p className="text-xs text-gray-500 mt-1">Crie um token aleatório forte (ex: meu_token_secreto_123)</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Business Account ID (opcional)</label>
                      <input
                        type="text"
                        value={whatsappConfig.business_account_id}
                        onChange={(e) => setWhatsappConfig({...whatsappConfig, business_account_id: e.target.value})}
                        placeholder="1234567890"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <button
                    onClick={saveWhatsAppConfig}
                    disabled={saving}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <Phone className="w-5 h-5" />
                    <span>{saving ? 'Conectando...' : 'Conectar WhatsApp Business'}</span>
                  </button>
                </div>
              )}

              {/* ABA: TÉCNICOS */}
              {activeTab === 'technicians' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">👨‍🔧 Gerenciar Técnicos</h2>
                    <p className="text-gray-600 mb-6">
                      Cadastre os técnicos que vão atender os chamados.
                    </p>
                  </div>

                  {technicians.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">Nenhum técnico cadastrado ainda.</p>
                      <p className="text-sm text-gray-500">
                        Adicione técnicos no Supabase na tabela "technicians"
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {technicians.map((tech) => (
                        <div key={tech.id} className="border rounded-lg p-4 flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">{tech.name}</h3>
                            <p className="text-sm text-gray-600">{tech.specialty}</p>
                            <p className="text-xs text-gray-500">{tech.phone}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs ${
                            tech.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {tech.active ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
