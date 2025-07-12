'use client';

import { useState, useEffect } from 'react';
import { Save, Settings, Bot, Image, MessageCircle } from 'lucide-react';

interface BotConfig {
  aiEnabled: boolean;
  autoReply: boolean;
  replyDelay: number;
  includeImages: boolean;
  imageKeywords: string[];
  personalityPrompt: string;
}

export function BotConfig() {
  const [config, setConfig] = useState<BotConfig>({
    aiEnabled: true,
    autoReply: true,
    replyDelay: 2000,
    includeImages: true,
    imageKeywords: ['image', 'photo', 'picture', 'show', 'voir', 'photo', 'image', 'montrer', 'chercher'],
    personalityPrompt: 'Tu es un assistant IA amical et serviable qui répond en français. Tu es intégré dans un bot WhatsApp et tu dois répondre de manière naturelle et conversationnelle. Sois concis mais informatif.'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/bot/config');
      const data = await response.json();
      if (data.config) {
        setConfig(data.config);
      }
    } catch (error) {
      console.error('Error fetching config:', error);
    }
  };

  const saveConfig = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/bot/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config)
      });

      if (response.ok) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      }
    } catch (error) {
      console.error('Error saving config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateConfig = (key: keyof BotConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const addKeyword = () => {
    const newKeyword = prompt('Nouveau mot-clé pour les images:');
    if (newKeyword && !config.imageKeywords.includes(newKeyword.toLowerCase())) {
      updateConfig('imageKeywords', [...config.imageKeywords, newKeyword.toLowerCase()]);
    }
  };

  const removeKeyword = (keyword: string) => {
    updateConfig('imageKeywords', config.imageKeywords.filter(k => k !== keyword));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-8 h-8 text-gray-600" />
        <h2 className="text-2xl font-bold text-gray-900">Configuration du Bot</h2>
      </div>

      {/* General Settings */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Bot className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Paramètres généraux</h3>
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
                checked={config.aiEnabled}
                onChange={(e) => updateConfig('aiEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">Réponse automatique</label>
              <p className="text-sm text-gray-500">Répondre automatiquement aux messages reçus</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.autoReply}
                onChange={(e) => updateConfig('autoReply', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className="font-medium text-gray-700">Délai de réponse (ms)</label>
            <p className="text-sm text-gray-500 mb-2">Délai avant d'envoyer une réponse automatique</p>
            <input
              type="number"
              value={config.replyDelay}
              onChange={(e) => updateConfig('replyDelay', parseInt(e.target.value))}
              min="0"
              max="10000"
              step="500"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* AI Personality */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <MessageCircle className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Personnalité de l'IA</h3>
        </div>
        
        <div>
          <label className="font-medium text-gray-700">Prompt de personnalité</label>
          <p className="text-sm text-gray-500 mb-2">Définit le comportement et le style de réponse de l'IA</p>
          <textarea
            value={config.personalityPrompt}
            onChange={(e) => updateConfig('personalityPrompt', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Décrivez la personnalité souhaitée pour votre bot..."
          />
        </div>
      </div>

      {/* Image Settings */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Image className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Paramètres d'images</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">Inclure des images</label>
              <p className="text-sm text-gray-500">Autoriser le bot à envoyer des images</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.includeImages}
                onChange={(e) => updateConfig('includeImages', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className="font-medium text-gray-700">Mots-clés pour images</label>
            <p className="text-sm text-gray-500 mb-2">Mots qui déclenchent l'envoi d'images</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {config.imageKeywords.map((keyword) => (
                <span
                  key={keyword}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  {keyword}
                  <button
                    onClick={() => removeKeyword(keyword)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <button
              onClick={addKeyword}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
            >
              Ajouter un mot-clé
            </button>
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <button
          onClick={saveConfig}
          disabled={isLoading}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            isSaved
              ? 'bg-green-600 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Save className="w-5 h-5" />
          {isLoading ? 'Sauvegarde...' : isSaved ? 'Sauvegardé !' : 'Sauvegarder'}
        </button>
      </div>
    </div>
  );
}