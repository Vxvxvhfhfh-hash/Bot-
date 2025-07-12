# � Guide d'installation - WhatsApp AI Bot avec Gemini

Ce guide vous accompagne pas à pas pour installer et configurer votre bot WhatsApp avec IA Gemini.

## 📋 Prérequis système

### Logiciels requis
- **Node.js** version 18 ou supérieure
- **npm** (inclus avec Node.js)
- **Git** pour cloner le repository

### Services cloud requis
- **Google Cloud Platform** (pour l'API Gemini)
- **Unsplash** (optionnel, pour les images)
- **Google Custom Search** (optionnel, pour la recherche d'images)
- **Vercel** (pour le déploiement)

## 🚀 Installation locale

### 1. Cloner le projet

```bash
git clone https://github.com/votre-username/whatsapp-ai-bot.git
cd whatsapp-ai-bot
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration des variables d'environnement

Copiez le fichier d'exemple :
```bash
cp .env.example .env.local
```

Éditez le fichier `.env.local` avec vos clés API :
```env
GOOGLE_API_KEY=your_gemini_api_key_here
UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
GOOGLE_SEARCH_API_KEY=your_google_search_api_key_here
GOOGLE_SEARCH_ENGINE_ID=your_google_search_engine_id_here
```

### 4. Lancer en mode développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## 🔑 Configuration des APIs

### Google Gemini API

1. **Créer un projet Google Cloud**
   - Aller sur [Google Cloud Console](https://console.cloud.google.com/)
   - Créer un nouveau projet ou sélectionner un existant
   - Activer l'API Generative AI

2. **Obtenir la clé API**
   - Aller sur [Google AI Studio](https://aistudio.google.com/)
   - Créer une nouvelle clé API
   - Copier la clé dans `GOOGLE_API_KEY`

3. **Configurer les quotas**
   - Vérifier les limites de votre quota
   - Configurer les alertes si nécessaire

### Unsplash API (optionnel)

1. **Créer un compte développeur**
   - Aller sur [Unsplash Developers](https://unsplash.com/developers)
   - Créer un nouveau compte ou se connecter
   - Accepter les conditions d'utilisation

2. **Créer une application**
   - Cliquer sur "New Application"
   - Remplir les informations requises
   - Accepter les conditions d'utilisation

3. **Obtenir la clé**
   - Copier l'Access Key
   - Coller dans `UNSPLASH_ACCESS_KEY`

### Google Custom Search API (optionnel)

1. **Activer l'API**
   - Aller sur [Google Cloud Console](https://console.cloud.google.com/)
   - Activer l'API Custom Search JSON
   - Créer des identifiants API

2. **Configurer le moteur de recherche**
   - Aller sur [Custom Search Engine](https://cse.google.com/)
   - Créer un nouveau moteur de recherche
   - Configurer pour rechercher des images
   - Noter l'ID du moteur de recherche

3. **Configuration**
   - Copier la clé API dans `GOOGLE_SEARCH_API_KEY`
   - Copier l'ID du moteur dans `GOOGLE_SEARCH_ENGINE_ID`

## 🌐 Déploiement sur Vercel

### 1. Préparation du projet

```bash
# Vérifier que le build fonctionne
npm run build

# Tester localement
npm start
```

### 2. Déploiement avec Vercel CLI

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter à Vercel
vercel login

# Déployer
vercel --prod
```

### 3. Déploiement avec GitHub

1. **Connecter le repository**
   - Aller sur [Vercel Dashboard](https://vercel.com/dashboard)
   - Cliquer sur "New Project"
   - Importer depuis GitHub

2. **Configurer les variables d'environnement**
   - Dans les paramètres du projet
   - Ajouter toutes les variables d'environnement
   - Redéployer si nécessaire

### 4. Variables d'environnement Vercel

Dans le dashboard Vercel, ajouter :
- `GOOGLE_API_KEY`
- `UNSPLASH_ACCESS_KEY`
- `GOOGLE_SEARCH_API_KEY`
- `GOOGLE_SEARCH_ENGINE_ID`

## 📱 Configuration WhatsApp

### 1. Prérequis WhatsApp

- **WhatsApp Business** ou **WhatsApp Personnel**
- **Téléphone** avec WhatsApp installé
- **Connexion internet** stable

### 2. Première connexion

1. **Ouvrir l'application web**
   - Aller sur votre URL de déploiement
   - Cliquer sur l'onglet "Connexion"

2. **Générer le QR code**
   - Cliquer sur "Se connecter"
   - Attendre la génération du QR code

3. **Scanner avec WhatsApp**
   - Ouvrir WhatsApp sur votre téléphone
   - Aller dans Paramètres → Appareils connectés
   - Appuyer sur "Connecter un appareil"
   - Scanner le QR code

4. **Vérifier la connexion**
   - Attendre le message "Connecté"
   - Vérifier dans l'onglet "Chat"

### 3. Configuration du bot

1. **Aller dans l'onglet Configuration**
2. **Personnaliser les paramètres** :
   - Activer/désactiver l'IA
   - Configurer les réponses automatiques
   - Ajuster le délai de réponse
   - Modifier la personnalité du bot

3. **Configurer les images** :
   - Activer l'envoi d'images
   - Ajouter des mots-clés déclencheurs
   - Tester avec des messages

## 🔧 Dépannage

### Problèmes courants

#### QR Code ne s'affiche pas
```bash
# Vérifier les logs
npm run dev
# Regarder la console pour les erreurs
```

#### Erreur de connexion WhatsApp
- Vérifier que WhatsApp Web fonctionne normalement
- Redémarrer l'application
- Supprimer les données de session : `rm -rf .wwebjs_auth/`

#### Bot ne répond pas
- Vérifier la clé API Gemini
- Vérifier les quotas API
- Consulter les logs d'erreur

#### Images ne s'envoient pas
- Vérifier la clé Unsplash
- Tester avec les images par défaut
- Vérifier les permissions d'images

### Commandes de diagnostic

```bash
# Vérifier les dépendances
npm audit

# Nettoyer les modules
rm -rf node_modules package-lock.json
npm install

# Vérifier les types TypeScript
npm run type-check

# Linter le code
npm run lint
```

### Logs utiles

```bash
# Voir les logs en temps réel
tail -f logs/app.log

# Vérifier les erreurs Puppeteer
ls -la .cache/puppeteer/

# Vérifier les sessions WhatsApp
ls -la .wwebjs_auth/
```

## 🔒 Sécurité et bonnes pratiques

### Variables d'environnement
- ❌ Jamais commiter les clés API
- ✅ Utiliser des variables d'environnement
- ✅ Configurer les quotas API
- ✅ Surveiller l'utilisation

### Déploiement
- ✅ Utiliser HTTPS uniquement
- ✅ Configurer les domaines autorisés
- ✅ Activer les logs de sécurité
- ✅ Mettre à jour régulièrement

### WhatsApp
- ✅ Respecter les limites de messages
- ✅ Ne pas spammer les utilisateurs
- ✅ Configurer des réponses appropriées
- ✅ Surveiller les conversations

## 📊 Surveillance et maintenance

### Métriques importantes
- Nombre de messages traités
- Temps de réponse moyen
- Erreurs API
- Utilisation des quotas

### Maintenance régulière
- Nettoyer les logs anciens
- Vérifier les quotas API
- Mettre à jour les dépendances
- Sauvegarder les configurations

### Alertes recommandées
- Quota API dépassé
- Erreurs de connexion WhatsApp
- Temps de réponse élevé
- Erreurs critiques

## 📞 Support

Si vous rencontrez des problèmes :

1. **Vérifier la documentation** : README.md
2. **Consulter les issues** : GitHub Issues
3. **Créer une issue** : Décrire le problème détaillé
4. **Contacter le support** : support@example.com

## 🎉 Félicitations !

Votre bot WhatsApp avec IA Gemini est maintenant configuré et prêt à l'emploi !

### Prochaines étapes
1. **Tester** le bot avec différents messages
2. **Personnaliser** la personnalité selon vos besoins
3. **Surveiller** les performances
4. **Optimiser** selon l'usage