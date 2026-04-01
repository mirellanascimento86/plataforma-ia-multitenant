'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  MessageSquare, 
  Bot, 
  Users, 
  Calendar, 
  FileSpreadsheet, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronDown,
  Plus,
  Bell,
  UserCircle,
  HelpCircle,
  Zap,
  Building2
} from 'lucide-react'

const menuItems = [
  { href: '/dashboard', label: 'Início', icon: LayoutDashboard },
  { href: '/conversas', label: 'Conversas', icon: MessageSquare },
  { href: '/agentes', label: 'Agentes', icon: Bot },
  { href: '/clientes', label: 'Clientes', icon: Users },
  { href: '/agendamentos', label: 'Agendamentos', icon: Calendar },
  { href: '/analytics', label: 'Analytics', icon: FileSpreadsheet },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClientComponentClient()
  const [empresa, setEmpresa] = useState<any>(null)
  const [workspaces, setWorkspaces] = useState<any[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState(3)

  useEffect(() => {
    carregarDados()
  }, [])

  async function carregarDados() {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      router.push('/login')
      return
    }

    const { data: membro } = await supabase
      .from('membros_empresa')
      .select(`
        empresa_id,
        cargo,
        empresas:empresa_id (*)
      `)
      .eq('usuario_id', session.user.id)
      .eq('ativo', true)
      .single()

    if (membro) {
      setEmpresa(membro.empresas)
      
      const { data: todosMembros } = await supabase
        .from('membros_empresa')
        .select(`
          empresa_id,
          empresas:empresa_id (*)
        `)
        .eq('usuario_id', session.user.id)
        .eq('ativo', true)
      
      setWorkspaces(todosMembros?.map((m: any) => m.empresas) || [])
    }
    
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <Zap size={48} className="text-blue-600" />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="bg-white border-r border-slate-200 flex flex-col relative z-30"
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
          {sidebarOpen ? (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap size={18} className="text-white" />
              </div>
              <span className="font-bold text-lg text-slate-900">Thunder AI</span>
            </Link>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto">
              <Zap size={18} className="text-white" />
            </div>
          )}
          
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Workspace Selector */}
        {sidebarOpen && empresa && (
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <button 
                onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
                className="w-full flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-left group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building2 size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 truncate text-sm">{empresa.nome}</p>
                  <p className="text-xs text-slate-500">Workspace atual</p>
                </div>
                <ChevronDown 
                  size={16} 
                  className={`text-slate-400 transition-transform ${workspaceMenuOpen ? 'rotate-180' : ''}`} 
                />
              </button>

              <AnimatePresence>
                {workspaceMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden"
                  >
                    {workspaces.map((ws: any) => (
                      <button
                        key={ws.id}
                        onClick={() => {
                          setWorkspaceMenuOpen(false)
                          // Trocar workspace
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors ${
                          ws.id === empresa.id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${ws.id === empresa.id ? 'bg-blue-600' : 'bg-slate-300'}`} />
                        <span className={`text-sm ${ws.id === empresa.id ? 'font-medium text-blue-700' : 'text-slate-700'}`}>
                          {ws.nome}
                        </span>
                      </button>
                    ))}
                    <div className="border-t border-slate-100">
                      <button
                        onClick={() => router.push('/workspace/novo')}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-blue-600"
                      >
                        <Plus size={16} />
                        <span className="text-sm font-medium">Novo workspace</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25' 
                    : 'hover:bg-slate-100 text-slate-600'
                }`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon size={20} />
                {sidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Menu */}
        <div className="p-3 border-t border-slate-100 space-y-1">
          <Link
            href="/configuracoes"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors ${
              pathname === '/configuracoes' ? 'bg-slate-100' : ''
            }`}
          >
            <Settings size={20} />
            {sidebarOpen && <span className="font-medium text-sm">Configurações</span>}
          </Link>
          
          <Link
            href="/suporte"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <HelpCircle size={20} />
            {sidebarOpen && <span className="font-medium text-sm">Fale Conosco</span>}
          </Link>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-600 transition-colors"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="font-medium text-sm">Sair</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              {menuItems.find(item => item.href === pathname)?.label || 'Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Notificações */}
            <button className="relative p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <Bell size={20} className="text-slate-600" />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
            
            {/* Perfil */}
            <button className="flex items-center gap-3 p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <UserCircle size={20} className="text-white" />
              </div>
              <span className="text-sm font-medium text-slate-700 hidden md:block">Meu Perfil</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}