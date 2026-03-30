'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [empresa, setEmpresa] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserData()
  }, [])

  async function loadUserData() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login')
        return
      }

      const { data: userData } = await supabase
        .from('usuarios')
        .select('*, empresas(*)')
        .eq('id', session.user.id)
        .single()

      if (!userData) {
        router.push('/login')
        return
      }

      setUser(userData)
      setEmpresa(userData.empresas)
    } catch (error) {
      console.error('Erro:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-blue-600">
                {empresa?.nome || 'Minha Empresa'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Olá, {user?.nome}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-sm font-medium"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card Robôs */}
          <a href="/robos" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="font-semibold text-lg text-gray-900">Meus Robôs</h3>
            <p className="text-gray-500 text-sm mt-1">Gerenciar assistentes virtuais</p>
          </a>

          {/* Card Conversas */}
          <a href="/conversas" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="font-semibold text-lg text-gray-900">Conversas</h3>
            <p className="text-gray-500 text-sm mt-1">Atender clientes</p>
          </a>

          {/* Card WhatsApp */}
          <a href="/whatsapp" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="font-semibold text-lg text-gray-900">WhatsApp</h3>
            <p className="text-gray-500 text-sm mt-1">Conectar número</p>
          </a>

          {/* Card Agendamentos */}
          <a href="/agendamentos" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📅</span>
            </div>
            <h3 className="font-semibold text-lg text-gray-900">Agendamentos</h3>
            <p className="text-gray-500 text-sm mt-1">Calendário de compromissos</p>
          </a>

          {/* Card Clientes */}
          <a href="/clientes" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="font-semibold text-lg text-gray-900">Clientes</h3>
            <p className="text-gray-500 text-sm mt-1">Base de contatos</p>
          </a>

          {/* Card Planilhas */}
          <a href="/planilhas" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="font-semibold text-lg text-gray-900">Planilhas</h3>
            <p className="text-gray-500 text-sm mt-1">Exportar relatórios</p>
          </a>
        </div>
      </main>
    </div>
  )
}
