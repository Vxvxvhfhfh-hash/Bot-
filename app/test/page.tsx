'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface TestResult {
  endpoint: string
  method: string
  status: number
  success: boolean
  data: any
  error?: string
  responseTime: number
}

export default function TestPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(false)
  const [rpMessage, setRpMessage] = useState('Je marche dans les rues sombres de Night City')
  const [webhookMessage, setWebhookMessage] = useState('!rp start')

  const runTest = async (endpoint: string, method: string = 'GET', body?: any) => {
    const startTime = Date.now()
    
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      }
      
      if (body && method !== 'GET') {
        options.body = JSON.stringify(body)
      }
      
      const response = await fetch(endpoint, options)
      const responseTime = Date.now() - startTime
      const data = await response.json()
      
      const result: TestResult = {
        endpoint,
        method,
        status: response.status,
        success: response.ok,
        data,
        responseTime
      }
      
      setTestResults(prev => [result, ...prev])
      return result
      
    } catch (error) {
      const responseTime = Date.now() - startTime
      const result: TestResult = {
        endpoint,
        method,
        status: 0,
        success: false,
        data: null,
        error: (error as Error).message,
        responseTime
      }
      
      setTestResults(prev => [result, ...prev])
      return result
    }
  }

  const runAllTests = async () => {
    setLoading(true)
    setTestResults([])
    
    try {
      // Test tous les endpoints
      await Promise.all([
        runTest('/api/status'),
        runTest('/api/health'),
        runTest('/api/webhook'),
        runTest('/api/generate-response', 'POST', {
          message: rpMessage,
          characterName: 'default',
          conversationHistory: []
        })
      ])
    } finally {
      setLoading(false)
    }
  }

  const testSingleEndpoint = async (endpoint: string, method: string = 'GET', body?: any) => {
    setLoading(true)
    await runTest(endpoint, method, body)
    setLoading(false)
  }

  const clearResults = () => {
    setTestResults([])
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
            🧪 Test des APIs
          </h1>
          <p className="text-gray-300">
            Interface de test pour toutes les APIs du bot WhatsApp RP
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="cyber-card mb-8"
        >
          <h2 className="text-2xl font-bold text-neon-blue mb-6">
            ⚡ Contrôles de Test
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* RP Message Test */}
            <div>
              <label className="block text-sm font-medium text-neon-green mb-2">
                Message RP à tester:
              </label>
              <textarea
                value={rpMessage}
                onChange={(e) => setRpMessage(e.target.value)}
                className="cyber-input w-full h-24 resize-none"
                placeholder="Entrez votre message RP..."
              />
            </div>
            
            {/* Webhook Message Test */}
            <div>
              <label className="block text-sm font-medium text-neon-green mb-2">
                Message Webhook à tester:
              </label>
              <input
                type="text"
                value={webhookMessage}
                onChange={(e) => setWebhookMessage(e.target.value)}
                className="cyber-input w-full"
                placeholder="!rp start"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <motion.button
              className="cyber-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={runAllTests}
              disabled={loading}
            >
              {loading ? '🔄 Test en cours...' : '🚀 Lancer tous les tests'}
            </motion.button>
            
            <motion.button
              className="cyber-button-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearResults}
            >
              🗑️ Vider les résultats
            </motion.button>
          </div>
        </motion.div>

        {/* Individual Tests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <TestButton
            title="📊 Status"
            description="Page de statut"
            endpoint="/api/status"
            onTest={() => testSingleEndpoint('/api/status')}
            loading={loading}
          />
          
          <TestButton
            title="🏥 Health"
            description="Vérification santé"
            endpoint="/api/health"
            onTest={() => testSingleEndpoint('/api/health')}
            loading={loading}
          />
          
          <TestButton
            title="📡 Webhook"
            description="Endpoint webhook"
            endpoint="/api/webhook"
            onTest={() => testSingleEndpoint('/api/webhook', 'POST', {
              messages: [{
                from: 'test_user',
                text: { body: webhookMessage },
                type: 'text'
              }]
            })}
            loading={loading}
          />
          
          <TestButton
            title="🧠 Génération RP"
            description="Test IA Gemini"
            endpoint="/api/generate-response"
            onTest={() => testSingleEndpoint('/api/generate-response', 'POST', {
              message: rpMessage,
              characterName: 'default',
              conversationHistory: []
            })}
            loading={loading}
          />
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="cyber-card"
        >
          <h2 className="text-2xl font-bold text-neon-green mb-6">
            📈 Résultats des Tests
          </h2>
          
          {testResults.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-4">🔬</div>
              <p>Aucun test effectué. Lancez vos premiers tests !</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {testResults.map((result, index) => (
                <TestResultCard key={index} result={result} />
              ))}
            </div>
          )}
        </motion.div>

        {/* Test Summary */}
        {testResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="cyber-card mt-8"
          >
            <h2 className="text-2xl font-bold text-neon-blue mb-6">
              📊 Résumé des Tests
            </h2>
            
            <TestSummary results={testResults} />
          </motion.div>
        )}
      </div>
    </div>
  )
}

interface TestButtonProps {
  title: string
  description: string
  endpoint: string
  onTest: () => void
  loading: boolean
}

function TestButton({ title, description, endpoint, onTest, loading }: TestButtonProps) {
  return (
    <motion.div
      className="cyber-card text-center"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="text-2xl mb-3">{title.split(' ')[0]}</div>
      <h3 className="font-bold text-neon-green mb-2">{title.split(' ').slice(1).join(' ')}</h3>
      <p className="text-sm text-gray-300 mb-4">{description}</p>
      <code className="text-xs bg-dark-200/50 px-2 py-1 rounded block mb-4">
        {endpoint}
      </code>
      <motion.button
        className="cyber-button text-sm w-full"
        onClick={onTest}
        disabled={loading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {loading ? '⏳' : '🧪 Tester'}
      </motion.button>
    </motion.div>
  )
}

interface TestResultCardProps {
  result: TestResult
}

function TestResultCard({ result }: TestResultCardProps) {
  const getStatusColor = (success: boolean, status: number) => {
    if (success) return 'text-neon-green'
    if (status >= 400) return 'text-red-500'
    return 'text-yellow-500'
  }

  const getStatusIcon = (success: boolean) => {
    return success ? '✅' : '❌'
  }

  return (
    <div className="border border-neon-green/20 rounded-cyber p-4 bg-dark-200/30">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg">{getStatusIcon(result.success)}</span>
            <span className="font-bold text-neon-blue">{result.method}</span>
            <code className="text-sm bg-dark-300/50 px-2 py-1 rounded">
              {result.endpoint}
            </code>
          </div>
          <div className="flex items-center gap-4 mt-1 text-sm">
            <span className={getStatusColor(result.success, result.status)}>
              Status: {result.status || 'Network Error'}
            </span>
            <span className="text-gray-400">
              {result.responseTime}ms
            </span>
          </div>
        </div>
      </div>
      
      {result.error ? (
        <div className="text-red-400 text-sm mb-2">
          Erreur: {result.error}
        </div>
      ) : (
        <div className="text-xs space-y-2">
          {result.data?.status && (
            <div>
              <span className="text-neon-green">Status:</span> {result.data.status}
            </div>
          )}
          
          {result.data?.response && (
            <div>
              <span className="text-neon-green">Réponse RP:</span>
              <div className="bg-dark-300/50 p-2 rounded mt-1 max-h-20 overflow-y-auto">
                {result.data.response.substring(0, 200)}...
              </div>
            </div>
          )}
          
          {result.data?.config && (
            <div>
              <span className="text-neon-green">Bot:</span> {result.data.config.botName}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

interface TestSummaryProps {
  results: TestResult[]
}

function TestSummary({ results }: TestSummaryProps) {
  const successful = results.filter(r => r.success).length
  const total = results.length
  const percentage = Math.round((successful / total) * 100)
  const avgResponseTime = Math.round(
    results.reduce((acc, r) => acc + r.responseTime, 0) / total
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="text-center">
        <div className="text-3xl font-bold text-neon-green mb-1">
          {successful}/{total}
        </div>
        <div className="text-sm text-gray-400">Tests Réussis</div>
      </div>
      
      <div className="text-center">
        <div className={`text-3xl font-bold mb-1 ${
          percentage >= 80 ? 'text-neon-green' : 
          percentage >= 60 ? 'text-yellow-500' : 'text-red-500'
        }`}>
          {percentage}%
        </div>
        <div className="text-sm text-gray-400">Taux de Réussite</div>
      </div>
      
      <div className="text-center">
        <div className="text-3xl font-bold text-neon-blue mb-1">
          {avgResponseTime}ms
        </div>
        <div className="text-sm text-gray-400">Temps Moyen</div>
      </div>
      
      <div className="text-center">
        <div className="text-3xl font-bold text-neon-purple mb-1">
          {results.length}
        </div>
        <div className="text-sm text-gray-400">Total Tests</div>
      </div>
    </div>
  )
}