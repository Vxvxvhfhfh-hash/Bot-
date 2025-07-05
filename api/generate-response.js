// ═══════════════════════════════════════════════════════════════════════════════
// 🧠 API GENERATE RESPONSE - IA Gemini pour RP sur Vercel
// ═══════════════════════════════════════════════════════════════════════════════

import { GoogleGenerativeAI } from '@google/generative-ai';

// Configuration
const config = {
    geminiApiKey: process.env.GEMINI_API_KEY,
    botName: process.env.BOT_NAME || '🎭 RP Master Bot',
    rpWorld: process.env.RP_WORLD || 'Cyberpunk 2077',
    defaultCharacter: process.env.DEFAULT_CHARACTER || 'Assistant IA Futuriste',
    maxMessageLength: parseInt(process.env.MAX_MESSAGE_LENGTH) || 1000,
    debugMode: process.env.DEBUG_MODE === 'true'
};

// Initialisation Gemini AI
let genAI, model;
try {
    if (config.geminiApiKey && config.geminiApiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
        genAI = new GoogleGenerativeAI(config.geminiApiKey);
        model = genAI.getGenerativeModel({ model: "gemini-pro" });
    }
} catch (error) {
    console.error('Erreur initialisation Gemini:', error);
}

// Système RP AI
class RPAISystem {
    constructor() {
        this.characterProfiles = {
            default: {
                name: config.defaultCharacter,
                personality: "Assistant IA avancé dans un monde cyberpunk, utilise un langage technique mais accessible",
                background: `Tu es un assistant IA dans le monde de ${config.rpWorld}. Tu utilises des emojis cyberpunk et des caractères spéciaux pour l'esthétique.`,
                responseStyle: "Réponses immersives avec des éléments visuels et des actions entre *astérisques*"
            }
        };
    }

    async generateRPResponse(userMessage, conversationHistory = [], characterName = 'default') {
        try {
            if (!model) {
                return this.getFallbackResponse();
            }

            const character = this.characterProfiles[characterName] || this.characterProfiles.default;
            
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
${conversationHistory.slice(-5).map(msg => `${msg.sender}: ${msg.content}`).join('\n')}

MESSAGE À TRAITER: ${userMessage}

Réponds en tant que ${character.name}:`;

            const result = await model.generateContent(prompt);
            const response = result.response.text();
            
            return this.formatRPMessage(response);
            
        } catch (error) {
            console.error('Erreur Gemini AI:', error);
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

const rpAI = new RPAISystem();

export default async function handler(req, res) {
    // Vérifier la méthode HTTP
    if (req.method !== 'POST') {
        return res.status(405).json({
            error: 'Méthode non autorisée',
            message: 'Utilisez POST pour générer une réponse RP'
        });
    }

    try {
        const { 
            message, 
            conversationHistory = [], 
            characterName = 'default',
            userInfo = {} 
        } = req.body;

        // Validation des paramètres
        if (!message || typeof message !== 'string') {
            return res.status(400).json({
                error: 'Paramètres invalides',
                message: 'Le champ "message" est requis et doit être une chaîne de caractères'
            });
        }

        if (config.debugMode) {
            console.log('🎭 Génération réponse RP:', {
                message: message.substring(0, 100) + '...',
                character: characterName,
                historyLength: conversationHistory.length
            });
        }

        // Vérifier si Gemini AI est disponible
        if (!config.geminiApiKey || config.geminiApiKey === 'YOUR_GEMINI_API_KEY_HERE') {
            return res.status(500).json({
                error: 'Configuration manquante',
                message: 'Clé API Gemini non configurée',
                fallbackResponse: rpAI.getFallbackResponse()
            });
        }

        // Générer la réponse RP
        const rpResponse = await rpAI.generateRPResponse(
            message, 
            conversationHistory, 
            characterName
        );

        // Détecter la catégorie pour les médias
        const mediaCategory = rpAI.detectMessageCategory(message);

        // Réponse API
        res.status(200).json({
            success: true,
            timestamp: new Date().toISOString(),
            response: rpResponse,
            metadata: {
                character: characterName,
                mediaCategory: mediaCategory,
                messageLength: rpResponse.length,
                rpWorld: config.rpWorld,
                botName: config.botName
            },
            suggestions: {
                addMedia: config.enableMediaResponses && Math.random() < 0.3,
                mediaCategory: mediaCategory
            }
        });

    } catch (error) {
        console.error('Erreur génération réponse:', error);
        
        res.status(500).json({
            error: 'Erreur serveur',
            message: error.message,
            timestamp: new Date().toISOString(),
            fallbackResponse: rpAI.getFallbackResponse()
        });
    }
}