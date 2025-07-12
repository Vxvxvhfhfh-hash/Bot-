'use client';

import { useState, useEffect } from 'react';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import { ChatInterface } from '@/components/ChatInterface';
import { BotConfig } from '@/components/BotConfig';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { WhatsAppConnection } from '@/types';
import { Smartphone, MessageSquare, Settings, Bot } from 'lucide-react';

export default function WhatsAppBot() {
  const [connection, setConnection] = useState<WhatsAppConnection>({
    id: 'default',
    status: 'disconnected'
  });
  const [activeTab, setActiveTab] = useState<'connect' | 'chat' | 'config'>('connect');
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/whatsapp/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ method: 'qr' })
      });

      if (!response.ok) {
        throw new Error('Failed to connect');
      }

      const data = await response.json();
      console.log('Connection initiated:', data);
      
      // Polling pour vérifier le statut de connexion
      const pollStatus = setInterval(async () => {
        try {
          const statusResponse = await fetch('/api/whatsapp/status');
          const statusData = await statusResponse.json();
          
          setConnection(statusData.connection);
          
          if (statusData.connection.status === 'connected') {
            clearInterval(pollStatus);
            setActiveTab('chat');
          }
        } catch (error) {
          console.error('Error polling status:', error);
        }
      }, 2000);

      // Nettoyer le polling après 5 minutes
      setTimeout(() => {
        clearInterval(pollStatus);
      }, 300000);

    } catch (error) {
      console.error('Error connecting:', error);
      alert('Erreur lors de la connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      const response = await fetch('/api/whatsapp/disconnect', {
        method: 'POST'
      });

      if (response.ok) {
        setConnection({
          id: 'default',
          status: 'disconnected'
        });
        setActiveTab('connect');
      }
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Bot className="w-12 h-12 text-green-600" />
              <h1 className="text-4xl font-bold text-gray-800">WhatsApp AI Bot</h1>
            </div>
            <p className="text-gray-600 text-lg">
              Bot WhatsApp intelligent avec IA Gemini et images stock
            </p>
          </div>

          {/* Status bar */}
          <div className="mb-6">
            <ConnectionStatus connection={connection} />
          </div>

          {/* Navigation tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg shadow-md p-1">
              <button
                onClick={() => setActiveTab('connect')}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeTab === 'connect'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-green-600'
                }`}
              >
                <Smartphone className="w-5 h-5" />
                Connexion
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                disabled={connection.status !== 'connected'}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeTab === 'chat'
                    ? 'bg-green-600 text-white shadow-md'
                    : connection.status === 'connected'
                    ? 'text-gray-600 hover:text-green-600'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                Chat
              </button>
              <button
                onClick={() => setActiveTab('config')}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeTab === 'config'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-green-600'
                }`}
              >
                <Settings className="w-5 h-5" />
                Configuration
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {activeTab === 'connect' && (
              <div className="p-8">
                <QRCodeDisplay
                  connection={connection}
                  onConnect={handleConnect}
                  onDisconnect={handleDisconnect}
                  isLoading={isLoading}
                />
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="p-8">
                <ChatInterface />
              </div>
            )}

            {activeTab === 'config' && (
              <div className="p-8">
                <BotConfig />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-gray-500">
            <p>© 2024 WhatsApp AI Bot - Propulsé par Gemini AI</p>
          </div>
        </div>
      </div>
    </div>
  );
}