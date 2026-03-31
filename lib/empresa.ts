import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';

export function useEmpresaAtual() {
  const [empresa, setEmpresa] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function carregarEmpresa() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setLoading(false);
        return;
      }

      // Busca empresa do usuário logado
      const { data: membro } = await supabase
        .from('membros_empresa')
        .select(`
          empresa_id,
          cargo,
          empresas:empresa_id (*)
        `)
        .eq('usuario_id', session.user.id)
        .eq('ativo', true)
        .single();

      if (membro) {
        setEmpresa({
          ...membro.empresas,
          meuCargo: membro.cargo
        });
      }
      
      setLoading(false);
    }

    carregarEmpresa();
  }, []);

  return { empresa, loading };
}
