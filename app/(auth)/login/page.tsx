'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function Login() {
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

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
    } else {
      document.documentElement.classList.add('thunder-shake')
      setTimeout(() => router.push('/'), 800)
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
        <p className="text-center text-blue-300 mt-2">Entre no poder do trovão</p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <input name="email" type="email" placeholder="Email" required className="w-full bg-black border border-yellow-400 px-5 py-4 rounded-2xl text-white" />
          <input name="password" type="password" placeholder="Senha" required className="w-full bg-black border border-yellow-400 px-5 py-4 rounded-2xl text-white" />

          {error && <p className="text-red-400 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-300 via-blue-400 to-yellow-300 text-black font-bold py-5 rounded-2xl text-xl hover:scale-105 transition-all"
          >
            {loading ? "⚡ ENTRANDO..." : "ENTRAR NO TROVÃO ⚡"}
          </button>
        </form>

        <p className="text-center mt-8 text-zinc-400">
          Não tem conta? <a href="/cadastro" className="text-yellow-300 underline">Cadastre-se aqui</a>
        </p>
      </div>
    </div>
  )
}