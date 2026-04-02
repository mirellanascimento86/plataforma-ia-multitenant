'use client'
import { useState } from 'react'
import { createClientComponentClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
    else router.push('/dashboard')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-3xl w-full max-w-md shadow-xl">
        <h1 className="text-4xl font-bold text-center mb-8">Entrar</h1>
        <input type="email" placeholder="Seu email" className="w-full p-4 border rounded-2xl mb-4" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Senha" className="w-full p-4 border rounded-2xl mb-6" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={handleLogin} disabled={loading} className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-lg">
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </div>
    </div>
  )
}