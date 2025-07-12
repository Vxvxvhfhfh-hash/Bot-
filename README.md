# 🤖 Bot WhatsApp Gemini avec Images Stock

Un bot WhatsApp intelligent utilisant **EXCLUSIVEMENT** l'intelligence artificielle Google Gemini et des images stock media, développé en Node.js.

## 🚀 Fonctionnalités

- **🧠 Intelligence Artificielle**: Powered by Google Gemini Pro UNIQUEMENT
- **💬 Conversations naturelles**: Réponses contextuelles et intelligentes
- **🖼️ Images stock**: Intégration avec Unsplash, Pexels et images aléatoires
- **📱 WhatsApp Web**: Connection facile via QR code
- **🔧 Commandes personnalisées**: Système de commandes avec préfixe
- **📊 Logging**: Enregistrement des messages et statistiques
- **🎯 Réponses contextuelles**: Images suggérées basées sur le contenu

## 🧠 Pourquoi Google Gemini ?

Ce bot utilise **exclusivement** l'intelligence artificielle Google Gemini pour plusieurs raisons :

- **🚀 Performance**: Gemini Pro offre des réponses rapides et précises
- **🌐 Multilingue**: Support natif de nombreuses langues
- **🔒 Sécurité**: API sécurisée et fiable de Google
- **💡 Innovation**: Dernière technologie d'IA de Google
- **🎯 Spécialisation**: Optimisé pour les conversations naturelles

## 📋 Prérequis

- Node.js 16+ 
- npm ou yarn
- Compte Google Cloud (pour Gemini API)
- Comptes API optionnels:
  - Unsplash (pour images haute qualité)
  - Pexels (alternative aux images)

## 📦 Installation

1. **Cloner le projet**:
```bash
git clone <votre-repo>
cd whatsapp-gemini-bot
```

2. **Installer les dépendances**:
```bash
npm install
```

3. **Configuration**:
```bash
cp .env.example .env
```

4. **Configurer le fichier .env**:
```env
# Obligatoire
GEMINI_API_KEY=your_gemini_api_key_here

# Optionnel (pour de meilleures images)
UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
PEXELS_API_KEY=your_pexels_api_key_here

# Configuration du bot
BOT_NAME=Gemini Bot
BOT_PREFIX=!
MAX_MESSAGE_LENGTH=2000
ENABLE_IMAGES=true
IMAGE_PROVIDER=unsplash
```

## 🔑 Obtenir les clés API

### Google Gemini API (OBLIGATOIRE)
1. Aller sur [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Créer une nouvelle clé API
3. Copier la clé dans `GEMINI_API_KEY`

> ⚠️ **IMPORTANT**: Seule la clé API Google Gemini est requise. N'ajoutez AUCUNE autre clé d'IA (Claude, etc.)

### Unsplash API (Optionnel)
1. Créer un compte sur [Unsplash Developers](https://unsplash.com/developers)
2. Créer une nouvelle application
3. Copier l'Access Key dans `UNSPLASH_ACCESS_KEY`

### Pexels API (Optionnel)
1. Créer un compte sur [Pexels API](https://www.pexels.com/api/)
2. Générer une clé API
3. Copier la clé dans `PEXELS_API_KEY`

## 🎯 Utilisation

### Démarrer le bot
```bash
npm start
```

### Mode développement
```bash
npm run dev
```

### Première connexion
1. Lancer le bot
2. Scanner le QR code avec WhatsApp
3. Le bot est maintenant connecté!

## 📱 Commandes

### Commandes de base
- `!help` ou `!aide` - Afficher l'aide
- `!status` - Statut du bot
- `!info` - Informations sur le bot

### Commandes d'images
- `!image nature` - Envoyer une image sur le thème "nature"
- `!image technology` - Envoyer une image sur le thème "technologie"

### Conversation IA
- `!Bonjour, comment ça va?` - Conversation avec l'IA
- `!Explique-moi l'intelligence artificielle` - Questions complexes
- `!Raconte-moi une blague` - Demandes créatives

## 🔧 Configuration avancée

### Personnalisation du bot
```env
BOT_NAME=Mon Bot Personnalisé
BOT_PREFIX=@
MAX_MESSAGE_LENGTH=1500
```

### Providers d'images
```env
IMAGE_PROVIDER=unsplash  # Options: unsplash, pexels, random
```

### Désactiver les images
```env
ENABLE_IMAGES=false
```

## 📊 Structure du projet

```
whatsapp-gemini-bot/
├── index.js              # Fichier principal
├── package.json          # Dépendances
├── .env.example          # Configuration exemple
├── README.md             # Documentation
├── temp/                 # Images temporaires
└── logs/                 # Logs des messages
```

## 🤝 Fonctionnalités avancées

### Auto-suggestion d'images
Le bot peut automatiquement suggérer des images pertinentes basées sur le contenu de la conversation (30% de chance).

### Logging des messages
Tous les messages sont enregistrés dans le dossier `logs/` avec horodatage.

### Gestion des erreurs
Le bot gère gracieusement les erreurs et continue de fonctionner.

### Nettoyage automatique
Les images temporaires sont automatiquement supprimées après envoi.

## 🛠️ Dépannage

### Erreurs courantes

**"GEMINI_API_KEY is required"**
- Vérifier que la clé API Gemini est correctement configurée dans .env

**"Failed to load page"**
- Vérifier la connexion Internet
- Redémarrer le bot

**"Unable to find image"**
- Vérifier les clés API des providers d'images
- Essayer avec `IMAGE_PROVIDER=random`

### Logs de débogage
Les logs sont disponibles dans le dossier `logs/` pour diagnostiquer les problèmes.

## 🔒 Sécurité

- Ne jamais commiter le fichier `.env`
- Garder les clés API privées
- Utiliser des tokens avec permissions limitées

## 🚀 Déploiement

### Serveur local
```bash
npm start
```

### PM2 (recommandé pour production)
```bash
npm install -g pm2
pm2 start index.js --name whatsapp-bot
pm2 save
pm2 startup
```

### Docker (optionnel)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
```

## 📝 Licence

MIT License - Voir le fichier LICENSE pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues! N'hésitez pas à ouvrir une issue ou une pull request.

## 📞 Support

Pour toute question ou problème, n'hésitez pas à ouvrir une issue sur GitHub.

---

**Développé avec ❤️ en Node.js**