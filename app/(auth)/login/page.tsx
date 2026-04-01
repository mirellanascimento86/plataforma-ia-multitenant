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

    if (error) setError(error.message)
    else {
      document.documentElement.classList.add('thunder-shake')
      setTimeout(() => router.push('/'), 800)
    }
    setLoading(false)
  }

  return (
    <div className="thunder-bg min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-zinc-900 border border-yellow-400 rounded-3xl p-10">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">⚡</div>
          <h1 className="text-5xl font-black text-yellow-300">THUNDER AI</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input name="email" type="email" placeholder="Email" required className="w-full bg-black border border-yellow-400 px-5 py-4 rounded-2xl" />
          <input name="password" type="password" placeholder="Senha" required className="w-full bg-black border border-yellow-400 px-5 py-4 rounded-2xl" />

          {error && <p className="text-red-400 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-400 to-blue-400 text-black font-bold py-4 rounded-2xl text-lg hover:scale-105 transition"
          >
            {loading ? '⚡ Entrando...' : 'ENTRAR NO TROVÃO ⚡'}
          </button>
        </form>
      </div>
    </div>
  )
}