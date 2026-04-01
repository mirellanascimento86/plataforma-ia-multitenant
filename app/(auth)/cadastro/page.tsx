// app/(auth)/cadastro/page.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client'; // ajuste o path se necessário
import { useRouter } from 'next/navigation';

export default function CadastroPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleCadastro = async (formData: FormData) => {
    setLoading(true);
    setError('');

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const nome = formData.get('nome') as string;
    const empresa = formData.get('empresa') as string;

    // 1. Cria o usuário no Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nome, empresa }, // dados extras no metadata
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // 2. Insere na tabela usuarios usando o ID que o Auth acabou de criar
    const { error: profileError } = await supabase
      .from('usuarios')
      .insert({
        id: authData.user!.id,           // ← ESSA É A CHAVE
        nome,
        empresa,
      });

    if (profileError) {
      setError(`Erro ao criar perfil: ${profileError.message}`);
      // Opcional: deleta o auth user se o perfil falhar
      await supabase.auth.admin.deleteUser(authData.user!.id);
    } else {
      router.push('/conversas'); // ou /dashboard
    }

    setLoading(false);
  };

  return (
    // seu formulário aqui (mantendo o que você já tinha)
    <form action={handleCadastro}>
      {/* campos nome, empresa, email, senha */}
      <button type="submit" disabled={loading}>
        {loading ? 'Criando conta...' : 'Cadastrar'}
      </button>
    </form>
  );
}
