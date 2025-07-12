# 🚀 Guide de démarrage rapide

Ce guide vous permet de démarrer votre bot WhatsApp en quelques minutes.

## ⚡ Démarrage express

### 1. Clés API obligatoires

**Gemini AI** (gratuit) :
1. Allez sur [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Créez une clé API
3. Copiez votre clé

**Unsplash** (optionnel, gratuit) :
1. Allez sur [Unsplash Developers](https://unsplash.com/developers)
2. Créez une app
3. Copiez l'Access Key

### 2. Configuration

Créez un fichier `.env` :

```bash
# Obligatoire
GEMINI_API_KEY=votre_clé_gemini_ici

# Optionnel
UNSPLASH_ACCESS_KEY=votre_clé_unsplash_ici
PORT=3000
```

### 3. Démarrage

```bash
# Installer les dépendances (déjà fait)
npm install

# Démarrer le serveur
npm start
```

Ouvrez `http://localhost:3000` dans votre navigateur.

## 📱 Première utilisation

### Étape 1 : Connecter WhatsApp
1. Cliquez sur "Connecter WhatsApp"
2. Scannez le QR code avec votre téléphone
3. Attendez "WhatsApp Connecté"

### Étape 2 : Envoyer votre premier message
1. Entrez un numéro (ex: `06 12 34 56 78`)
2. Écrivez votre demande : `"Écris un message de motivation"`
3. Cliquez sur "Générer avec IA"
4. Cliquez sur "Envoyer"

### Étape 3 : Ajouter des images
1. Cochez "Inclure une image"
2. Sélectionnez une catégorie
3. Cliquez sur "Prévisualiser"
4. Envoyez votre message avec image

## 🎯 Exemples de prompts

**Pour un message professionnel :**
```
Écris un message de suivi commercial pour un client prospect
```

**Pour un message créatif :**
```
Crée un message poétique sur la nature avec des emojis
```

**Pour analyser une image :**
1. Choisissez une image
2. Cliquez sur "Analyser avec IA"
3. L'IA décrit l'image automatiquement

## 🔧 Raccourcis utiles

- `Ctrl + Enter` : Envoyer le message
- `Ctrl + G` : Générer avec IA
- Cliquez sur une notification pour la fermer

## 🚀 Déploiement Vercel (5 min)

```bash
# Installer Vercel CLI
npm install -g vercel

# Déployer
vercel
```

Ajoutez vos variables d'environnement dans le dashboard Vercel.

## 🆘 Problèmes courants

**QR Code ne s'affiche pas ?**
```bash
# Redémarrez le serveur
npm start
```

**IA ne répond pas ?**
- Vérifiez votre clé `GEMINI_API_KEY` dans `.env`
- Redémarrez le serveur

**Images ne se chargent pas ?**
- Ajoutez votre clé `UNSPLASH_ACCESS_KEY`
- Les images de secours fonctionnent sans clé

## 📞 Support

- Consultez le `README.md` pour plus de détails
- Vérifiez les logs dans la console
- Créez une issue sur GitHub

---

**Prêt à révolutionner vos communications WhatsApp ! 🚀**