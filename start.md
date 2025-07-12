# 🚀 Démarrage rapide - WhatsApp AI Bot avec Gemini

## ⚡ Lancement en 3 étapes

### 1. Installation
```bash
git clone https://github.com/votre-username/whatsapp-ai-bot.git
cd whatsapp-ai-bot
npm install
```

### 2. Configuration
```bash
cp .env.example .env.local
# Éditez .env.local avec vos clés API
```

### 3. Démarrage
```bash
npm run dev
```

🎉 **Votre bot est prêt sur http://localhost:3000**

## 🔑 Clés API nécessaires

### 1. Google Gemini (obligatoire)
- Aller sur [Google AI Studio](https://aistudio.google.com/)
- Créer une clé API
- Ajouter dans `GOOGLE_API_KEY`

### 2. Unsplash (optionnel)
- Créer un compte sur [Unsplash Developers](https://unsplash.com/developers)
- Créer une application
- Ajouter dans `UNSPLASH_ACCESS_KEY`

## 📱 Première utilisation

1. **Connexion WhatsApp**
   - Ouvrir l'application
   - Cliquer sur "Se connecter"
   - Scanner le QR code

2. **Configuration**
   - Aller dans l'onglet "Configuration"
   - Personnaliser la personnalité du bot
   - Configurer les mots-clés pour images

3. **Test**
   - Envoyer un message depuis WhatsApp
   - Vérifier la réponse automatique

## 🌐 Déploiement rapide

### Vercel (recommandé)
```bash
npm install -g vercel
vercel --prod
```

### Configuration Vercel
- Ajouter les variables d'environnement
- Configurer les domaines
- Activer les logs

## 🔧 Dépannage express

### QR Code ne s'affiche pas
```bash
npm run dev
# Vérifier les logs de la console
```

### Bot ne répond pas
- Vérifier la clé Gemini
- Vérifier les quotas API
- Redémarrer l'application

## 📚 Documentation complète

- **Installation détaillée** : `INSTALLATION.md`
- **Guide d'utilisation** : `README.md`
- **Configuration avancée** : Dans l'application web

## 🆘 Support rapide

**Problème urgent ?**
1. Vérifier les logs : `npm run dev`
2. Nettoyer les modules : `rm -rf node_modules && npm install`
3. Créer une issue : GitHub Issues

---

**🎯 Objectif : Votre bot WhatsApp avec IA Gemini opérationnel en moins de 10 minutes !**