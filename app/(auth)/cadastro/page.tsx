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

      await supabase.from('usuarios').insert({
        id: authData.user.id,
        empresa_id: empresaData.id,
        email: email,
        nome: nomeAdmin,
        cargo: 'admin_empresa',
        ativo: true
      })

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
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl font-bold text-white">+</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Criar conta</h1>
        <p className="text-gray-500 mt-2">Comece a usar a plataforma</p>
      </div>

      {erro && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {erro}
        </div>
      )}

      {etapa === 1 ? (
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Dados da Empresa</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Empresa</label>
            <input
              type="text"
              value={nomeEmpresa}
              onChange={(e) => setNomeEmpresa(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Barbearia do João"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="contato@empresa.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <input
              type="tel"
              value={telefoneEmpresa}
              onChange={(e) => setTelefoneEmpresa(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="(11) 99999-9999"
            />
          </div>

          <button
            onClick={avancarEtapa}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Continuar →
          </button>
        </div>
      ) : (
        <form onSubmit={handleCadastro} className="space-y-4">
          <h2 className="font-semibold text-lg">Dados do Administrador</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Seu Nome</label>
            <input
              type="text"
              value={nomeAdmin}
              onChange={(e) => setNomeAdmin(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="João Silva"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Mínimo 6 caracteres"
              minLength={6}
              required
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setEtapa(1)}
              className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              ← Voltar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Criando...' : 'Criar Conta'}
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 text-center text-sm text-gray-500">
        Já tem conta?{' '}
        <Link href="/login" className="text-blue-600 hover:underline font-medium">
          Fazer login
        </Link>
      </div>
    </div>
  )
}
