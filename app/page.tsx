'use client';

import { useState, useEffect } from 'react';
import { Smartphone, MessageCircle, Settings, Image, Zap, QrCode, Key } from 'lucide-react';
import WhatsAppConnection from '@/components/WhatsAppConnection';
import ChatInterface from '@/components/ChatInterface';
import ConfigPanel from '@/components/ConfigPanel';
import { WhatsAppConnection as WhatsAppConnectionType, BotConfig } from '@/types';

export default function Home() {
  const [connection, setConnection] = useState<WhatsAppConnectionType>({
    id: 'default',
    status: 'disconnected'
  });
  const [activeTab, setActiveTab] = useState<'connection' | 'chat' | 'config'>('connection');
  const [config, setConfig] = useState<BotConfig>({
    aiEnabled: true,
    autoReply: true,
    replyDelay: 2000,
    includeImages: true,
    imageKeywords: ['image', 'photo', 'picture', 'show', 'voir', 'photo'],
    personalityPrompt: 'Tu es un assistant IA amical et serviable qui répond en français.'
  });

  useEffect(() => {
    // Simulation de la connexion WebSocket
    const ws = new WebSocket('ws://localhost:3001');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'qr':
          setConnection(prev => ({
            ...prev,
            status: 'connecting',
            qr: data.data
          }));
          break;
        case 'pairingCode':
          setConnection(prev => ({
            ...prev,
            status: 'connecting',
            pairingCode: data.data
          }));
          break;
        case 'connected':
          setConnection(prev => ({
            ...prev,
            status: 'connected',
            connectedAt: new Date(),
            qr: undefined,
            pairingCode: undefined
          }));
          break;
        case 'disconnected':
          setConnection(prev => ({
            ...prev,
            status: 'disconnected'
          }));
          break;
        case 'error':
          setConnection(prev => ({
            ...prev,
            status: 'error'
          }));
          break;
      }
    };

    return () => ws.close();
  }, []);

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'connection':
        return <Smartphone className="w-5 h-5" />;
      case 'chat':
        return <MessageCircle className="w-5 h-5" />;
      case 'config':
        return <Settings className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-whatsapp-green to-whatsapp-teal">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-white rounded-full shadow-lg">
              <MessageCircle className="w-8 h-8 text-whatsapp-green" />
            </div>
            <h1 className="text-4xl font-bold text-white">WhatsApp AI Bot</h1>
          </div>
          <p className="text-whatsapp-green-light text-lg">
            Bot intelligent avec IA et recherche d'images
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-lg text-center">
            <QrCode className="w-12 h-12 text-whatsapp-green mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">QR Code & Pairing</h3>
            <p className="text-gray-600">Connexion facile via QR code ou code de jumelage</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg text-center">
            <Zap className="w-12 h-12 text-whatsapp-green mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">IA Intelligente</h3>
            <p className="text-gray-600">Réponses automatiques intelligentes avec OpenAI</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg text-center">
            <Image className="w-12 h-12 text-whatsapp-green mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Images Stock</h3>
            <p className="text-gray-600">Recherche et envoi d'images Google automatique</p>
          </div>
        </div>

        {/* Main Interface */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            {[
              { key: 'connection', label: 'Connexion' },
              { key: 'chat', label: 'Chat' },
              { key: 'config', label: 'Configuration' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'text-whatsapp-green border-b-2 border-whatsapp-green bg-whatsapp-green/5'
                    : 'text-gray-600 hover:text-whatsapp-green hover:bg-gray-50'
                }`}
              >
                {getTabIcon(tab.key)}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'connection' && (
              <WhatsAppConnection connection={connection} setConnection={setConnection} />
            )}
            {activeTab === 'chat' && (
              <ChatInterface connection={connection} config={config} />
            )}
            {activeTab === 'config' && (
              <ConfigPanel config={config} setConfig={setConfig} />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-whatsapp-green-light">
          <p>© 2024 WhatsApp AI Bot - Développé avec Next.js et TypeScript</p>
        </div>
      </div>
    </div>
  );
}