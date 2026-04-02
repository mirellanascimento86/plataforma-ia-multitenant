'use client'
import { useState } from 'react'
import { createClientComponentClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export default function CadastroPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleCadastro = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) alert(error.message)
    else {
      alert('Cadastro realizado! Verifique seu email.')
      router.push('/auth/login')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-3xl w-full max-w-md shadow-xl">
        <h1 className="text-4xl font-bold text-center mb-8">Criar Conta</h1>
        <input type="email" placeholder="Seu email" className="w-full p-4 border rounded-2xl mb-4" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Senha (mín. 6 caracteres)" className="w-full p-4 border rounded-2xl mb-6" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={handleCadastro} disabled={loading} className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-lg">
          {loading ? 'Criando...' : 'Criar Conta'}
        </button>
      </div>
    </div>
  )
}