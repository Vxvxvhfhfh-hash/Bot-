# 🚀 Démarrage Rapide - Bot WhatsApp RP

*Configurez votre bot RP en 5 minutes chrono !*

## ⚡ Installation Express

### 1. Prérequis Rapides
```bash
# Vérifier Node.js (16+)
node --version

# Si pas installé: https://nodejs.org
```

### 2. Installation Automatique
```bash
# Cloner le projet
git clone <votre-repo>
cd whatsapp-rp-bot-gemini

# Installation complète + configuration
npm run install-all
```

### 3. Démarrage Immédiat
```bash
# Lancer le bot
npm start

# Scanner le QR code avec WhatsApp
# C'est parti ! 🎭
```

## 🔑 Clé API Gemini (Obligatoire)

1. **Aller sur** : https://makersuite.google.com/app/apikey
2. **Créer une clé API** gratuite
3. **La copier** lors de l'installation

## 📱 Utilisation Instant

### Commandes de base
```
!rp start    # Démarrer le RP
!rp stop     # Arrêter le RP
!rp help     # Voir l'aide
```

### Exemple d'utilisation
```
Vous: !rp start
Bot: 🎭 ═══════════════════════════════════════ 🎭
     ✦ SYSTÈME RP ACTIVÉ ✦
     🌃 Bienvenue dans Cyberpunk 2077...

Vous: Je marche dans Night City
Bot: ⚡ ═══════════════════════════════════════ ⚡
     *Les néons scintillent autour de vous*
     *L'atmosphère cyberpunk vous enveloppe*...
```

## 📸 Médias (Optionnel)

Pour l'immersion totale, ajoutez vos images :

```
media/
├── cyberpunk/    # Images futuristes
├── action/       # Scènes d'action
├── ambient/      # Atmosphère
└── character/    # Personnages
```

**Formats** : `.jpg`, `.png`, `.gif`, `.mp4`

## 🛠️ Configuration Express

Si besoin de reconfigurer :
```bash
npm run setup
```

## 🎯 Personnalisation Rapide

Éditez `.env` :
```env
BOT_NAME=🎭 Mon Bot RP
RP_WORLD=Mon Univers
DEFAULT_CHARACTER=Mon Personnage
```

## 🐛 Dépannage Express

### Bot ne démarre pas ?
```bash
# Vérifier les dépendances
npm install

# Vérifier la configuration
cat .env
```

### Pas de réponse IA ?
- Vérifier la clé API Gemini dans `.env`
- Vérifier quotas Google Cloud

### QR Code invisible ?
- Agrandir le terminal
- Redémarrer le bot

## 🎮 Prêt à jouer !

Votre bot RP est maintenant fonctionnel ! 

- **Scanner** le QR code
- **Taper** `!rp start` dans WhatsApp  
- **Profiter** de l'expérience RP immersive

## 📚 Pour aller plus loin

- **README.md** : Documentation complète
- **media/README.md** : Guide des médias
- **bot.js** : Code source commenté

---

***Temps d'installation : 3-5 minutes*** ⚡  
***Première utilisation : 30 secondes*** 🎭

**Bon jeu de rôle !** ✨