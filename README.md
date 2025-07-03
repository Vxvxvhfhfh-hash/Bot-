# 🎭 Bot WhatsApp RP avec IA Gemini

Un bot WhatsApp avancé pour système de jeu de rôle (RP) utilisant l'intelligence artificielle Gemini, avec système de médias immersifs et esthétique cyberpunk.

## ✨ Fonctionnalités

- 🤖 **IA Gemini intégrée** : Réponses immersives et contextuelles
- 🎭 **Système RP complet** : Personnages, univers, historique des conversations
- 📸 **Médias automatiques** : Images d'ambiance selon le contexte
- 🎨 **Esthétique avancée** : Caractères spéciaux, emojis, formatage
- 🌃 **Univers personnalisable** : Cyberpunk 2077 par défaut
- 💬 **Commandes intuitives** : Interface simple et efficace

## 🚀 Installation

### Prérequis

- Node.js 16+ 
- npm ou yarn
- Compte Google Cloud avec API Gemini activée
- WhatsApp sur téléphone

### Étapes d'installation

1. **Cloner et installer les dépendances**
```bash
git clone <votre-repo>
cd whatsapp-rp-bot-gemini
npm install
```

2. **Configuration de l'environnement**
```bash
cp .env.example .env
```

3. **Configurer l'API Gemini**
- Aller sur [Google AI Studio](https://makersuite.google.com/app/apikey)
- Créer une clé API Gemini
- Ajouter la clé dans `.env` :
```
GEMINI_API_KEY=votre_cle_api_ici
```

4. **Personnaliser le bot (optionnel)**
Modifiez les variables dans `.env` :
```env
BOT_NAME=🎭 Votre Bot RP
RP_WORLD=Votre Univers
DEFAULT_CHARACTER=Votre Personnage
```

## 🎮 Utilisation

### Démarrage du bot

```bash
npm start
```

### Première connexion

1. Lancer le bot
2. Scanner le QR code avec WhatsApp
3. Le bot est maintenant connecté !

### Commandes disponibles

| Commande | Description |
|----------|-------------|
| `!rp start` | Démarrer une session RP |
| `!rp stop` | Arrêter la session RP |
| `!rp status` | Voir le statut du système |
| `!rp help` | Afficher l'aide |

### Exemple d'utilisation

```
Utilisateur: !rp start
Bot: 🎭 ═══════════════════════════════════════ 🎭
     ✦ SYSTÈME RP ACTIVÉ ✦
     🌃 Bienvenue dans Cyberpunk 2077
     ...

Utilisateur: Je marche dans la rue principale de Night City
Bot: ⚡ ═══════════════════════════════════════ ⚡
     *Les néons scintillent autour de vous*
     *L'atmosphère cyberpunk vous enveloppe*
     ...
```

## 📁 Structure du projet

```
whatsapp-rp-bot-gemini/
├── bot.js                 # Fichier principal
├── package.json          # Dépendances
├── .env.example          # Configuration exemple
├── README.md             # Documentation
└── media/                # Dossier médias
    ├── cyberpunk/        # Images cyberpunk
    ├── action/           # Images d'action
    ├── ambient/          # Images d'ambiance
    └── character/        # Avatars et personnages
```

## 🎨 Système de médias

Le bot envoie automatiquement des images d'immersion basées sur :
- **Détection contextuelle** : Analyse des mots-clés
- **Catégories automatiques** : cyberpunk, action, ambient, character
- **Envoi intelligent** : 30% de chance après chaque message

### Ajouter vos médias

1. Placer vos images dans `media/[categorie]/`
2. Formats supportés : `.jpg`, `.jpeg`, `.png`, `.gif`, `.mp4`, `.webp`
3. Le bot les utilisera automatiquement

## 🧠 Système d'IA

### Personnalités configurables

Le bot peut incarner différents personnages :
- **Personnalité par défaut** : Assistant IA cyberpunk
- **Historique contextuel** : Se souvient des conversations
- **Réponses adaptatives** : S'adapte au style de jeu

### Prompts IA

Les prompts incluent :
- Contexte du monde RP
- Personnalité du personnage
- Historique de conversation
- Règles d'esthétique
- Limites de longueur

## ⚙️ Configuration avancée

### Variables d'environnement

```env
# IA et RP
GEMINI_API_KEY=your_key
BOT_NAME=🎭 RP Master Bot
RP_WORLD=Cyberpunk 2077
DEFAULT_CHARACTER=Assistant IA Futuriste

# Médias
MEDIA_FOLDER=./media
ENABLE_MEDIA_RESPONSES=true

# Performance
AUTO_REPLY_DELAY=2000
MAX_MESSAGE_LENGTH=1000
DEBUG_MODE=false
```

### Personnalisation des personnages

Modifiez la classe `RPAISystem` dans `bot.js` :

```javascript
this.characterProfiles = {
    detective: {
        name: "Détective Cyber",
        personality: "Enquêteur cynique dans Night City",
        background: "Ancien flic reconverti...",
        responseStyle: "Style noir et dramatique"
    }
};
```

## 🛠️ Développement

### Mode développement

```bash
npm run dev  # Utilise nodemon pour rechargement auto
```

### Debug

Activez le mode debug dans `.env` :
```
DEBUG_MODE=true
```

### Logs

Le bot affiche des logs colorés avec :
- 💬 Messages reçus
- 🎭 Actions RP
- ✅ Succès
- ❌ Erreurs
- 📸 Médias envoyés

## 🔒 Sécurité

- **Clés API** : Stockées dans `.env` (non versionnées)
- **Sessions WhatsApp** : Authentification locale sécurisée
- **Limitations** : Contrôle de la longueur des messages
- **Gestion d'erreurs** : Fallbacks immersifs

## 📊 Performances

- **Délai de réponse** : Configurable (2s par défaut)
- **Historique** : Limité aux 20 derniers messages
- **Médias** : Détection intelligente des catégories
- **Mémoire** : Optimisée pour usage long terme

## 🐛 Dépannage

### Problèmes courants

1. **QR Code ne s'affiche pas**
   - Vérifier la connexion internet
   - Redémarrer le bot

2. **Erreur API Gemini**
   - Vérifier la clé API dans `.env`
   - Vérifier les quotas Google Cloud

3. **Médias non envoyés**
   - Vérifier que le dossier `media/` existe
   - Ajouter des images dans les sous-dossiers

4. **Bot ne répond pas**
   - Vérifier que le RP est activé avec `!rp start`
   - Voir les logs pour les erreurs

### Logs d'erreur

Le bot affiche des messages d'erreur colorés :
```
❌ [timestamp] Erreur Gemini AI: Invalid API key
📸 [timestamp] Dossier médias initialisé: ./media
🎭 [timestamp] RP démarré pour le chat John Doe
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/awesome-feature`)
3. Commit (`git commit -m 'Add awesome feature'`)
4. Push (`git push origin feature/awesome-feature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🎯 Roadmap

- [ ] Système de quêtes automatiques
- [ ] Multi-personnages par conversation
- [ ] Génération d'images IA
- [ ] Interface web de gestion
- [ ] Intégration Discord
- [ ] Système de progression RPG
- [ ] Médias audio/vidéo
- [ ] Base de données persistante

## 💖 Support

Si ce projet vous aide, n'hésitez pas à :
- ⭐ Mettre une étoile au repo
- 🐛 Signaler les bugs
- 💡 Proposer des améliorations
- 📢 Partager avec la communauté

---

**Développé avec ❤️ pour la communauté RP**

*Utilise l'IA responsablement et amusez-vous bien !* 🎭✨