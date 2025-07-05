const { createServer } = require('http');
const { Server } = require('socket.io');
const { whatsappService } = require('./lib/whatsapp');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  // Événements WhatsApp
  whatsappService.on('qr', (qr) => {
    console.log('QR Code généré');
    io.emit('whatsapp-event', {
      type: 'qr',
      data: qr
    });
  });

  whatsappService.on('pairingCode', (code) => {
    console.log('Code de jumelage généré:', code);
    io.emit('whatsapp-event', {
      type: 'pairingCode',
      data: code
    });
  });

  whatsappService.on('connected', () => {
    console.log('WhatsApp connecté');
    io.emit('whatsapp-event', {
      type: 'connected',
      data: true
    });
  });

  whatsappService.on('disconnected', (reason) => {
    console.log('WhatsApp déconnecté:', reason);
    io.emit('whatsapp-event', {
      type: 'disconnected',
      data: reason
    });
  });

  whatsappService.on('error', (error) => {
    console.error('Erreur WhatsApp:', error);
    io.emit('whatsapp-event', {
      type: 'error',
      data: error.message
    });
  });

  whatsappService.on('message', (message) => {
    console.log('Message reçu:', message);
    io.emit('whatsapp-event', {
      type: 'message',
      data: message
    });
  });

  // Connexions WebSocket
  io.on('connection', (socket) => {
    console.log('Client connecté:', socket.id);
    
    // Envoyer le statut actuel
    const connection = whatsappService.getConnection();
    socket.emit('whatsapp-event', {
      type: 'status',
      data: connection
    });

    socket.on('disconnect', () => {
      console.log('Client déconnecté:', socket.id);
    });
  });

  const PORT = process.env.PORT || 3000;
  
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📱 WhatsApp AI Bot prêt !`);
  });
});