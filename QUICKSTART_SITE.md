# 🚀 Démarrage Ultra-Rapide - Site WhatsApp RP Bot

## ⚡ En 3 minutes chrono !

### 🎯 Option 1: Automatique (Recommandé)
```bash
# 1. Cloner et accéder au projet
git clone <your-repo-url>
cd whatsapp-rp-bot

# 2. Lancer le script automatique
./deploy-site.sh
```

### 🛠️ Option 2: Manuel
```bash
# 1. Installer les dépendances
npm install

# 2. Configurer l'environnement
cp .env.example .env.local
# Éditer .env.local avec votre GEMINI_API_KEY

# 3. Lancer le site
npm run dev
```

## 🌐 Accès Immédiat

Une fois lancé, accédez à:

- **🏠 Site:** http://localhost:3000
- **🎮 Dashboard:** http://localhost:3000/dashboard  
- **🧪 Tests:** http://localhost:3000/test
- **📖 About:** http://localhost:3000/about

## 🔑 Configuration Minimale

Seule variable **obligatoire** dans `.env.local`:
```env
GEMINI_API_KEY=votre_clé_api_gemini
```

## 🚀 Déploiement Vercel

```bash
# Installation Vercel CLI (si nécessaire)
npm i -g vercel

# Déploiement en production
vercel --prod
```

## 📱 Fonctionnalités du Site

### ✨ Page d'Accueil
- Présentation interactive du bot
- Statut en temps réel
- Design cyberpunk avec animations

### 🎮 Dashboard
- Monitoring des APIs en direct
- Statistiques du bot (sessions, messages)
- Actions rapides (tests, logs)

### 🧪 Interface de Test
- Test de toutes les APIs
- Formulaires personnalisables
- Résultats détaillés avec métriques

### 📊 Page À Propos
- Documentation complète
- Stack technique
- Architecture serverless

## 🎨 Design Cyberpunk

- **Couleurs néon** (vert, bleu, violet, rose)
- **Animations fluides** avec Framer Motion
- **Effets visuels** (glitch, glow, particles)
- **Responsive design** mobile-first

## ⚙️ Scripts Disponibles

```bash
npm run dev          # Développement (localhost:3000)
npm run build        # Construction pour production
npm start            # Serveur de production
npm run deploy       # Déploiement Vercel
npm run test         # Tests des APIs
```

## 🔧 Technologies Utilisées

- **Next.js 14** - Framework React moderne
- **Tailwind CSS** - Styling utilitaire
- **Framer Motion** - Animations fluides
- **TypeScript** - Sécurité de types
- **Vercel** - Déploiement serverless

## 🌟 Aperçu des Pages

### 🏠 Accueil
```
┌─────────────────────────────────────┐
│          🎭 RP BOT                  │
│    Bot WhatsApp avec IA Gemini      │
│                                     │
│  [🧠 IA] [🎭 RP] [📱 WhatsApp]     │
│  [🌃 Cyber] [📸 Media] [⚡ Real]    │
│                                     │
│    [🎮 Dashboard] [🧪 Tests]       │
└─────────────────────────────────────┘
```

### 🎮 Dashboard  
```
┌─────────────────────────────────────┐
│         📊 Dashboard                │
│                                     │
│  🤖 Status    👥 Sessions          │
│  💬 Messages  ⏱️ Uptime           │
│                                     │
│  💾 Memory   🧠 Gemini AI          │
│  ⚙️ Config   📦 Dependencies       │
│                                     │
│  ⚡ Quick Actions                   │
│  [Test IA] [Logs] [Restart]        │
└─────────────────────────────────────┘
```

### 🧪 Tests
```
┌─────────────────────────────────────┐
│          🧪 API Tests               │
│                                     │
│  Message RP: [________________]     │
│  Webhook:    [________________]     │
│                                     │
│  [📊 Status] [🏥 Health]           │
│  [📡 Webhook] [🧠 Generate]        │
│                                     │
│  📈 Results:                        │
│  ✅ Status: 200 (150ms)             │
│  ✅ Health: 200 (89ms)              │
└─────────────────────────────────────┘
```

## 🎯 Prêt en 60 secondes !

1. **Cloner** le projet
2. **Lancer** `./deploy-site.sh`
3. **Configurer** la clé Gemini
4. **Profiter** du site ! 🎉

---

**🎭 Votre bot WhatsApp RP a maintenant sa propre interface web moderne !**

> **Besoin d'aide ?** Consultez `SITE_README.md` pour la documentation complète.