// ═══════════════════════════════════════════════════════════════════════════════
// 🏥 API HEALTH CHECK - Surveillance du système sur Vercel
// ═══════════════════════════════════════════════════════════════════════════════

export default async function handler(req, res) {
    const startTime = Date.now();
    
    try {
        const healthData = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            platform: 'vercel',
            version: '1.0.0',
            environment: process.env.NODE_ENV || 'production'
        };

        // Vérifications des services
        const checks = {
            memory: checkMemory(),
            environment: checkEnvironment(),
            gemini: checkGeminiConfig(),
            dependencies: await checkDependencies()
        };

        // Déterminer l'état global
        const allHealthy = Object.values(checks).every(check => check.status === 'ok');
        const overallStatus = allHealthy ? 'healthy' : 'degraded';
        
        // Temps de réponse
        const responseTime = Date.now() - startTime;

        const response = {
            status: overallStatus,
            timestamp: healthData.timestamp,
            responseTime: `${responseTime}ms`,
            system: {
                platform: healthData.platform,
                version: healthData.version,
                environment: healthData.environment,
                uptime: `${Math.floor(healthData.uptime)}s`,
                nodejs: process.version
            },
            checks: checks,
            config: {
                botName: process.env.BOT_NAME || '🎭 RP Master Bot',
                rpWorld: process.env.RP_WORLD || 'Cyberpunk 2077',
                enableMedia: process.env.ENABLE_MEDIA_RESPONSES === 'true',
                debugMode: process.env.DEBUG_MODE === 'true'
            }
        };

        // Codes de statut HTTP selon l'état
        const statusCode = overallStatus === 'healthy' ? 200 : 503;
        
        // Headers pour monitoring
        res.setHeader('X-Health-Status', overallStatus);
        res.setHeader('X-Response-Time', `${responseTime}ms`);
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        
        res.status(statusCode).json(response);

    } catch (error) {
        console.error('Erreur health check:', error);
        
        const responseTime = Date.now() - startTime;
        
        res.setHeader('X-Health-Status', 'unhealthy');
        res.setHeader('X-Response-Time', `${responseTime}ms`);
        
        res.status(500).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            responseTime: `${responseTime}ms`,
            error: {
                message: error.message,
                type: error.constructor.name
            },
            system: {
                platform: 'vercel',
                nodejs: process.version
            }
        });
    }
}

// Vérification de la mémoire
function checkMemory() {
    try {
        const memUsage = process.memoryUsage();
        const totalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
        const usedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
        const externalMB = Math.round(memUsage.external / 1024 / 1024);
        
        // Limite approximative Vercel: 1GB
        const isHealthy = totalMB < 900;
        
        return {
            status: isHealthy ? 'ok' : 'warning',
            details: {
                total: `${totalMB}MB`,
                used: `${usedMB}MB`,
                external: `${externalMB}MB`,
                usage: `${Math.round((usedMB / totalMB) * 100)}%`
            },
            message: isHealthy ? 'Mémoire normale' : 'Utilisation mémoire élevée'
        };
    } catch (error) {
        return {
            status: 'error',
            message: `Erreur vérification mémoire: ${error.message}`
        };
    }
}

// Vérification des variables d'environnement
function checkEnvironment() {
    try {
        const requiredVars = ['GEMINI_API_KEY'];
        const optionalVars = ['BOT_NAME', 'RP_WORLD', 'DEFAULT_CHARACTER'];
        
        const missing = [];
        const present = [];
        
        // Vérifier les variables requises
        requiredVars.forEach(varName => {
            if (process.env[varName] && process.env[varName] !== 'YOUR_GEMINI_API_KEY_HERE') {
                present.push(varName);
            } else {
                missing.push(varName);
            }
        });
        
        // Vérifier les variables optionnelles
        optionalVars.forEach(varName => {
            if (process.env[varName]) {
                present.push(varName);
            }
        });
        
        const isHealthy = missing.length === 0;
        
        return {
            status: isHealthy ? 'ok' : 'error',
            details: {
                present: present.length,
                missing: missing,
                total: requiredVars.length + optionalVars.length
            },
            message: isHealthy ? 'Configuration complète' : `Variables manquantes: ${missing.join(', ')}`
        };
    } catch (error) {
        return {
            status: 'error',
            message: `Erreur vérification environnement: ${error.message}`
        };
    }
}

// Vérification de la configuration Gemini
function checkGeminiConfig() {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        
        if (!apiKey) {
            return {
                status: 'error',
                message: 'Clé API Gemini manquante'
            };
        }
        
        if (apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
            return {
                status: 'error',
                message: 'Clé API Gemini non configurée (valeur par défaut)'
            };
        }
        
        if (apiKey.length < 20) {
            return {
                status: 'warning',
                message: 'Clé API Gemini semble invalide (trop courte)'
            };
        }
        
        return {
            status: 'ok',
            details: {
                configured: true,
                length: apiKey.length,
                prefix: apiKey.substring(0, 8) + '...'
            },
            message: 'Clé API Gemini configurée'
        };
    } catch (error) {
        return {
            status: 'error',
            message: `Erreur vérification Gemini: ${error.message}`
        };
    }
}

// Vérification des dépendances critiques
async function checkDependencies() {
    try {
        const criticalDeps = [
            '@google/generative-ai'
        ];
        
        const results = [];
        
        for (const dep of criticalDeps) {
            try {
                await import(dep);
                results.push({ name: dep, status: 'ok' });
            } catch (error) {
                results.push({ 
                    name: dep, 
                    status: 'error',
                    error: error.message 
                });
            }
        }
        
        const allOk = results.every(r => r.status === 'ok');
        
        return {
            status: allOk ? 'ok' : 'error',
            details: results,
            message: allOk ? 'Toutes les dépendances sont disponibles' : 'Certaines dépendances sont manquantes'
        };
    } catch (error) {
        return {
            status: 'error',
            message: `Erreur vérification dépendances: ${error.message}`
        };
    }
}