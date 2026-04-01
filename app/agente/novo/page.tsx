'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Bot, 
  MessageSquare, 
  Brain, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  Wand2,
  Code
} from 'lucide-react'
import Link from 'next/link'

export default function NovoAgentePage() {
  const [step, setStep] = useState(1)
  const [modo, setModo] = useState<'simples' | 'avancado'>('simples')
  const [formData, setFormData] = useState({
    nome: '',
    objetivo: 'atender',
    tomVoz: 'profissional',
    instrucoes: '',
    promptSistema: ''
  })
  const [loading, setLoading] = useState(false)
  
  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleSubmit = async () => {
    setLoading(true)
    
    const { data: { session } } = await supabase.auth.getSession()
    
    const { data: membro } = await supabase
      .from('membros_empresa')
      .select('empresa_id')
      .eq('usuario_id', session?.user.id)
      .single()

    const { data: bot, error } = await supabase
      .from('bots')
      .insert({
        empresa_id: membro.empresa_id,
        nome: formData.nome,
        descricao: formData.objetivo,
        config_ia: {
          tom_voz: formData.tomVoz,
          instrucoes: formData.instrucoes,
          prompt_sistema: formData.promptSistema || gerarPromptPadrao()
        },
        status: 'configurando'
      })
      .select()
      .single()

    if (bot) {
      router.push(`/agente/${bot.id}/conectar`)
    }
    
    setLoading(false)
  }

  const gerarPromptPadrao = () => {
    return `Você é um atendente virtual da empresa ${formData.nome}.
    
Tom de voz: ${formData.tomVoz}
Objetivo: ${formData.objetivo}

Instruções:
${formData.instrucoes || '- Seja sempre cordial e prestativo\n- Responda de forma clara e objetiva\n- Se não souber algo, peça para aguardar um atendente humano'}`
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-lg">
              <ArrowLeft size={20} className="text-slate-600" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Criar novo agente</h1>
              <p className="text-sm text-slate-500">Configure seu assistente virtual</p>
            </div>
          </div>
          
          {/* Progresso */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  s === step 
                    ? 'bg-blue-600 text-white' 
                    : s < step 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-slate-100 text-slate-400'
                }`}
              >
                {s < step ? '✓' : s}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Step 1: Escolher Modo */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Como você quer criar seu agente?</h2>
              <p className="text-slate-600">Escolha o modo que melhor se adapta às suas necessidades</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <button
                onClick={() => { setModo('simples'); setStep(2) }}
                className={`p-8 rounded-2xl border-2 text-left transition-all hover:shadow-lg ${
                  modo === 'simples' 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-slate-200 bg-white hover:border-blue-300'
                }`}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <Wand2 size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Modo Simples</h3>
                <p className="text-slate-600 mb-4">
                  Responda algumas perguntas e deixe a IA configurar tudo automaticamente. 
                  Ideal para começar rápido.
                </p>
                <span className="text-blue-600 font-medium flex items-center gap-1">
                  Começar <ChevronRight size={16} />
                </span>
              </button>

              <button
                onClick={() => { setModo('avancado'); setStep(2) }}
                className={`p-8 rounded-2xl border-2 text-left transition-all hover:shadow-lg ${
                  modo === 'avancado' 
                    ? 'border-purple-600 bg-purple-50' 
                    : 'border-slate-200 bg-white hover:border-purple-300'
                }`}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                  <Code size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Modo Avançado</h3>
                <p className="text-slate-600 mb-4">
                  Controle total sobre o comportamento do agente. 
                  Crie fluxos personalizados e regras complexas.
                </p>
                <span className="text-purple-600 font-medium flex items-center gap-1">
                  Configurar <ChevronRight size={16} />
                </span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Informações Básicas */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl border border-slate-200 p-8"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Informações do agente</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nome do agente *
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Atendente Virtual Loja"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Objetivo principal *
                </label>
                <select
                  value={formData.objetivo}
                  onChange={(e) => setFormData({...formData, objetivo: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="atender">Atendimento ao cliente</option>
                  <option value="vender">Vendas e captação</option>
                  <option value="suporte">Suporte técnico</option>
                  <option value="agendar">Agendamentos</option>
                  <option value="qualificar">Qualificação de leads</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tom de voz *
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {['profissional', 'amigavel', 'direto'].map((tom) => (
                    <button
                      key={tom}
                      onClick={() => setFormData({...formData, tomVoz: tom})}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        formData.tomVoz === tom
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <span className="font-medium capitalize">{tom}</span>
                    </button>
                  ))}
                </div>
              </div>

              {modo === 'simples' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Instruções específicas (opcional)
                  </label>
                  <textarea
                    value={formData.instrucoes}
                    onChange={(e) => setFormData({...formData, instrucoes: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Ex: Sempre mencione nosso horário de atendimento, não faça promessas de desconto..."
                  />
                </div>
              )}

              {modo === 'avancado' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Prompt do Sistema (avançado)
                  </label>
                  <textarea
                    value={formData.promptSistema}
                    onChange={(e) => setFormData({...formData, promptSistema: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    rows={10}
                    placeholder={gerarPromptPadrao()}
                  />
                  <p className="text-sm text-slate-500 mt-2">
                    Defina exatamente como o agente deve se comportar.
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-2"
              >
                <ChevronLeft size={18} />
                Voltar
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!formData.nome}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                Continuar
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Revisar e Criar */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl border border-slate-200 p-8"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles size={40} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Pronto para criar!</h2>
              <p className="text-slate-600">Revise as informações do seu agente</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 space-y-4 mb-8">
              <div className="flex justify-between">
                <span className="text-slate-600">Nome:</span>
                <span className="font-medium text-slate-900">{formData.nome}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Objetivo:</span>
                <span className="font-medium text-slate-900 capitalize">{formData.objetivo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Tom de voz:</span>
                <span className="font-medium text-slate-900 capitalize">{formData.tomVoz}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Modo:</span>
                <span className="font-medium text-slate-900 capitalize">{modo}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-2"
              >
                <ChevronLeft size={18} />
                Voltar
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Criando agente...' : (
                  <>
                    <Bot size={20} />
                    Criar agente e conectar WhatsApp
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}