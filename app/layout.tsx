import type { Metadata } from 'next'
import React from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: '🎭 WhatsApp RP Bot | IA Gemini Cyberpunk',
  description: 'Bot WhatsApp avec système de jeu de rôle utilisant l\'IA Gemini pour des expériences immersives dans l\'univers cyberpunk',
  keywords: ['whatsapp', 'bot', 'rp', 'roleplay', 'gemini', 'ai', 'cyberpunk', 'nextjs'],
  authors: [{ name: 'WhatsApp RP Bot Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#00ff94',
  robots: 'index, follow',
  openGraph: {
    title: '🎭 WhatsApp RP Bot | IA Gemini Cyberpunk',
    description: 'Bot WhatsApp RP avec IA Gemini pour des aventures immersives',
    type: 'website',
    locale: 'fr_FR',
    siteName: 'WhatsApp RP Bot',
  },
  twitter: {
    card: 'summary_large_image',
    title: '🎭 WhatsApp RP Bot | IA Gemini Cyberpunk',
    description: 'Bot WhatsApp RP avec IA Gemini pour des aventures immersives',
  },
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎭</text></svg>',
    apple: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎭</text></svg>',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-gradient-cyber text-neon-green font-cyber">
        <div className="relative z-10">
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </div>
        
        {/* Matrix Rain Effect */}
        <div className="fixed inset-0 pointer-events-none opacity-5 z-0">
          <div className="matrix-bg w-full h-full"></div>
        </div>
        
        {/* Floating Particles */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-neon-green rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      </body>
    </html>
  )
}