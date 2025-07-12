const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('../utils/logger');

class GeminiService {
  constructor() {
    this.genAI = null;
    this.model = null;
    this.visionModel = null;
    this.initialize();
  }

  initialize() {
    try {
      if (!process.env.GEMINI_API_KEY) {
        logger.warn('Clé API Gemini non configurée');
        return;
      }

      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      this.visionModel = this.genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
      
      logger.info('Service Gemini initialisé');
    } catch (error) {
      logger.error('Erreur initialisation Gemini:', error);
    }
  }

  async generateMessage(prompt, context = null) {
    if (!this.model) {
      throw new Error('Service Gemini non initialisé');
    }

    try {
      let fullPrompt = `Tu es un assistant IA intelligent et amical qui aide les utilisateurs via WhatsApp. 
      Réponds de manière naturelle, concise et utile. 
      Utilise des emojis appropriés pour rendre la conversation plus engageante.
      
      Contexte: ${context || 'Aucun contexte spécifique'}
      
      Demande de l'utilisateur: ${prompt}
      
      Réponse:`;

      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      logger.info('Message IA généré avec succès');
      return text;
    } catch (error) {
      logger.error('Erreur génération message IA:', error);
      throw error;
    }
  }

  async generateContextualMessage(prompt, messageHistory = []) {
    if (!this.model) {
      throw new Error('Service Gemini non initialisé');
    }

    try {
      let contextPrompt = `Tu es un assistant IA intelligent qui communique via WhatsApp. 
      Voici l'historique récent de la conversation:
      
      ${messageHistory.map(msg => `${msg.sender}: ${msg.text}`).join('\n')}
      
      Nouvelle demande: ${prompt}
      
      Réponds de manière naturelle en tenant compte du contexte de la conversation. 
      Utilise des emojis appropriés et garde un ton amical et professionnel.
      
      Réponse:`;

      const result = await this.model.generateContent(contextPrompt);
      const response = await result.response;
      const text = response.text();

      logger.info('Message contextuel IA généré avec succès');
      return text;
    } catch (error) {
      logger.error('Erreur génération message contextuel IA:', error);
      throw error;
    }
  }

  async analyzeImage(imageUrl, prompt = null) {
    if (!this.visionModel) {
      throw new Error('Service Gemini Vision non initialisé');
    }

    try {
      const analysisPrompt = prompt || `Analyse cette image et décris ce que tu vois de manière détaillée et engageante. 
      Inclus des observations intéressantes et des détails pertinents. 
      Utilise des emojis appropriés pour rendre la description vivante.`;

      const imagePart = {
        inlineData: {
          data: await this.fetchImageAsBase64(imageUrl),
          mimeType: 'image/jpeg'
        }
      };

      const result = await this.visionModel.generateContent([analysisPrompt, imagePart]);
      const response = await result.response;
      const text = response.text();

      logger.info('Analyse d\'image IA terminée avec succès');
      return text;
    } catch (error) {
      logger.error('Erreur analyse image IA:', error);
      throw error;
    }
  }

  async generateImageCaption(imageUrl, style = 'engaging') {
    if (!this.visionModel) {
      throw new Error('Service Gemini Vision non initialisé');
    }

    try {
      const styles = {
        engaging: 'Créé une légende engageante et captivante pour cette image, comme pour un post Instagram. Utilise des emojis et un ton enthousiaste.',
        professional: 'Créé une description professionnelle et précise de cette image.',
        funny: 'Créé une légende humoristique et amusante pour cette image. Sois créatif et drôle!',
        poetic: 'Créé une description poétique et artistique de cette image, avec des métaphores et un langage imagé.'
      };

      const prompt = styles[style] || styles.engaging;

      const imagePart = {
        inlineData: {
          data: await this.fetchImageAsBase64(imageUrl),
          mimeType: 'image/jpeg'
        }
      };

      const result = await this.visionModel.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();

      logger.info('Légende d\'image générée avec succès');
      return text;
    } catch (error) {
      logger.error('Erreur génération légende image:', error);
      throw error;
    }
  }

  async fetchImageAsBase64(imageUrl) {
    try {
      const axios = require('axios');
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      return Buffer.from(response.data, 'binary').toString('base64');
    } catch (error) {
      logger.error('Erreur téléchargement image:', error);
      throw error;
    }
  }

  async generateSmartReply(incomingMessage, context = null) {
    if (!this.model) {
      throw new Error('Service Gemini non initialisé');
    }

    try {
      const prompt = `L'utilisateur t'a envoyé ce message: "${incomingMessage}"
      
      Contexte: ${context || 'Conversation WhatsApp'}
      
      Génère une réponse intelligente, utile et naturelle. 
      - Si c'est une question, réponds de manière informative
      - Si c'est une salutation, réponds amicalement
      - Si c'est une demande d'aide, propose des solutions
      - Utilise des emojis appropriés
      - Garde un ton conversationnel et amical
      - Sois concis mais complet
      
      Réponse:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      logger.info('Réponse intelligente générée avec succès');
      return text;
    } catch (error) {
      logger.error('Erreur génération réponse intelligente:', error);
      throw error;
    }
  }

  isAvailable() {
    return this.model !== null && this.visionModel !== null;
  }
}

module.exports = GeminiService;