const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

const WhatsAppService = require('./services/whatsapp');
const GeminiService = require('./services/gemini');
const ImageService = require('./services/images');
const logger = require('./utils/logger');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "ws:", "wss:"]
    }
  }
}));
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Services
const whatsappService = new WhatsAppService();
const geminiService = new GeminiService();
const imageService = new ImageService();

// Socket.io connection
io.on('connection', (socket) => {
  logger.info('Client connecté:', socket.id);

  // Événements WhatsApp
  socket.on('start-whatsapp', async () => {
    try {
      await whatsappService.initialize(socket);
    } catch (error) {
      logger.error('Erreur initialisation WhatsApp:', error);
      socket.emit('error', 'Erreur lors de l\'initialisation WhatsApp');
    }
  });

  socket.on('send-message', async (data) => {
    try {
      const { number, message, includeImage } = data;
      
      let finalMessage = message;
      let media = null;

      if (includeImage) {
        const imageUrl = await imageService.getRandomImage();
        media = await imageService.prepareMediaForWhatsApp(imageUrl);
      }

      await whatsappService.sendMessage(number, finalMessage, media);
      socket.emit('message-sent', { success: true });
    } catch (error) {
      logger.error('Erreur envoi message:', error);
      socket.emit('message-sent', { success: false, error: error.message });
    }
  });

  socket.on('disconnect', () => {
    logger.info('Client déconnecté:', socket.id);
  });
});

// API Routes
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'online',
    whatsapp: whatsappService.isReady(),
    timestamp: new Date().toISOString()
  });
});

app.post('/api/generate-ai-message', async (req, res) => {
  try {
    const { prompt, context } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt requis' });
    }

    const aiMessage = await geminiService.generateMessage(prompt, context);
    res.json({ message: aiMessage });
  } catch (error) {
    logger.error('Erreur génération IA:', error);
    res.status(500).json({ error: 'Erreur lors de la génération du message IA' });
  }
});

app.post('/api/analyze-image', async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ error: 'URL d\'image requise' });
    }

    const analysis = await geminiService.analyzeImage(imageUrl);
    res.json({ analysis });
  } catch (error) {
    logger.error('Erreur analyse image:', error);
    res.status(500).json({ error: 'Erreur lors de l\'analyse de l\'image' });
  }
});

app.get('/api/random-image', async (req, res) => {
  try {
    const { category = 'nature' } = req.query;
    const imageUrl = await imageService.getRandomImage(category);
    res.json({ imageUrl });
  } catch (error) {
    logger.error('Erreur récupération image:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'image' });
  }
});

// Serve client
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  logger.error('Erreur serveur:', err);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  logger.info(`Serveur démarré sur le port ${PORT}`);
});

module.exports = app;