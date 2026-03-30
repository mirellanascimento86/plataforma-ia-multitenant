import { createClient } from '@supabase/supabase-js'

// TEMPORÁRIO - Substitua pelos seus valores reais do Supabase
const supabaseUrl = 'https://fwcljognwdutsagppxcq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3Y2xqb2dud2R1dHNhZ3BweGNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4OTY4MjMsImV4cCI6MjA5MDQ3MjgyM30.6n8MejPbWRZlJnfZylrsK37_jwFha3FE7Xbj_Sn8VcE'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Helper para pegar empresa do usuário atual
export async function getEmpresaId() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  const { data } = await supabase
    .from('usuarios')
    .select('empresa_id')
    .eq('id', user.id)
    .single()
  
  return data?.empresa_id
}
