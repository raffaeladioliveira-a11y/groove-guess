import './globals.css'
import React from 'react'
import { SessionProvider } from 'next-auth/react'

export const metadata = {
  title: 'Quiz Musical',
  description: 'Multiplayer quiz musical',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <SessionProvider>
          <header className="border-b bg-white">
            <nav className="max-w-5xl mx-auto p-3 flex gap-3">
              <a href="/">Início</a>
              <a href="/admin">Admin</a>
              <a href="/profile">Perfil</a>
            </nav>
          </header>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
