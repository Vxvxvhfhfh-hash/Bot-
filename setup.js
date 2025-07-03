#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const chalk = require('chalk');

// Interface pour les questions
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log(chalk.cyan('═'.repeat(60)));
console.log(chalk.yellow('🎭 CONFIGURATION DU BOT WHATSAPP RP'));
console.log(chalk.cyan('═'.repeat(60)));

async function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

async function setup() {
    try {
        console.log(chalk.green('\n✨ Démarrage de la configuration...\n'));

        // Vérifier si .env existe déjà
        if (fs.existsSync('.env')) {
            const overwrite = await question(chalk.yellow('⚠️  Un fichier .env existe déjà. Le remplacer ? (y/N): '));
            if (overwrite.toLowerCase() !== 'y') {
                console.log(chalk.blue('Configuration annulée.'));
                rl.close();
                return;
            }
        }

        // Configuration Gemini API
        console.log(chalk.magenta('🧠 Configuration de l\'IA Gemini:'));
        console.log(chalk.gray('Pour obtenir votre clé API: https://makersuite.google.com/app/apikey'));
        const geminiKey = await question(chalk.cyan('🔑 Clé API Gemini: '));

        // Configuration du bot
        console.log(chalk.magenta('\n🎭 Configuration du personnage RP:'));
        const botName = await question(chalk.cyan('🎪 Nom du bot (🎭 RP Master Bot): ')) || '🎭 RP Master Bot';
        const rpWorld = await question(chalk.cyan('🌍 Univers RP (Cyberpunk 2077): ')) || 'Cyberpunk 2077';
        const defaultCharacter = await question(chalk.cyan('🤖 Personnage par défaut (Assistant IA Futuriste): ')) || 'Assistant IA Futuriste';

        // Configuration des médias
        console.log(chalk.magenta('\n📸 Configuration des médias:'));
        const enableMedia = await question(chalk.cyan('📸 Activer les médias automatiques ? (Y/n): '));
        const mediaEnabled = enableMedia.toLowerCase() !== 'n';

        // Configuration avancée
        console.log(chalk.magenta('\n⚙️ Configuration avancée:'));
        const debugMode = await question(chalk.cyan('🐛 Mode debug ? (y/N): '));
        const debug = debugMode.toLowerCase() === 'y';

        const delayInput = await question(chalk.cyan('⏱️  Délai de réponse en ms (2000): '));
        const delay = parseInt(delayInput) || 2000;

        const maxLengthInput = await question(chalk.cyan('📝 Longueur max des messages (1000): '));
        const maxLength = parseInt(maxLengthInput) || 1000;

        // Créer le fichier .env
        const envContent = `# Configuration Gemini AI
GEMINI_API_KEY=${geminiKey}

# Configuration du Bot RP
BOT_NAME=${botName}
RP_WORLD=${rpWorld}
DEFAULT_CHARACTER=${defaultCharacter}

# Configuration des médias
MEDIA_FOLDER=./media
ENABLE_MEDIA_RESPONSES=${mediaEnabled}

# Configuration avancée
DEBUG_MODE=${debug}
AUTO_REPLY_DELAY=${delay}
MAX_MESSAGE_LENGTH=${maxLength}
`;

        fs.writeFileSync('.env', envContent);
        console.log(chalk.green('\n✅ Fichier .env créé avec succès!'));

        // Vérifier les dossiers médias
        console.log(chalk.blue('\n📁 Vérification des dossiers médias...'));
        const mediaFolders = ['media/cyberpunk', 'media/action', 'media/ambient', 'media/character'];
        
        mediaFolders.forEach(folder => {
            if (!fs.existsSync(folder)) {
                fs.mkdirSync(folder, { recursive: true });
                console.log(chalk.green(`✅ Dossier créé: ${folder}`));
            } else {
                console.log(chalk.blue(`📁 Dossier existant: ${folder}`));
            }
        });

        // Créer des fichiers d'exemple dans les dossiers médias
        const placeholderContent = `# Placez vos images ici
Ce dossier est prêt à recevoir vos médias.
Formats supportés: .jpg, .jpeg, .png, .gif, .webp, .mp4
`;

        mediaFolders.forEach(folder => {
            const readmePath = path.join(folder, 'README.md');
            if (!fs.existsSync(readmePath)) {
                fs.writeFileSync(readmePath, placeholderContent);
            }
        });

        // Affichage du résumé
        console.log(chalk.cyan('\n═'.repeat(60)));
        console.log(chalk.yellow('📋 RÉSUMÉ DE LA CONFIGURATION'));
        console.log(chalk.cyan('═'.repeat(60)));
        console.log(chalk.white(`🎭 Nom du bot: ${chalk.green(botName)}`));
        console.log(chalk.white(`🌍 Univers: ${chalk.green(rpWorld)}`));
        console.log(chalk.white(`🤖 Personnage: ${chalk.green(defaultCharacter)}`));
        console.log(chalk.white(`📸 Médias: ${chalk.green(mediaEnabled ? 'Activés' : 'Désactivés')}`));
        console.log(chalk.white(`🐛 Debug: ${chalk.green(debug ? 'Activé' : 'Désactivé')}`));
        console.log(chalk.white(`⏱️  Délai: ${chalk.green(delay + 'ms')}`));
        console.log(chalk.white(`📝 Longueur max: ${chalk.green(maxLength + ' caractères')}`));

        // Instructions finales
        console.log(chalk.cyan('\n═'.repeat(60)));
        console.log(chalk.yellow('🚀 PROCHAINES ÉTAPES'));
        console.log(chalk.cyan('═'.repeat(60)));
        console.log(chalk.white('1. Installer les dépendances:'));
        console.log(chalk.green('   npm install'));
        console.log(chalk.white('\n2. Ajouter vos médias dans les dossiers:'));
        console.log(chalk.green('   media/cyberpunk/, media/action/, etc.'));
        console.log(chalk.white('\n3. Démarrer le bot:'));
        console.log(chalk.green('   npm start'));
        console.log(chalk.white('\n4. Scanner le QR code avec WhatsApp'));
        console.log(chalk.white('\n5. Utiliser les commandes:'));
        console.log(chalk.green('   !rp start  # Démarrer le RP'));
        console.log(chalk.green('   !rp help   # Voir l\'aide'));

        console.log(chalk.cyan('\n═'.repeat(60)));
        console.log(chalk.magenta('🎭 Configuration terminée! Bon jeu de rôle! ✨'));
        console.log(chalk.cyan('═'.repeat(60)));

    } catch (error) {
        console.error(chalk.red(`❌ Erreur lors de la configuration: ${error.message}`));
    } finally {
        rl.close();
    }
}

// Démarrer la configuration
setup();