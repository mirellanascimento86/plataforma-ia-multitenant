'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { 
  LayoutDashboard, 
  MessageSquare, 
  Bot, 
  LogOut, 
  Calendar, 
  Users, 
  FileSpreadsheet, 
  Phone,
  Settings 
} from 'lucide-react'

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/conversas', label: 'Conversas', icon: MessageSquare },
  { href: '/robos', label: 'Meus Robôs', icon: Bot },
  { href: '/agendamentos', label: 'Agendamentos', icon: Calendar },
  { href: '/clientes', label: 'Clientes', icon: Users },
  { href: '/planilhas', label: 'Planilhas', icon: FileSpreadsheet },
  { href: '/whatsapp', label: 'WhatsApp', icon: Phone },
  { href: '/configuracoes', label: 'Configurações', icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUser()
  }, [])

  async function loadUser() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/login')
      return
    }

    const { data } = await supabase
      .from('usuarios')
      .select('*, empresas(*)')
      .eq('id', session.user.id)
      .single()

    setUser(data)
    setLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-blue-600">{user?.empresas?.nome}</h1>
          <p className="text-sm text-gray-500">{user?.nome}</p>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t bg-white">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  )
}
