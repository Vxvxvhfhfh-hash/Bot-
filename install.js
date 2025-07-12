#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

console.log('🚀 Installation du Bot WhatsApp Gemini\n');

// Vérifier Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 16) {
    console.error(`❌ Node.js version ${nodeVersion} n'est pas supportée.`);
    console.log('📋 Veuillez installer Node.js 16 ou plus récent.');
    console.log('🔗 Télécharger: https://nodejs.org/\n');
    process.exit(1);
}

console.log(`✅ Node.js version ${nodeVersion} détectée\n`);

// Créer les dossiers nécessaires
console.log('📁 Création des dossiers...');
const dirs = ['./temp', './logs', './backups'];
dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`   ✅ ${dir} créé`);
    } else {
        console.log(`   ⚠️  ${dir} existe déjà`);
    }
});

// Créer le fichier .env s'il n'existe pas
console.log('\n🔧 Configuration...');
if (!fs.existsSync('.env')) {
    if (fs.existsSync('.env.example')) {
        fs.copyFileSync('.env.example', '.env');
        console.log('   ✅ Fichier .env créé à partir de .env.example');
    } else {
        console.error('   ❌ Fichier .env.example non trouvé');
        process.exit(1);
    }
} else {
    console.log('   ⚠️  Fichier .env existe déjà');
}

// Installer les dépendances
console.log('\n📦 Installation des dépendances...');
const installProcess = spawn('npm', ['install'], { 
    stdio: 'inherit',
    shell: true
});

installProcess.on('close', (code) => {
    if (code === 0) {
        console.log('\n✅ Installation terminée avec succès!\n');
        
        // Afficher les instructions de configuration
        console.log('=' * 60);
        console.log('🎯 ÉTAPES SUIVANTES:');
        console.log('=' * 60);
        console.log('\n1. 🔑 Configurer les clés API:');
        console.log('   Éditez le fichier .env et ajoutez vos clés API:');
        console.log('   - GEMINI_API_KEY (OBLIGATOIRE)');
        console.log('   - UNSPLASH_ACCESS_KEY (optionnel)');
        console.log('   - PEXELS_API_KEY (optionnel)\n');
        
        console.log('2. 🔗 Obtenir les clés API:');
        console.log('   - Gemini: https://makersuite.google.com/app/apikey');
        console.log('   - Unsplash: https://unsplash.com/developers');
        console.log('   - Pexels: https://www.pexels.com/api/\n');
        
        console.log('3. 🚀 Démarrer le bot:');
        console.log('   npm start\n');
        
        console.log('4. 📱 Connexion WhatsApp:');
        console.log('   - Scannez le QR code avec WhatsApp');
        console.log('   - Attendez la confirmation de connexion\n');
        
        console.log('5. 🎮 Commandes disponibles:');
        console.log('   - !help : Afficher l\'aide');
        console.log('   - !status : Statut du bot');
        console.log('   - !image [mot-clé] : Générer une image');
        console.log('   - !votre question : Discuter avec l\'IA\n');
        
        console.log('📚 Pour plus d\'informations, consultez le README.md');
        console.log('=' * 60);
    } else {
        console.error('\n❌ Erreur lors de l\'installation des dépendances');
        console.log('🔧 Essayez de résoudre les erreurs ci-dessus et relancez l\'installation.');
        process.exit(1);
    }
});

installProcess.on('error', (err) => {
    console.error('\n❌ Erreur lors de l\'installation:', err.message);
    console.log('🔧 Vérifiez que npm est installé et accessible.');
    process.exit(1);
});