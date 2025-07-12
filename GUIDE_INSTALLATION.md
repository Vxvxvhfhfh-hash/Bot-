# 🚀 Guide d'Installation Rapide - Bot WhatsApp Gemini

## 📋 Résumé du Projet

Un bot WhatsApp intelligent qui combine :
- **🧠 IA Google Gemini EXCLUSIVEMENT** pour les conversations
- **🖼️ Images stock** (Unsplash, Pexels, images aléatoires)
- **📱 WhatsApp Web.js** pour la connexion
- **🎯 Commandes personnalisées** avec préfixe

> ⚠️ **IMPORTANT**: Ce bot utilise UNIQUEMENT l'intelligence artificielle Google Gemini. Aucune autre IA (OpenAI, Claude, etc.) n'est utilisée.

## ⚡ Installation Express (5 minutes)

### 1. Prérequis
```bash
# Vérifier Node.js (16+ requis)
node --version

# Si Node.js n'est pas installé :
# Télécharger sur https://nodejs.org/
```

### 2. Installation automatique
```bash
# Installer les dépendances
npm run install-bot

# OU installation manuelle
npm install
```

### 3. Configuration
```bash
# Éditer le fichier .env (créé automatiquement)
nano .env

# Ajouter au minimum :
GEMINI_API_KEY=votre_clé_api_gemini
```

### 4. Obtenir la clé Gemini (OBLIGATOIRE)
1. Aller sur https://makersuite.google.com/app/apikey
2. Créer une nouvelle clé API
3. Copier la clé dans le fichier .env

### 5. Démarrer le bot
```bash
# Démarrage avec vérifications
npm run quick-start

# OU démarrage simple
npm start
```

### 6. Connexion WhatsApp
1. Un QR code apparaît dans le terminal
2. Ouvrir WhatsApp sur le téléphone
3. Aller dans **Paramètres** > **WhatsApp Web**
4. Scanner le QR code
5. ✅ Bot connecté !

## 🎮 Commandes Disponibles

| Commande | Description |
|----------|-------------|
| `!help` | Afficher l'aide |
| `!status` | Statut du bot |
| `!info` | Informations sur le bot |
| `!image nature` | Générer une image "nature" |
| `!Bonjour` | Discuter avec l'IA |
| `!Raconte une blague` | Demande créative |

## 🔧 Configuration Avancée (Optionnel)

### APIs d'images (pour de meilleures images)
```bash
# Unsplash (gratuit)
UNSPLASH_ACCESS_KEY=votre_clé_unsplash

# Pexels (gratuit)
PEXELS_API_KEY=votre_clé_pexels
```

### Personnalisation du bot
```bash
BOT_NAME=Mon Bot Perso
BOT_PREFIX=@
ENABLE_IMAGES=true
```

## 🐳 Déploiement Docker

### Option 1 : Docker Compose (recommandé)
```bash
# Construire et démarrer
npm run docker:run

# Voir les logs
npm run docker:logs

# Arrêter
npm run docker:stop
```

### Option 2 : Docker manuel
```bash
# Construire l'image
docker build -t whatsapp-gemini-bot .

# Démarrer le conteneur
docker run -d --name whatsapp-bot \
  --env-file .env \
  -v $(pwd)/data:/app/.wwebjs_auth \
  whatsapp-gemini-bot
```

## 🧪 Tests

```bash
# Tester toutes les fonctionnalités
npm test

# Vérifier la configuration
npm run quick-start
```

## 📊 Structure des Fichiers

```
whatsapp-gemini-bot/
├── 📄 index.js              # Bot principal
├── 📄 package.json          # Configuration npm
├── 📄 .env.example          # Configuration exemple
├── 📄 config.js             # Configuration avancée
├── 📁 temp/                 # Images temporaires
├── 📁 logs/                 # Logs des messages
├── 🐳 Dockerfile            # Configuration Docker
├── 🐳 docker-compose.yml    # Docker Compose
├── 🛠️ install.js           # Script d'installation
├── 🛠️ start.js             # Script de démarrage
├── 🛠️ test.js              # Tests automatisés
└── 📖 README.md             # Documentation complète
```

## 🚨 Dépannage Rapide

### Problème : "GEMINI_API_KEY is required"
```bash
# Vérifier le fichier .env
cat .env

# Ajouter la clé
echo "GEMINI_API_KEY=votre_clé_ici" >> .env
```

### Problème : "Failed to load page"
```bash
# Vérifier la connexion Internet
ping google.com

# Redémarrer le bot
npm start
```

### Problème : QR code ne s'affiche pas
```bash
# Vérifier les dépendances
npm install

# Démarrer en mode debug
DEBUG=* npm start
```

### Problème : Images ne s'envoient pas
```bash
# Vérifier la configuration
echo $UNSPLASH_ACCESS_KEY

# Utiliser les images aléatoires
IMAGE_PROVIDER=random npm start
```

## 📱 Utilisation

### Première utilisation
1. Envoyer `!help` au bot
2. Tester avec `!status`
3. Demander une image : `!image chat`
4. Poser une question : `!Explique-moi l'IA`

### Conseils d'utilisation
- **Préfixe** : Toujours commencer par `!`
- **Images** : Utiliser des mots-clés simples
- **Conversations** : Poser des questions naturelles
- **Erreurs** : Vérifier les logs dans `logs/`

## 🔄 Maintenance

### Mise à jour
```bash
# Mettre à jour les dépendances
npm update

# Redémarrer le bot
npm start
```

### Sauvegardes
```bash
# Sauvegarder les données WhatsApp
cp -r .wwebjs_auth/ backup/

# Sauvegarder les logs
tar -czf logs-backup.tar.gz logs/
```

## 🎯 Prochaines Étapes

1. **Personnaliser** le bot avec vos propres réponses
2. **Ajouter** des commandes personnalisées
3. **Configurer** un serveur pour un déploiement permanent
4. **Intégrer** d'autres APIs (météo, news, etc.)
5. **Créer** des réponses automatiques

## 📞 Support

- **Documentation** : README.md
- **Issues** : GitHub Issues
- **Logs** : Dossier `logs/`
- **Tests** : `npm test`

---

**🎉 Félicitations ! Votre bot WhatsApp Gemini est prêt à être utilisé !**

*Développé avec ❤️ en Node.js*