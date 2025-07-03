// ═══════════════════════════════════════════════════════════════════════════════
// 🎭 API STATUS - Bot WhatsApp RP sur Vercel
// ═══════════════════════════════════════════════════════════════════════════════

export default async function handler(req, res) {
    try {
        const config = {
            botName: process.env.BOT_NAME || '🎭 RP Master Bot',
            rpWorld: process.env.RP_WORLD || 'Cyberpunk 2077',
            defaultCharacter: process.env.DEFAULT_CHARACTER || 'Assistant IA Futuriste',
            enableMedia: process.env.ENABLE_MEDIA_RESPONSES === 'true',
            debugMode: process.env.DEBUG_MODE === 'true',
            version: '1.0.0',
            platform: 'Vercel'
        };

        const statusHTML = `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${config.botName} - Status</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
                    color: #00ff94;
                    min-height: 100vh;
                    padding: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .container {
                    background: rgba(0, 0, 0, 0.8);
                    border: 2px solid #00ff94;
                    border-radius: 10px;
                    padding: 30px;
                    max-width: 800px;
                    width: 100%;
                    box-shadow: 0 0 30px rgba(0, 255, 148, 0.3);
                    animation: glow 2s ease-in-out infinite alternate;
                }
                
                @keyframes glow {
                    from { box-shadow: 0 0 20px rgba(0, 255, 148, 0.3); }
                    to { box-shadow: 0 0 40px rgba(0, 255, 148, 0.6); }
                }
                
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                
                .title {
                    font-size: 2.5em;
                    color: #00ff94;
                    text-shadow: 0 0 10px rgba(0, 255, 148, 0.8);
                    margin-bottom: 10px;
                }
                
                .subtitle {
                    color: #ff6b6b;
                    font-size: 1.2em;
                    margin-bottom: 20px;
                }
                
                .status-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin-bottom: 30px;
                }
                
                .status-item {
                    background: rgba(0, 255, 148, 0.1);
                    border: 1px solid #00ff94;
                    border-radius: 5px;
                    padding: 15px;
                }
                
                .status-label {
                    color: #4ecdc4;
                    font-size: 0.9em;
                    margin-bottom: 5px;
                }
                
                .status-value {
                    color: #00ff94;
                    font-weight: bold;
                    font-size: 1.1em;
                }
                
                .endpoints {
                    margin-top: 30px;
                }
                
                .endpoint {
                    background: rgba(255, 107, 107, 0.1);
                    border: 1px solid #ff6b6b;
                    border-radius: 5px;
                    padding: 10px;
                    margin-bottom: 10px;
                    font-family: monospace;
                }
                
                .method {
                    color: #4ecdc4;
                    font-weight: bold;
                }
                
                .url {
                    color: #00ff94;
                }
                
                .description {
                    color: #999;
                    font-size: 0.9em;
                    margin-top: 5px;
                }
                
                .separator {
                    color: #00ff94;
                    text-align: center;
                    margin: 20px 0;
                    font-size: 1.5em;
                }
                
                @media (max-width: 768px) {
                    .status-grid {
                        grid-template-columns: 1fr;
                    }
                    .title {
                        font-size: 2em;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="title">🎭 RP BOT STATUS</div>
                    <div class="subtitle">═══ SYSTÈME OPÉRATIONNEL ═══</div>
                </div>
                
                <div class="status-grid">
                    <div class="status-item">
                        <div class="status-label">🤖 Bot Name</div>
                        <div class="status-value">${config.botName}</div>
                    </div>
                    
                    <div class="status-item">
                        <div class="status-label">🌍 RP World</div>
                        <div class="status-value">${config.rpWorld}</div>
                    </div>
                    
                    <div class="status-item">
                        <div class="status-label">🎭 Character</div>
                        <div class="status-value">${config.defaultCharacter}</div>
                    </div>
                    
                    <div class="status-item">
                        <div class="status-label">📸 Media</div>
                        <div class="status-value">${config.enableMedia ? '✅ Enabled' : '❌ Disabled'}</div>
                    </div>
                    
                    <div class="status-item">
                        <div class="status-label">🚀 Platform</div>
                        <div class="status-value">${config.platform}</div>
                    </div>
                    
                    <div class="status-item">
                        <div class="status-label">📊 Version</div>
                        <div class="status-value">${config.version}</div>
                    </div>
                </div>
                
                <div class="separator">✦ ═══════════════════════════════════════ ✦</div>
                
                <div class="endpoints">
                    <h3 style="color: #4ecdc4; margin-bottom: 15px;">📡 API ENDPOINTS:</h3>
                    
                    <div class="endpoint">
                        <span class="method">GET</span> <span class="url">/api/status</span>
                        <div class="description">Status du bot et configuration</div>
                    </div>
                    
                    <div class="endpoint">
                        <span class="method">POST</span> <span class="url">/api/webhook</span>
                        <div class="description">Webhook pour recevoir les messages WhatsApp</div>
                    </div>
                    
                    <div class="endpoint">
                        <span class="method">POST</span> <span class="url">/api/generate-response</span>
                        <div class="description">Générer une réponse RP avec Gemini AI</div>
                    </div>
                    
                    <div class="endpoint">
                        <span class="method">GET</span> <span class="url">/api/health</span>
                        <div class="description">Health check du système</div>
                    </div>
                </div>
                
                <div class="separator">💫 ═══════════════════════════════════════ 💫</div>
                
                <div style="text-align: center; color: #999; margin-top: 20px;">
                    <p>🎮 Bot WhatsApp RP avec IA Gemini</p>
                    <p>⚡ Déployé sur Vercel - ${new Date().toLocaleString('fr-FR')}</p>
                </div>
            </div>
        </body>
        </html>`;

        if (req.method === 'GET') {
            res.setHeader('Content-Type', 'text/html');
            return res.status(200).send(statusHTML);
        }

        // Pour les requêtes JSON
        res.status(200).json({
            status: 'online',
            timestamp: new Date().toISOString(),
            config: config,
            endpoints: [
                { method: 'GET', path: '/api/status', description: 'Status du bot' },
                { method: 'POST', path: '/api/webhook', description: 'Webhook WhatsApp' },
                { method: 'POST', path: '/api/generate-response', description: 'Génération RP' },
                { method: 'GET', path: '/api/health', description: 'Health check' }
            ]
        });

    } catch (error) {
        console.error('Erreur API Status:', error);
        res.status(500).json({
            error: 'Erreur serveur',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
}