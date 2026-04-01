'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Bot, Calendar, Users, Settings, LogOut } from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <div className="w-64 bg-white border-r flex flex-col">
      <div className="p-6 font-bold text-2xl text-indigo-600">Thunder AI</div>
      <nav className="flex-1 px-3">
        <Link href="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl ${pathname === '/dashboard' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}>
          <Home size={20} /> Lar
        </Link>
        <Link href="/robos" className={`flex items-center gap-3 px-4 py-3 rounded-xl ${pathname === '/robos' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}>
          <Bot size={20} /> Robôs
        </Link>
        {/* adicione os outros links depois */}
      </nav>
      <div className="p-4 border-t">
        <button onClick={() => {/* logout */}} className="w-full flex items-center gap-3 text-red-600 hover:bg-red-50 px-4 py-3 rounded-xl">
          <LogOut size={20} /> Sair
        </button>
      </div>
    </div>
  )
}