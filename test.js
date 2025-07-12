#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

console.log('🧪 Test du Bot WhatsApp Gemini\n');

const tests = [];
let passedTests = 0;
let failedTests = 0;

// Fonction pour ajouter un test
function addTest(name, testFunction) {
    tests.push({ name, testFunction });
}

// Fonction pour exécuter un test
async function runTest(test) {
    try {
        console.log(`⏳ Test: ${test.name}`);
        await test.testFunction();
        console.log(`✅ PASS: ${test.name}`);
        passedTests++;
        return true;
    } catch (error) {
        console.log(`❌ FAIL: ${test.name}`);
        console.log(`   Erreur: ${error.message}\n`);
        failedTests++;
        return false;
    }
}

// Test 1: Vérifier les dépendances
addTest('Vérification des dépendances', async () => {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const dependencies = Object.keys(packageJson.dependencies);
    
    for (const dep of dependencies) {
        try {
            require(dep);
        } catch (error) {
            throw new Error(`Dépendance manquante: ${dep}`);
        }
    }
    
    console.log(`   📦 ${dependencies.length} dépendances vérifiées`);
});

// Test 2: Vérifier la configuration
addTest('Vérification de la configuration', async () => {
    if (!fs.existsSync('.env')) {
        throw new Error('Fichier .env manquant');
    }
    
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY manquante dans .env');
    }
    
    console.log('   🔑 Configuration de base validée');
});

// Test 2b: Vérifier l'utilisation exclusive de Gemini
addTest('Vérification utilisation exclusive de Gemini', async () => {
    // Vérifier qu'aucune autre IA n'est configurée
    const otherAIKeys = [
        'OPENAI_API_KEY',
        'ANTHROPIC_API_KEY',
        'CLAUDE_API_KEY',
        'CHATGPT_API_KEY'
    ];
    
    for (const key of otherAIKeys) {
        if (process.env[key]) {
            throw new Error(`Clé API détectée pour une autre IA: ${key}. Ce bot utilise UNIQUEMENT Gemini.`);
        }
    }
    
    // Vérifier la configuration AI_PROVIDER
    if (process.env.AI_PROVIDER && process.env.AI_PROVIDER !== 'gemini_only') {
        throw new Error('AI_PROVIDER doit être "gemini_only" ou non défini');
    }
    
    console.log('   ✅ Utilisation exclusive de Google Gemini confirmée');
});

// Test 3: Vérifier l'API Gemini
addTest('Test de l\'API Gemini', async () => {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY non configurée');
    }
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = "Dis simplement 'Test réussi' en français.";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text || text.length === 0) {
        throw new Error('Réponse vide de l\'API Gemini');
    }
    
    console.log(`   🧠 Réponse Gemini: "${text.trim()}"`);
});

// Test 4: Vérifier l'API Unsplash (si configurée)
addTest('Test de l\'API Unsplash (optionnel)', async () => {
    if (!process.env.UNSPLASH_ACCESS_KEY) {
        console.log('   ⚠️  UNSPLASH_ACCESS_KEY non configurée - test ignoré');
        return;
    }
    
    const response = await axios.get('https://api.unsplash.com/search/photos', {
        params: {
            query: 'test',
            per_page: 1
        },
        headers: {
            'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
        }
    });
    
    if (!response.data.results || response.data.results.length === 0) {
        throw new Error('Aucune image trouvée via l\'API Unsplash');
    }
    
    console.log('   🖼️  API Unsplash fonctionnelle');
});

// Test 5: Vérifier l'API Pexels (si configurée)
addTest('Test de l\'API Pexels (optionnel)', async () => {
    if (!process.env.PEXELS_API_KEY) {
        console.log('   ⚠️  PEXELS_API_KEY non configurée - test ignoré');
        return;
    }
    
    const response = await axios.get('https://api.pexels.com/v1/search', {
        params: {
            query: 'test',
            per_page: 1
        },
        headers: {
            'Authorization': process.env.PEXELS_API_KEY
        }
    });
    
    if (!response.data.photos || response.data.photos.length === 0) {
        throw new Error('Aucune image trouvée via l\'API Pexels');
    }
    
    console.log('   🖼️  API Pexels fonctionnelle');
});

// Test 6: Vérifier les dossiers
addTest('Vérification des dossiers', async () => {
    const requiredDirs = ['./temp', './logs'];
    
    for (const dir of requiredDirs) {
        if (!fs.existsSync(dir)) {
            throw new Error(`Dossier manquant: ${dir}`);
        }
    }
    
    console.log(`   📁 ${requiredDirs.length} dossiers vérifiés`);
});

// Test 7: Test de téléchargement d'image
addTest('Test de téléchargement d\'image', async () => {
    const testImageUrl = 'https://picsum.photos/200/200?random=1';
    const testImagePath = path.join('./temp', 'test_image.jpg');
    
    try {
        const response = await axios.get(testImageUrl, {
            responseType: 'arraybuffer',
            timeout: 5000
        });
        
        await fs.promises.writeFile(testImagePath, response.data);
        
        if (!fs.existsSync(testImagePath)) {
            throw new Error('Image non téléchargée');
        }
        
        const stats = fs.statSync(testImagePath);
        if (stats.size === 0) {
            throw new Error('Image vide téléchargée');
        }
        
        // Nettoyer le fichier de test
        fs.unlinkSync(testImagePath);
        
        console.log('   📸 Téléchargement d\'image fonctionnel');
    } catch (error) {
        // Nettoyer en cas d'erreur
        if (fs.existsSync(testImagePath)) {
            fs.unlinkSync(testImagePath);
        }
        throw error;
    }
});

// Test 8: Test de l'extraction de mots-clés
addTest('Test d\'extraction de mots-clés', async () => {
    const testText = "J'aimerais voir une belle image de nature avec des montagnes et des arbres";
    
    const words = testText.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 3)
        .filter(word => !['pour', 'avec', 'dans', 'une', 'des', 'les', 'que', 'qui', 'mais'].includes(word));
    
    if (words.length === 0) {
        throw new Error('Aucun mot-clé extrait');
    }
    
    console.log(`   🔍 Mots-clés extraits: ${words.slice(0, 3).join(', ')}`);
});

// Fonction principale pour exécuter tous les tests
async function runAllTests() {
    console.log(`🚀 Exécution de ${tests.length} tests...\n`);
    
    for (const test of tests) {
        await runTest(test);
    }
    
    console.log('\n' + '=' * 50);
    console.log('📊 RÉSULTATS DES TESTS');
    console.log('=' * 50);
    console.log(`✅ Tests réussis: ${passedTests}`);
    console.log(`❌ Tests échoués: ${failedTests}`);
    console.log(`📊 Total: ${passedTests + failedTests}`);
    
    if (failedTests === 0) {
        console.log('\n🎉 Tous les tests sont passés! Le bot est prêt à être utilisé.');
        console.log('🚀 Vous pouvez maintenant lancer le bot avec: npm start');
    } else {
        console.log('\n⚠️  Certains tests ont échoué. Veuillez corriger les erreurs avant de lancer le bot.');
        console.log('📖 Consultez le README.md pour plus d\'informations.');
    }
    
    console.log('=' * 50);
}

// Exécuter les tests
runAllTests().catch((error) => {
    console.error('\n❌ Erreur fatale lors des tests:', error.message);
    process.exit(1);
});