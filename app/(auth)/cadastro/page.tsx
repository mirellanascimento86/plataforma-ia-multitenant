'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export default function Cadastro() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleCadastro = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: { emailRedirectTo: window.location.origin + '/dashboard' }
    })
    
    if (error) alert('Erro: ' + error.message)
    else {
      alert('Conta criada! Faça login agora.')
      router.push('/login')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-10 rounded-3xl w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-8">Criar Conta</h1>
        <input type="email" placeholder="Email" className="w-full p-4 border rounded-2xl mb-4" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Senha (mín. 6 caracteres)" className="w-full p-4 border rounded-2xl mb-8" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={handleCadastro} disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-2xl text-xl">
          {loading ? 'Criando...' : 'Criar Conta'}
        </button>
      </div>
    </div>
  )
}
