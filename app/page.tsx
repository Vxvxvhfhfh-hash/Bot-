'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [botStatus, setBotStatus] = useState<'loading' | 'online' | 'offline'>('loading')

  useEffect(() => {
    setIsLoaded(true)
    // Simuler la vérification du statut du bot
    checkBotStatus()
  }, [])

  const checkBotStatus = async () => {
    try {
      const response = await fetch('/api/health')
      if (response.ok) {
        setBotStatus('online')
      } else {
        setBotStatus('offline')
      }
    } catch (error) {
      setBotStatus('offline')
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 cyber-grid opacity-20"></div>
      
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 py-12"
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        {/* Hero Section */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 glitch neon-text" data-text="🎭 RP BOT">
            <span className="text-neon-green">🎭 RP</span>{' '}
            <span className="text-neon-blue">BOT</span>
          </h1>
          
          <motion.div
            className="text-xl md:text-2xl mb-8 typing-animation"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, delay: 1 }}
          >
            Bot WhatsApp avec IA Gemini pour le Roleplay Cyberpunk
          </motion.div>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className={`w-3 h-3 rounded-full ${
              botStatus === 'online' ? 'bg-neon-green animate-pulse' :
              botStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-500 animate-pulse'
            }`}></div>
            <span className="text-lg">
              Statut: {botStatus === 'online' ? 'En ligne' : botStatus === 'offline' ? 'Hors ligne' : 'Vérification...'}
            </span>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div variants={itemVariants} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            icon="🧠"
            title="IA Gemini"
            description="Intelligence artificielle avancée pour des réponses immersives et contextuelles"
            gradient="from-neon-blue to-neon-purple"
          />
          
          <FeatureCard
            icon="🎭"
            title="Système RP"
            description="Commandes intuitives pour gérer vos sessions de jeu de rôle"
            gradient="from-neon-green to-neon-blue"
          />
          
          <FeatureCard
            icon="📱"
            title="WhatsApp"
            description="Intégration native avec WhatsApp Business API"
            gradient="from-neon-purple to-neon-pink"
          />
          
          <FeatureCard
            icon="🌃"
            title="Univers Cyberpunk"
            description="Ambiance futuriste avec personnages et décors immersifs"
            gradient="from-neon-pink to-neon-green"
          />
          
          <FeatureCard
            icon="📸"
            title="Médias Auto"
            description="Images et vidéos envoyées automatiquement selon le contexte"
            gradient="from-neon-green to-neon-purple"
          />
          
          <FeatureCard
            icon="⚡"
            title="Temps Réel"
            description="Réponses instantanées avec historique de conversation"
            gradient="from-neon-blue to-neon-pink"
          />
        </motion.div>

        {/* Action Buttons */}
        <motion.div variants={itemVariants} className="text-center space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              className="cyber-button text-lg px-8 py-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open('/dashboard', '_self')}
            >
              🎮 Tableau de Bord
            </motion.button>
            
            <motion.button
              className="cyber-button-secondary text-lg px-8 py-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open('/test', '_self')}
            >
              🧪 Tester les APIs
            </motion.button>
          </div>
          
          <div className="text-center">
            <motion.a
              href="/api/status"
              target="_blank"
              className="inline-flex items-center gap-2 text-neon-blue hover:text-neon-green transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              📊 Voir le statut complet
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </motion.a>
          </div>
        </motion.div>

        {/* Quick Start Guide */}
        <motion.div variants={itemVariants} className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-neon-blue">
            🚀 Démarrage Rapide
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Configuration"
              description="Ajoutez votre clé API Gemini dans les variables d'environnement"
              code="GEMINI_API_KEY=your_key"
            />
            
            <StepCard
              number="2"
              title="Webhook"
              description="Configurez votre webhook WhatsApp Business"
              code="https://your-app.vercel.app/api/webhook"
            />
            
            <StepCard
              number="3"
              title="Utilisation"
              description="Envoyez !rp start dans WhatsApp pour commencer"
              code="!rp start"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

interface FeatureCardProps {
  icon: string
  title: string
  description: string
  gradient: string
}

function FeatureCard({ icon, title, description, gradient }: FeatureCardProps) {
  return (
    <motion.div
      className="cyber-card group cursor-pointer"
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 0 40px rgba(0, 255, 148, 0.3)"
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`text-4xl mb-4 p-3 rounded-cyber bg-gradient-to-r ${gradient} w-fit`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-neon-green group-hover:text-neon-blue transition-colors">
        {title}
      </h3>
      <p className="text-gray-300 leading-relaxed">
        {description}
      </p>
    </motion.div>
  )
}

interface StepCardProps {
  number: string
  title: string
  description: string
  code: string
}

function StepCard({ number, title, description, code }: StepCardProps) {
  return (
    <div className="cyber-card text-center">
      <div className="w-12 h-12 bg-neon-green text-dark-500 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-bold mb-3 text-neon-blue">{title}</h3>
      <p className="text-gray-300 mb-4">{description}</p>
      <div className="code-block">
        <code>{code}</code>
      </div>
    </div>
  )
}