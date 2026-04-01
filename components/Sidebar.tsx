'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Bot, Users, Settings, LogOut } from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white border-r shadow-sm flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-3xl font-bold text-indigo-600">Thunder AI</h1>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <Link 
          href="/dashboard" 
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-colors ${pathname === '/dashboard' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100 text-gray-700'}`}
        >
          <Home size={20} />
          Lar
        </Link>

        <Link 
          href="/robos" 
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-colors ${pathname === '/robos' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100 text-gray-700'}`}
        >
          <Bot size={20} />
          Meus Robôs
        </Link>

        <Link 
          href="/workspace" 
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-colors ${pathname === '/workspace' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100 text-gray-700'}`}
        >
          <Users size={20} />
          Workspace
        </Link>

        <Link 
          href="/configuracoes" 
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-colors ${pathname === '/configuracoes' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100 text-gray-700'}`}
        >
          <Settings size={20} />
          Configurações
        </Link>
      </nav>

      <div className="p-4 border-t mt-auto">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-2xl text-sm font-medium">
          <LogOut size={20} />
          Sair da conta
        </button>
      </div>
    </div>
  )
}