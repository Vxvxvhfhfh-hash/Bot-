'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Image, MessageCircle, Clock } from 'lucide-react';
import { WhatsAppConnection, BotConfig, AIMessage } from '@/types';

interface Props {
  connection: WhatsAppConnection;
  config: BotConfig;
}

export default function ChatInterface({ connection, config }: Props) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || connection.status !== 'connected') return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      content: newMessage,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: newMessage,
          context: messages.slice(-5), // Derniers 5 messages pour contexte
          config
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      const aiMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: 'assistant',
        timestamp: new Date(),
        hasImage: data.hasImage,
        imageUrl: data.imageUrl
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Désolé, je n\'ai pas pu traiter votre message. Veuillez réessayer.',
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (connection.status !== 'connected') {
    return (
      <div className="text-center py-12">
        <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          WhatsApp non connecté
        </h3>
        <p className="text-gray-500">
          Veuillez vous connecter à WhatsApp pour utiliser le chat.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Chat Header */}
      <div className="bg-whatsapp-green text-white p-4 rounded-t-lg">
        <div className="flex items-center gap-3">
          <Bot className="w-8 h-8" />
          <div>
            <h3 className="font-semibold">Assistant IA WhatsApp</h3>
            <p className="text-sm text-whatsapp-green-light">
              {config.aiEnabled ? 'IA activée' : 'IA désactivée'} • 
              {config.autoReply ? ' Réponse automatique' : ' Réponse manuelle'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="chat-container border-x border-gray-200 bg-whatsapp-gray min-h-[400px] max-h-[600px]">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bot className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>Aucun message pour le moment.</p>
            <p className="text-sm mt-2">Commencez une conversation !</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-whatsapp-green text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 opacity-75" />
                    ) : (
                      <Bot className="w-4 h-4 opacity-75" />
                    )}
                    <span className="text-xs opacity-75">
                      {message.role === 'user' ? 'Vous' : 'Assistant'}
                    </span>
                  </div>
                  
                  <p className="text-sm leading-relaxed mb-2">{message.content}</p>
                  
                  {message.hasImage && message.imageUrl && (
                    <div className="mt-2">
                      <img
                        src={message.imageUrl}
                        alt="Image partagée"
                        className="max-w-full h-auto rounded-lg"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1 mt-2">
                    <Clock className="w-3 h-3 opacity-50" />
                    <span className="text-xs opacity-50">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 rounded-lg rounded-bl-none shadow-sm px-4 py-2 max-w-xs">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 opacity-75" />
                    <span className="text-xs opacity-75">Assistant</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                    <span className="text-xs text-gray-500">En train d'écrire...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border border-gray-200 rounded-b-lg bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Tapez votre message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-whatsapp-green focus:border-transparent"
            disabled={!config.aiEnabled || isLoading}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || !config.aiEnabled || isLoading}
            className="px-4 py-2 bg-whatsapp-green hover:bg-whatsapp-green-dark text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        {!config.aiEnabled && (
          <p className="text-xs text-amber-600 mt-2">
            L'IA est désactivée. Activez-la dans la configuration pour envoyer des messages.
          </p>
        )}
      </form>
    </div>
  );
}