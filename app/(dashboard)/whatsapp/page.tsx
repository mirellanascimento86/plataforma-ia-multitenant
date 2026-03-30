'use client'

import { useState } from 'react'
import { Phone, QrCode, CheckCircle, AlertCircle, Copy, RefreshCw } from 'lucide-react'

export default function WhatsAppPage() {
  const [status, setStatus] = useState('desconectado') // desconectado, conectando, conectado
  const [qrCode, setQrCode] = useState<string | null>(null)

  async function conectarWhatsApp() {
    setStatus('conectando')
    // Simulação - aqui você integraria com API do WhatsApp
    setTimeout(() => {
      setQrCode('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==')
    }, 2000)
  }

  async function simularConectado() {
    setStatus('conectado')
    setQrCode(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Conectar WhatsApp</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status e Ações */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              status === 'conectado' ? 'bg-green-100' :
              status === 'conectando' ? 'bg-yellow-100' :
              'bg-gray-100'
            }`}>
              <Phone className={`w-8 h-8 ${
                status === 'conectado' ? 'text-green-600' :
                status === 'conectando' ? 'text-yellow-600' :
                'text-gray-400'
              }`} />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Status da Conexão</h3>
              <p className={`text-sm ${
                status === 'conectado' ? 'text-green-600' :
                status === 'conectando' ? 'text-yellow-600' :
                'text-gray-500'
              }`}>
                {status === 'conectado' && 'Conectado e funcionando'}
                {status === 'conectando' && 'Aguardando QR Code...'}
                {status === 'desconectado' && 'Desconectado'}
              </p>
            </div>
          </div>

          {status === 'desconectado' && (
            <button
              onClick={conectarWhatsApp}
              className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center justify-center"
            >
              <QrCode className="w-5 h-5 mr-2" />
              Gerar QR Code
            </button>
          )}

          {status === 'conectando' && qrCode && (
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg inline-block mb-4">
                {/* Aqui iria o QR Code real */}
                <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-xs">QR Code Placeholder</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Abra o WhatsApp no seu celular e escaneie o QR Code
              </p>
              <button
                onClick={simularConectado}
                className="text-blue-600 hover:underline text-sm"
              >
                Simular conexão bem-sucedida (teste)
              </button>
            </div>
          )}

          {status === 'conectado' && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center text-green-700 mb-2">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">WhatsApp conectado!</span>
                </div>
                <p className="text-sm text-green-600">
                  Seu robô está pronto para atender clientes.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-gray-600">Número conectado</span>
                  <span className="font-medium">(11) 99999-9999</span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-gray-600">Mensagens recebidas hoje</span>
                  <span className="font-medium">24</span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-gray-600">Respostas automáticas</span>
                  <span className="font-medium">18</span>
                </div>
              </div>

              <button
                onClick={() => setStatus('desconectado')}
                className="w-full py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
              >
                Desconectar
              </button>
            </div>
          )}
        </div>

        {/* Instruções */}
        <div className="bg-blue-50 rounded-xl p-6">
          <h3 className="font-semibold text-lg text-blue-900 mb-4">Como conectar</h3>
          <ol className="space-y-4 text-blue-800">
            <li className="flex items-start">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm mr-3 flex-shrink-0">1</span>
              <span>Abra o WhatsApp no seu celular</span>
            </li>
            <li className="flex items-start">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm mr-3 flex-shrink-0">2</span>
              <span>Toque em "Mais opções" (⋮) ou "Configurações"</span>
            </li>
            <li className="flex items-start">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm mr-3 flex-shrink-0">3</span>
              <span>Selecione "Aparelhos conectados"</span>
            </li>
            <li className="flex items-start">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm mr-3 flex-shrink-0">4</span>
              <span>Toque em "Conectar um aparelho"</span>
            </li>
            <li className="flex items-start">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm mr-3 flex-shrink-0">5</span>
              <span>Aponte a câmera para o QR Code ao lado</span>
            </li>
          </ol>

          <div className="mt-6 p-4 bg-yellow-100 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-700 mr-2 flex-shrink-0" />
              <p className="text-sm text-yellow-800">
                Mantenha seu celular conectado à internet. O WhatsApp Web precisa do celular online para funcionar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
