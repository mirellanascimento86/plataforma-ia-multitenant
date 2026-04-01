import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Sidebar from '@/components/Sidebar'        // vamos criar agora
import Topbar from '@/components/Topbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = { title: 'Thunder AI', description: 'Agentes IA no WhatsApp' }

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: () => cookieStore })

  const { data: { session } } = await supabase.auth.getSession()

  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {session ? (
          <div className="flex h-screen bg-gray-50">
            {/* Menu esquerdo colapsável */}
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Topbar session={session} />
              <main className="flex-1 overflow-auto p-6">{children}</main>
            </div>
          </div>
        ) : (
          children
        )}
      </body>
    </html>
  )
}