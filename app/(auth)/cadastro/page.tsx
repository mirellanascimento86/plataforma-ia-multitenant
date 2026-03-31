// app/(auth)/cadastro/page.tsx
'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function CadastroPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const nome = formData.get('nome') as string;
    const nomeEmpresa = formData.get('nome_empresa') as string;

    try {
      // 1. Criar usuário no Auth (o trigger cria empresa e vínculo automaticamente!)
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome: nome,
            nome_empresa: nomeEmpresa, // Passa para o trigger
          },
        },
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        // 2. Redirecionar para dashboard (já está logado)
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      console.error('Erro no cadastro:', err);
      setError(err.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Criar sua conta</h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome completo</label>
            <input 
              name="nome" 
              type="text" 
              required 
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="João Silva"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nome da empresa</label>
            <input 
              name="nome_empresa" 
              type="text" 
              required 
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Minha Empresa LTDA"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">E-mail</label>
            <input 
              name="email" 
              type="email" 
              required 
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="joao@empresa.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Senha</label>
            <input 
              name="password" 
              type="password" 
              required 
              minLength={6}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="******"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Criando conta...' : 'Criar conta gratuita'}
          </button>
        </div>
      </form>
    </div>
  );
}
