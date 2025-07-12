import { whatsappService } from './whatsapp';
import { aiService } from './ai';
import { imageSearchService } from './imageSearch';
import { AIMessage } from '@/types';

export class BotService {
  private messageHistory: Map<string, AIMessage[]> = new Map();
  private initialized = false;

  constructor() {
    this.initializeBot();
  }

  private initializeBot() {
    if (this.initialized) return;
    
    // Écouter les événements de connexion
    whatsappService.on('connected', () => {
      console.log('Bot WhatsApp connecté et prêt !');
    });

    whatsappService.on('disconnected', () => {
      console.log('Bot WhatsApp déconnecté');
      this.messageHistory.clear();
    });

    // Écouter les messages entrants
    whatsappService.on('message', this.handleIncomingMessage.bind(this));

    this.initialized = true;
  }

  private async handleIncomingMessage(messageData: any) {
    try {
      const config = aiService.getConfig();
      
      // Vérifier si le bot doit répondre
      if (!config.aiEnabled || !config.autoReply) {
        return;
      }

      // Éviter de répondre à nos propres messages
      if (messageData.fromMe) {
        return;
      }

      // Obtenir l'historique des messages pour ce chat
      const chatId = messageData.chatId;
      const history = this.messageHistory.get(chatId) || [];
      
      // Ajouter le message entrant à l'historique
      const userMessage: AIMessage = {
        id: messageData.id,
        content: messageData.content,
        role: 'user',
        timestamp: messageData.timestamp,
        hasImage: false
      };

      history.push(userMessage);

      // Générer une réponse avec l'IA
      const response = await aiService.generateResponse(
        messageData.content,
        history.slice(-10) // Garder seulement les 10 derniers messages
      );

      let imageUrl: string | undefined = undefined;
      
      // Rechercher une image si nécessaire
      if (response.needsImage && config.includeImages && response.imageQuery) {
        try {
          const images = await imageSearchService.searchImages(response.imageQuery, 1);
          if (images.length > 0) {
            imageUrl = images[0].url;
          }
        } catch (error) {
          console.error('Erreur lors de la recherche d\'images:', error);
        }
      }

      // Attendre le délai configuré avant de répondre
      if (config.replyDelay > 0) {
        await this.delay(config.replyDelay);
      }

      // Envoyer la réponse
      await whatsappService.sendMessage(chatId, response.text, imageUrl);

      // Ajouter la réponse du bot à l'historique
      const botMessage: AIMessage = {
        id: `bot_${Date.now()}`,
        content: response.text,
        role: 'assistant',
        timestamp: new Date(),
        hasImage: !!imageUrl,
        imageUrl
      };

      history.push(botMessage);

      // Mettre à jour l'historique (limite à 20 messages)
      if (history.length > 20) {
        history.splice(0, history.length - 20);
      }

      this.messageHistory.set(chatId, history);

      console.log(`Réponse envoyée à ${messageData.from}: ${response.text}`);
      
    } catch (error) {
      console.error('Erreur lors du traitement du message:', error);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Méthodes publiques pour l'API
  public async sendMessage(chatId: string, message: string, context?: AIMessage[]) {
    const config = aiService.getConfig();
    
    if (!config.aiEnabled) {
      throw new Error('Le bot IA n\'est pas activé');
    }

    // Générer une réponse
    const response = await aiService.generateResponse(message, context || []);

    let imageUrl: string | undefined = undefined;
    
    // Rechercher une image si nécessaire
    if (response.needsImage && config.includeImages && response.imageQuery) {
      try {
        const images = await imageSearchService.searchImages(response.imageQuery, 1);
        if (images.length > 0) {
          imageUrl = images[0].url;
        }
      } catch (error) {
        console.error('Erreur lors de la recherche d\'images:', error);
      }
    }

    // Envoyer le message
    await whatsappService.sendMessage(chatId, response.text, imageUrl);

    return {
      text: response.text,
      hasImage: !!imageUrl,
      imageUrl,
      needsImage: response.needsImage,
      imageQuery: response.imageQuery
    };
  }

  public getMessageHistory(chatId: string): AIMessage[] {
    return this.messageHistory.get(chatId) || [];
  }

  public clearMessageHistory(chatId?: string) {
    if (chatId) {
      this.messageHistory.delete(chatId);
    } else {
      this.messageHistory.clear();
    }
  }

  public getConnectionStatus() {
    return whatsappService.getConnection();
  }

  public async connectWhatsApp() {
    return whatsappService.connect();
  }

  public async disconnectWhatsApp() {
    return whatsappService.disconnect();
  }

  public async getChats() {
    return whatsappService.getChats();
  }

  public isWhatsAppConnected(): boolean {
    return whatsappService.isConnected();
  }
}

export const botService = new BotService();