'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function Cadastro() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const nome = formData.get('nome') as string
    const empresa = formData.get('empresa') as string

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nome, empresa } }
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    const { error: profileError } = await supabase.from('usuarios').insert({
      id: data.user!.id,
      nome,
      empresa
    })

    if (profileError) {
      setError('Erro ao criar perfil')
    } else {
      document.documentElement.classList.add('thunder-shake')
      setTimeout(() => {
        router.push('/')
      }, 800)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-md w-full bg-zinc-900 border border-yellow-400 rounded-3xl p-8 shadow-2xl">
      <div className="flex items-center justify-center gap-2 mb-8">
        <span className="text-5xl">⚡</span>
        <h1 className="text-4xl font-bold tracking-tighter text-yellow-300">Thunder AI</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input name="nome" placeholder="Seu nome" required className="w-full bg-black border border-yellow-400 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-blue-400" />
        <input name="empresa" placeholder="Nome da empresa" required className="w-full bg-black border border-yellow-400 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-blue-400" />
        <input name="email" type="email" placeholder="Email" required className="w-full bg-black border border-yellow-400 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-blue-400" />
        <input name="password" type="password" placeholder="Senha" required className="w-full bg-black border border-yellow-400 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-blue-400" />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-yellow-400 to-blue-400 text-black font-bold py-4 rounded-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
        >
          {loading ? '⚡ Criando conta...' : 'CADASTRAR COM TROVÃO ⚡'}
        </button>
      </form>

      <p className="text-center text-zinc-400 mt-6 text-sm">
        Já tem conta? <a href="/login" className="text-yellow-300">Faça login</a>
      </p>
    </div>
  )
}
