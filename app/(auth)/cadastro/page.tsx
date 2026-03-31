'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

// Cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export default function CadastroPage() {
  const router = useRouter()
  const [etapa, setEtapa] = useState(1)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  // Dados
  const [nomeEmpresa, setNomeEmpresa] = useState('')
  const [email, setEmail] = useState('')
  const [telefoneEmpresa, setTelefoneEmpresa] = useState('')
  const [nomeAdmin, setNomeAdmin] = useState('')
  const [senha, setSenha] = useState('')

  // Gerar slug único com timestamp + random (garantido único)
  function gerarSlugUnico(nome: string): string {
    const timestamp = Date.now().toString(36) // Base36 do timestamp atual
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
      console.log('=== INICIANDO CADASTRO ===')
      
      // 1. Gerar slug ÚNICO (timestamp garante unicidade)
      const slug = gerarSlugUnico(nomeEmpresa)
      console.log('Slug gerado:', slug)

      // 2. Criar usuário no Auth PRIMEIRO
      console.log('Criando usuário no Auth...')
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          data: {
            nome: nomeAdmin,
            nome_empresa: nomeEmpresa
          }
        }
      })

      if (authError) {
        console.error('Erro Auth:', authError)
        if (authError.message.includes('already registered')) {
          throw new Error('Este email já está cadastrado. Use outro email ou faça login.')
        }
        throw new Error('Erro ao criar conta: ' + authError.message)
      }

      if (!authData.user) {
        throw new Error('Erro ao criar usuário - sem retorno')
      }

      console.log('✓ Usuário Auth criado:', authData.user.id)

      // 3. Criar empresa com delay pequeno para garantir ordem
      await new Promise(resolve => setTimeout(resolve, 500))
      
      console.log('Criando empresa...')
      const { data: empresaData, error: empresaError } = await supabase
        .from('empresas')
        .insert({
          nome: nomeEmpresa,
          slug: slug, // GARANTIDO ÚNICO pelo timestamp
          email: email,
          telefone: telefoneEmpresa || null,
          ativa: true,
          plano: 'gratuito'
        })
        .select()
        .single()

      if (empresaError) {
        console.error('Erro Empresa:', empresaError)
        // Se falhar, tentar com novo slug
        if (empresaError.code === '23505') {
          console.log('Slug duplicado detectado, tentando com novo slug...')
          const novoSlug = gerarSlugUnico(nomeEmpresa + '-retry')
          
          const { data: retryData, error: retryError } = await supabase
            .from('empresas')
            .insert({
              nome: nomeEmpresa,
              slug: novoSlug,
              email: email,
              telefone: telefoneEmpresa || null,
              ativa: true,
              plano: 'gratuito'
            })
            .select()
            .single()
            
          if (retryError) throw new Error('Erro ao criar empresa após retry: ' + retryError.message)
          
          // Continuar com retryData
          await criarUsuarioERobo(authData.user.id, retryData.id)
          console.log('✓ Empresa criada (retry):', retryData.id)
          router.push('/')
          return
        }
        throw new Error('Erro ao criar empresa: ' + empresaError.message)
      }

      console.log('✓ Empresa criada:', empresaData.id)

      // 4. Criar usuário e robô
      await criarUsuarioERobo(authData.user.id, empresaData.id)

      console.log('=== CADASTRO COMPLETO ===')
      
      // 5. Redirecionar para dashboard (pasta /(dashboard) = URL /)
      router.push('/')
      
    } catch (error: any) {
      console.error('ERRO COMPLETO:', error)
      setErro(error.message || 'Erro ao criar conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  // Função auxiliar para criar usuário e robô
  async function criarUsuarioERobo(userId: string, empresaId: string) {
    // Criar usuário
    console.log('Criando usuário na tabela...')
    const { error: userError } = await supabase.from('usuarios').insert({
      id: userId,
      empresa_id: empresaId,
      email: email,
      nome: nomeAdmin,
      cargo: 'admin_empresa',
      ativo: true
    })

    if (userError) {
      console.error('Erro ao criar usuário:', userError)
      throw new Error('Erro ao vincular usuário')
    }
    console.log('✓ Usuário criado')

    // Criar robô padrão
    console.log('Criando robô...')
    const { error: roboError } = await supabase.from('robos').insert({
      empresa_id: empresaId,
      nome: 'Assistente Virtual',
      descricao: 'Robô de atendimento automático',
      ativo: true,
      personalidade: 'profissional',
      saudacao: 'Olá! Sou o assistente virtual. Como posso ajudar você hoje?',
      instrucoes_sistema: 'Você é um assistente de atendimento ao cliente. Seja educado, profissional e objetivo.'
    })

    if (roboError) {
      console.error('Erro ao criar robô:', roboError)
      // Não falha o cadastro se robô der erro
    } else {
      console.log('✓ Robô criado')
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
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl font-bold text-white">IA</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Criar sua conta</h1>
          <p className="text-gray-500 mt-2">Plataforma de atendimento inteligente</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          
          {/* Progresso */}
          <div className="flex items-center mb-8">
            <div className={`flex-1 h-2 rounded-full ${etapa >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mx-2 ${etapa >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>1</div>
            <div className={`flex-1 h-2 rounded-full ${etapa >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mx-2 ${etapa >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>2</div>
            <div className="flex-1 h-2 rounded-full bg-gray-200" />
          </div>

          {/* Erro */}
          {erro && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <p className="text-red-700 text-sm">{erro}</p>
            </div>
          )}

          {/* Etapa 1 */}
          {etapa === 1 ? (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-gray-900">Dados da Empresa</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Empresa *</label>
                <input
                  type="text"
                  value={nomeEmpresa}
                  onChange={(e) => setNomeEmpresa(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Ex: Barbearia do João"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="contato@empresa.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                <input
                  type="tel"
                  value={telefoneEmpresa}
                  onChange={(e) => setTelefoneEmpresa(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="(11) 99999-9999"
                />
              </div>

              <button
                onClick={avancarEtapa}
                className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors flex items-center justify-center"
              >
                Continuar →
              </button>
            </div>
          ) : (
            /* Etapa 2 */
            <form onSubmit={handleCadastro} className="space-y-5">
              <h2 className="text-lg font-semibold text-gray-900">Dados do Administrador</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Seu Nome *</label>
                <input
                  type="text"
                  value={nomeAdmin}
                  onChange={(e) => setNomeAdmin(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="João Silva"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Senha *</label>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                  required
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEtapa(1)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                >
                  ← Voltar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 font-medium transition-colors"
                >
                  {loading ? '⏳ Criando...' : '✓ Criar Conta'}
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
      </div>
    </div>
  )
}
