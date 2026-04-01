import { createClient } from '@/utils/supabase/client'

export async function getEmpresaAtual() {
  const supabase = createClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) return null
  
  const { data: membro } = await supabase
    .from('membros_empresa')
    .select(`
      empresa_id,
      cargo,
      empresas:empresa_id (*)
    `)
    .eq('usuario_id', session.user.id)
    .eq('ativo', true)
    .single()
  
  if (!membro) return null
  
  return {
    ...membro.empresas,
    meuCargo: membro.cargo
  }
}

export function useEmpresaAtual() {
  // Hook simplificado para uso em client components
  const [empresa, setEmpresa] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    getEmpresaAtual().then(data => {
      setEmpresa(data)
      setLoading(false)
    })
  }, [])
  
  return { empresa, loading }
}

// Precisa importar useState e useEffect
import { useState, useEffect } from 'react'
