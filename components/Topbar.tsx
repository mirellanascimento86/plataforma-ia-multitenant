'use client'
import { createClientComponentClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { Bell, User, LogOut } from 'lucide-react'

export default function Topbar() {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <header className="h-16 bg-white border-b px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
      </div>

      <div className="flex items-center gap-6">
        <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <Bell size={22} />
        </button>

        <div className="flex items-center gap-3 cursor-pointer" onClick={handleLogout}>
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white">
            <User size={18} />
          </div>
          <div className="text-sm">
            <p className="font-medium">Minha Conta</p>
            <p className="text-xs text-gray-500 -mt-0.5 cursor-pointer hover:text-red-600" onClick={handleLogout}>
              Sair
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}