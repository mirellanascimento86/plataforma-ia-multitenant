'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

// Criar cliente Supabase diretamente (evita problemas de importação)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export default function CadastroPage() {
  const router = useRouter()
  const [etapa, setEtapa] = useState(1)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  // Dados da empresa
  const [nomeEmpresa, setNomeEmpresa] = useState('')
  const [email, setEmail] = useState('')
  const [telefoneEmpresa, setTelefoneEmpresa] = useState('')

  // Dados do admin
  const [nomeAdmin, setNomeAdmin] = useState('')
  const [senha, setSenha] = useState('')

  function gerarSlugUnico(nome: string) {
    const base = nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 25)
    
    // Adicionar código aleatório para garantir unicidade
    const random = Math.random().toString(36).substring(2, 8)
    return `${base}-${random}`
  }

  async function handleCadastro(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErro('')

    try {
      console.log('Iniciando cadastro...')

      // 1. Criar slug único
      const slug = gerarSlugUnico(nomeEmpresa)
      console.log('Slug gerado:', slug)

      // 2. Criar usuário no Auth
      console.log('Criando usuário no Auth...')
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: senha,
      })

      if (authError) {
        console.error('Erro Auth:', authError)
        throw new Error('Email já cadastrado ou senha inválida')
      }

      if (!authData.user) {
        throw new Error('Erro ao criar usuário')
      }

      console.log('Usuário Auth criado:', authData.user.id)

      // 3. Criar empresa
      console.log('Criando empresa...')
      const { data: empresaData, error: empresaError } = await supabase
        .from('empresas')
        .insert({
          nome: nomeEmpresa,
          slug: slug,
          email: email,
          telefone: telefoneEmpresa,
          ativa: true,
          plano: 'gratuito'
        })
        .select()
        .single()

      if (empresaError) {
        console.error('Erro Empresa:', empresaError)
        // Se der erro de slug duplicado, tentar novamente com novo slug
        if (empresaError.code === '23505') {
          throw new Error('Nome da empresa já existe. Tente outro nome.')
        }
        throw new Error('Erro ao criar empresa: ' + empresaError.message)
      }

      console.log('Empresa criada:', empresaData.id)

      // 4. Criar usuário vinculado à empresa
      console.log('Criando usuário na tabela usuarios...')
      const { error: usuarioError } = await supabase.from('usuarios').insert({
        id: authData.user.id,
        empresa_id: empresaData.id,
        email: email,
        nome: nomeAdmin,
        cargo: 'admin_empresa',
        ativo: true
      })

      if (usuarioError) {
        console.error('Erro Usuário:', usuarioError)
        throw new Error('Erro ao vincular usuário à empresa')
      }

      // 5. Criar robô padrão
      console.log('Criando robô padrão...')
      const { error: roboError } = await supabase.from('robos').insert({
        empresa_id: empresaData.id,
        nome: 'Assistente Virtual',
        descricao: 'Robô de atendimento automático',
        ativo: true,
        personalidade: 'profissional',
        saudacao: 'Olá! Sou o assistente virtual. Como posso ajudar você hoje?'
      })

      if (roboError) {
        console.error('Erro Robô:', roboError)
        // Não falha o cadastro se o robô der erro
      }

      console.log('Cadastro completo! Redirecionando...')

      // 6. Redirecionar para dashboard
      // Se usar pasta (dashboard), redireciona para /
      // Se usar pasta dashboard, redireciona para /dashboard
      router.push('/')
      
    } catch (error: any) {
      console.error('Erro completo:', error)
      setErro(error.message || 'Erro ao criar conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  function avancarEtapa() {
    if (!nomeEmpresa.trim()) {
      setErro('Digite o nome da empresa')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      setErro('Digite um email válido')
      return
    }
    setErro('')
    setEtapa(2)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl font-bold text-white">IA</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Criar sua conta</h1>
          <p className="text-gray-500 mt-2">Comece a usar a plataforma hoje</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          
          {/* Indicador de etapas */}
          <div className="flex items-center mb-8">
            <div className={`flex-1 h-2 rounded-full transition-colors ${etapa >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mx-2 transition-colors ${etapa >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
            <div className={`flex-1 h-2 rounded-full transition-colors ${etapa >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mx-2 transition-colors ${etapa >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
            <div className="flex-1 h-2 rounded-full bg-gray-200" />
          </div>

          {/* Erro */}
          {erro && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start">
              <span className="text-red-500 mr-2">⚠️</span>
              <p className="text-red-700 text-sm">{erro}</p>
            </div>
          )}

          {/* Etapa 1: Dados da Empresa */}
          {etapa === 1 ? (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-gray-900">Dados da Empresa</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Empresa *
                </label>
                <input
                  type="text"
                  value={nomeEmpresa}
                  onChange={(e) => setNomeEmpresa(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Ex: Barbearia do João"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email da Empresa *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="contato@suaempresa.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone (opcional)
                </label>
                <input
                  type="tel"
                  value={telefoneEmpresa}
                  onChange={(e) => setTelefoneEmpresa(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="(11) 99999-9999"
                />
              </div>

              <button
                onClick={avancarEtapa}
                className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors flex items-center justify-center"
              >
                Continuar
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ) : (
            /* Etapa 2: Dados do Administrador */
            <form onSubmit={handleCadastro} className="space-y-5">
              <h2 className="text-lg font-semibold text-gray-900">Dados do Administrador</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seu Nome Completo *
                </label>
                <input
                  type="text"
                  value={nomeAdmin}
                  onChange={(e) => setNomeAdmin(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="João Silva"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha *
                </label>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Use pelo menos 6 caracteres</p>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEtapa(1)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={loading || !nomeAdmin || !senha}
                  className="flex-1 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Criando...
                    </>
                  ) : (
                    'Criar Conta'
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Link para login */}
          <div className="mt-6 text-center text-sm text-gray-500">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
              Fazer login
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-8">
          Ao criar uma conta, você concorda com nossos termos de uso.
        </p>
      </div>
    </div>
  )
}
