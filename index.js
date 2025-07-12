const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
require('dotenv').config();

class WhatsAppGeminiBot {
    constructor() {
        this.client = new Client({
            authStrategy: new LocalAuth(),
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

        // Initialiser Gemini AI
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });

        this.botName = process.env.BOT_NAME || 'Gemini Bot';
        this.prefix = process.env.BOT_PREFIX || '!';
        this.maxMessageLength = parseInt(process.env.MAX_MESSAGE_LENGTH) || 2000;
        this.enableImages = process.env.ENABLE_IMAGES === 'true';
        this.imageProvider = process.env.IMAGE_PROVIDER || 'unsplash';

        this.setupEventHandlers();
        this.createDirectories();
    }

    createDirectories() {
        const dirs = ['./temp', './logs'];
        dirs.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }

    setupEventHandlers() {
        this.client.on('qr', (qr) => {
            console.log('📱 Scannez ce QR code avec WhatsApp:');
            qrcode.generate(qr, { small: true });
        });

        this.client.on('ready', () => {
            console.log('🤖 Bot WhatsApp Gemini est prêt!');
            console.log(`📋 Nom du bot: ${this.botName}`);
            console.log(`🔧 Préfixe: ${this.prefix}`);
            console.log(`🖼️ Images activées: ${this.enableImages ? 'Oui' : 'Non'}`);
        });

        this.client.on('message', async (message) => {
            await this.handleMessage(message);
        });

        this.client.on('disconnected', (reason) => {
            console.log('❌ Client déconnecté:', reason);
        });
    }

    async handleMessage(message) {
        try {
            // Ignorer les messages du bot lui-même
            if (message.fromMe) return;

            // Log du message
            this.logMessage(message);

            const messageBody = message.body.trim();
            const contact = await message.getContact();
            const chat = await message.getChat();

            // Vérifier si le message commence par le préfixe
            if (!messageBody.startsWith(this.prefix)) return;

            const command = messageBody.slice(this.prefix.length).trim();

            // Commandes spéciales
            if (await this.handleSpecialCommands(command, message, chat)) {
                return;
            }

            // Traitement par l'IA Gemini
            await this.processWithGemini(command, message, chat, contact);

        } catch (error) {
            console.error('❌ Erreur lors du traitement du message:', error);
            await message.reply('❌ Une erreur est survenue lors du traitement de votre message.');
        }
    }

    async handleSpecialCommands(command, message, chat) {
        const lowerCommand = command.toLowerCase();

        if (lowerCommand === 'help' || lowerCommand === 'aide') {
            const helpMessage = `🤖 *${this.botName}* - Aide

📝 *Commandes disponibles:*
${this.prefix}help - Afficher cette aide
${this.prefix}image [mot-clé] - Générer une image avec un mot-clé
${this.prefix}status - Statut du bot
${this.prefix}info - Informations sur le bot

💬 *Utilisation générale:*
Tapez ${this.prefix} suivi de votre question pour discuter avec l'IA Gemini.

Exemple: ${this.prefix}Explique-moi l'intelligence artificielle`;

            await message.reply(helpMessage);
            return true;
        }

        if (lowerCommand === 'status') {
            const statusMessage = `📊 *Statut du Bot*

✅ Bot: Actif
🧠 IA: Gemini Pro
🖼️ Images: ${this.enableImages ? 'Activées' : 'Désactivées'}
📱 WhatsApp: Connecté
🕐 Uptime: ${this.getUptime()}`;

            await message.reply(statusMessage);
            return true;
        }

        if (lowerCommand === 'info') {
            const infoMessage = `ℹ️ *Informations du Bot*

🤖 Nom: ${this.botName}
🔧 Version: 1.0.0
🧠 IA: Google Gemini Pro
📚 Fonctionnalités:
  • Conversation intelligente
  • Génération d'images
  • Réponses contextuelles
  • Support multimédia

Développé avec ❤️ en Node.js`;

            await message.reply(infoMessage);
            return true;
        }

        if (lowerCommand.startsWith('image ')) {
            const keyword = command.slice(6).trim();
            if (keyword) {
                await this.sendImageWithKeyword(keyword, message, chat);
            } else {
                await message.reply('🖼️ Veuillez fournir un mot-clé pour l\'image.\nExemple: !image nature');
            }
            return true;
        }

        return false;
    }

    async processWithGemini(prompt, message, chat, contact) {
        try {
            // Afficher que le bot est en train de taper
            await chat.sendStateTyping();

            // Préparer le prompt avec contexte
            const enhancedPrompt = `Vous êtes ${this.botName}, un assistant IA bienveillant et utile sur WhatsApp. 
Répondez de manière concise et amicale à la question suivante:

${prompt}

Réponse (max ${this.maxMessageLength} caractères):`;

            // Générer la réponse avec Gemini
            const result = await this.model.generateContent(enhancedPrompt);
            const response = await result.response;
            let aiResponse = response.text();

            // Limiter la longueur de la réponse
            if (aiResponse.length > this.maxMessageLength) {
                aiResponse = aiResponse.substring(0, this.maxMessageLength - 3) + '...';
            }

            // Envoyer la réponse
            await message.reply(`🧠 *${this.botName}:*\n\n${aiResponse}`);

            // Envoyer une image pertinente si activé
            if (this.enableImages && Math.random() < 0.3) { // 30% de chance
                const keywords = this.extractKeywords(prompt);
                if (keywords.length > 0) {
                    setTimeout(async () => {
                        await this.sendRandomImage(keywords[0], chat);
                    }, 2000);
                }
            }

        } catch (error) {
            console.error('❌ Erreur Gemini:', error);
            await message.reply('❌ Désolé, je n\'ai pas pu traiter votre demande. Veuillez réessayer.');
        }
    }

    async sendImageWithKeyword(keyword, message, chat) {
        try {
            await chat.sendStateTyping();
            
            const imageUrl = await this.getStockImage(keyword);
            if (imageUrl) {
                const imagePath = await this.downloadImage(imageUrl, keyword);
                const media = MessageMedia.fromFilePath(imagePath);
                
                await chat.sendMessage(media, {
                    caption: `🖼️ Image: *${keyword}*`
                });

                // Nettoyer le fichier temporaire
                setTimeout(() => {
                    fs.unlink(imagePath).catch(console.error);
                }, 5000);
            } else {
                await message.reply(`❌ Impossible de trouver une image pour "${keyword}"`);
            }
        } catch (error) {
            console.error('❌ Erreur envoi image:', error);
            await message.reply('❌ Erreur lors de l\'envoi de l\'image.');
        }
    }

    async sendRandomImage(keyword, chat) {
        try {
            const imageUrl = await this.getStockImage(keyword);
            if (imageUrl) {
                const imagePath = await this.downloadImage(imageUrl, keyword);
                const media = MessageMedia.fromFilePath(imagePath);
                
                await chat.sendMessage(media, {
                    caption: `📸 Image suggérée: *${keyword}*`
                });

                // Nettoyer le fichier temporaire
                setTimeout(() => {
                    fs.unlink(imagePath).catch(console.error);
                }, 5000);
            }
        } catch (error) {
            console.error('❌ Erreur envoi image aléatoire:', error);
        }
    }

    async getStockImage(keyword) {
        try {
            switch (this.imageProvider) {
                case 'unsplash':
                    return await this.getUnsplashImage(keyword);
                case 'pexels':
                    return await this.getPexelsImage(keyword);
                case 'random':
                    return await this.getRandomImage(keyword);
                default:
                    return await this.getUnsplashImage(keyword);
            }
        } catch (error) {
            console.error('❌ Erreur récupération image:', error);
            return null;
        }
    }

    async getUnsplashImage(keyword) {
        if (!process.env.UNSPLASH_ACCESS_KEY) {
            console.warn('⚠️ Clé API Unsplash manquante');
            return null;
        }

        try {
            const response = await axios.get('https://api.unsplash.com/search/photos', {
                params: {
                    query: keyword,
                    per_page: 10,
                    orientation: 'landscape'
                },
                headers: {
                    'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
                }
            });

            if (response.data.results && response.data.results.length > 0) {
                const randomIndex = Math.floor(Math.random() * response.data.results.length);
                return response.data.results[randomIndex].urls.regular;
            }
            return null;
        } catch (error) {
            console.error('❌ Erreur API Unsplash:', error);
            return null;
        }
    }

    async getPexelsImage(keyword) {
        if (!process.env.PEXELS_API_KEY) {
            console.warn('⚠️ Clé API Pexels manquante');
            return null;
        }

        try {
            const response = await axios.get('https://api.pexels.com/v1/search', {
                params: {
                    query: keyword,
                    per_page: 10,
                    orientation: 'landscape'
                },
                headers: {
                    'Authorization': process.env.PEXELS_API_KEY
                }
            });

            if (response.data.photos && response.data.photos.length > 0) {
                const randomIndex = Math.floor(Math.random() * response.data.photos.length);
                return response.data.photos[randomIndex].src.large;
            }
            return null;
        } catch (error) {
            console.error('❌ Erreur API Pexels:', error);
            return null;
        }
    }

    async getRandomImage(keyword) {
        // Utiliser picsum.photos pour des images aléatoires
        const width = 800;
        const height = 600;
        return `https://picsum.photos/${width}/${height}?random=${Date.now()}`;
    }

    async downloadImage(imageUrl, keyword) {
        try {
            const response = await axios.get(imageUrl, {
                responseType: 'arraybuffer',
                timeout: 10000
            });

            const sanitizedKeyword = keyword.replace(/[^a-zA-Z0-9]/g, '_');
            const filename = `${sanitizedKeyword}_${Date.now()}.jpg`;
            const filepath = path.join('./temp', filename);

            await fs.writeFile(filepath, response.data);
            return filepath;
        } catch (error) {
            console.error('❌ Erreur téléchargement image:', error);
            throw error;
        }
    }

    extractKeywords(text) {
        // Mots-clés simple extraction
        const words = text.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 3)
            .filter(word => !['pour', 'avec', 'dans', 'une', 'des', 'les', 'que', 'qui', 'mais', 'this', 'that', 'with', 'from', 'they', 'what', 'when', 'where'].includes(word));

        return words.slice(0, 3); // Retourner les 3 premiers mots-clés
    }

    logMessage(message) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            from: message.from,
            body: message.body,
            type: message.type
        };

        const logFile = path.join('./logs', `messages_${new Date().toISOString().split('T')[0]}.log`);
        fs.appendFile(logFile, JSON.stringify(logEntry) + '\n').catch(console.error);
    }

    getUptime() {
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        return `${hours}h ${minutes}m ${seconds}s`;
    }

    async start() {
        try {
            console.log('🚀 Démarrage du bot WhatsApp Gemini...');
            await this.client.initialize();
        } catch (error) {
            console.error('❌ Erreur lors du démarrage:', error);
            process.exit(1);
        }
    }
}

// Vérifier les variables d'environnement obligatoires
if (!process.env.GEMINI_API_KEY) {
    console.error('❌ ERREUR: La variable GEMINI_API_KEY est requise dans le fichier .env');
    process.exit(1);
}

// Créer et démarrer le bot
const bot = new WhatsAppGeminiBot();
bot.start();

// Gestion de l'arrêt propre
process.on('SIGINT', () => {
    console.log('\n🛑 Arrêt du bot...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Arrêt du bot...');
    process.exit(0);
});