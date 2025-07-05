# 🎭 Bot WhatsApp RP - Version Vercel

Bot WhatsApp avec IA Gemini optimisé pour le déploiement serverless sur Vercel.

## 🚀 Déploiement Ultra-Rapide

### Option 1: Déploiement en 1 clic
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/votre-username/whatsapp-rp-bot-gemini)

### Option 2: Via GitHub
1. **Fork** ce repo
2. **Connecter** à Vercel
3. **Configurer** la clé API Gemini
4. **Déployer** automatiquement

## ⚙️ Configuration Minimale

Dans Vercel Dashboard → Settings → Environment Variables :

```env
GEMINI_API_KEY=votre_cle_api_gemini
```

**C'est tout !** Le bot est fonctionnel avec cette seule variable.

## 🎯 URLs Après Déploiement

```
🏠 Accueil:      https://votre-app.vercel.app
📊 Status:       https://votre-app.vercel.app/api/status  
🏥 Health:       https://votre-app.vercel.app/api/health
📡 Webhook:      https://votre-app.vercel.app/api/webhook
🧠 API RP:       https://votre-app.vercel.app/api/generate-response
```

## 🧪 Tests Automatiques

```bash
# Tester localement
npm run test

# Tester en production
npm run test:prod
```

## 📡 Architecture Vercel

### Fonctions Serverless
- ✅ **api/status.js** - Page d'état avec interface cyberpunk
- ✅ **api/health.js** - Monitoring système complet
- ✅ **api/webhook.js** - Réception messages WhatsApp
- ✅ **api/generate-response.js** - IA Gemini pour RP

### Avantages Vercel
- ⚡ **Cold start** optimisé
- 🌍 **CDN global** automatique
- 🔒 **HTTPS** par défaut
- 📊 **Monitoring** intégré
- 💰 **Plan gratuit** suffisant

## 🎮 Utilisation

### Commandes Bot
```
!rp start    # Démarrer le RP
!rp stop     # Arrêter le RP  
!rp status   # Voir l'état
!rp help     # Aide complète
```

### Intégration WhatsApp

#### Option A: WhatsApp Business API
```
Webhook URL: https://votre-app.vercel.app/api/webhook
```

#### Option B: Providers tiers
- Twilio WhatsApp API
- 360Dialog
- Maytapi

## 🛠️ Développement Local

```bash
# Installation
npm install

# Mode dev Vercel
npm run vercel-dev

# Tests
npm run test
```

## 📊 Monitoring

### Health Check Automatique
- ✅ Mémoire système
- ✅ Configuration API
- ✅ Variables d'environnement
- ✅ Dépendances critiques

### Logs Vercel
```bash
vercel logs votre-app.vercel.app --follow
```

## 🎨 Personnalisation

### Variables Optionnelles
```env
BOT_NAME=🤖 Mon Bot RP
RP_WORLD=Mon Univers  
DEFAULT_CHARACTER=Mon Personnage
ENABLE_MEDIA_RESPONSES=true
DEBUG_MODE=false
```

### Univers RP Supportés
- 🌃 Cyberpunk 2077 (défaut)
- ⭐ Star Wars
- 🏰 Fantasy Medieval
- 🚀 Science Fiction
- 🎭 Personnalisé

## 💰 Coûts

### Plan Gratuit Vercel
- ✅ **100GB/mois** de bande passante
- ✅ **Fonctions illimitées**
- ✅ **Domaine personnalisé**
- ✅ **SSL automatique**

**Parfait pour un bot WhatsApp !**

## 🔧 Variables d'Environnement

### Obligatoires
| Variable | Description | Exemple |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Clé API Google Gemini | `AIza...` |

### Optionnelles  
| Variable | Description | Défaut |
|----------|-------------|--------|
| `BOT_NAME` | Nom du bot | `🎭 RP Master Bot` |
| `RP_WORLD` | Univers RP | `Cyberpunk 2077` |
| `DEFAULT_CHARACTER` | Personnage IA | `Assistant IA Futuriste` |
| `ENABLE_MEDIA_RESPONSES` | Médias auto | `true` |
| `DEBUG_MODE` | Mode debug | `false` |
| `AUTO_REPLY_DELAY` | Délai réponse (ms) | `2000` |
| `MAX_MESSAGE_LENGTH` | Longueur max | `1000` |

## 🚨 Dépannage Express

### Bot ne répond pas
1. ✅ Vérifier `GEMINI_API_KEY` dans Vercel
2. ✅ Tester `/api/health`
3. ✅ Consulter les logs Vercel

### API Timeout
1. ✅ Optimiser les prompts Gemini
2. ✅ Réduire `MAX_MESSAGE_LENGTH`
3. ✅ Passer au plan Pro si nécessaire

### Webhook ne fonctionne pas
1. ✅ Vérifier l'URL webhook
2. ✅ Tester avec `curl`
3. ✅ Valider le token de vérification

## 📚 Documentation Complète

- 📖 **[README.md](README.md)** - Documentation complète
- 🚀 **[DEPLOY_VERCEL.md](DEPLOY_VERCEL.md)** - Guide détaillé
- ⚡ **[QUICKSTART.md](QUICKSTART.md)** - Démarrage rapide

## 🎉 Résumé Ultra-Simple

1. **Fork** ce repo
2. **Déployer** sur Vercel  
3. **Ajouter** `GEMINI_API_KEY`
4. **Configurer** WhatsApp webhook
5. **Profiter** du RP ! 🎭

---

**Temps de déploiement : 5 minutes**  
**Coût mensuel : 0€ (plan gratuit)**  
**Maintenance : Aucune**

**Let's RP ! 🌃✨**