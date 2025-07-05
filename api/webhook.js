// ═══════════════════════════════════════════════════════════════════════════════
// 📡 API WEBHOOK - Réception des messages WhatsApp sur Vercel
// ═══════════════════════════════════════════════════════════════════════════════

// Configuration
const config = {
    botName: process.env.BOT_NAME || '🎭 RP Master Bot',
    rpWorld: process.env.RP_WORLD || 'Cyberpunk 2077',
    defaultCharacter: process.env.DEFAULT_CHARACTER || 'Assistant IA Futuriste',
    enableMediaResponses: process.env.ENABLE_MEDIA_RESPONSES === 'true',
    debugMode: process.env.DEBUG_MODE === 'true',
    autoReplyDelay: parseInt(process.env.AUTO_REPLY_DELAY) || 2000,
    commandPrefix: '!rp'
};

// Stockage temporaire des sessions actives (en production, utiliser une DB)
const activeSessions = new Map();
const conversationHistory = new Map();

// Commandes RP disponibles
const rpCommands = {
    start: 'Démarrer une session RP',
    stop: 'Arrêter la session RP',
    status: 'Voir le statut du système',
    help: 'Afficher cette aide'
};

// Fonction pour générer les messages de commande
function generateCommandResponse(command, userId) {
    const isActive = activeSessions.has(userId);
    
    switch (command) {
        case 'start':
            if (isActive) {
                return `⚠️ ═══════════════════════════════════════ ⚠️\n\n✦ SESSION DÉJÀ ACTIVE ✦\n\nLe RP est déjà en cours !\nUtilisez ${config.commandPrefix} stop pour l'arrêter.\n\n💫 ═══════════════════════════════════════ 💫`;
            }
            
            activeSessions.set(userId, {
                startTime: Date.now(),
                character: config.defaultCharacter,
                world: config.rpWorld
            });
            
            return `🎭 ═══════════════════════════════════════ 🎭\n\n✦ SYSTÈME RP ACTIVÉ ✦\n\n🌃 Bienvenue dans ${config.rpWorld}\n🤖 Je suis ${config.defaultCharacter}\n⚡ Le roleplay commence maintenant!\n\n◆ Tapez vos messages normalement\n◇ Je répondrai en tant que personnage RP\n◈ Utilisez ${config.commandPrefix} help pour les commandes\n\n💫 ═══════════════════════════════════════ 💫`;
            
        case 'stop':
            if (!isActive) {
                return `⚠️ ═══════════════════════════════════════ ⚠️\n\n✦ AUCUNE SESSION ACTIVE ✦\n\nLe RP n'est pas en cours.\nUtilisez ${config.commandPrefix} start pour commencer.\n\n💫 ═══════════════════════════════════════ 💫`;
            }
            
            activeSessions.delete(userId);
            conversationHistory.delete(userId);
            
            return `🎭 ═══════════════════════════════════════ 🎭\n\n✦ SESSION RP TERMINÉE ✦\n\n*Les lumières néon s'éteignent lentement*\n*Le système IA entre en mode veille*\n\nÀ bientôt dans ${config.rpWorld}! 🌃\n\n💫 ═══════════════════════════════════════ 💫`;
            
        case 'status':
            const sessionInfo = activeSessions.get(userId);
            const duration = sessionInfo ? Math.floor((Date.now() - sessionInfo.startTime) / 1000) : 0;
            
            return `🎯 ═══════════════════════════════════════ 🎯\n\n📊 STATUT DU SYSTÈME RP\n\n🔥 État: ${isActive ? '✅ ACTIF' : '❌ INACTIF'}\n🌍 Monde: ${config.rpWorld}\n🤖 Personnage: ${config.defaultCharacter}\n📸 Médias: ${config.enableMediaResponses ? '✅ Activés' : '❌ Désactivés'}\n⏱️ Durée: ${duration}s\n\n⚡ ═══════════════════════════════════════ ⚡`;
            
        case 'help':
            const commandList = Object.entries(rpCommands)
                .map(([cmd, desc]) => `🎮 ${config.commandPrefix} ${cmd} - ${desc}`)
                .join('\n');
                
            return `🎮 ═══════════════════════════════════════ 🎮\n\n📋 COMMANDES DISPONIBLES\n\n${commandList}\n\n✨ FONCTIONNALITÉS ✨\n\n🤖 IA Gemini pour réponses immersives\n📸 Médias automatiques après actions\n🎨 Caractères spéciaux et emojis\n🌃 Univers ${config.rpWorld}\n\n🔮 ═══════════════════════════════════════ 🔮`;
            
        default:
            return generateCommandResponse('help', userId);
    }
}

// Fonction pour appeler l'API de génération de réponse
async function generateRPResponse(message, userId) {
    try {
        // Récupérer l'historique de conversation
        const history = conversationHistory.get(userId) || [];
        
        // URL de l'API (utiliser l'URL de base de Vercel)
        const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
        const apiUrl = `${baseUrl}/api/generate-response`;
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message,
                conversationHistory: history,
                characterName: 'default',
                userInfo: { userId }
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Mettre à jour l'historique
            history.push(
                { sender: 'USER', content: message, timestamp: Date.now() },
                { sender: 'BOT', content: data.response, timestamp: Date.now() }
            );
            
            // Limiter l'historique
            if (history.length > 20) {
                history.splice(0, history.length - 20);
            }
            
            conversationHistory.set(userId, history);
            
            return {
                response: data.response,
                metadata: data.metadata,
                suggestions: data.suggestions
            };
        } else {
            throw new Error(data.message || 'Erreur génération réponse');
        }
        
    } catch (error) {
        console.error('Erreur appel API génération:', error);
        return {
            response: "*L'interface neural scintille* ⚡\n═══ CONNEXION RÉTABLIE ═══\nSystème IA temporairement indisponible... 🔮",
            metadata: { error: true },
            suggestions: { addMedia: false }
        };
    }
}

export default async function handler(req, res) {
    try {
        if (req.method === 'GET') {
            // Endpoint de vérification pour webhook
            const challenge = req.query['hub.challenge'];
            const token = req.query['hub.verify_token'];
            
            if (challenge && token === process.env.WEBHOOK_VERIFY_TOKEN) {
                return res.status(200).send(challenge);
            }
            
            return res.status(200).json({
                status: 'Webhook endpoint active',
                timestamp: new Date().toISOString(),
                config: {
                    botName: config.botName,
                    rpWorld: config.rpWorld,
                    commandPrefix: config.commandPrefix
                }
            });
        }
        
        if (req.method !== 'POST') {
            return res.status(405).json({
                error: 'Méthode non autorisée',
                message: 'Utilisez POST pour envoyer des messages ou GET pour la vérification'
            });
        }

        const webhookData = req.body;
        
        if (config.debugMode) {
            console.log('📡 Webhook reçu:', JSON.stringify(webhookData, null, 2));
        }

        // Traitement des différents types de webhook
        let responses = [];
        
        // Format générique pour test (adaptable selon le fournisseur WhatsApp)
        if (webhookData.messages || webhookData.message) {
            const messages = webhookData.messages || [webhookData];
            
            for (const messageData of messages) {
                const userId = messageData.from || messageData.userId || 'unknown';
                const messageText = messageData.text?.body || messageData.message || messageData.text || '';
                const messageType = messageData.type || 'text';
                
                if (messageType !== 'text' || !messageText.trim()) {
                    continue;
                }
                
                let response;
                
                // Vérifier si c'est une commande RP
                if (messageText.startsWith(config.commandPrefix)) {
                    const args = messageText.split(' ').slice(1);
                    const command = args[0]?.toLowerCase() || 'help';
                    
                    response = {
                        to: userId,
                        text: generateCommandResponse(command, userId),
                        type: 'command'
                    };
                    
                } else if (activeSessions.has(userId)) {
                    // Générer une réponse RP si la session est active
                    const rpResult = await generateRPResponse(messageText, userId);
                    
                    response = {
                        to: userId,
                        text: rpResult.response,
                        type: 'rp',
                        metadata: rpResult.metadata,
                        suggestions: rpResult.suggestions
                    };
                    
                } else {
                    // Message d'aide si aucune session active
                    response = {
                        to: userId,
                        text: `🎭 ═══════════════════════════════════════ 🎭\n\n✨ Salut ! Je suis ${config.botName}\n\nPour commencer une aventure RP :\n🎮 Tapez ${config.commandPrefix} start\n\nPour voir l'aide :\n❓ Tapez ${config.commandPrefix} help\n\n💫 ═══════════════════════════════════════ 💫`,
                        type: 'welcome'
                    };
                }
                
                responses.push(response);
            }
        }
        
        // Statistiques
        const stats = {
            activeSessions: activeSessions.size,
            totalConversations: conversationHistory.size,
            timestamp: new Date().toISOString()
        };

        res.status(200).json({
            success: true,
            timestamp: new Date().toISOString(),
            processed: responses.length,
            responses: responses,
            stats: stats,
            config: {
                botName: config.botName,
                rpWorld: config.rpWorld,
                enableMedia: config.enableMediaResponses
            }
        });

    } catch (error) {
        console.error('Erreur webhook:', error);
        
        res.status(500).json({
            error: 'Erreur serveur',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
}