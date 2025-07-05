'use client';

import { useState } from 'react';
import { QrCode, Key, Smartphone, AlertCircle, CheckCircle, Loader2, Power, RefreshCw } from 'lucide-react';
import { WhatsAppConnection as WhatsAppConnectionType } from '@/types';

interface Props {
  connection: WhatsAppConnectionType;
  setConnection: (connection: WhatsAppConnectionType) => void;
}

export default function WhatsAppConnection({ connection, setConnection }: Props) {
  const [connectionMethod, setConnectionMethod] = useState<'qr' | 'pairing'>('qr');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      const response = await fetch('/api/whatsapp/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ method: connectionMethod }),
      });

      if (!response.ok) {
        throw new Error('Failed to connect');
      }

      const data = await response.json();
      console.log('Connection initiated:', data);
    } catch (error) {
      console.error('Connection error:', error);
      setConnection({
        ...connection,
        status: 'error'
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      const response = await fetch('/api/whatsapp/disconnect', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to disconnect');
      }

      setConnection({
        ...connection,
        status: 'disconnected',
        qr: undefined,
        pairingCode: undefined
      });
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  };

  const getStatusIcon = () => {
    switch (connection.status) {
      case 'connecting':
        return <Loader2 className="w-5 h-5 animate-spin text-yellow-500" />;
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Smartphone className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (connection.status) {
      case 'connecting':
        return 'Connexion en cours...';
      case 'connected':
        return 'Connecté';
      case 'error':
        return 'Erreur de connexion';
      default:
        return 'Déconnecté';
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Status */}
      <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <h3 className="font-semibold text-gray-800">Statut de la connexion</h3>
            <p className="text-sm text-gray-600">{getStatusText()}</p>
          </div>
        </div>
        
        {connection.status === 'connected' && (
          <button
            onClick={handleDisconnect}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            <Power className="w-4 h-4" />
            Déconnecter
          </button>
        )}
      </div>

      {/* Connection Method Selection */}
      {connection.status === 'disconnected' && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Méthode de connexion</h3>
          <div className="flex gap-4">
            <button
              onClick={() => setConnectionMethod('qr')}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                connectionMethod === 'qr'
                  ? 'border-whatsapp-green bg-whatsapp-green/10 text-whatsapp-green'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <QrCode className="w-5 h-5" />
              QR Code
            </button>
            <button
              onClick={() => setConnectionMethod('pairing')}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                connectionMethod === 'pairing'
                  ? 'border-whatsapp-green bg-whatsapp-green/10 text-whatsapp-green'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <Key className="w-5 h-5" />
              Code de jumelage
            </button>
          </div>
        </div>
      )}

      {/* QR Code Display */}
      {connection.status === 'connecting' && connectionMethod === 'qr' && connection.qr && (
        <div className="mb-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Scannez le QR Code avec WhatsApp
            </h3>
            <div className="qr-container inline-block">
              <img
                src={connection.qr}
                alt="QR Code WhatsApp"
                className="w-64 h-64 mx-auto"
              />
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Ouvrez WhatsApp sur votre téléphone > Menu > Appareils liés > Lier un appareil
            </p>
          </div>
        </div>
      )}

      {/* Pairing Code Display */}
      {connection.status === 'connecting' && connectionMethod === 'pairing' && connection.pairingCode && (
        <div className="mb-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Code de jumelage
            </h3>
            <div className="bg-gray-100 p-6 rounded-lg">
              <div className="text-4xl font-mono font-bold text-whatsapp-green mb-4">
                {connection.pairingCode}
              </div>
              <p className="text-sm text-gray-600">
                Entrez ce code dans WhatsApp pour vous connecter
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Connection Controls */}
      {connection.status === 'disconnected' && (
        <div className="text-center">
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="flex items-center gap-2 px-8 py-3 bg-whatsapp-green hover:bg-whatsapp-green-dark text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
          >
            {isConnecting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Smartphone className="w-5 h-5" />
            )}
            {isConnecting ? 'Connexion...' : 'Se connecter'}
          </button>
        </div>
      )}

      {/* Connected Info */}
      {connection.status === 'connected' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <h3 className="text-lg font-semibold text-green-800">
              Connexion établie avec succès !
            </h3>
          </div>
          <div className="space-y-2 text-sm text-green-700">
            {connection.connectedAt && (
              <p>
                <strong>Connecté depuis :</strong>{' '}
                {connection.connectedAt.toLocaleString('fr-FR')}
              </p>
            )}
            <p>
              <strong>ID de session :</strong> {connection.id}
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {connection.status === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <h3 className="text-lg font-semibold text-red-800">
              Erreur de connexion
            </h3>
          </div>
          <p className="text-red-700 mb-4">
            Impossible de se connecter à WhatsApp. Veuillez réessayer.
          </p>
          <button
            onClick={handleConnect}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Réessayer
          </button>
        </div>
      )}
    </div>
  );
}