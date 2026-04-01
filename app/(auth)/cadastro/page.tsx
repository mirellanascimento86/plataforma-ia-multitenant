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
      setError('Erro ao criar perfil: ' + profileError.message)
    } else {
      document.documentElement.classList.add('thunder-shake')
      setTimeout(() => router.push('/'), 1000)
    }
    setLoading(false)
  }

  return (
    <div className="thunder-bg min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-zinc-900 border border-yellow-400 rounded-3xl p-10 shadow-2xl">
        <div className="flex justify-center mb-8">
          <span className="text-6xl">⚡</span>
        </div>
        <h1 className="text-5xl font-black text-center text-yellow-300 tracking-tighter">THUNDER AI</h1>
        <p className="text-center text-blue-300 mt-2">Cadastre-se e libere o trovão</p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <input name="nome" placeholder="Seu nome completo" required className="w-full bg-black border border-yellow-400 px-5 py-4 rounded-2xl text-white placeholder-zinc-500 focus:border-blue-400" />
          <input name="empresa" placeholder="Nome da sua empresa" required className="w-full bg-black border border-yellow-400 px-5 py-4 rounded-2xl text-white placeholder-zinc-500 focus:border-blue-400" />
          <input name="email" type="email" placeholder="Seu email" required className="w-full bg-black border border-yellow-400 px-5 py-4 rounded-2xl text-white placeholder-zinc-500 focus:border-blue-400" />
          <input name="password" type="password" placeholder="Crie uma senha forte" required className="w-full bg-black border border-yellow-400 px-5 py-4 rounded-2xl text-white placeholder-zinc-500 focus:border-blue-400" />

          {error && <p className="text-red-400 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-300 via-blue-400 to-yellow-300 text-black font-bold py-5 rounded-2xl text-xl hover:scale-105 transition-all flex items-center justify-center gap-3"
          >
            {loading ? "⚡ CRIANDO CONTA..." : "CADASTRAR COM TROVÃO ⚡"}
          </button>
        </form>
      </div>
    </div>
  )
}