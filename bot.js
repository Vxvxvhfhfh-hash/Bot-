require('dotenv').config();
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const qrcode = require('qrcode-terminal');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const figlet = require('figlet');
const gradient = require('gradient-string');

// ═══════════════════════════════════════════════════════════════════════════════
// 🎭 CONFIGURATION ET INITIALISATION
// ═══════════════════════════════════════════════════════════════════════════════

const config = {
    geminiApiKey: process.env.GEMINI_API_KEY,AIzaSyAZ2kEdV2msOk_oGozkExOXfxEaudOUFOA
    botName: process.env.BOT_NAME || '🎭 RP Master Bot',
    rpWorld: process.env.RP_WORLD || 'Cyberpunk 2077',
    defaultCharacter: process.env.DEFAULT_CHARACTER || 'Assistant IA Futuriste',
    mediaFolder: process.env.MEDIA_FOLDER || './media',
    enableMediaResponses: process.env.ENABLE_MEDIA_RESPONSES === 'true',
    debugMode: process.env.DEBUG_MODE === 'true',
    autoReplyDelay: parseInt(process.env.AUTO_REPLY_DELAY) || 2000,
    maxMessageLength: parseInt(process.env.MAX_MESSAGE_LENGTH) || 1000
};

// Initialisation Gemini AI
const genAI = new GoogleGenerativeAI(config.geminiApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Initialisation du client WhatsApp
const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "whatsapp-rp-bot"
    }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 FONCTIONS D'ESTHETIQUE ET AFFICHAGE
// ═══════════════════════════════════════════════════════════════════════════════

function displayBanner() {
    console.clear();
    const banner = figlet.textSync('RP BOT', {
        font: 'ANSI Shadow',
        horizontalLayout: 'default',
        verticalLayout: 'default'
    });
    
    console.log(gradient.pastel.multiline(banner));
    console.log(chalk.cyan('═'.repeat(80)));
    console.log(chalk.yellow(`🎭 ${config.botName}`));
    console.log(chalk.magenta(`🌍 Monde RP: ${config.rpWorld}`));
    console.log(chalk.green(`🤖 Personnage: ${config.defaultCharacter}`));
    console.log(chalk.cyan('═'.repeat(80)));
}

function formatMessage(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const symbols = {
        info: '💬',
        success: '✅',
        error: '❌',
        warning: '⚠️',
        rp: '🎭',
        media: '📸'
    };
    
    const colors = {
        info: chalk.blue,
        success: chalk.green,
        error: chalk.red,
        warning: chalk.yellow,
        rp: chalk.magenta,
        media: chalk.cyan
    };
    
    return `${colors[type](`${symbols[type]} [${timestamp}]`)} ${message}`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🧠 SYSTÈME D'IA GEMINI POUR RP
// ═══════════════════════════════════════════════════════════════════════════════

class RPAISystem {
    constructor() {
        this.conversationHistory = new Map();
        this.characterProfiles = {
            default: {
                name: config.defaultCharacter,
                personality: "Assistant IA avancé dans un monde cyberpunk, utilise un langage technique mais accessible",
                background: `Tu es un assistant IA dans le monde de ${config.rpWorld}. Tu utilises des emojis cyberpunk et des caractères spéciaux pour l'esthétique.`,
                responseStyle: "Réponses immersives avec des éléments visuels et des actions entre *astérisques*"
            }
        };
    }

    async generateRPResponse(userMessage, userContact, characterName = 'default') {
        try {
            const character = this.characterProfiles[characterName] || this.characterProfiles.default;
            const conversationKey = userContact;
            
            // Récupérer l'historique de conversation
            if (!this.conversationHistory.has(conversationKey)) {
                this.conversationHistory.set(conversationKey, []);
            }
            
            const history = this.conversationHistory.get(conversationKey);
            
            // Construire le prompt avec contexte RP
            const prompt = `
Tu incarnes ${character.name} dans l'univers de ${config.rpWorld}.

PERSONNALITÉ: ${character.personality}
BACKGROUND: ${character.background}
STYLE: ${character.responseStyle}

RÈGLES IMPORTANTES:
- Utilise des emojis cyberpunk (⚡🔮💎🌃🔥💫⭐🎯🎪🎭)
- Ajoute des caractères spéciaux pour l'esthétique (═══ ◆◇◈ ▲▼ ✦✧)
- Mets les actions entre *astérisques*
- Reste immersif dans le roleplay
- Maximum ${config.maxMessageLength} caractères
- Utilise des séparateurs visuels comme ──────────

HISTORIQUE RÉCENT:
${history.slice(-5).map(msg => `${msg.sender}: ${msg.content}`).join('\n')}

MESSAGE À TRAITER: ${userMessage}

Réponds en tant que ${character.name}:`;

            const result = await model.generateContent(prompt);
            const response = result.response.text();
            
            // Sauvegarder dans l'historique
            history.push(
                { sender: 'USER', content: userMessage, timestamp: Date.now() },
                { sender: 'BOT', content: response, timestamp: Date.now() }
            );
            
            // Limiter l'historique
            if (history.length > 20) {
                history.splice(0, history.length - 20);
            }
            
            return this.formatRPMessage(response);
            
        } catch (error) {
            console.error(formatMessage(`Erreur Gemini AI: ${error.message}`, 'error'));
            return this.getFallbackResponse();
        }
    }

    formatRPMessage(message) {
        // Ajouter des éléments esthétiques
        const decorations = ['✦', '◆', '⚡', '🔮', '💎'];
        const randomDecor = decorations[Math.floor(Math.random() * decorations.length)];
        
        return `${randomDecor} ═══════════════════════════════════════ ${randomDecor}\n${message}\n${randomDecor} ═══════════════════════════════════════ ${randomDecor}`;
    }

    getFallbackResponse() {
        const fallbacks = [
            "*L'interface neural scintille* ⚡\n═══ CONNEXION RÉTABLIE ═══\nSystème IA temporairement indisponible... 🔮",
            "*Glitch dans la matrice* 💫\n◆◇◈ RECALIBRAGE EN COURS ◈◇◆\nVeuillez patienter... ⭐",
            "*Les circuits surchauffent* 🔥\n▲▼ MAINTENANCE SYSTÈME ▼▲\nRedémarrage imminent... 🎯"
        ];
        
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📸 SYSTÈME DE MÉDIAS POUR L'IMMERSION
// ═══════════════════════════════════════════════════════════════════════════════

class MediaSystem {
    constructor() {
        this.mediaFolder = config.mediaFolder;
        this.mediaCategories = {
            cyberpunk: ['cyberpunk1.jpg', 'cyberpunk2.jpg', 'neon_city.jpg'],
            action: ['explosion.gif', 'chase.jpg', 'combat.png'],
            ambient: ['rain.jpg', 'night_city.jpg', 'hologram.gif'],
            character: ['avatar1.jpg', 'avatar2.png', 'robot.jpg']
        };
        this.ensureMediaFolder();
    }

    async ensureMediaFolder() {
        try {
            await fs.ensureDir(this.mediaFolder);
            // Créer les sous-dossiers
            for (const category of Object.keys(this.mediaCategories)) {
                await fs.ensureDir(path.join(this.mediaFolder, category));
            }
            console.log(formatMessage(`Dossier médias initialisé: ${this.mediaFolder}`, 'success'));
        } catch (error) {
            console.error(formatMessage(`Erreur création dossier médias: ${error.message}`, 'error'));
        }
    }

    async getRandomMedia(category = 'ambient') {
        try {
            const categoryPath = path.join(this.mediaFolder, category);
            const files = await fs.readdir(categoryPath);
            const mediaFiles = files.filter(file => 
                /\.(jpg|jpeg|png|gif|mp4|webp)$/i.test(file)
            );
            
            if (mediaFiles.length === 0) {
                return null;
            }
            
            const randomFile = mediaFiles[Math.floor(Math.random() * mediaFiles.length)];
            const filePath = path.join(categoryPath, randomFile);
            
            if (await fs.pathExists(filePath)) {
                return MessageMedia.fromFilePath(filePath);
            }
            
            return null;
        } catch (error) {
            console.error(formatMessage(`Erreur récupération média: ${error.message}`, 'error'));
            return null;
        }
    }

    detectMessageCategory(message) {
        const keywords = {
            cyberpunk: ['ville', 'néon', 'futur', 'technologie', 'cyber'],
            action: ['combat', 'course', 'explosion', 'bagarre', 'action'],
            ambient: ['pluie', 'nuit', 'atmosphère', 'ambiance', 'calme'],
            character: ['personnage', 'avatar', 'profil', 'identité']
        };
        
        const lowerMessage = message.toLowerCase();
        
        for (const [category, words] of Object.entries(keywords)) {
            if (words.some(word => lowerMessage.includes(word))) {
                return category;
            }
        }
        
        return 'ambient'; // Catégorie par défaut
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎮 SYSTÈME PRINCIPAL DU BOT
// ═══════════════════════════════════════════════════════════════════════════════

class WhatsAppRPBot {
    constructor() {
        this.aiSystem = new RPAISystem();
        this.mediaSystem = new MediaSystem();
        this.activeChats = new Set();
        this.commandPrefix = '!rp';
    }

    async initialize() {
        displayBanner();
        console.log(formatMessage('Initialisation du bot RP...', 'info'));
        
        // Gestionnaires d'événements WhatsApp
        this.setupEventHandlers();
        
        // Démarrage du client
        await client.initialize();
    }

    setupEventHandlers() {
        client.on('qr', (qr) => {
            console.log(formatMessage('QR Code généré. Scannez avec WhatsApp:', 'info'));
            qrcode.generate(qr, { small: true });
        });

        client.on('ready', () => {
            console.log(formatMessage('Bot WhatsApp RP connecté avec succès! 🎭', 'success'));
            console.log(formatMessage(`Préfixe de commande: ${this.commandPrefix}`, 'info'));
        });

        client.on('message', async (message) => {
            await this.handleMessage(message);
        });

        client.on('disconnected', (reason) => {
            console.log(formatMessage(`Déconnexion: ${reason}`, 'warning'));
        });
    }

    async handleMessage(message) {
        try {
            // Ignorer les messages du bot lui-même
            if (message.fromMe) return;
            
            const contact = await message.getContact();
            const chat = await message.getChat();
            const messageBody = message.body.trim();
            
            console.log(formatMessage(`Message reçu de ${contact.name || contact.number}: ${messageBody}`, 'info'));
            
            // Vérifier si c'est une commande RP
            if (messageBody.startsWith(this.commandPrefix)) {
                await this.handleRPCommand(message, messageBody, contact, chat);
                return;
            }
            
            // Vérifier si le chat est actif pour le RP
            if (this.activeChats.has(chat.id._serialized)) {
                await this.handleRPMessage(message, messageBody, contact, chat);
            }
            
        } catch (error) {
            console.error(formatMessage(`Erreur traitement message: ${error.message}`, 'error'));
        }
    }

    async handleRPCommand(message, messageBody, contact, chat) {
        const args = messageBody.split(' ').slice(1);
        const command = args[0]?.toLowerCase();
        
        switch (command) {
            case 'start':
                await this.startRP(chat, contact);
                break;
                
            case 'stop':
                await this.stopRP(chat, contact);
                break;
                
            case 'status':
                await this.showStatus(chat, contact);
                break;
                
            case 'help':
                await this.showHelp(chat, contact);
                break;
                
            default:
                await this.showHelp(chat, contact);
        }
    }

    async startRP(chat, contact) {
        this.activeChats.add(chat.id._serialized);
        
        const welcomeMessage = `🎭 ═══════════════════════════════════════ 🎭
        
✦ SYSTÈME RP ACTIVÉ ✦

🌃 Bienvenue dans ${config.rpWorld}
🤖 Je suis ${config.defaultCharacter}
⚡ Le roleplay commence maintenant!

◆ Tapez vos messages normalement
◇ Je répondrai en tant que personnage RP
◈ Utilisez ${this.commandPrefix} help pour les commandes

💫 ═══════════════════════════════════════ 💫`;

        await chat.sendMessage(welcomeMessage);
        
        // Envoyer un média d'ambiance
        if (config.enableMediaResponses) {
            const media = await this.mediaSystem.getRandomMedia('cyberpunk');
            if (media) {
                await chat.sendMessage(media, { caption: '*L\'univers cyberpunk s\'illumine autour de vous* 🌃✨' });
            }
        }
        
        console.log(formatMessage(`RP démarré pour le chat ${chat.name || 'Inconnu'}`, 'rp'));
    }

    async stopRP(chat, contact) {
        this.activeChats.delete(chat.id._serialized);
        
        const goodbyeMessage = `🎭 ═══════════════════════════════════════ 🎭

✦ SESSION RP TERMINÉE ✦

*Les lumières néon s\'éteignent lentement*
*Le système IA entre en mode veille*

À bientôt dans ${config.rpWorld}! 🌃

💫 ═══════════════════════════════════════ 💫`;

        await chat.sendMessage(goodbyeMessage);
        console.log(formatMessage(`RP arrêté pour le chat ${chat.name || 'Inconnu'}`, 'rp'));
    }

    async showStatus(chat, contact) {
        const isActive = this.activeChats.has(chat.id._serialized);
        const statusMessage = `🎯 ═══════════════════════════════════════ 🎯

📊 STATUT DU SYSTÈME RP

🔥 État: ${isActive ? '✅ ACTIF' : '❌ INACTIF'}
🌍 Monde: ${config.rpWorld}
🤖 Personnage: ${config.defaultCharacter}
📸 Médias: ${config.enableMediaResponses ? '✅ Activés' : '❌ Désactivés'}

⚡ ═══════════════════════════════════════ ⚡`;

        await chat.sendMessage(statusMessage);
    }

    async showHelp(chat, contact) {
        const helpMessage = `🎮 ═══════════════════════════════════════ 🎮

📋 COMMANDES DISPONIBLES

🎭 ${this.commandPrefix} start - Démarrer le RP
🛑 ${this.commandPrefix} stop - Arrêter le RP  
📊 ${this.commandPrefix} status - Voir le statut
❓ ${this.commandPrefix} help - Afficher cette aide

✨ FONCTIONNALITÉS ✨

🤖 IA Gemini pour réponses immersives
📸 Médias automatiques après actions
🎨 Caractères spéciaux et emojis
🌃 Univers ${config.rpWorld}

🔮 ═══════════════════════════════════════ 🔮`;

        await chat.sendMessage(helpMessage);
    }

    async handleRPMessage(message, messageBody, contact, chat) {
        try {
            // Ajouter un délai pour simuler la réflexion
            await chat.sendSeen();
            await new Promise(resolve => setTimeout(resolve, config.autoReplyDelay));
            
            // Générer la réponse IA
            const rpResponse = await this.aiSystem.generateRPResponse(
                messageBody, 
                contact.id._serialized
            );
            
            // Envoyer la réponse
            await chat.sendMessage(rpResponse);
            
            // Envoyer un média d'immersion si activé
            if (config.enableMediaResponses && Math.random() < 0.3) { // 30% de chance
                const category = this.mediaSystem.detectMessageCategory(messageBody);
                const media = await this.mediaSystem.getRandomMedia(category);
                
                if (media) {
                    const captions = [
                        '*L\'environnement réagit à vos actions* 🌃',
                        '*Une scène se matérialise devant vous* ✨',
                        '*L\'atmosphère change subitement* ⚡',
                        '*Des hologrammes apparaissent* 🔮',
                        '*La réalité se déforme légèrement* 💫'
                    ];
                    
                    const randomCaption = captions[Math.floor(Math.random() * captions.length)];
                    await chat.sendMessage(media, { caption: randomCaption });
                }
            }
            
            console.log(formatMessage(`Réponse RP envoyée à ${contact.name || contact.number}`, 'rp'));
            
        } catch (error) {
            console.error(formatMessage(`Erreur réponse RP: ${error.message}`, 'error'));
            
            // Message d'erreur RP immersif
            const errorMessage = `⚠️ ═══════════════════════════════════════ ⚠️

*Interférence dans la transmission*
*Systèmes en cours de recalibrage*

🔧 Veuillez réessayer dans un moment...

💫 ═══════════════════════════════════════ 💫`;

            await chat.sendMessage(errorMessage);
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🚀 DÉMARRAGE DU BOT
// ═══════════════════════════════════════════════════════════════════════════════

const bot = new WhatsAppRPBot();

// Gestion des signaux système
process.on('SIGINT', () => {
    console.log(formatMessage('Arrêt du bot en cours...', 'warning'));
    client.destroy();
    process.exit(0);
});

process.on('unhandledRejection', (error) => {
    console.error(formatMessage(`Erreur non gérée: ${error.message}`, 'error'));
});

// Démarrage
bot.initialize().catch(error => {
    console.error(formatMessage(`Erreur démarrage: ${error.message}`, 'error'));
    process.exit(1);
});
