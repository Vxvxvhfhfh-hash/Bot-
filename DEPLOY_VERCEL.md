# 🚀 Déploiement sur Vercel - Bot WhatsApp RP

Guide complet pour déployer votre bot WhatsApp RP avec IA Gemini sur Vercel.

## ⚡ Déploiement Express (5 minutes)

### 1. Prérequis
- Compte [Vercel](https://vercel.com) (gratuit)
- Compte [GitHub](https://github.com) (gratuit)
- Clé API [Google Gemini](https://makersuite.google.com/app/apikey) (gratuite)

### 2. Déploiement en un clic

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/votre-username/whatsapp-rp-bot-gemini)

**OU**

### 3. Déploiement manuel

#### A. Pousser vers GitHub
```bash
# Initialiser un repo Git (si pas déjà fait)
git init
git add .
git commit -m "Initial commit: Bot WhatsApp RP"

# Créer un repo sur GitHub et le pousser
git remote add origin https://github.com/votre-username/whatsapp-rp-bot-gemini.git
git push -u origin main
```

#### B. Connecter à Vercel
1. Aller sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Cliquer "New Project"
3. Connecter votre repo GitHub
4. Configurer les variables d'environnement (voir section suivante)
5. Cliquer "Deploy"

## 🔧 Configuration des Variables d'Environnement

### Variables Obligatoires

Dans Vercel Dashboard → Settings → Environment Variables :

```env
GEMINI_API_KEY=votre_cle_api_gemini_ici
```

### Variables Optionnelles

```env
BOT_NAME=🎭 Votre Bot RP
RP_WORLD=Votre Univers RP
DEFAULT_CHARACTER=Votre Personnage
ENABLE_MEDIA_RESPONSES=true
DEBUG_MODE=false
AUTO_REPLY_DELAY=2000
MAX_MESSAGE_LENGTH=1000
```

### Variables Avancées (Webhook)

```env
WEBHOOK_VERIFY_TOKEN=votre_token_secret_ici
VERCEL_URL=votre-app.vercel.app
```

## 📡 Configuration WhatsApp Business API

### Option 1: WhatsApp Business Cloud API (Recommandée)

1. **Créer une app Facebook**
   - Aller sur [Facebook Developers](https://developers.facebook.com)
   - Créer une nouvelle app
   - Ajouter WhatsApp Business API

2. **Configurer le webhook**
   ```
   URL Webhook: https://votre-app.vercel.app/api/webhook
   Token de vérification: votre_token_secret
   ```

3. **Champs d'abonnement**
   - `messages`
   - `message_deliveries`
   - `message_reads`

### Option 2: Fournisseurs tiers

- **Twilio WhatsApp API**
- **360Dialog**
- **Maytapi**
- **WhatsApp Business Solution Providers**

## 🎯 URLs de votre Bot Déployé

Après déploiement, votre bot sera accessible sur :

```
🏠 Page d'accueil:     https://votre-app.vercel.app
📊 Status:            https://votre-app.vercel.app/api/status
🏥 Health Check:      https://votre-app.vercel.app/api/health
📡 Webhook:           https://votre-app.vercel.app/api/webhook
🧠 Génération RP:     https://votre-app.vercel.app/api/generate-response
```

## 🧪 Tests après Déploiement

### 1. Tester l'API Status
```bash
curl https://votre-app.vercel.app/api/status
```

### 2. Tester le Health Check
```bash
curl https://votre-app.vercel.app/api/health
```

### 3. Tester la génération RP
```bash
curl -X POST https://votre-app.vercel.app/api/generate-response \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Je marche dans Night City",
    "characterName": "default"
  }'
```

### 4. Tester le Webhook
```bash
curl -X POST https://votre-app.vercel.app/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{
      "from": "test_user",
      "text": {"body": "!rp start"},
      "type": "text"
    }]
  }'
```

## 🛠️ Développement Local avec Vercel

### Installation Vercel CLI
```bash
npm install -g vercel
```

### Développement local
```bash
# Installer les dépendances
npm install

# Démarrer en mode dev Vercel
npm run vercel-dev

# Ou directement avec Vercel CLI
vercel dev
```

### Simuler l'environnement Vercel
```bash
# Créer .env.local pour le développement
cp .env.example .env.local

# Éditer .env.local avec vos vraies clés API
```

## 📊 Monitoring et Logs

### Voir les logs Vercel
```bash
vercel logs votre-app.vercel.app
```

### Monitoring via Dashboard
- Aller sur [Vercel Dashboard](https://vercel.com/dashboard)
- Sélectionner votre projet
- Onglet "Functions" pour voir les performances
- Onglet "Analytics" pour les statistiques

### Health Check automatique
Le système vérifie automatiquement :
- ✅ État mémoire
- ✅ Configuration API Gemini
- ✅ Variables d'environnement
- ✅ Dépendances critiques

## 🔄 Mise à jour du Bot

### Déploiement automatique
Chaque push sur `main` redéploie automatiquement :

```bash
git add .
git commit -m "Mise à jour du bot"
git push origin main
# → Redéploiement automatique sur Vercel
```

### Déploiement manuel
```bash
npm run deploy
```

## 💰 Coûts Vercel

### Plan Gratuit (Suffisant pour la plupart des cas)
- ✅ 100GB de bande passante/mois
- ✅ 10GB stockage
- ✅ 100 déploiements/jour
- ✅ Fonctions serverless illimitées
- ✅ HTTPS automatique
- ✅ Domaine personnalisé

### Limites à connaître
- ⏱️ Timeout max: 10s (Hobby), 60s (Pro)
- 🧠 Mémoire max: 1GB
- 📦 Taille fonction max: 50MB

## 🌐 Domaine Personnalisé

### Ajouter votre domaine
1. Vercel Dashboard → Settings → Domains
2. Ajouter votre domaine : `mon-bot-rp.com`
3. Configurer les DNS selon les instructions
4. Certificat SSL automatique

### Sous-domaine gratuit
Vercel fournit : `votre-app.vercel.app`

## 🔒 Sécurité

### Variables d'environnement
- ✅ Chiffrées au repos
- ✅ Accessibles uniquement aux fonctions
- ✅ Pas d'exposition publique

### Bonnes pratiques
- 🔐 Utiliser des tokens de webhook sécurisés
- 🛡️ Valider les signatures webhook
- 🔍 Activer les logs en production
- ⚡ Limiter les appels API

## 🐛 Dépannage

### Erreur "Function Timeout"
- Optimiser les appels Gemini AI
- Réduire la taille des prompts
- Utiliser l'async/await correctement

### Erreur "Memory Limit Exceeded"
- Vérifier la taille des données en mémoire
- Nettoyer les variables inutilisées
- Utiliser le garbage collection

### Erreur "Environment Variable Missing"
- Vérifier la configuration dans Vercel Dashboard
- Redéployer après ajout de variables
- Vérifier l'orthographe des noms

### Webhook ne fonctionne pas
- Vérifier l'URL webhook
- Tester avec curl
- Vérifier les logs Vercel
- Valider le token de vérification

## 📞 Support

### Ressources utiles
- [Documentation Vercel](https://vercel.com/docs)
- [Guide WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)
- [Google Gemini API](https://ai.google.dev/docs)

### Communauté
- [Discord Vercel](https://vercel.com/discord)
- [GitHub Issues](https://github.com/votre-repo/issues)

---

## 🎉 Félicitations !

Votre bot WhatsApp RP est maintenant déployé sur Vercel !

🔗 **URL de votre bot** : `https://votre-app.vercel.app`

### Prochaines étapes :
1. ✅ Configurer WhatsApp Business API
2. ✅ Tester toutes les fonctionnalités
3. ✅ Ajouter vos médias personnalisés
4. ✅ Personnaliser l'univers RP
5. ✅ Partager avec vos amis !

**Bon jeu de rôle !** 🎭✨