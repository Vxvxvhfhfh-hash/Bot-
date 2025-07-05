const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = createServer(app);

// Middleware
app.use(express.static('public'));
app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes
app.post('/api/whatsapp/connect', (req, res) => {
  const { method } = req.body;
  console.log('Connexion WhatsApp demandée:', method);
  
  // Simuler la connexion WhatsApp
  setTimeout(() => {
    io.emit('whatsapp-event', {
      type: 'qr',
      data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
    });
  }, 1000);
  
  res.json({ success: true, message: 'Connexion initiée' });
});

app.post('/api/whatsapp/disconnect', (req, res) => {
  console.log('Déconnexion WhatsApp');
  io.emit('whatsapp-event', {
    type: 'disconnected',
    data: 'Déconnecté'
  });
  res.json({ success: true, message: 'Déconnecté' });
});

app.post('/api/chat/send', (req, res) => {
  const { message } = req.body;
  console.log('Message reçu:', message);
  
  // Simuler une réponse IA
  const responses = [
    "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
    "C'est une excellente question ! Laissez-moi réfléchir...",
    "Je comprends votre demande. Voici ma réponse...",
    "Merci pour votre message ! J'espère que cela vous aide.",
    "N'hésitez pas à me poser d'autres questions !"
  ];
  
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  res.json({
    success: true,
    response: randomResponse,
    hasImage: Math.random() > 0.7,
    imageUrl: Math.random() > 0.7 ? 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80' : null
  });
});

app.post('/api/config/update', (req, res) => {
  const config = req.body;
  console.log('Configuration mise à jour:', config);
  res.json({ success: true, message: 'Configuration sauvegardée' });
});

// Socket.IO connexions
io.on('connection', (socket) => {
  console.log('Client connecté:', socket.id);
  
  socket.emit('whatsapp-event', {
    type: 'status',
    data: { status: 'disconnected' }
  });

  socket.on('disconnect', () => {
    console.log('Client déconnecté:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📱 WhatsApp AI Bot prêt !`);
  console.log(`🌐 Accédez à http://localhost:${PORT}`);
});