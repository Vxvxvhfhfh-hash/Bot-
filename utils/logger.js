const winston = require('winston');
const path = require('path');

// Configuration des niveaux de log
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
};

// Configuration des couleurs
const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  verbose: 'grey',
  debug: 'white',
  silly: 'rainbow'
};

winston.addColors(logColors);

// Format pour les logs
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Format pour la console
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    if (stack) {
      log += '\n' + stack;
    }
    return log;
  })
);

// Configuration des transports
const transports = [
  // Console transport
  new winston.transports.Console({
    format: consoleFormat,
    level: process.env.LOG_LEVEL || 'info'
  })
];

// Ajouter les transports de fichier seulement en production
if (process.env.NODE_ENV === 'production') {
  transports.push(
    // Fichier pour tous les logs
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/combined.log'),
      format: logFormat,
      level: 'info',
      maxsize: 10485760, // 10MB
      maxFiles: 5,
      tailable: true
    }),
    // Fichier pour les erreurs uniquement
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/error.log'),
      format: logFormat,
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5,
      tailable: true
    })
  );
}

// Créer le logger
const logger = winston.createLogger({
  levels: logLevels,
  format: logFormat,
  transports,
  // Ne pas quitter le processus en cas d'erreur
  exitOnError: false
});

// Fonction pour créer le dossier logs si nécessaire
const createLogDirectory = () => {
  const fs = require('fs');
  const logDir = path.join(__dirname, '../logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
};

// Créer le dossier logs en production
if (process.env.NODE_ENV === 'production') {
  createLogDirectory();
}

// Fonction pour loguer les requêtes HTTP
logger.httpLog = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const message = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;
    
    if (res.statusCode >= 400) {
      logger.warn(message);
    } else {
      logger.http(message);
    }
  });
  
  next();
};

// Fonction pour loguer les erreurs non capturées
logger.handleUncaughtExceptions = () => {
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
  });
};

// Fonction pour nettoyer les logs anciens
logger.cleanOldLogs = () => {
  const fs = require('fs');
  const logDir = path.join(__dirname, '../logs');
  
  if (fs.existsSync(logDir)) {
    const files = fs.readdirSync(logDir);
    const now = Date.now();
    const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 jours
    
    files.forEach(file => {
      const filePath = path.join(logDir, file);
      const stats = fs.statSync(filePath);
      
      if (now - stats.mtime.getTime() > maxAge) {
        fs.unlinkSync(filePath);
        logger.info(`Ancien fichier log supprimé: ${file}`);
      }
    });
  }
};

// Nettoyer les logs anciens toutes les 24 heures
if (process.env.NODE_ENV === 'production') {
  setInterval(logger.cleanOldLogs, 24 * 60 * 60 * 1000);
}

module.exports = logger;