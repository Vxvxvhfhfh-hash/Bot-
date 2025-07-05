import { Client, LocalAuth, MessageMedia } from 'whatsapp-web.js';
import QRCode from 'qrcode';
import { EventEmitter } from 'events';
import { WhatsAppConnection, AIMessage } from '@/types';

export class WhatsAppService extends EventEmitter {
  private client: Client | null = null;
  private connection: WhatsAppConnection = {
    id: 'default',
    status: 'disconnected'
  };

  constructor() {
    super();
    this.initializeClient();
  }

  private initializeClient() {
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
          '--disable-gpu'
        ]
      }
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    if (!this.client) return;

    this.client.on('qr', async (qr: string) => {
      console.log('QR Code received:', qr);
      const qrImageUrl = await QRCode.toDataURL(qr);
      this.connection = {
        ...this.connection,
        status: 'connecting',
        qr: qrImageUrl
      };
      this.emit('qr', qrImageUrl);
    });

    this.client.on('code', (code: string) => {
      console.log('Pairing code received:', code);
      this.connection = {
        ...this.connection,
        status: 'connecting',
        pairingCode: code
      };
      this.emit('pairingCode', code);
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
      this.emit('connected');
    });

    this.client.on('authenticated', () => {
      console.log('WhatsApp client is authenticated!');
      this.emit('authenticated');
    });

    this.client.on('auth_failure', (msg: string) => {
      console.error('Authentication failed:', msg);
      this.connection = {
        ...this.connection,
        status: 'error'
      };
      this.emit('error', msg);
    });

    this.client.on('disconnected', (reason: string) => {
      console.log('WhatsApp client disconnected:', reason);
      this.connection = {
        ...this.connection,
        status: 'disconnected'
      };
      this.emit('disconnected', reason);
    });

    this.client.on('message', (message: any) => {
      this.handleIncomingMessage(message);
    });
  }

  private async handleIncomingMessage(message: any) {
    const contact = await message.getContact();
    const chat = await message.getChat();
    
    const messageData = {
      id: message.id.id,
      content: message.body,
      from: contact.name || contact.pushname || contact.number,
      fromNumber: contact.number,
      timestamp: new Date(message.timestamp * 1000),
      isGroup: chat.isGroup,
      chatId: message.from
    };

    this.emit('message', messageData);
  }

  async connect() {
    if (!this.client) {
      this.initializeClient();
    }
    
    try {
      this.connection.status = 'connecting';
      await this.client!.initialize();
    } catch (error) {
      console.error('Failed to connect WhatsApp:', error);
      this.connection.status = 'error';
      this.emit('error', error);
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.destroy();
      this.client = null;
    }
    this.connection.status = 'disconnected';
    this.emit('disconnected');
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
}

export const whatsappService = new WhatsAppService();