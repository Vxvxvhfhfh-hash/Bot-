require('dotenv').config();

const config = {
    // Configuration du bot
    bot: {
        name: process.env.BOT_NAME || 'Gemini Bot',
        prefix: process.env.BOT_PREFIX || '!',
        maxMessageLength: parseInt(process.env.MAX_MESSAGE_LENGTH) || 2000,
        enableImages: process.env.ENABLE_IMAGES === 'true',
        imageProvider: process.env.IMAGE_PROVIDER || 'unsplash',
        autoSuggestImages: process.env.AUTO_SUGGEST_IMAGES !== 'false',
        autoSuggestProbability: parseFloat(process.env.AUTO_SUGGEST_PROBABILITY) || 0.3
    },

    // Configuration des APIs
    apis: {
        gemini: {
            key: process.env.GEMINI_API_KEY,
            model: process.env.GEMINI_MODEL || 'gemini-pro',
            maxTokens: parseInt(process.env.GEMINI_MAX_TOKENS) || 1000
        },
        unsplash: {
            accessKey: process.env.UNSPLASH_ACCESS_KEY,
            perPage: parseInt(process.env.UNSPLASH_PER_PAGE) || 10,
            orientation: process.env.UNSPLASH_ORIENTATION || 'landscape'
        },
        pexels: {
            apiKey: process.env.PEXELS_API_KEY,
            perPage: parseInt(process.env.PEXELS_PER_PAGE) || 10,
            orientation: process.env.PEXELS_ORIENTATION || 'landscape'
        }
    },

    // Configuration des images
    images: {
        defaultSize: {
            width: parseInt(process.env.IMAGE_WIDTH) || 800,
            height: parseInt(process.env.IMAGE_HEIGHT) || 600
        },
        tempDir: process.env.TEMP_DIR || './temp',
        cleanupDelay: parseInt(process.env.CLEANUP_DELAY) || 5000,
        downloadTimeout: parseInt(process.env.DOWNLOAD_TIMEOUT) || 10000
    },

    // Configuration du logging
    logging: {
        enabled: process.env.LOGGING_ENABLED !== 'false',
        dir: process.env.LOG_DIR || './logs',
        level: process.env.LOG_LEVEL || 'info',
        maxFiles: parseInt(process.env.LOG_MAX_FILES) || 7,
        maxSize: process.env.LOG_MAX_SIZE || '10m'
    },

    // Configuration WhatsApp
    whatsapp: {
        puppeteer: {
            headless: process.env.PUPPETEER_HEADLESS !== 'false',
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
        },
        authStrategy: process.env.AUTH_STRATEGY || 'local',
        sessionName: process.env.SESSION_NAME || 'whatsapp-session'
    },

    // Configuration des commandes
    commands: {
        help: ['help', 'aide', 'h'],
        status: ['status', 'statut', 'état'],
        info: ['info', 'information', 'about'],
        image: ['image', 'img', 'photo', 'picture']
    },

    // Messages prédéfinis
    messages: {
        welcome: process.env.WELCOME_MESSAGE || '🤖 Bonjour! Je suis votre assistant IA. Tapez !help pour voir les commandes disponibles.',
        error: process.env.ERROR_MESSAGE || '❌ Une erreur est survenue. Veuillez réessayer plus tard.',
        noImage: process.env.NO_IMAGE_MESSAGE || '❌ Impossible de trouver une image pour cette recherche.',
        processing: process.env.PROCESSING_MESSAGE || '🤔 Je réfléchis...',
        typing: process.env.TYPING_MESSAGE || '✍️ En train de taper...'
    },

    // Configuration de sécurité
    security: {
        rateLimiting: {
            enabled: process.env.RATE_LIMITING_ENABLED !== 'false',
            windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 60000, // 1 minute
            maxRequests: parseInt(process.env.RATE_LIMIT_MAX) || 10
        },
        blockedWords: process.env.BLOCKED_WORDS ? process.env.BLOCKED_WORDS.split(',').map(w => w.trim()) : [],
        allowedUsers: process.env.ALLOWED_USERS ? process.env.ALLOWED_USERS.split(',').map(u => u.trim()) : [],
        adminUsers: process.env.ADMIN_USERS ? process.env.ADMIN_USERS.split(',').map(u => u.trim()) : []
    },

    // Configuration de développement
    development: {
        enabled: process.env.NODE_ENV === 'development',
        debug: process.env.DEBUG === 'true',
        mockResponses: process.env.MOCK_RESPONSES === 'true'
    }
};

// Validation des configurations obligatoires
const requiredConfigs = [
    'apis.gemini.key'
];

function validateConfig() {
    const missingConfigs = [];

    requiredConfigs.forEach(path => {
        const value = getNestedValue(config, path);
        if (!value) {
            missingConfigs.push(path);
        }
    });

    if (missingConfigs.length > 0) {
        console.error('❌ Configurations manquantes:');
        missingConfigs.forEach(cfg => console.error(`  - ${cfg}`));
        process.exit(1);
    }
}

function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Fonction pour obtenir la configuration complète
function getConfig() {
    return config;
}

// Fonction pour obtenir une configuration spécifique
function get(path, defaultValue = null) {
    return getNestedValue(config, path) || defaultValue;
}

// Validation au chargement du module
validateConfig();

module.exports = {
    config,
    getConfig,
    get,
    validateConfig
};