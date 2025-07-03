'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface BotStats {
  status: string
  uptime: string
  activeSessions: number
  totalMessages: number
  lastActivity: string
}

interface SystemHealth {
  status: string
  memory: any
  environment: any
  gemini: any
  dependencies: any
}

export default function DashboardPage() {
  const [botStats, setBotStats] = useState<BotStats | null>(null)
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
    const interval = setInterval(fetchDashboardData, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [healthResponse, webhookResponse] = await Promise.all([
        fetch('/api/health'),
        fetch('/api/webhook')
      ])

      let healthData: any = null
      if (healthResponse.ok) {
        healthData = await healthResponse.json()
        setSystemHealth(healthData)
      }

      if (webhookResponse.ok) {
        const webhookData = await webhookResponse.json()
        setBotStats({
          status: healthData?.status || 'unknown',
          uptime: healthData?.system?.uptime || '0s',
          activeSessions: webhookData?.stats?.activeSessions || 0,
          totalMessages: webhookData?.stats?.totalConversations || 0,
          lastActivity: new Date().toLocaleTimeString()
        })
      }

      setLoading(false)
      setError(null)
    } catch (err) {
      setError('Erreur de connexion aux APIs')
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="cyber-spinner"></div>
        <span className="ml-4 text-neon-green">Chargement du dashboard...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-neon-green mb-2">
            🎮 Dashboard de Contrôle
          </h1>
          <p className="text-gray-300">
            Surveillance en temps réel du bot WhatsApp RP
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/20 border border-red-500 rounded-cyber p-4 mb-6"
          >
            <div className="flex items-center gap-2">
              <span>❌</span>
              <span>{error}</span>
              <button
                onClick={fetchDashboardData}
                className="ml-auto cyber-button-secondary text-sm"
              >
                Réessayer
              </button>
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatCard
            title="Statut du Bot"
            value={botStats?.status || 'Inconnu'}
            icon="🤖"
            color={botStats?.status === 'healthy' ? 'text-neon-green' : 'text-red-500'}
          />
          
          <StatCard
            title="Sessions Actives"
            value={botStats?.activeSessions?.toString() || '0'}
            icon="👥"
            color="text-neon-blue"
          />
          
          <StatCard
            title="Messages Totaux"
            value={botStats?.totalMessages?.toString() || '0'}
            icon="💬"
            color="text-neon-purple"
          />
          
          <StatCard
            title="Uptime"
            value={botStats?.uptime || '0s'}
            icon="⏱️"
            color="text-neon-green"
          />
        </motion.div>

        {/* System Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          <HealthCard
            title="💾 Mémoire Système"
            data={systemHealth?.memory}
            type="memory"
          />
          
          <HealthCard
            title="🧠 IA Gemini"
            data={systemHealth?.gemini}
            type="gemini"
          />
          
          <HealthCard
            title="⚙️ Configuration"
            data={systemHealth?.environment}
            type="environment"
          />
          
          <HealthCard
            title="📦 Dépendances"
            data={systemHealth?.dependencies}
            type="dependencies"
          />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="cyber-card"
        >
          <h2 className="text-2xl font-bold text-neon-blue mb-6">
            ⚡ Actions Rapides
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickActionButton
              title="🧪 Tester l'IA"
              description="Tester la génération de réponse RP"
              onClick={() => window.open('/test', '_self')}
            />
            
            <QuickActionButton
              title="📊 Voir les Logs"
              description="Consulter les logs détaillés"
              onClick={() => window.open('/api/health', '_blank')}
            />
            
            <QuickActionButton
              title="🔄 Redémarrer"
              description="Redémarrer les services"
              onClick={() => fetchDashboardData()}
            />
          </div>
        </motion.div>

        {/* Real-time Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="cyber-card mt-8"
        >
          <h2 className="text-2xl font-bold text-neon-green mb-6">
            📈 Activité en Temps Réel
          </h2>
          
          <div className="space-y-4">
            <ActivityItem
              time={new Date().toLocaleTimeString()}
              event="Système en fonctionnement"
              status="success"
            />
            
            <ActivityItem
              time={botStats?.lastActivity || 'N/A'}
              event="Dernière vérification de santé"
              status="info"
            />
            
            {systemHealth?.status === 'healthy' && (
              <ActivityItem
                time={new Date().toLocaleTimeString()}
                event="Tous les systèmes opérationnels"
                status="success"
              />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string
  icon: string
  color: string
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div className="cyber-card text-center">
      <div className="text-3xl mb-2">{icon}</div>
      <div className={`text-2xl font-bold ${color} mb-1`}>{value}</div>
      <div className="text-sm text-gray-400">{title}</div>
    </div>
  )
}

interface HealthCardProps {
  title: string
  data: any
  type: string
}

function HealthCard({ title, data, type }: HealthCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok': return 'text-neon-green'
      case 'warning': return 'text-yellow-500'
      case 'error': return 'text-red-500'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="cyber-card">
      <h3 className="text-lg font-bold text-neon-blue mb-4">{title}</h3>
      
      {data ? (
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Statut:</span>
            <span className={getStatusColor(data.status)}>
              {data.status === 'ok' ? '✅ OK' : 
               data.status === 'warning' ? '⚠️ Attention' : 
               data.status === 'error' ? '❌ Erreur' : '❓ Inconnu'}
            </span>
          </div>
          
          {data.message && (
            <div className="text-sm text-gray-300">{data.message}</div>
          )}
          
          {data.details && type === 'memory' && (
            <div className="text-xs space-y-1 mt-2">
              <div>Total: {data.details.total}</div>
              <div>Utilisé: {data.details.used}</div>
              <div>Usage: {data.details.usage}</div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-gray-400">Aucune donnée disponible</div>
      )}
    </div>
  )
}

interface QuickActionButtonProps {
  title: string
  description: string
  onClick: () => void
}

function QuickActionButton({ title, description, onClick }: QuickActionButtonProps) {
  return (
    <motion.button
      className="cyber-card text-left p-4 hover:bg-dark-200/50 transition-colors"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="font-bold text-neon-green mb-1">{title}</div>
      <div className="text-sm text-gray-300">{description}</div>
    </motion.button>
  )
}

interface ActivityItemProps {
  time: string
  event: string
  status: 'success' | 'warning' | 'error' | 'info'
}

function ActivityItem({ time, event, status }: ActivityItemProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅'
      case 'warning': return '⚠️'
      case 'error': return '❌'
      case 'info': return 'ℹ️'
      default: return '📋'
    }
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-dark-200/30 rounded-cyber">
      <span className="text-lg">{getStatusIcon(status)}</span>
      <div className="flex-1">
        <div className="text-sm">{event}</div>
        <div className="text-xs text-gray-400">{time}</div>
      </div>
    </div>
  )
}