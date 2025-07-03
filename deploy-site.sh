#!/bin/bash

# 🚀 Script de Déploiement - Site WhatsApp RP Bot
# Automatise l'installation et le déploiement du site Next.js

set -e  # Arrêter en cas d'erreur

# Couleurs pour l'affichage
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Banner ASCII
echo -e "${GREEN}"
echo "╔═══════════════════════════════════════════════════════════════════════════════╗"
echo "║                       🎭 WHATSAPP RP BOT - SITE WEB 🎭                       ║"
echo "║                    Déploiement automatique avec Next.js                      ║"
echo "╚═══════════════════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Fonction pour afficher les étapes
step() {
    echo -e "${BLUE}[ÉTAPE]${NC} $1"
}

# Fonction pour afficher les succès
success() {
    echo -e "${GREEN}[SUCCÈS]${NC} $1"
}

# Fonction pour afficher les avertissements
warning() {
    echo -e "${YELLOW}[ATTENTION]${NC} $1"
}

# Fonction pour afficher les erreurs
error() {
    echo -e "${RED}[ERREUR]${NC} $1"
}

# Vérification des prérequis
step "Vérification des prérequis..."

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    error "Node.js n'est pas installé. Veuillez installer Node.js 18+ depuis https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    error "Node.js version 18+ requis. Version actuelle: $(node --version)"
    exit 1
fi

success "Node.js $(node --version) ✓"

# Vérifier npm
if ! command -v npm &> /dev/null; then
    error "npm n'est pas installé"
    exit 1
fi

success "npm $(npm --version) ✓"

# Installation des dépendances
step "Installation des dépendances..."

if [ ! -f "package.json" ]; then
    error "package.json non trouvé. Assurez-vous d'être dans le bon répertoire."
    exit 1
fi

echo "📦 Installation des packages npm..."
if npm install --silent; then
    success "Dépendances installées avec succès"
else
    error "Échec de l'installation des dépendances"
    exit 1
fi

# Vérification des variables d'environnement
step "Vérification de la configuration..."

if [ ! -f ".env" ] && [ ! -f ".env.local" ]; then
    warning "Aucun fichier .env trouvé"
    echo "Création d'un fichier .env.local par défaut..."
    
    cat > .env.local << EOF
# Configuration Bot WhatsApp RP
GEMINI_API_KEY=your_gemini_api_key_here
BOT_NAME=🎭 RP Master Bot
RP_WORLD=Cyberpunk 2077
DEFAULT_CHARACTER=Assistant IA Futuriste
ENABLE_MEDIA_RESPONSES=true
DEBUG_MODE=false

# Vercel
VERCEL_URL=\${VERCEL_URL}
EOF
    
    warning "⚠️  N'oubliez pas de configurer votre GEMINI_API_KEY dans .env.local"
fi

# Build du projet
step "Build du projet Next.js..."

echo "🔨 Construction du projet..."
if npm run build; then
    success "Build réussi"
else
    error "Échec du build"
    exit 1
fi

# Test des APIs
step "Test des APIs..."

echo "🧪 Vérification des endpoints..."

# Démarrer le serveur en arrière-plan pour les tests
echo "Démarrage du serveur de développement..."
npm run dev &
SERVER_PID=$!

# Attendre que le serveur démarre
sleep 5

# Tests basiques
echo "Test de l'endpoint status..."
if curl -s -f http://localhost:3000/api/status > /dev/null; then
    success "API Status OK"
else
    warning "API Status inaccessible (peut nécessiter une clé API)"
fi

echo "Test de l'endpoint health..."
if curl -s -f http://localhost:3000/api/health > /dev/null; then
    success "API Health OK"
else
    warning "API Health inaccessible"
fi

# Arrêter le serveur de test
kill $SERVER_PID 2>/dev/null || true
sleep 2

# Options de déploiement
step "Options de déploiement..."

echo "Choisissez votre méthode de déploiement:"
echo "1) 🌐 Déploiement local (npm start)"
echo "2) ⚡ Déploiement Vercel (automatique)"
echo "3) 🧪 Mode développement (npm run dev)"
echo "4) 📊 Tests uniquement"

read -p "Votre choix (1-4): " choice

case $choice in
    1)
        step "Déploiement local..."
        echo "🚀 Lancement du serveur de production..."
        echo "📱 Site accessible sur: http://localhost:3000"
        echo "🎮 Dashboard: http://localhost:3000/dashboard"
        echo "🧪 Tests: http://localhost:3000/test"
        echo "📖 About: http://localhost:3000/about"
        echo ""
        echo "Appuyez sur Ctrl+C pour arrêter le serveur"
        npm start
        ;;
        
    2)
        step "Déploiement Vercel..."
        
        # Vérifier si Vercel CLI est installé
        if ! command -v vercel &> /dev/null; then
            echo "📦 Installation de Vercel CLI..."
            npm install -g vercel
        fi
        
        echo "🚀 Déploiement sur Vercel..."
        echo "⚠️  Assurez-vous d'avoir configuré vos variables d'environnement sur Vercel"
        
        if vercel --prod; then
            success "Déploiement Vercel réussi!"
            echo ""
            echo "🎉 Votre site est maintenant en ligne!"
            echo "📊 Vérifiez le tableau de bord Vercel pour l'URL de production"
        else
            error "Échec du déploiement Vercel"
            exit 1
        fi
        ;;
        
    3)
        step "Mode développement..."
        echo "🔧 Lancement en mode développement..."
        echo "📱 Site accessible sur: http://localhost:3000"
        echo "🔄 Rechargement automatique activé"
        echo ""
        echo "Appuyez sur Ctrl+C pour arrêter"
        npm run dev
        ;;
        
    4)
        step "Tests des APIs..."
        echo "🧪 Lancement des tests..."
        
        # Démarrer le serveur pour les tests
        npm run dev &
        TEST_SERVER_PID=$!
        sleep 3
        
        # Exécuter les tests
        if [ -f "test-vercel-apis.js" ]; then
            node test-vercel-apis.js http://localhost:3000
        else
            echo "Tests manuels..."
            echo "Status API: http://localhost:3000/api/status"
            echo "Health API: http://localhost:3000/api/health"
            echo "Webhook API: http://localhost:3000/api/webhook"
            echo "Generate API: http://localhost:3000/api/generate-response"
        fi
        
        # Arrêter le serveur de test
        kill $TEST_SERVER_PID 2>/dev/null || true
        success "Tests terminés"
        ;;
        
    *)
        error "Choix invalide"
        exit 1
        ;;
esac

echo ""
success "Déploiement terminé avec succès!"

# Informations utiles
echo -e "${YELLOW}"
echo "╔═══════════════════════════════════════════════════════════════════════════════╗"
echo "║                              📋 INFORMATIONS UTILES                          ║"
echo "╠═══════════════════════════════════════════════════════════════════════════════╣"
echo "║                                                                               ║"
echo "║  🌐 Pages du site:                                                            ║"
echo "║     • Accueil: /                                                              ║"
echo "║     • Dashboard: /dashboard                                                   ║"
echo "║     • Tests: /test                                                            ║"
echo "║     • À propos: /about                                                        ║"
echo "║                                                                               ║"
echo "║  🔧 APIs disponibles:                                                         ║"
echo "║     • Status: /api/status                                                     ║"
echo "║     • Health: /api/health                                                     ║"
echo "║     • Webhook: /api/webhook                                                   ║"
echo "║     • Generate: /api/generate-response                                        ║"
echo "║                                                                               ║"
echo "║  ⚙️  Configuration:                                                           ║"
echo "║     • Variables d'environnement: .env.local                                   ║"
echo "║     • Documentation: SITE_README.md                                          ║"
echo "║     • Scripts npm: package.json                                               ║"
echo "║                                                                               ║"
echo "║  🚀 Commandes utiles:                                                         ║"
echo "║     • npm run dev        (développement)                                     ║"
echo "║     • npm run build      (construction)                                      ║"
echo "║     • npm start          (production locale)                                 ║"
echo "║     • npm run deploy     (déploiement Vercel)                                ║"
echo "║                                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${GREEN}🎭 Profitez de votre bot WhatsApp RP avec son interface web moderne!${NC}"