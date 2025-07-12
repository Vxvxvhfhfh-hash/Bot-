#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Démarrage du Bot WhatsApp Gemini...\n');

// Vérifier l'existence du fichier .env
if (!fs.existsSync('.env')) {
    console.log('⚠️  Fichier .env non trouvé!');
    console.log('📋 Création du fichier .env à partir de .env.example...\n');
    
    if (fs.existsSync('.env.example')) {
        fs.copyFileSync('.env.example', '.env');
        console.log('✅ Fichier .env créé avec succès!');
        console.log('🔧 Veuillez éditer le fichier .env et ajouter vos clés API:\n');
        console.log('   - GEMINI_API_KEY (obligatoire)');
        console.log('   - UNSPLASH_ACCESS_KEY (optionnel)');
        console.log('   - PEXELS_API_KEY (optionnel)\n');
        console.log('📖 Consultez le README.md pour plus d\'informations sur l\'obtention des clés API.\n');
        process.exit(1);
    } else {
        console.error('❌ Fichier .env.example non trouvé!');
        process.exit(1);
    }
}

// Vérifier les dépendances
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const nodeModulesPath = path.join(__dirname, 'node_modules');

if (!fs.existsSync(nodeModulesPath)) {
    console.log('📦 Installation des dépendances...');
    console.log('⚠️  Veuillez exécuter: npm install\n');
    process.exit(1);
}

// Créer les dossiers nécessaires
const dirs = ['./temp', './logs'];
dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Dossier ${dir} créé`);
    }
});

// Afficher les informations de démarrage
console.log('📊 Informations du bot:');
console.log(`   - Nom: ${packageJson.name}`);
console.log(`   - Version: ${packageJson.version}`);
console.log(`   - Description: ${packageJson.description}\n`);

// Vérifier les variables d'environnement critiques
require('dotenv').config();

if (!process.env.GEMINI_API_KEY) {
    console.error('❌ ERREUR: La variable GEMINI_API_KEY est manquante dans le fichier .env');
    console.log('🔗 Obtenez votre clé API ici: https://makersuite.google.com/app/apikey\n');
    process.exit(1);
}

console.log('✅ Configuration vérifiée!');
console.log('🤖 Lancement du bot...\n');

// Afficher les étapes de connexion
console.log('📱 Étapes de connexion:');
console.log('   1. Un QR code va s\'afficher dans le terminal');
console.log('   2. Ouvrez WhatsApp sur votre téléphone');
console.log('   3. Allez dans Paramètres > WhatsApp Web');
console.log('   4. Scannez le QR code affiché');
console.log('   5. Attendez la confirmation de connexion\n');

console.log('🎯 Commandes disponibles après connexion:');
console.log('   - !help : Afficher l\'aide');
console.log('   - !status : Statut du bot');
console.log('   - !image [mot-clé] : Générer une image');
console.log('   - !votre question : Discuter avec l\'IA\n');

console.log('🛑 Pour arrêter le bot, appuyez sur Ctrl+C\n');
console.log('=' * 50);

// Démarrer le bot principal
try {
    require('./index.js');
} catch (error) {
    console.error('❌ Erreur lors du démarrage:', error.message);
    console.log('\n🔧 Solutions possibles:');
    console.log('   - Vérifiez votre connexion Internet');
    console.log('   - Vérifiez que toutes les dépendances sont installées: npm install');
    console.log('   - Vérifiez la configuration dans le fichier .env');
    console.log('   - Consultez les logs pour plus de détails\n');
    process.exit(1);
}