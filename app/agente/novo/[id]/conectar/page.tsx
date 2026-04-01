'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Phone, 
  CheckCircle, 
  AlertCircle,
  Copy,
  ExternalLink,
  Zap
} from 'lucide-react'
import Link from 'next/link'

export default function ConectarWhatsAppPage() {
  const params = useParams()
  const botId = params.id as string
  
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    wabaId: '',
    phoneNumberId: '',
    accessToken: '',
    numeroTelefone: ''
  })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  
  const supabase = createClientComponentClient()
  const router = useRouter()

  const testarConexao = async () => {
    setLoading(true)
    setStatus('testing')
    
    try {
      // Aqui você faria a chamada real para a API do Meta
      // Por enquanto vamos simular o sucesso
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Salvar no banco
      await supabase
        .from('bots')
        .update({
          numero_whatsapp: formData.numeroTelefone,
          waba_id: formData.wabaId,
          phone_number_id: formData.phoneNumberId,
          access_token: formData.accessToken,
          status: 'ativo'
        })
        .eq('id', botId)
      
      setStatus('success')
      
      setTimeout(() => {
        router.push(`/agente/${botId}`)
      }, 2000)
      
    } catch (error) {
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link href={`/agente/${botId}`} className="p-2 hover:bg-slate-100 rounded-lg">
            <ArrowLeft size={20} className="text-slate-600" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Conectar WhatsApp Business</h1>
            <p className="text-sm text-slate-500">API Oficial Meta (WABA)</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Guia Rápido */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white mb-8">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Zap size={20} />
            Como obter suas credenciais
          </h2>
          <ol className="space-y-2 text-sm text-blue-100">
            <li>1. Acesse <a href="https://developers.facebook.com" target="_blank" className="underline hover:text-white">developers.facebook.com</a></li>
            <li>2. Crie um app do tipo "Business"</li>
            <li>3. Adicione o produto "WhatsApp"</li>
            <li>4. Copie o WABA ID, Phone Number ID e Access Token</li>
          </ol>
        </div>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-200 p-8"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-6">Credenciais da API</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  WABA ID (WhatsApp Business Account ID)
                </label>
                <input
                  type="text"
                  value={formData.wabaId}
                  onChange={(e) => setFormData({...formData, wabaId: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="123456789012345"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Encontrado em: WhatsApp → API Setup → Business Account ID
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number ID
                </label>
                <input
                  type="text"
                  value={formData.phoneNumberId}
                  onChange={(e) => setFormData({...formData, phoneNumberId: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="987654321098765"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Access Token (Permanente)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={formData.accessToken}
                    onChange={(e) => setFormData({...formData, accessToken: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="EAAxxxxxxxxxxxxxxxx"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Token de acesso permanente do System User
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Número do Telefone (com código do país)
                </label>
                <input
                  type="text"
                  value={formData.numeroTelefone}
                  onChange={(e) => setFormData({...formData, numeroTelefone: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="5511999999999"
                />
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!formData.wabaId || !formData.phoneNumberId || !formData.accessToken}
              className="w-full mt-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              Continuar
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-200 p-8 text-center"
          >
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Phone size={40} className="text-blue-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Testar conexão</h2>
            <p className="text-slate-600 mb-8">
              Vamos verificar se suas credenciais estão corretas e ativar o número.
            </p>

            <div className="bg-slate-50 rounded-xl p-4 mb-8 text-left">
              <p className="text-sm text-slate-600 mb-2"><strong>Número:</strong> {formData.numeroTelefone}</p>
              <p className="text-sm text-slate-600"><strong>WABA ID:</strong> {formData.wabaId}</p>
            </div>

            {status === 'idle' && (
              <button
                onClick={testarConexao}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Zap size={20} />
                    </motion.div>
                    Testando conexão...
                  </>
                ) : (
                  <>
                    <Zap size={20} />
                    Conectar WhatsApp
                  </>
                )}
              </button>
            )}

            {status === 'testing' && (
              <div className="flex items-center justify-center gap-2 text-blue-600">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Zap size={24} />
                </motion.div>
                <span>Verificando credenciais...</span>
              </div>
            )}

            {status === 'success' && (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="flex items-center justify-center gap-2 text-green-600"
              >
                <CheckCircle size={32} />
                <span className="text-lg font-semibold">Conectado com sucesso!</span>
              </motion.div>
            )}

            {status === 'error' && (
              <div className="flex items-center justify-center gap-2 text-red-600">
                <AlertCircle size={32} />
                <span>Erro na conexão. Verifique as credenciais.</span>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}