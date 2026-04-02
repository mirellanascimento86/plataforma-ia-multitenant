'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Bot, Users, Settings, LogOut } from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white border-r h-screen flex flex-col shadow-sm">
      <div className="p-6 border-b">
        <h1 className="text-3xl font-bold text-indigo-600">Thunder AI</h1>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        <Link href="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-2xl ${pathname === '/dashboard' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}>
          <Home size={22} /> Lar
        </Link>
        <Link href="/robos" className={`flex items-center gap-3 px-4 py-3 rounded-2xl ${pathname?.startsWith('/robos') ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}>
          <Bot size={22} /> Robôs
        </Link>
        <Link href="/workspace" className={`flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-100`}>
          <Users size={22} /> Workspace
        </Link>
        <Link href="/configuracoes" className={`flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-100`}>
          <Settings size={22} /> Configurações
        </Link>
      </nav>
      <div className="p-4 border-t">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-2xl">
          <LogOut size={22} /> Sair
        </button>
      </div>
    </div>
  )
}
