'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function Cadastro() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const nome = formData.get('nome') as string;
    const empresa = formData.get('empresa') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { data, error: authError } = await supabase.auth.signUp({
      email, password, options: { data: { nome, empresa } }
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    await supabase.from('usuarios').insert({ id: data.user!.id, nome, empresa });

    // Redireciona para o dashboard
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-zinc-900 border border-white/10 rounded-3xl p-12">
        <h1 className="text-4xl font-black text-center mb-10">Criar conta Thunder AI</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input name="nome" placeholder="Nome completo" required className="w-full bg-black border border-white/20 px-6 py-5 rounded-2xl text-white" />
          <input name="empresa" placeholder="Nome da empresa" required className="w-full bg-black border border-white/20 px-6 py-5 rounded-2xl text-white" />
          <input name="email" type="email" placeholder="Email" required className="w-full bg-black border border-white/20 px-6 py-5 rounded-2xl text-white" />
          <input name="password" type="password" placeholder="Senha" required className="w-full bg-black border border-white/20 px-6 py-5 rounded-2xl text-white" />

          {error && <p className="text-red-400 text-center">{error}</p>}

          <button type="submit" disabled={loading} className="w-full py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-3xl text-xl">
            {loading ? 'CRIANDO...' : 'Criar conta'}
          </button>
        </form>
      </div>
    </div>
  );
}