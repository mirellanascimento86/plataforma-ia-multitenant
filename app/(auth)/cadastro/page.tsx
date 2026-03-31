
async function handleCadastro(e: React.FormEvent) {
  e.preventDefault()
  setLoading(true)
  setErro('')

  try {
    console.log('=== INICIANDO CADASTRO ===')
    
    const slug = gerarSlugUnico(nomeEmpresa)
    console.log('Slug gerado:', slug)

    // 1. Criar usuário no Auth
    console.log('Criando usuário no Auth...')
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: senha,
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

    // 2. Criar empresa
    console.log('Criando empresa...')
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
      console.error('Erro Empresa:', empresaError)
      throw new Error('Erro ao criar empresa: ' + empresaError.message)
    }

    console.log('✓ Empresa criada:', empresaData.id, '- Nome:', empresaData.nome)

    // 3. VERIFICAR se usuário já existe na tabela
    console.log('Verificando se usuário já existe...')
    const { data: usuarioExistente } = await supabase
      .from('usuarios')
      .select('id')
      .eq('id', authData.user.id)
      .single()

    if (usuarioExistente) {
      console.log('Usuário já existe, atualizando...')
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({
          empresa_id: empresaData.id,
          email: email,
          nome: nomeAdmin,
          cargo: 'admin_empresa',
          ativo: true
        })
        .eq('id', authData.user.id)

      if (updateError) {
        console.error('Erro ao atualizar usuário:', updateError)
        throw new Error('Erro ao vincular usuário: ' + updateError.message)
      }
    } else {
      // Criar novo usuário
      console.log('Criando novo usuário na tabela...')
      const { error: userError } = await supabase.from('usuarios').insert({
        id: authData.user.id,
        empresa_id: empresaData.id,
        email: email,
        nome: nomeAdmin,
        cargo: 'admin_empresa',
        ativo: true
      })

      if (userError) {
        console.error('Erro ao criar usuário:', userError)
        console.error('Detalhes:', {
          id: authData.user.id,
          empresa_id: empresaData.id,
          email: email,
          nome: nomeAdmin
        })
        throw new Error('Erro ao vincular usuário: ' + userError.message)
      }
    }

    console.log('✓ Usuário vinculado')

    // 4. Criar robô
    console.log('Criando robô...')
    const { error: roboError } = await supabase.from('robos').insert({
      empresa_id: empresaData.id,
      nome: 'Assistente Virtual',
      descricao: 'Robô de atendimento automático',
      ativo: true
    })

    if (roboError) {
      console.error('Erro Robô:', roboError)
      // Não falha o cadastro
    } else {
      console.log('✓ Robô criado')
    }

    console.log('=== CADASTRO COMPLETO ===')
    
    // Redirecionar
    router.push('/')
    
  } catch (error: any) {
    console.error('ERRO COMPLETO:', error)
    setErro(error.message || 'Erro ao criar conta. Tente novamente.')
  } finally {
    setLoading(false)
  }
}
