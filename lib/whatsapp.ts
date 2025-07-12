import { Client, LocalAuth, MessageMedia } from 'whatsapp-web.js';
import QRCode from 'qrcode';
import { eventManager } from './eventManager';
import { WhatsAppConnection } from '@/types';

export class WhatsAppService {
  private client: Client | null = null;
  private connection: WhatsAppConnection = {
    id: 'default',
    status: 'disconnected'
  };

  constructor() {
    this.initializeClient();
  }

  private initializeClient() {
    if (this.client) {
      return;
    }

    this.client = new Client({
      authStrategy: new LocalAuth({
        clientId: 'whatsapp-ai-bot'
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
          '--single-process',
          '--disable-gpu',
          '--disable-extensions',
          '--disable-default-apps',
          '--disable-web-security',
          '--disable-features=TranslateUI'
        ]
      }
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    if (!this.client) return;

    this.client.on('qr', async (qr: string) => {
      console.log('QR Code received:', qr);
      try {
        const qrImageUrl = await QRCode.toDataURL(qr);
        this.connection = {
          ...this.connection,
          status: 'connecting',
          qr: qrImageUrl
        };
        eventManager.emit('qr', qrImageUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
        eventManager.emit('error', error);
      }
    });

    this.client.on('code', (code: string) => {
      console.log('Pairing code received:', code);
      this.connection = {
        ...this.connection,
        status: 'connecting',
        pairingCode: code
      };
      eventManager.emit('pairingCode', code);
    });

    this.client.on('ready', () => {
      console.log('WhatsApp client is ready!');
      this.connection = {
        ...this.connection,
        status: 'connected',
        connectedAt: new Date(),
        qr: undefined,
        pairingCode: undefined
      };
      eventManager.emit('connected');
    });

    this.client.on('authenticated', () => {
      console.log('WhatsApp client is authenticated!');
      eventManager.emit('authenticated');
    });

    this.client.on('auth_failure', (msg: string) => {
      console.error('Authentication failed:', msg);
      this.connection = {
        ...this.connection,
        status: 'error'
      };
      eventManager.emit('error', msg);
    });

    this.client.on('disconnected', (reason: string) => {
      console.log('WhatsApp client disconnected:', reason);
      this.connection = {
        ...this.connection,
        status: 'disconnected'
      };
      eventManager.emit('disconnected', reason);
    });

    this.client.on('message', (message: any) => {
      this.handleIncomingMessage(message);
    });
  }

  private async handleIncomingMessage(message: any) {
    try {
      const contact = await message.getContact();
      const chat = await message.getChat();
      
      const messageData = {
        id: message.id.id,
        content: message.body,
        from: contact.name || contact.pushname || contact.number,
        fromNumber: contact.number,
        timestamp: new Date(message.timestamp * 1000),
        isGroup: chat.isGroup,
        chatId: message.from,
        fromMe: message.fromMe
      };

      eventManager.emit('message', messageData);
    } catch (error) {
      console.error('Error handling incoming message:', error);
      eventManager.emit('error', error);
    }
  }

  async connect() {
    if (!this.client) {
      this.initializeClient();
    }
    
    try {
      this.connection.status = 'connecting';
      eventManager.emit('connecting');
      await this.client!.initialize();
    } catch (error) {
      console.error('Failed to connect WhatsApp:', error);
      this.connection.status = 'error';
      eventManager.emit('error', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.destroy();
      this.client = null;
    }
    this.connection.status = 'disconnected';
    eventManager.emit('disconnected');
  }

  async sendMessage(chatId: string, content: string, imageUrl?: string) {
    if (!this.client || this.connection.status !== 'connected') {
      throw new Error('WhatsApp client not connected');
    }

    try {
      if (imageUrl) {
        const media = await MessageMedia.fromUrl(imageUrl);
        await this.client.sendMessage(chatId, media, { caption: content });
      } else {
        await this.client.sendMessage(chatId, content);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  getConnection(): WhatsAppConnection {
    return this.connection;
  }

  async getChats() {
    if (!this.client || this.connection.status !== 'connected') {
      return [];
    }

    try {
      const chats = await this.client.getChats();
      return chats.map(chat => ({
        id: chat.id._serialized,
        name: chat.name,
        isGroup: chat.isGroup,
        unreadCount: chat.unreadCount,
        lastMessage: chat.lastMessage?.body || '',
        timestamp: chat.lastMessage?.timestamp ? new Date(chat.lastMessage.timestamp * 1000) : new Date()
      }));
    } catch (error) {
      console.error('Failed to get chats:', error);
      return [];
    }
  }

  isConnected(): boolean {
    return this.connection.status === 'connected';
  }

  // Méthodes pour obtenir les informations du client
  async getClientInfo() {
    if (!this.client || !this.isConnected()) {
      return null;
    }

    try {
      const info = this.client.info;
      return {
        wid: info.wid,
        pushname: info.pushname,
        platform: info.platform,
        phone: info.phone
      };
    } catch (error) {
      console.error('Failed to get client info:', error);
      return null;
    }
  }

  // Méthode pour redémarrer le client
  async restart() {
    try {
      await this.disconnect();
      await new Promise(resolve => setTimeout(resolve, 2000));
      await this.connect();
    } catch (error) {
      console.error('Failed to restart WhatsApp client:', error);
      throw error;
    }
  }

  // Méthodes pour gérer les événements
  on(event: string, callback: (...args: any[]) => void) {
    eventManager.on(event, callback);
  }

  off(event: string, callback: (...args: any[]) => void) {
    eventManager.off(event, callback);
  }
}

export const whatsappService = new WhatsAppService();