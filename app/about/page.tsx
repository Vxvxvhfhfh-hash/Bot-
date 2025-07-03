'use client'

import React from 'react'
import { motion } from 'framer-motion'

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-neon-green mb-4 glitch" data-text="À PROPOS">
            À PROPOS
          </h1>
          <p className="text-xl text-gray-300">
            Découvrez l'histoire et la technologie derrière le bot WhatsApp RP
          </p>
        </motion.div>

        {/* Project Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="cyber-card mb-8"
        >
          <h2 className="text-3xl font-bold text-neon-blue mb-6">
            🎭 Le Projet
          </h2>
          
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>
              Le <strong className="text-neon-green">Bot WhatsApp RP</strong> est une innovation 
              technologique qui combine l'intelligence artificielle de Google Gemini avec 
              l'univers immersif du cyberpunk pour créer des expériences de jeu de rôle 
              uniques directement dans WhatsApp.
            </p>
            
            <p>
              Conçu pour les passionnés de science-fiction et de roleplay, ce bot utilise 
              les dernières avancées en IA pour générer des réponses contextuelles, 
              créer des atmosphères immersives et maintenir la cohérence narrative 
              tout au long de vos aventures.
            </p>
            
            <p>
              Déployé sur <strong className="text-neon-blue">Vercel</strong>, le bot offre 
              une architecture serverless performante et scalable, garantissant une 
              disponibilité 24/7 et des temps de réponse optimaux.
            </p>
          </div>
        </motion.div>

        {/* Technical Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="cyber-card mb-8"
        >
          <h2 className="text-3xl font-bold text-neon-purple mb-6">
            ⚡ Stack Technique
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TechCard
              icon="🧠"
              title="Google Gemini AI"
              description="Intelligence artificielle avancée pour la génération de contenu RP"
              color="text-neon-green"
            />
            
            <TechCard
              icon="📱"
              title="WhatsApp Business API"
              description="Intégration native avec WhatsApp pour l'envoi de messages"
              color="text-neon-blue"
            />
            
            <TechCard
              icon="⚡"
              title="Next.js 14"
              description="Framework React moderne avec App Router et composants serveur"
              color="text-neon-purple"
            />
            
            <TechCard
              icon="🚀"
              title="Vercel Serverless"
              description="Déploiement automatique avec fonctions serverless Edge"
              color="text-neon-pink"
            />
            
            <TechCard
              icon="🎨"
              title="Tailwind CSS"
              description="Framework CSS utilitaire avec thème cyberpunk personnalisé"
              color="text-neon-yellow"
            />
            
            <TechCard
              icon="🔄"
              title="Framer Motion"
              description="Animations fluides et interactions utilisateur avancées"
              color="text-neon-blue"
            />
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="cyber-card mb-8"
        >
          <h2 className="text-3xl font-bold text-neon-green mb-6">
            🌟 Fonctionnalités
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <FeatureItem
                icon="🎭"
                title="Système RP Immersif"
                description="Gestion complète des sessions de jeu de rôle avec commandes intuitives"
              />
              
              <FeatureItem
                icon="🧠"
                title="IA Contextuelle"
                description="Réponses adaptées au contexte avec mémoire de conversation"
              />
              
              <FeatureItem
                icon="📸"
                title="Médias Automatiques"
                description="Images et vidéos envoyées selon le contexte narratif"
              />
              
              <FeatureItem
                icon="⚡"
                title="Temps Réel"
                description="Réponses instantanées avec latence optimisée"
              />
            </div>
            
            <div className="space-y-4">
              <FeatureItem
                icon="🌃"
                title="Univers Cyberpunk"
                description="Ambiance futuriste avec personnages et décors immersifs"
              />
              
              <FeatureItem
                icon="🔧"
                title="Personnalisable"
                description="Configuration flexible pour différents univers RP"
              />
              
              <FeatureItem
                icon="📊"
                title="Monitoring"
                description="Dashboard de surveillance en temps réel"
              />
              
              <FeatureItem
                icon="🛡️"
                title="Sécurisé"
                description="Chiffrement des données et protection de la vie privée"
              />
            </div>
          </div>
        </motion.div>

        {/* Architecture */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="cyber-card mb-8"
        >
          <h2 className="text-3xl font-bold text-neon-blue mb-6">
            🏗️ Architecture
          </h2>
          
          <div className="space-y-6">
            <div className="text-gray-300">
              L'architecture du bot repose sur une approche serverless moderne, 
              optimisée pour la performance et la scalabilité :
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-neon-green">Frontend</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong>Next.js 14</strong> avec App Router</li>
                  <li>• <strong>React 18</strong> avec hooks modernes</li>
                  <li>• <strong>TypeScript</strong> pour la sécurité de types</li>
                  <li>• <strong>Tailwind CSS</strong> pour le styling</li>
                  <li>• <strong>Framer Motion</strong> pour les animations</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-neon-purple">Backend</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong>Vercel Functions</strong> serverless</li>
                  <li>• <strong>Google Gemini API</strong> pour l'IA</li>
                  <li>• <strong>WhatsApp Business API</strong></li>
                  <li>• <strong>RESTful APIs</strong> avec validation</li>
                  <li>• <strong>Edge Runtime</strong> pour la performance</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Open Source */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="cyber-card"
        >
          <h2 className="text-3xl font-bold text-neon-pink mb-6">
            💝 Open Source
          </h2>
          
          <div className="space-y-4 text-gray-300">
            <p>
              Ce projet est entièrement <strong className="text-neon-green">open source</strong> 
              et disponible sous licence MIT. La communauté est encouragée à contribuer, 
              proposer des améliorations et adapter le code à leurs besoins.
            </p>
            
            <div className="flex flex-wrap gap-4 mt-6">
              <motion.a
                href="https://github.com/votre-repo/whatsapp-rp-bot"
                target="_blank"
                className="cyber-button inline-flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub Repository
              </motion.a>
              
              <motion.a
                href="/api/status"
                target="_blank"
                className="cyber-button-secondary inline-flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                📊 Documentation API
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

interface TechCardProps {
  icon: string
  title: string
  description: string
  color: string
}

function TechCard({ icon, title, description, color }: TechCardProps) {
  return (
    <motion.div
      className="cyber-card text-center group"
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`text-4xl mb-3 ${color} group-hover:animate-pulse`}>
        {icon}
      </div>
      <h3 className="font-bold text-lg mb-2 text-neon-green group-hover:text-neon-blue transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-300 leading-relaxed">
        {description}
      </p>
    </motion.div>
  )
}

interface FeatureItemProps {
  icon: string
  title: string
  description: string
}

function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <div className="flex items-start gap-4 group">
      <div className="text-2xl group-hover:animate-bounce">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-neon-green mb-1 group-hover:text-neon-blue transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-300 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  )
}