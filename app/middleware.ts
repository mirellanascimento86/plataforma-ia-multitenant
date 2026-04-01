import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // Atualiza o cookie na request
            request.cookies.set(name, value)
            // Cria uma nova response com o cookie atualizado
            response = NextResponse.next({
              request,
            })
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Refresh da sessão (importante para manter o usuário logado)
  await supabase.auth.getSession()

  return response
}

// Aplica o middleware em todas as páginas, exceto login, cadastro e arquivos estáticos
export const config = {
  matcher: [
    '/((?!login|cadastro|api|_next/static|_next/image|favicon.ico).*)',
  ],
}