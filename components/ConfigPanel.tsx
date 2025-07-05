'use client';

import { useState } from 'react';
import { Save, Settings, Zap, Image, MessageSquare, Clock, RefreshCw } from 'lucide-react';
import { BotConfig } from '@/types';

interface Props {
  config: BotConfig;
  setConfig: (config: BotConfig) => void;
}

export default function ConfigPanel({ config, setConfig }: Props) {
  const [localConfig, setLocalConfig] = useState<BotConfig>(config);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const response = await fetch('/api/config/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(localConfig),
      });

      if (!response.ok) {
        throw new Error('Failed to save config');
      }

      setConfig(localConfig);
      
      // Afficher un message de succès
      console.log('Configuration sauvegardée avec succès');
    } catch (error) {
      console.error('Error saving config:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    const defaultConfig: BotConfig = {
      aiEnabled: true,
      autoReply: true,
      replyDelay: 2000,
      includeImages: true,
      imageKeywords: ['image', 'photo', 'picture', 'show', 'voir', 'photo'],
      personalityPrompt: 'Tu es un assistant IA amical et serviable qui répond en français. Tu es intégré dans un bot WhatsApp et tu dois répondre de manière naturelle et conversationnelle. Sois concis mais informatif.'
    };
    setLocalConfig(defaultConfig);
  };

  const updateConfig = (key: keyof BotConfig, value: any) => {
    setLocalConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Settings className="w-6 h-6 text-whatsapp-green" />
        <h2 className="text-2xl font-bold text-gray-800">Configuration du Bot</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Paramètres généraux */}
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-whatsapp-green" />
              <h3 className="text-lg font-semibold text-gray-800">Paramètres généraux</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-700">IA activée</label>
                  <p className="text-sm text-gray-500">Activer les réponses automatiques par IA</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localConfig.aiEnabled}
                    onChange={(e) => updateConfig('aiEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-whatsapp-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-whatsapp-green"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-700">Réponse automatique</label>
                  <p className="text-sm text-gray-500">Répondre automatiquement aux messages</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localConfig.autoReply}
                    onChange={(e) => updateConfig('autoReply', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-whatsapp-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-whatsapp-green"></div>
                </label>
              </div>

              <div>
                <label className="flex items-center gap-2 font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4" />
                  Délai de réponse (ms)
                </label>
                <input
                  type="number"
                  value={localConfig.replyDelay}
                  onChange={(e) => updateConfig('replyDelay', parseInt(e.target.value))}
                  min="0"
                  max="10000"
                  step="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-whatsapp-green focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Délai avant d'envoyer la réponse (0-10000ms)
                </p>
              </div>
            </div>
          </div>

          {/* Paramètres des images */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Image className="w-5 h-5 text-whatsapp-green" />
              <h3 className="text-lg font-semibold text-gray-800">Paramètres des images</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-700">Inclure des images</label>
                  <p className="text-sm text-gray-500">Rechercher et envoyer des images automatiquement</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localConfig.includeImages}
                    onChange={(e) => updateConfig('includeImages', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-whatsapp-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-whatsapp-green"></div>
                </label>
              </div>

              <div>
                <label className="font-medium text-gray-700 mb-2 block">
                  Mots-clés pour les images
                </label>
                <input
                  type="text"
                  value={localConfig.imageKeywords.join(', ')}
                  onChange={(e) => updateConfig('imageKeywords', e.target.value.split(', ').map(k => k.trim()))}
                  placeholder="image, photo, picture, show, voir"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-whatsapp-green focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Mots-clés séparés par des virgules qui déclenchent la recherche d'images
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Personnalité de l'IA */}
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-whatsapp-green" />
              <h3 className="text-lg font-semibold text-gray-800">Personnalité de l'IA</h3>
            </div>
            
            <div>
              <label className="font-medium text-gray-700 mb-2 block">
                Prompt de personnalité
              </label>
              <textarea
                value={localConfig.personalityPrompt}
                onChange={(e) => updateConfig('personalityPrompt', e.target.value)}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-whatsapp-green focus:border-transparent resize-none"
                placeholder="Décrivez la personnalité et le comportement souhaité pour l'IA..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Instructions pour définir la personnalité et le style de réponse de l'IA
              </p>
            </div>
          </div>

          {/* Aperçu de la configuration */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Aperçu de la configuration</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">IA activée:</span>
                <span className={localConfig.aiEnabled ? 'text-green-600' : 'text-red-600'}>
                  {localConfig.aiEnabled ? 'Oui' : 'Non'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Réponse automatique:</span>
                <span className={localConfig.autoReply ? 'text-green-600' : 'text-red-600'}>
                  {localConfig.autoReply ? 'Oui' : 'Non'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Délai de réponse:</span>
                <span className="text-gray-800">{localConfig.replyDelay}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Images incluses:</span>
                <span className={localConfig.includeImages ? 'text-green-600' : 'text-red-600'}>
                  {localConfig.includeImages ? 'Oui' : 'Non'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mots-clés d'images:</span>
                <span className="text-gray-800">{localConfig.imageKeywords.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Réinitialiser
        </button>
        
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2 bg-whatsapp-green hover:bg-whatsapp-green-dark text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Sauvegarde...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Sauvegarder
            </>
          )}
        </button>
      </div>
    </div>
  );
}