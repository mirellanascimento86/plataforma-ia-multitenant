import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const { data: { session } } = await supabase.auth.getSession();

  // Rotas protegidas que precisam de empresa selecionada
  const protectedRoutes = ['/dashboard', '/conversas', '/robos', '/clientes', '/agendamentos'];
  const isProtected = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route));

  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Se estiver logado mas não tiver empresa selecionada, redireciona para seleção
  if (session && isProtected) {
    const { data: membro } = await supabase
      .from('membros_empresa')
      .select('empresa_id, cargo')
      .eq('usuario_id', session.user.id)
      .eq('ativo', true)
      .single();

    if (!membro) {
      // Usuário sem empresa - redireciona para criar
      return NextResponse.redirect(new URL('/criar-empresa', req.url));
    }

    // Adiciona empresa_id ao header para uso nas APIs
    res.headers.set('x-empresa-id', membro.empresa_id);
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
