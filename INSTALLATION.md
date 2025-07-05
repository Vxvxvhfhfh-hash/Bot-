# 📋 Guide d'installation - WhatsApp AI Bot

## Prérequis

- Node.js 18 ou plus récent
- npm ou yarn
- Compte OpenAI avec clé API
- Compte Google Cloud (optionnel pour la recherche d'images)

## Installation étape par étape

### 1. Cloner le projet

```bash
git clone <repository-url>
cd whatsapp-ai-bot
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration des variables d'environnement

Créez un fichier `.env.local` :

```bash
cp .env.example .env.local
```

Éditez le fichier `.env.local` avec vos clés API :

```env
# Obligatoire - Clé API OpenAI
OPENAI_API_KEY=sk-your-openai-api-key

# Optionnel - Google Custom Search pour les images
GOOGLE_SEARCH_API_KEY=your-google-api-key
GOOGLE_SEARCH_ENGINE_ID=your-search-engine-id

# Configuration
PORT=3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Obtenir la clé API OpenAI

1. Allez sur [OpenAI Platform](https://platform.openai.com/)
2. Créez un compte ou connectez-vous
3. Allez dans "API Keys" dans le menu
4. Cliquez sur "Create new secret key"
5. Copiez la clé générée dans `OPENAI_API_KEY`

### 5. Configurer Google Custom Search (optionnel)

#### Étape 1 : Google Cloud Console

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un existant
3. Activez l'API "Custom Search JSON API"
4. Créez des identifiants API (clé API)
5. Copiez la clé dans `GOOGLE_SEARCH_API_KEY`

#### Étape 2 : Moteur de recherche personnalisé

1. Allez sur [Google Custom Search](https://cse.google.com/)
2. Cliquez sur "Ajouter"
3. Entrez "images.google.com" comme site à rechercher
4. Créez le moteur de recherche
5. Dans les paramètres, activez "Recherche d'images"
6. Copiez l'ID du moteur dans `GOOGLE_SEARCH_ENGINE_ID`

### 6. Démarrer l'application

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:3000`

## Vérification de l'installation

1. Ouvrez `http://localhost:3000` dans votre navigateur
2. Vous devriez voir l'interface du bot WhatsApp
3. Allez dans l'onglet "Connexion" pour tester la connexion WhatsApp
4. Allez dans l'onglet "Configuration" pour vérifier les paramètres

## Résolution des problèmes

### Erreur : Module non trouvé

```bash
# Supprimez node_modules et reinstallez
rm -rf node_modules package-lock.json
npm install
```

### Erreur Puppeteer

```bash
# Installez les dépendances système pour Puppeteer
sudo apt-get install -y chromium-browser

# Ou pour macOS
brew install chromium
```

### Erreur de permission

```bash
# Assurez-vous que le dossier a les bonnes permissions
chmod -R 755 .
```

### WhatsApp ne se connecte pas

1. Vérifiez que Chromium/Chrome est installé
2. Vérifiez les logs dans la console
3. Redémarrez l'application
4. Essayez de supprimer le dossier `.wwebjs_auth` et reconnectez-vous

## Déploiement

### Déploiement local

```bash
npm run build
npm start
```

### Déploiement sur Vercel

```bash
# Installez Vercel CLI
npm install -g vercel

# Déployez
vercel

# Configurez les variables d'environnement sur Vercel
vercel env add OPENAI_API_KEY
vercel env add GOOGLE_SEARCH_API_KEY
vercel env add GOOGLE_SEARCH_ENGINE_ID
```

## Structure du projet

```
whatsapp-ai-bot/
├── app/                    # Application Next.js
│   ├── api/               # Routes API
│   ├── globals.css        # Styles globaux
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Page d'accueil
├── components/            # Composants React
├── lib/                   # Services et utilitaires
├── types/                 # Types TypeScript
├── utils/                 # Utilitaires
├── public/               # Fichiers statiques
├── .env.example          # Exemple de variables d'environnement
├── server.js             # Serveur Node.js avec WebSocket
└── package.json          # Configuration npm
```

## Fonctionnalités

✅ **Connexion WhatsApp** : QR Code ou Code de jumelage
✅ **IA Conversationnelle** : Réponses automatiques avec OpenAI
✅ **Recherche d'images** : Intégration Google Custom Search
✅ **Interface web** : Dashboard de gestion moderne
✅ **Communication temps réel** : WebSocket pour les mises à jour
✅ **Configuration flexible** : Paramètres personnalisables
✅ **Déployable** : Prêt pour Vercel et autres plateformes

## Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs dans la console
2. Consultez ce guide d'installation
3. Ouvrez une issue sur GitHub
4. Vérifiez que toutes les dépendances sont installées

## Licence

Ce projet est sous licence MIT.