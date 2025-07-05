export interface WhatsAppConnection {
  id: string;
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  qr?: string;
  pairingCode?: string;
  phoneNumber?: string;
  connectedAt?: Date;
}

export interface AIMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  hasImage?: boolean;
  imageUrl?: string;
}

export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  isGroup: boolean;
  lastMessage?: string;
  unreadCount: number;
  profilePic?: string;
}

export interface ImageResult {
  title: string;
  url: string;
  thumbnail: string;
  contextLink: string;
}

export interface ChatSession {
  contactId: string;
  messages: AIMessage[];
  isActive: boolean;
  lastActivity: Date;
}

export interface BotConfig {
  aiEnabled: boolean;
  autoReply: boolean;
  replyDelay: number;
  includeImages: boolean;
  imageKeywords: string[];
  personalityPrompt: string;
}

export interface WebSocketMessage {
  type: 'qr' | 'connected' | 'disconnected' | 'message' | 'error' | 'pairingCode';
  data: any;
}