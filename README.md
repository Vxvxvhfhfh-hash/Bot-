# 🤖 WhatsApp AI Bot

Un bot WhatsApp intelligent avec interface web, IA conversationnelle et recherche d'images automatique.

## 🌟 Fonctionnalités

- **Connexion WhatsApp Web** : QR Code ou Code de jumelage
- **Intelligence Artificielle** : Réponses automatiques avec OpenAI GPT
- **Recherche d'images** : Intégration Google Custom Search
- **Interface web moderne** : Dashboard de gestion complet
- **Déployable sur Vercel** : Configuration optimisée pour le cloud

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone <repository-url>
cd whatsapp-ai-bot
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration des variables d'environnement

Créez un fichier `.env.local` basé sur `.env.example` :

```bash
cp .env.example .env.local
```

Remplissez les variables suivantes :

```env
# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Google Custom Search API (optionnel)
GOOGLE_SEARCH_API_KEY=your_google_search_api_key_here
GOOGLE_SEARCH_ENGINE_ID=your_google_search_engine_id_here

# Configuration
PORT=3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Démarrer l'application

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:3000`

## 🔧 Configuration

### Obtenir les clés API

#### OpenAI API Key
1. Aller sur [OpenAI Platform](https://platform.openai.com/)
2. Créer un compte ou se connecter
3. Aller dans "API Keys"
4. Créer une nouvelle clé API
5. Copier la clé dans `OPENAI_API_KEY`

#### Google Custom Search API (optionnel)
1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créer un projet ou sélectionner un projet existant
3. Activer l'API "Custom Search JSON API"
4. Créer des identifiants API
5. Créer un moteur de recherche personnalisé sur [Google CSE](https://cse.google.com/)
6. Copier l'ID du moteur de recherche et la clé API

### Configuration du bot

Une fois l'application démarrée, vous pouvez configurer le bot via l'interface web :

1. **Connexion WhatsApp** : Scannez le QR code ou utilisez le code de jumelage
2. **Configuration IA** : Ajustez la personnalité et les paramètres
3. **Paramètres images** : Configurez la recherche d'images automatique

## 📱 Utilisation

### Connexion WhatsApp

1. Allez dans l'onglet "Connexion"
2. Choisissez votre méthode de connexion (QR Code ou Code de jumelage)
3. Suivez les instructions pour connecter votre WhatsApp

### Configuration du bot

1. Allez dans l'onglet "Configuration"
2. Activez/désactivez les fonctionnalités selon vos besoins
3. Personnalisez la personnalité de l'IA
4. Configurez les mots-clés pour la recherche d'images

### Chat et test

1. Utilisez l'onglet "Chat" pour tester le bot
2. Envoyez des messages et observez les réponses de l'IA
3. Testez la recherche d'images avec des mots-clés appropriés

## 🚀 Déploiement sur Vercel

### 1. Préparer le déploiement

```bash
npm run build
```

### 2. Déployer sur Vercel

#### Option A : Via Vercel CLI

```bash
npm install -g vercel
vercel
```

#### Option B : Via GitHub

1. Poussez votre code sur GitHub
2. Connectez votre repository à Vercel
3. Configurez les variables d'environnement
4. Déployez automatiquement

### 3. Configurer les variables d'environnement sur Vercel

Dans le dashboard Vercel, ajoutez :

- `OPENAI_API_KEY`
- `GOOGLE_SEARCH_API_KEY`
- `GOOGLE_SEARCH_ENGINE_ID`

## 🛠️ Développement

### Structure du projet

```
whatsapp-ai-bot/
├── app/                    # Application Next.js
│   ├── api/               # Routes API
│   ├── globals.css        # Styles globaux
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Page d'accueil
├── components/            # Composants React
│   ├── WhatsAppConnection.tsx
│   ├── ChatInterface.tsx
│   └── ConfigPanel.tsx
├── lib/                   # Services et utilitaires
│   ├── whatsapp.ts        # Service WhatsApp
│   ├── ai.ts              # Service IA
│   └── imageSearch.ts     # Service de recherche d'images
├── types/                 # Types TypeScript
└── utils/                 # Utilitaires
```

### Scripts disponibles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Démarrer en production
npm start

# Linting
npm run lint
```

### Technologies utilisées

- **Next.js 14** : Framework React
- **TypeScript** : Typage statique
- **Tailwind CSS** : Styling
- **WhatsApp Web.js** : API WhatsApp
- **OpenAI** : Intelligence artificielle
- **Google Custom Search** : Recherche d'images
- **Socket.io** : Communication temps réel

## 🔒 Sécurité

- Les clés API sont chiffrées côté serveur
- Validation des entrées utilisateur
- Gestion des erreurs et logging
- Rate limiting sur les API

## 🐛 Dépannage

### Problèmes courants

1. **WhatsApp ne se connecte pas**
   - Vérifiez que Puppeteer est correctement installé
   - Redémarrez l'application
   - Vérifiez les logs pour les erreurs

2. **L'IA ne répond pas**
   - Vérifiez votre clé API OpenAI
   - Vérifiez votre crédit OpenAI
   - Consultez les logs d'erreur

3. **Les images ne s'affichent pas**
   - Vérifiez la configuration Google Custom Search
   - Les images de fallback Unsplash sont utilisées par défaut

### Logs

Les logs sont disponibles dans :
- Console du navigateur (frontend)
- Logs Vercel (production)
- Console Node.js (développement)

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez :

1. Forker le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📞 Support

Pour toute question ou problème :
- Ouvrez une issue sur GitHub
- Consultez la documentation
- Vérifiez les logs d'erreur

---

**Note importante** : Ce bot est destiné à des fins éducatives et de démonstration. Assurez-vous de respecter les conditions d'utilisation de WhatsApp et les lois locales lors de l'utilisation de ce bot.