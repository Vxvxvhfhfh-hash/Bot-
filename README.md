# 🤖 WhatsApp AI Bot avec Gemini

Un bot WhatsApp intelligent utilisant l'IA Google Gemini pour répondre automatiquement aux messages avec du texte et des images stock.

## 🚀 Fonctionnalités

- **Connexion WhatsApp Web** : Scan QR code pour connecter votre numéro
- **IA Gemini** : Réponses intelligentes en français
- **Images automatiques** : Recherche et envoi d'images depuis Unsplash/Google
- **Interface web moderne** : Gestion complète via navigateur
- **Configuration flexible** : Personnalisation du comportement du bot
- **Déployable sur Vercel** : Prêt pour la production

## 📋 Prérequis

- Node.js 18+
- Compte Google Cloud (pour Gemini API)
- Compte Unsplash (optionnel, pour les images)
- Compte Vercel (pour le déploiement)

## 🛠️ Installation

### 1. Cloner le projet
```bash
git clone <url-du-repo>
cd whatsapp-ai-bot
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration des variables d'environnement

Créer un fichier `.env.local` :

```env
# Google Gemini API
GOOGLE_API_KEY=votre_cle_gemini_api

# Unsplash API (optionnel)
UNSPLASH_ACCESS_KEY=votre_cle_unsplash

# Google Custom Search (optionnel)
GOOGLE_SEARCH_API_KEY=votre_cle_google_search
GOOGLE_SEARCH_ENGINE_ID=votre_id_moteur_recherche
```

### 4. Obtenir les clés API

#### Google Gemini API
1. Aller sur [Google AI Studio](https://aistudio.google.com/)
2. Créer un nouveau projet
3. Générer une clé API
4. Copier la clé dans `GOOGLE_API_KEY`

#### Unsplash API (optionnel)
1. Créer un compte sur [Unsplash Developers](https://unsplash.com/developers)
2. Créer une nouvelle application
3. Copier l'Access Key dans `UNSPLASH_ACCESS_KEY`

#### Google Custom Search (optionnel)
1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Activer l'API Custom Search
3. Créer des identifiants
4. Configurer un moteur de recherche personnalisé

## 🚀 Démarrage local

```bash
# Mode développement
npm run dev

# Mode production
npm run build
npm start
```

L'application sera disponible sur `http://localhost:3000`

## 🌐 Déploiement sur Vercel

### 1. Déploiement automatique

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/votre-username/whatsapp-ai-bot)

### 2. Déploiement manuel

```bash
# Installer Vercel CLI
npm install -g vercel

# Déployer
vercel --prod
```

### 3. Configuration des variables d'environnement

Dans le dashboard Vercel, ajouter les variables :

- `GOOGLE_API_KEY` : Votre clé API Gemini
- `UNSPLASH_ACCESS_KEY` : Votre clé Unsplash
- `GOOGLE_SEARCH_API_KEY` : Votre clé Google Search
- `GOOGLE_SEARCH_ENGINE_ID` : Votre ID moteur de recherche

## 📱 Utilisation

### 1. Connexion WhatsApp

1. Ouvrir l'application web
2. Cliquer sur "Se connecter"
3. Scanner le QR code avec WhatsApp
4. Attendre la confirmation de connexion

### 2. Configuration du bot

- **Onglet Configuration** : Personnaliser le comportement
- **Personnalité** : Modifier le prompt de l'IA
- **Images** : Configurer les mots-clés déclencheurs
- **Délais** : Ajuster le temps de réponse

### 3. Gestion des conversations

- **Onglet Chat** : Voir les conversations actives
- **Réponses manuelles** : Envoyer des messages personnalisés
- **Historique** : Consulter l'historique des échanges

## 🔧 Configuration avancée

### Personnalisation de l'IA

```javascript
// Exemple de prompt personnalisé
const prompt = `
Tu es un assistant commercial pour une entreprise de technologie.
Tu dois être professionnel, amical et toujours proposer des solutions.
Réponds toujours en français et de manière concise.
`;
```

### Mots-clés pour images

```javascript
const imageKeywords = [
  'photo', 'image', 'picture', 'montrer', 'voir',
  'produit', 'catalogue', 'exemple', 'démonstration'
];
```

### Gestion des erreurs

Le bot gère automatiquement :
- Les erreurs de connexion WhatsApp
- Les limites de l'API Gemini
- Les images indisponibles
- Les timeouts de réponse

## � Surveillance et logs

### Logs disponibles

- Connexions/déconnexions WhatsApp
- Messages reçus et envoyés
- Erreurs API
- Recherches d'images

### Métriques

- Nombre de messages traités
- Temps de réponse moyen
- Taux de succès des images
- Utilisation de l'API

## 🔒 Sécurité

### Bonnes pratiques

- **Variables d'environnement** : Jamais dans le code
- **Rate limiting** : Limiter les requêtes API
- **Validation** : Vérifier tous les inputs
- **Logs** : Pas de données sensibles

### Limitations

- **Gemini API** : Quotas par jour/minute
- **WhatsApp** : Limite de messages par seconde
- **Images** : Taille max des fichiers

## 🛠️ Développement

### Structure du projet

```
├── app/
│   ├── api/              # APIs Next.js
│   ├── components/       # Composants React
│   └── page.tsx         # Page principale
├── lib/
│   ├── ai.ts            # Service Gemini
│   ├── whatsapp.ts      # Service WhatsApp
│   ├── imageSearch.ts   # Service images
│   └── botService.ts    # Service principal
├── types/
│   └── index.ts         # Types TypeScript
└── components/
    ├── QRCodeDisplay.tsx
    ├── ChatInterface.tsx
    ├── BotConfig.tsx
    └── ConnectionStatus.tsx
```

### Scripts disponibles

```bash
npm run dev        # Développement
npm run build      # Build production
npm run start      # Démarrage production
npm run lint       # Vérification code
npm run type-check # Vérification types
```

### Ajout de nouvelles fonctionnalités

1. **Nouveau service** : Créer dans `lib/`
2. **Nouvelle API** : Ajouter dans `app/api/`
3. **Nouveau composant** : Créer dans `components/`
4. **Nouveaux types** : Ajouter dans `types/`

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Commit les changements
4. Push vers la branche
5. Créer une Pull Request

## 📄 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

### Problèmes courants

**QR Code ne s'affiche pas**
- Vérifier la connexion internet
- Redémarrer l'application
- Vider le cache du navigateur

**Bot ne répond pas**
- Vérifier la clé API Gemini
- Vérifier la configuration
- Consulter les logs

**Images ne s'envoient pas**
- Vérifier la clé Unsplash
- Vérifier la connexion internet
- Tester avec les images par défaut

### Contact

- **Issues** : Créer une issue sur GitHub
- **Email** : support@example.com
- **Discord** : [Serveur Discord](https://discord.gg/example)

## 🔄 Roadmap

- [ ] Support des messages vocaux
- [ ] Intégration avec d'autres IA
- [ ] Sauvegarde automatique des conversations
- [ ] Interface d'administration avancée
- [ ] Support multilingue
- [ ] Intégration avec bases de données

---

⭐ **N'oubliez pas de mettre une étoile si ce projet vous a aidé !**