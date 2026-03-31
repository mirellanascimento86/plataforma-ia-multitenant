// app/conversas/page.tsx
'use client';

import { useEmpresaAtual } from '@/lib/empresa';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';

export default function ConversasPage() {
  const { empresa, loading: loadingEmpresa } = useEmpresaAtual();
  const [conversas, setConversas] = useState([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (!empresa) return;

    // RLS garante que só vemos conversas da empresa_id correta!
    async function carregarConversas() {
      const { data, error } = await supabase
        .from('conversas')
        .select(`
          *,
          cliente:cliente_id (*),
          bot:bot_id (*),
          mensagens:mensagens (count)
        `)
        .eq('empresa_id', empresa.id) // Opcional: RLS já filtra, mas explicitar ajuda performance
        .order('ultima_mensagem_em', { ascending: false });

      if (error) {
        console.error('Erro:', error);
        return;
      }

      setConversas(data || []);
    }

    carregarConversas();

    // Subscribe para novas mensagens em tempo real
    const subscription = supabase
      .channel(`conversas:${empresa.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'conversas',
        filter: `empresa_id=eq.${empresa.id}`
      }, (payload) => {
        console.log('Nova conversa:', payload);
        carregarConversas();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [empresa]);

  if (loadingEmpresa) return <div>Carregando...</div>;
  if (!empresa) return <div>Sem acesso à empresa</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Conversas - {empresa.nome}
      </h1>
      {/* Lista de conversas */}
    </div>
  );
}
