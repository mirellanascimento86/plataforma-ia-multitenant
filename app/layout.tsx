import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Thunder AI Corporation',
  description: 'Plataforma de Agentes IA para WhatsApp',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}