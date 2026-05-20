import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
// @ts-ignore
import './globals.css'

const dmSans = DM_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Instruo — Agendamento de Aulas',
  description: 'Agende suas aulas práticas com instrutores autônomos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={dmSans.className}>
        {children}
      </body>
    </html>
  )
}