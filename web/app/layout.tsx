import './globals.css'
import React from 'react'

export const metadata = {
  title: 'Quiz Musical',
  description: 'Multiplayer quiz musical',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="min-h-screen bg-gray-50 text-gray-900">{children}</body>
    </html>
  )
}
