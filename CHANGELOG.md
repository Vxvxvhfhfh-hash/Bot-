# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-15

### ✨ Ajouté
- **Bot WhatsApp complet** avec intégration WhatsApp Web.js
- **Intelligence Artificielle Gemini** pour les conversations
- **Système d'images stock** avec support pour:
  - Unsplash API
  - Pexels API
  - Images aléatoires (picsum.photos)
- **Système de commandes** avec préfixe personnalisable
- **Commandes de base**:
  - `!help` - Afficher l'aide
  - `!status` - Statut du bot
  - `!info` - Informations sur le bot
  - `!image [mot-clé]` - Générer une image
- **Auto-suggestion d'images** basée sur le contenu des conversations
- **Système de logging** avec enregistrement des messages
- **Configuration avancée** via fichier .env
- **Gestion des erreurs** robuste
- **Nettoyage automatique** des fichiers temporaires
- **Support Docker** avec Dockerfile et docker-compose.yml
- **Scripts d'installation et de test**
- **Documentation complète** avec README.md détaillé

### 🔧 Configuration
- Variables d'environnement pour toutes les APIs
- Configuration personnalisable du bot (nom, préfixe, etc.)
- Support pour plusieurs providers d'images
- Paramètres de sécurité et rate limiting
- Configuration Puppeteer optimisée

### 🛠️ Outils
- **install.js** - Script d'installation automatique
- **start.js** - Script de démarrage avec vérifications
- **test.js** - Suite de tests complète
- **config.js** - Système de configuration centralisé

### 🐳 Docker
- Dockerfile optimisé avec Alpine Linux
- docker-compose.yml pour déploiement facile
- Volumes persistants pour les données
- Healthcheck intégré
- Utilisateur non-root pour la sécurité

### 📦 Dépendances
- **whatsapp-web.js** v1.23.0 - Interface WhatsApp
- **@google/generative-ai** v0.2.1 - IA Gemini
- **qrcode-terminal** v0.12.0 - Affichage QR code
- **axios** v1.6.0 - Requêtes HTTP
- **dotenv** v16.3.1 - Variables d'environnement
- **fs-extra** v11.1.1 - Opérations fichiers
- **nodemon** v3.0.1 - Développement

### 🔒 Sécurité
- Fichier .env pour les clés API
- .gitignore complet
- Validation des configurations obligatoires
- Gestion sécurisée des fichiers temporaires

### 📖 Documentation
- README.md complet avec instructions détaillées
- Exemples d'utilisation
- Guide d'installation des APIs
- Troubleshooting
- Configuration avancée

## [Unreleased]

### 🔄 Planifié
- Interface web pour la configuration
- Base de données pour l'historique des conversations
- Système de plugins
- Support multilingue
- Commandes admin avancées
- Métriques et monitoring
- Backup automatique des données
- Support pour les groupes WhatsApp
- Réponses automatiques programmées
- Amélioration des modèles Gemini (Gemini Pro Vision, etc.)
- Intégration avec d'autres services Google (Google Search, etc.)

### 🐛 Corrections prévues
- Optimisation de la mémoire pour les longues sessions
- Amélioration de la gestion des erreurs réseau
- Optimisation du téléchargement d'images

---

## Format des versions

- **Major** (X.0.0) - Changements incompatibles
- **Minor** (0.X.0) - Nouvelles fonctionnalités compatibles
- **Patch** (0.0.X) - Corrections de bugs

## Types de changements

- **✨ Ajouté** - Nouvelles fonctionnalités
- **🔧 Modifié** - Changements dans les fonctionnalités existantes
- **🗑️ Supprimé** - Fonctionnalités supprimées
- **🐛 Corrigé** - Corrections de bugs
- **🔒 Sécurité** - Corrections de vulnérabilités