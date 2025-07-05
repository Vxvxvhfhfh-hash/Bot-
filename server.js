import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const server = createServer(app);
const io = new Server(server);

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

// API Routes
app.post('/api/whatsapp/connect', (req, res) => {
  console.log('Connexion WhatsApp demandée');
  res.json({ success: true, message: 'Connexion initiée' });
});

app.post('/api/chat/send', (req, res) => {
  const { message } = req.body;
  console.log('Message reçu:', message);
  
  const responses = [
    "Bonjour ! Comment puis-je vous aider ?",
    "C'est une excellente question !",
    "Je comprends votre demande.",
    "Merci pour votre message !",
    "N'hésitez pas à me poser d'autres questions !"
  ];
  
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  res.json({
    success: true,
    response: randomResponse
  });
});

// Socket.IO
io.on('connection', (socket) => {
  console.log('Client connecté:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client déconnecté:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📱 WhatsApp AI Bot prêt !`);
});

export default app;