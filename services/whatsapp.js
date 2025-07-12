const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const logger = require('../utils/logger');

class WhatsAppService {
  constructor() {
    this.client = null;
    this.isInitialized = false;
    this.isReady = false;
    this.socket = null;
  }

  async initialize(socket) {
    this.socket = socket;
    
    try {
      // Créer une nouvelle instance du client WhatsApp
      this.client = new Client({
        authStrategy: new LocalAuth({
          clientId: process.env.WHATSAPP_SESSION_NAME || 'whatsapp-ai-bot'
        }),
        puppeteer: {
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
          ]
        }
      });

      // Gestion des événements
      this.client.on('qr', async (qr) => {
        logger.info('QR Code généré');
        const qrCodeDataURL = await qrcode.toDataURL(qr);
        this.socket.emit('qr-code', { qrCode: qrCodeDataURL });
      });

      this.client.on('ready', () => {
        logger.info('Client WhatsApp prêt');
        this.isReady = true;
        this.socket.emit('whatsapp-ready');
      });

      this.client.on('authenticated', () => {
        logger.info('Client WhatsApp authentifié');
        this.socket.emit('whatsapp-authenticated');
      });

      this.client.on('auth_failure', (msg) => {
        logger.error('Échec de l\'authentification:', msg);
        this.socket.emit('auth-failure', msg);
      });

      this.client.on('disconnected', (reason) => {
        logger.info('Client WhatsApp déconnecté:', reason);
        this.isReady = false;
        this.socket.emit('whatsapp-disconnected', reason);
      });

      // Gestion des messages entrants
      this.client.on('message', async (message) => {
        if (!message.fromMe && message.body) {
          logger.info(`Message reçu de ${message.from}: ${message.body}`);
          this.socket.emit('message-received', {
            from: message.from,
            body: message.body,
            timestamp: message.timestamp
          });
        }
      });

      // Initialiser le client
      await this.client.initialize();
      this.isInitialized = true;
      
      logger.info('Service WhatsApp initialisé');
      
    } catch (error) {
      logger.error('Erreur lors de l\'initialisation WhatsApp:', error);
      throw error;
    }
  }

  async sendMessage(number, message, media = null) {
    if (!this.isReady) {
      throw new Error('WhatsApp n\'est pas prêt');
    }

    try {
      // Formater le numéro
      const formattedNumber = this.formatNumber(number);
      
      if (media) {
        // Envoyer avec média
        await this.client.sendMessage(formattedNumber, media, { caption: message });
      } else {
        // Envoyer message texte
        await this.client.sendMessage(formattedNumber, message);
      }
      
      logger.info(`Message envoyé à ${formattedNumber}: ${message}`);
      
    } catch (error) {
      logger.error('Erreur envoi message:', error);
      throw error;
    }
  }

  formatNumber(number) {
    // Supprimer tous les caractères non numériques
    let formatted = number.replace(/\D/g, '');
    
    // Ajouter l'indicatif international si nécessaire
    if (!formatted.startsWith('33') && formatted.length === 10) {
      formatted = '33' + formatted.substring(1);
    }
    
    return formatted + '@c.us';
  }

  async getContacts() {
    if (!this.isReady) {
      throw new Error('WhatsApp n\'est pas prêt');
    }

    try {
      const contacts = await this.client.getContacts();
      return contacts.map(contact => ({
        id: contact.id.user,
        name: contact.name || contact.pushname,
        isMyContact: contact.isMyContact
      }));
    } catch (error) {
      logger.error('Erreur récupération contacts:', error);
      throw error;
    }
  }

  async getChats() {
    if (!this.isReady) {
      throw new Error('WhatsApp n\'est pas prêt');
    }

    try {
      const chats = await this.client.getChats();
      return chats.map(chat => ({
        id: chat.id._serialized,
        name: chat.name,
        isGroup: chat.isGroup,
        unreadCount: chat.unreadCount,
        lastMessage: chat.lastMessage
      }));
    } catch (error) {
      logger.error('Erreur récupération chats:', error);
      throw error;
    }
  }

  isReady() {
    return this.isReady;
  }

  async disconnect() {
    if (this.client) {
      await this.client.destroy();
      this.isReady = false;
      this.isInitialized = false;
    }
  }
}

module.exports = WhatsAppService;