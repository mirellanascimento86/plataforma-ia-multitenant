'use client'
import { createClientComponentClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { Bell, User } from 'lucide-react'

export default function Topbar() {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <header className="h-16 bg-white border-b px-8 flex items-center justify-between">
      <h2 className="text-xl font-semibold">Thunder AI</h2>
      
      <div className="flex items-center gap-6">
        <button className="p-2 hover:bg-gray-100 rounded-xl">
          <Bell size={24} />
        </button>
        
        <div className="flex items-center gap-3 cursor-pointer" onClick={handleLogout}>
          <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white">
            <User size={20} />
          </div>
          <div>
            <p className="text-sm font-medium">Perfil</p>
            <p className="text-xs text-red-600 cursor-pointer" onClick={handleLogout}>Sair</p>
          </div>
        </div>
      </div>
    </header>
  )
}