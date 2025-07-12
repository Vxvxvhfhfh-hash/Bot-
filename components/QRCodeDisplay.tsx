'use client';

import { useState, useEffect } from 'react';
import { WhatsAppConnection } from '@/types';
import { QrCode, Smartphone, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface QRCodeDisplayProps {
  connection: WhatsAppConnection;
  onConnect: () => void;
  onDisconnect: () => void;
  isLoading: boolean;
}

export function QRCodeDisplay({ connection, onConnect, onDisconnect, isLoading }: QRCodeDisplayProps) {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  useEffect(() => {
    if (connection.status === 'connecting' && connection.qr) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [connection.status, connection.qr]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600';
      case 'connecting': return 'text-blue-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'connecting': return <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />;
      case 'error': return <XCircle className="w-6 h-6 text-red-600" />;
      default: return <Smartphone className="w-6 h-6 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return 'Connecté';
      case 'connecting': return 'Connexion en cours...';
      case 'error': return 'Erreur de connexion';
      default: return 'Déconnecté';
    }
  };

  return (
    <div className="text-center">
      <div className="mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          {getStatusIcon(connection.status)}
          <h2 className={`text-2xl font-bold ${getStatusColor(connection.status)}`}>
            {getStatusText(connection.status)}
          </h2>
        </div>
        
        {connection.connectedAt && (
          <p className="text-gray-600">
            Connecté depuis {connection.connectedAt.toLocaleString('fr-FR')}
          </p>
        )}
      </div>

      {connection.status === 'disconnected' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <QrCode className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Connexion WhatsApp
            </h3>
            <p className="text-blue-700 mb-4">
              Cliquez sur le bouton ci-dessous pour générer un QR code et connecter votre téléphone.
            </p>
            <button
              onClick={onConnect}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Connexion...
                </>
              ) : (
                <>
                  <Smartphone className="w-5 h-5" />
                  Se connecter
                </>
              )}
            </button>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-3">Instructions :</h4>
            <ol className="text-left text-gray-700 space-y-2">
              <li>1. Ouvrez WhatsApp sur votre téléphone</li>
              <li>2. Allez dans Paramètres → Appareils connectés</li>
              <li>3. Appuyez sur "Connecter un appareil"</li>
              <li>4. Scannez le QR code qui apparaîtra ici</li>
            </ol>
          </div>
        </div>
      )}

      {connection.status === 'connecting' && connection.qr && (
        <div className="space-y-6">
          <div className="bg-white border-2 border-green-300 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-4">
              Scannez ce QR code avec WhatsApp
            </h3>
            <div className="flex justify-center mb-4">
              <img
                src={connection.qr}
                alt="QR Code WhatsApp"
                className="w-64 h-64 border-2 border-gray-300 rounded-lg"
              />
            </div>
            <div className="text-center">
              <p className="text-gray-600 mb-2">
                Temps restant : <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
              </p>
              <p className="text-sm text-gray-500">
                Le QR code expire automatiquement après 5 minutes
              </p>
            </div>
          </div>

          <button
            onClick={onConnect}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Rafraîchir le QR code
          </button>
        </div>
      )}

      {connection.status === 'connected' && (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              Connexion établie !
            </h3>
            <p className="text-green-700 mb-4">
              Votre bot WhatsApp est maintenant connecté et prêt à fonctionner.
            </p>
            <p className="text-sm text-green-600">
              Vous pouvez maintenant passer à l'onglet Chat pour voir les conversations.
            </p>
          </div>

          <button
            onClick={onDisconnect}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Se déconnecter
          </button>
        </div>
      )}

      {connection.status === 'error' && (
        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              Erreur de connexion
            </h3>
            <p className="text-red-700 mb-4">
              Une erreur s'est produite lors de la connexion. Veuillez réessayer.
            </p>
          </div>

          <button
            onClick={onConnect}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Reconnexion...
              </>
            ) : (
              'Réessayer'
            )}
          </button>
        </div>
      )}
    </div>
  );
}