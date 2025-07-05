# 🤖 WhatsApp AI Bot Simplifié

Un bot WhatsApp intelligent avec interface web moderne et API simulée.

## 🌟 Fonctionnalités

- **Interface web moderne** : Dashboard de gestion avec Tailwind CSS
- **Simulation WhatsApp** : Interface QR Code et connexion simulée
- **Chat intelligent** : Réponses automatiques simulées
- **Configuration flexible** : Paramètres personnalisables
- **Déployable facilement** : Prêt pour Vercel

## 🚀 Installation rapide

### 1. Cloner et installer

```bash
git clone <repository-url>
cd whatsapp-ai-bot
npm install
```

### 2. Démarrer l'application

```bash
npm start
```

L'application sera disponible sur `http://localhost:3000`

## � Utilisation

### Interface web

1. **Connexion** : Simulez la connexion WhatsApp avec QR code
2. **Chat** : Testez l'interface de chat avec réponses automatiques
3. **Configuration** : Personnalisez les paramètres du bot

### Fonctionnalités

- ✅ Interface moderne avec Tailwind CSS
- ✅ Simulation de connexion WhatsApp
- ✅ Chat avec réponses automatiques
- ✅ WebSocket pour communication temps réel
- ✅ Configuration sauvegardable
- ✅ Responsive design

## 🚀 Déploiement sur Vercel

### Méthode simple

1. **Via GitHub** :
   - Poussez votre code sur GitHub
   - Connectez le repository à Vercel
   - Déployez automatiquement

2. **Via CLI** :
   ```bash
   npm install -g vercel
   vercel
   ```

### Configuration Vercel

Aucune variable d'environnement requise pour la version simplifiée.

## 🛠️ Structure du projet

```
whatsapp-ai-bot/
├── public/
│   └── index.html         # Interface web complète
├── server.js              # Serveur Express + WebSocket
├── package.json           # Configuration npm
├── vercel.json           # Configuration Vercel
└── README.md             # Documentation
```

## 🔧 Développement

### Technologies utilisées

- **Express.js** : Serveur web
- **Socket.io** : Communication temps réel
- **Tailwind CSS** : Styling (via CDN)
- **HTML/CSS/JS** : Interface utilisateur

### Personnalisation

Pour ajouter des fonctionnalités réelles :

1. **WhatsApp réel** : Intégrer `whatsapp-web.js`
2. **IA réelle** : Ajouter OpenAI API
3. **Images** : Intégrer Google Custom Search
4. **Base de données** : Ajouter persistence des données

### Scripts disponibles

```bash
npm run dev    # Démarrage développement
npm start      # Démarrage production
```

## 🌐 API Endpoints

- `GET /` - Interface web
- `POST /api/whatsapp/connect` - Connexion WhatsApp
- `POST /api/whatsapp/disconnect` - Déconnexion WhatsApp
- `POST /api/chat/send` - Envoyer message
- `POST /api/config/update` - Mise à jour config

## 📝 Notes importantes

Cette version est **simplifiée et simulée** pour :
- ✅ Démonstration rapide
- ✅ Déploiement facile
- ✅ Base de développement
- ✅ Tests d'interface

Pour une version complète avec WhatsApp réel, référez-vous à `INSTALLATION.md`.

## 🤝 Support

- Interface intuitive et moderne
- Simulation complète des fonctionnalités
- Prêt pour extension vers version complète
- Documentation claire

---

**Version Simplifiée** - Parfait pour démonstration et développement rapide ! 🚀