'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [empresa, setEmpresa] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
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

    if (userData) {
      setUser(userData)
      setEmpresa(userData.empresas)
    }
    
    setLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-blue-600">
              {empresa?.nome || 'Minha Empresa'}
            </h1>
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
          
          <Link href="/robos" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="font-semibold text-lg text-gray-900">Meus Robôs</h3>
            <p className="text-gray-500 text-sm mt-1">Gerenciar assistentes virtuais</p>
          </Link>

          <Link href="/conversas" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="font-semibold text-lg text-gray-900">Conversas</h3>
            <p className="text-gray-500 text-sm mt-1">Atender clientes</p>
          </Link>

          <Link href="/whatsapp" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="font-semibold text-lg text-gray-900">WhatsApp</h3>
            <p className="text-gray-500 text-sm mt-1">Conectar número</p>
          </Link>

          <Link href="/agendamentos" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="font-semibold text-lg text-gray-900">Agendamentos</h3>
            <p className="text-gray-500 text-sm mt-1">Calendário</p>
          </Link>

          <Link href="/clientes" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="font-semibold text-lg text-gray-900">Clientes</h3>
            <p className="text-gray-500 text-sm mt-1">Base de contatos</p>
          </Link>

          <Link href="/planilhas" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="font-semibold text-lg text-gray-900">Planilhas</h3>
            <p className="text-gray-500 text-sm mt-1">Exportar dados</p>
          </Link>

        </div>
      </main>
    </div>
  )
}
