'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { Plus, Brain, Save, Trash2, MessageSquare } from 'lucide-react'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export default function TreinamentoPage() {
  const searchParams = useSearchParams()
  const roboId = searchParams.get('robo')

  const [intencoes, setIntencoes] = useState<any[]>([])
  const [modalAberto, setModalAberto] = useState(false)
  const [novaIntencao, setNovaIntencao] = useState({
    pergunta: '',
    resposta: '',
    categoria: 'geral'
  })

  useEffect(() => {
    if (roboId) loadIntencoes()
  }, [roboId])

  async function loadIntencoes() {
    const { data } = await supabase
      .from('robo_conhecimento')
      .select('*')
      .eq('robo_id', roboId)
      .order('criado_em', { ascending: false })

    setIntencoes(data || [])
  }

  async function salvarIntencao(e: React.FormEvent) {
    e.preventDefault()
    
    await supabase.from('robo_conhecimento').insert({
      robo_id: roboId,
      pergunta: novaIntencao.pergunta,
      resposta: novaIntencao.resposta,
      categoria: novaIntencao.categoria,
      ativa: true
    })

    setModalAberto(false)
    setNovaIntencao({ pergunta: '', resposta: '', categoria: 'geral' })
    loadIntencoes()
  }

  if (!roboId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        
