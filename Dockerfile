# Utiliser Node.js 18 LTS comme image de base
FROM node:18-alpine

# Mettre à jour les packages système et installer les dépendances nécessaires
RUN apk update && apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    && rm -rf /var/cache/apk/*

# Définir les variables d'environnement pour Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs && \
    adduser -S whatsapp -u 1001 -G nodejs

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration des dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production && npm cache clean --force

# Copier le code source
COPY . .

# Créer les dossiers nécessaires
RUN mkdir -p temp logs backups .wwebjs_auth .wwebjs_cache

# Changer le propriétaire des fichiers
RUN chown -R whatsapp:nodejs /app

# Basculer vers l'utilisateur non-root
USER whatsapp

# Exposer le port (optionnel, pour les métriques ou API)
EXPOSE 3000

# Définir les volumes pour la persistance des données
VOLUME ["/app/.wwebjs_auth", "/app/.wwebjs_cache", "/app/logs", "/app/temp"]

# Commande de démarrage
CMD ["npm", "start"]

# Métadonnées
LABEL maintainer="WhatsApp Gemini Bot" \
      description="Bot WhatsApp avec IA Gemini et images stock" \
      version="1.0.0"

# Vérification de santé
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "console.log('Bot en cours d\'exécution')" || exit 1