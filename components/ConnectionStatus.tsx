'use client';

import { WhatsAppConnection } from '@/types';
import { Wifi, WifiOff, Loader2, AlertCircle } from 'lucide-react';

interface ConnectionStatusProps {
  connection: WhatsAppConnection;
}

export function ConnectionStatus({ connection }: ConnectionStatusProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 border-green-200 text-green-800';
      case 'connecting': return 'bg-blue-100 border-blue-200 text-blue-800';
      case 'error': return 'bg-red-100 border-red-200 text-red-800';
      default: return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <Wifi className="w-5 h-5" />;
      case 'connecting': return <Loader2 className="w-5 h-5 animate-spin" />;
      case 'error': return <AlertCircle className="w-5 h-5" />;
      default: return <WifiOff className="w-5 h-5" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return 'Connecté à WhatsApp';
      case 'connecting': return 'Connexion en cours...';
      case 'error': return 'Erreur de connexion';
      default: return 'Déconnecté';
    }
  };

  return (
    <div className={`flex items-center justify-center gap-3 px-4 py-3 rounded-lg border-2 ${getStatusColor(connection.status)}`}>
      {getStatusIcon(connection.status)}
      <div className="flex flex-col">
        <span className="font-medium">{getStatusText(connection.status)}</span>
        {connection.connectedAt && (
          <span className="text-sm opacity-75">
            Depuis {connection.connectedAt.toLocaleTimeString('fr-FR')}
          </span>
        )}
      </div>
    </div>
  );
}