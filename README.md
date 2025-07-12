# 🤖 Bot WhatsApp avec IA Gemini

Un bot WhatsApp intelligent avec interface web, intégration IA Gemini et gestion d'images stock, déployable sur Vercel.

## ✨ Fonctionnalités

- **🔗 Connexion WhatsApp** : Connexion sécurisée via QR code
- **🧠 Intelligence Artificielle** : Intégration avec Gemini AI pour des réponses intelligentes
- **🖼️ Images Stock** : Envoi d'images avec messages via l'API Unsplash
- **📱 Interface Web** : Interface moderne et responsive
- **💬 Gestion des Messages** : Envoi et réception de messages en temps réel
- **📊 Historique** : Suivi des messages envoyés
- **🔄 Temps Réel** : Communication via WebSocket
- **☁️ Déployable** : Prêt pour Vercel

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone <votre-repo>
cd whatsapp-ai-bot
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration

Copiez le fichier `.env.example` vers `.env` et configurez les variables :

```bash
cp .env.example .env
```

Éditez le fichier `.env` :

```env
# Configuration du serveur
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Configuration Gemini AI (obligatoire)
GEMINI_API_KEY=your_gemini_api_key_here

# Configuration des images Unsplash (optionnel)
UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here

# Configuration WhatsApp
WHATSAPP_SESSION_NAME=whatsapp-ai-bot

# Configuration logging
LOG_LEVEL=info
```

### 4. Obtenir les clés API

#### Gemini AI (Google)
1. Allez sur [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Créez un nouveau projet ou utilisez un existant
3. Générez une clé API
4. Copiez la clé dans `GEMINI_API_KEY`

#### Unsplash (optionnel)
1. Créez un compte sur [Unsplash Developers](https://unsplash.com/developers)
2. Créez une nouvelle application
3. Copiez l'Access Key dans `UNSPLASH_ACCESS_KEY`

## 🏃‍♂️ Démarrage

### Mode développement

```bash
npm run dev
```

### Mode production

```bash
npm start
```

L'application sera accessible sur `http://localhost:3000`

## 📱 Utilisation

### 1. Connexion WhatsApp

1. Ouvrez l'interface web
2. Cliquez sur "Connecter WhatsApp"
3. Scannez le QR code avec votre téléphone
4. Attendez la confirmation de connexion

### 2. Envoi de messages

1. Entrez le numéro de téléphone (format français)
2. Écrivez votre demande pour l'IA
3. Ajoutez un contexte si nécessaire
4. Cliquez sur "Générer avec IA"
5. Modifiez le message si besoin
6. Cliquez sur "Envoyer"

### 3. Gestion des images

1. Cochez "Inclure une image"
2. Sélectionnez une catégorie
3. Prévisualisez l'image
4. Analysez l'image avec l'IA si souhaité

## 🌐 Déploiement sur Vercel

### 1. Préparer le projet

```bash
npm run build
```

### 2. Déployer sur Vercel

```bash
# Installer Vercel CLI
npm install -g vercel

# Déployer
vercel
```

### 3. Configurer les variables d'environnement

Dans le dashboard Vercel, ajoutez les variables d'environnement :

- `GEMINI_API_KEY`
- `UNSPLASH_ACCESS_KEY`
- `NODE_ENV=production`
- `WHATSAPP_SESSION_NAME`

### 4. Accéder à l'application

Votre bot sera disponible sur l'URL fournie par Vercel.

## 📡 API Endpoints

- `GET /api/status` - Statut du serveur et WhatsApp
- `POST /api/generate-ai-message` - Génération de message IA
- `POST /api/analyze-image` - Analyse d'image par IA
- `GET /api/random-image` - Récupération d'image aléatoire

## 🔧 Configuration avancée

### Personnalisation de l'IA

Modifiez les prompts dans `services/gemini.js` :

```javascript
// Personnaliser le comportement de l'IA
const prompt = `Tu es un assistant personnalisé...`;
```

### Ajout de nouvelles catégories d'images

Dans `services/images.js`, ajoutez des catégories :

```javascript
const categories = {
    votre_categorie: ['mot-clé1', 'mot-clé2', ...],
    // ...
};
```

### Personnalisation de l'interface

Modifiez les styles dans `public/style.css` :

```css
:root {
    --primary-color: #votre-couleur;
    /* ... */
}
```

## 🐛 Dépannage

### Problèmes courants

1. **QR Code ne s'affiche pas**
   - Vérifiez que Puppeteer est installé
   - Redémarrez le serveur

2. **IA ne répond pas**
   - Vérifiez la clé API Gemini
   - Consultez les logs d'erreur

3. **Images ne se chargent pas**
   - Vérifiez la clé Unsplash
   - Les images de secours sont utilisées par défaut

### Logs

Les logs sont disponibles dans :
- Console (développement)
- Fichiers `logs/` (production)

## 🤝 Contribution

1. Fork le projet
2. Créez une branche (`git checkout -b feature/nouvelle-fonctionnalité`)
3. Commit vos changements (`git commit -m 'Ajouter nouvelle fonctionnalité'`)
4. Push la branche (`git push origin feature/nouvelle-fonctionnalité`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🔐 Sécurité

- Ne partagez jamais vos clés API
- Utilisez des variables d'environnement
- Activez l'authentification en production
- Surveillez les logs d'accès

## 📞 Support

Pour toute question ou problème :

1. Consultez la documentation
2. Vérifiez les issues existantes
3. Créez une nouvelle issue si nécessaire

## 🎯 Roadmap

- [ ] Authentification utilisateur
- [ ] Gestion multi-utilisateurs
- [ ] Webhooks WhatsApp Business
- [ ] Intégration d'autres IA
- [ ] Système de plugins
- [ ] Interface mobile dédiée

---

Développé avec ❤️ pour automatiser vos communications WhatsApp avec l'intelligence artificielle.