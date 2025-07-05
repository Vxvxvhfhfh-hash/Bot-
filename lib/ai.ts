import OpenAI from 'openai';
import { AIMessage, BotConfig } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class AIService {
  private config: BotConfig = {
    aiEnabled: true,
    autoReply: true,
    replyDelay: 2000,
    includeImages: true,
    imageKeywords: ['image', 'photo', 'picture', 'show', 'voir', 'photo', 'image'],
    personalityPrompt: `Tu es un assistant IA amical et serviable qui répond en français. Tu es intégré dans un bot WhatsApp et tu dois répondre de manière naturelle et conversationnelle. Sois concis mais informatif.`
  };

  constructor(config?: Partial<BotConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  async generateResponse(message: string, context: AIMessage[] = []): Promise<{ text: string; needsImage: boolean; imageQuery?: string }> {
    if (!this.config.aiEnabled) {
      return { text: "Le bot IA n'est pas activé.", needsImage: false };
    }

    try {
      const needsImage = this.shouldIncludeImage(message);
      let imageQuery = '';

      if (needsImage) {
        imageQuery = this.extractImageQuery(message);
      }

      const messages = [
        {
          role: 'system' as const,
          content: this.config.personalityPrompt + (needsImage ? ' Si on te demande une image, tu dois répondre en décrivant ce que tu vas chercher et pourquoi.' : '')
        },
        ...context.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        })),
        {
          role: 'user' as const,
          content: message
        }
      ];

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 150,
        temperature: 0.7,
      });

      const text = response.choices[0]?.message?.content || 'Désolé, je ne peux pas répondre pour le moment.';

      return {
        text,
        needsImage,
        imageQuery: needsImage ? imageQuery : undefined
      };
    } catch (error) {
      console.error('Error generating AI response:', error);
      return {
        text: 'Désolé, je rencontre un problème technique. Veuillez réessayer plus tard.',
        needsImage: false
      };
    }
  }

  private shouldIncludeImage(message: string): boolean {
    if (!this.config.includeImages) return false;
    
    const lowerMessage = message.toLowerCase();
    return this.config.imageKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  private extractImageQuery(message: string): string {
    // Extraire les mots-clés pertinents pour la recherche d'images
    const words = message.toLowerCase().split(' ');
    const stopWords = ['une', 'un', 'le', 'la', 'les', 'de', 'du', 'des', 'je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles', 'pour', 'avec', 'sans', 'sur', 'dans', 'par', 'show', 'me', 'a', 'an', 'the', 'of', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'by'];
    
    const relevantWords = words.filter(word => 
      word.length > 2 && 
      !stopWords.includes(word) && 
      !this.config.imageKeywords.includes(word)
    );

    return relevantWords.join(' ') || 'nature beautiful landscape';
  }

  updateConfig(newConfig: Partial<BotConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): BotConfig {
    return this.config;
  }
}

export const aiService = new AIService();