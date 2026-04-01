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
    const nome = formData.get('nome') as string
    const empresa = formData.get('empresa') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { data, error: authError } = await supabase.auth.signUp({
      email, password, options: { data: { nome, empresa } }
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    await supabase.from('usuarios').insert({ id: data.user!.id, nome, empresa })

    document.documentElement.classList.add('thunder-shake')
    setTimeout(() => router.push('/'), 800)
    setLoading(false)
  }

  return (
    <div className="thunder-bg min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-zinc-900 border border-amber-400 rounded-3xl p-12 shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-blue-400">
            THUNDER AI
          </h1>
          <p className="text-amber-300 text-xl mt-2">Corporation</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <input name="nome" placeholder="Seu nome completo" required className="w-full bg-black border border-amber-400 px-6 py-5 rounded-2xl text-white text-lg focus:border-blue-400 outline-none" />
          <input name="empresa" placeholder="Nome da sua empresa" required className="w-full bg-black border border-amber-400 px-6 py-5 rounded-2xl text-white text-lg focus:border-blue-400 outline-none" />
          <input name="email" type="email" placeholder="Seu email corporativo" required className="w-full bg-black border border-amber-400 px-6 py-5 rounded-2xl text-white text-lg focus:border-blue-400 outline-none" />
          <input name="password" type="password" placeholder="Senha forte" required className="w-full bg-black border border-amber-400 px-6 py-5 rounded-2xl text-white text-lg focus:border-blue-400 outline-none" />

          {error && <p className="text-red-400 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-6 text-xl font-bold bg-gradient-to-r from-amber-400 to-blue-400 text-black rounded-3xl hover:brightness-110 transition-all"
          >
            {loading ? 'CRIANDO CONTA...' : 'CADASTRAR NA THUNDER AI'}
          </button>
        </form>
      </div>
    </div>
  )
}