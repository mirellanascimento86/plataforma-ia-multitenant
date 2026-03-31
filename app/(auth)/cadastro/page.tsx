'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export default function CadastroPage() {
  const router = useRouter()
  const [etapa, setEtapa] = useState(1)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  const [nomeEmpresa, setNomeEmpresa] = useState('')
  const [email, setEmail] = useState('')
  const [telefoneEmpresa, setTelefoneEmpresa] = useState('')
  const [nomeAdmin, setNomeAdmin] = useState('')
  const [senha, setSenha] = useState('')

  function gerarSlugUnico(nome: string): string {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substring(2, 8)
    const base = nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 20)
    
    return `${base}-${timestamp}-${random}`
  }

  async function handleCadastro(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErro('')

    try {
      const slug = gerarSlugUnico(nomeEmpresa)

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: senha,
      })

      if (authError) {
        throw new Error('Email já cadastrado ou senha inválida')
      }

      if (!authData.user) {
        throw new Error('Erro ao criar usuário')
      }

      const { data: empresaData, error: empresaError } = await supabase
        .from('empresas')
        .insert({
          nome: nomeEmpresa,
          slug: slug,
          email: email,
          telefone: telefoneEmpresa || null,
          ativa: true,
          plano: 'gratuito'
        })
        .select()
        .single()

      if (empresaError) {
        throw new Error('Erro ao criar empresa: ' + empresaError.message)
      }

      const { error: userError } = await supabase.from('usuarios').insert({
        id: authData.user.id,
        empresa_id: empresaData.id,
        email: email,
        nome: nomeAdmin,
        cargo: 'admin_empresa',
        ativo: true
      })

      if (userError) {
        throw new Error('Erro ao vincular usuário: ' + userError.message)
      }

      await supabase.from('robos').insert({
        empresa_id: empresaData.id,
        nome: 'Assistente Virtual',
        descricao: 'Robô de atendimento automático',
        ativo: true
      })

      router.push('/')
      
    } catch (error: any) {
      setErro(error.message || 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  function avancarEtapa() {
    setErro('')
    if (!nomeEmpresa.trim()) {
      setErro('Digite o nome da empresa')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      setErro('Digite um email válido')
      return
    }
    setEtapa(2)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">+</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Criar conta</h1>
        </div>

        {erro && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {erro}
          </div>
        )}

        {etapa === 1 ? (
          <div className="space-y-4">
            <h2 className="font-semibold text-lg">Dados da Empresa</h2>
            <input
              type="text"
              value={nomeEmpresa}
              onChange={(e) => setNomeEmpresa(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Nome da Empresa"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Email"
            />
            <input
              type="tel"
              value={telefoneEmpresa}
              onChange={(e) => setTelefoneEmpresa(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Telefone"
            />
            <button
              onClick={avancarEtapa}
              className="w-full py-2 bg-blue-600 text-white rounded-lg"
            >
              Continuar
            </button>
          </div>
        ) : (
          <form onSubmit={handleCadastro} className="space-y-4">
            <h2 className="font-semibold text-lg">Dados do Administrador</h2>
            <input
              type="text"
              value={nomeAdmin}
              onChange={(e) => setNomeAdmin(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Seu Nome"
              required
            />
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Senha"
              minLength={6}
              required
            />
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setEtapa(1)}
                className="flex-1 py-2 border rounded-lg"
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50"
              >
                {loading ? 'Criando...' : 'Criar Conta'}
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 text-center text-sm">
          <Link href="/login" className="text-blue-600 hover:underline">
            Já tem conta? Fazer login
          </Link>
        </div>
      </div>
    </div>
  )
}
