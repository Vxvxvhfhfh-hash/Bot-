#!/usr/bin/env node

// ═══════════════════════════════════════════════════════════════════════════════
// 🧪 Script de Test des APIs Vercel - Bot WhatsApp RP
// ═══════════════════════════════════════════════════════════════════════════════

const chalk = require('chalk');

// Configuration
const BASE_URL = process.argv[2] || 'http://localhost:3000';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'test-key';

console.log(chalk.cyan('═'.repeat(80)));
console.log(chalk.yellow('🧪 TEST DES APIS VERCEL - BOT WHATSAPP RP'));
console.log(chalk.cyan('═'.repeat(80)));
console.log(chalk.white(`🔗 URL de base: ${BASE_URL}`));
console.log(chalk.cyan('═'.repeat(80)));

// Fonction utilitaire pour les requêtes
async function testAPI(method, endpoint, data = null, description) {
    try {
        console.log(chalk.blue(`\n📡 Test ${method} ${endpoint}`));
        console.log(chalk.gray(`   ${description}`));
        
        const startTime = Date.now();
        
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Vercel-Test-Client/1.0'
            }
        };
        
        if (data) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(`${BASE_URL}${endpoint}`, options);
        const responseTime = Date.now() - startTime;
        
        let responseData;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
            responseData = await response.json();
        } else {
            responseData = await response.text();
        }
        
        // Affichage du résultat
        const status = response.ok ? '✅' : '❌';
        const statusColor = response.ok ? chalk.green : chalk.red;
        
        console.log(statusColor(`   ${status} ${response.status} ${response.statusText} (${responseTime}ms)`));
        
        if (response.ok) {
            if (typeof responseData === 'object') {
                // Affichage sélectif pour les objets JSON
                if (responseData.status) {
                    console.log(chalk.green(`   📊 Status: ${responseData.status}`));
                }
                if (responseData.timestamp) {
                    console.log(chalk.gray(`   ⏱️  Timestamp: ${responseData.timestamp}`));
                }
                if (responseData.config) {
                    console.log(chalk.cyan(`   ⚙️  Config: ${responseData.config.botName || 'N/A'}`));
                }
                if (responseData.response) {
                    const preview = responseData.response.substring(0, 100) + '...';
                    console.log(chalk.magenta(`   🎭 Réponse RP: ${preview}`));
                }
                if (responseData.processed !== undefined) {
                    console.log(chalk.yellow(`   📨 Messages traités: ${responseData.processed}`));
                }
            } else {
                // Affichage pour le HTML/texte
                const preview = responseData.toString().substring(0, 200) + '...';
                console.log(chalk.gray(`   📄 Contenu: ${preview}`));
            }
        } else {
            console.log(chalk.red(`   ❌ Erreur: ${JSON.stringify(responseData, null, 2)}`));
        }
        
        return response.ok;
        
    } catch (error) {
        console.log(chalk.red(`   ❌ Erreur réseau: ${error.message}`));
        return false;
    }
}

// Tests principaux
async function runTests() {
    const results = [];
    
    // Test 1: Page d'accueil / Status
    results.push({
        name: 'Status Page',
        success: await testAPI('GET', '/api/status', null, 'Vérification de la page de statut principale')
    });
    
    // Test 2: Health Check
    results.push({
        name: 'Health Check',
        success: await testAPI('GET', '/api/health', null, 'Vérification de l\'état de santé du système')
    });
    
    // Test 3: Webhook verification
    results.push({
        name: 'Webhook Info',
        success: await testAPI('GET', '/api/webhook', null, 'Information sur l\'endpoint webhook')
    });
    
    // Test 4: Génération de réponse RP
    results.push({
        name: 'Generate Response',
        success: await testAPI('POST', '/api/generate-response', {
            message: "Je marche dans les rues sombres de Night City",
            characterName: "default",
            conversationHistory: []
        }, 'Test de génération de réponse RP avec Gemini AI')
    });
    
    // Test 5: Webhook avec commande RP
    results.push({
        name: 'Webhook RP Command',
        success: await testAPI('POST', '/api/webhook', {
            messages: [{
                from: "test_user_123",
                text: { body: "!rp start" },
                type: "text"
            }]
        }, 'Test du webhook avec commande de démarrage RP')
    });
    
    // Test 6: Webhook avec message RP
    results.push({
        name: 'Webhook RP Message',
        success: await testAPI('POST', '/api/webhook', {
            messages: [{
                from: "test_user_123",
                text: { body: "Je regarde autour de moi dans cette ville cyberpunk" },
                type: "text"
            }]
        }, 'Test du webhook avec message RP normal')
    });
    
    // Test 7: Commande d'arrêt RP
    results.push({
        name: 'Webhook RP Stop',
        success: await testAPI('POST', '/api/webhook', {
            messages: [{
                from: "test_user_123",
                text: { body: "!rp stop" },
                type: "text"
            }]
        }, 'Test du webhook avec commande d\'arrêt RP')
    });
    
    // Résumé des tests
    console.log(chalk.cyan('\n═'.repeat(80)));
    console.log(chalk.yellow('📊 RÉSUMÉ DES TESTS'));
    console.log(chalk.cyan('═'.repeat(80)));
    
    let successCount = 0;
    results.forEach((result, index) => {
        const status = result.success ? '✅' : '❌';
        const color = result.success ? chalk.green : chalk.red;
        console.log(color(`${status} Test ${index + 1}: ${result.name}`));
        if (result.success) successCount++;
    });
    
    const percentage = Math.round((successCount / results.length) * 100);
    const overallColor = percentage >= 80 ? chalk.green : percentage >= 60 ? chalk.yellow : chalk.red;
    
    console.log(chalk.cyan('\n═'.repeat(80)));
    console.log(overallColor(`📈 RÉSULTAT GLOBAL: ${successCount}/${results.length} tests réussis (${percentage}%)`));
    
    if (percentage >= 80) {
        console.log(chalk.green('🎉 Excellents résultats ! Votre bot est prêt pour la production.'));
    } else if (percentage >= 60) {
        console.log(chalk.yellow('⚠️  Résultats corrects, mais quelques points à améliorer.'));
    } else {
        console.log(chalk.red('❌ Plusieurs problèmes détectés. Vérifiez la configuration.'));
    }
    
    // Conseils selon les résultats
    console.log(chalk.cyan('\n═'.repeat(80)));
    console.log(chalk.yellow('💡 CONSEILS'));
    console.log(chalk.cyan('═'.repeat(80)));
    
    if (!results[0].success) {
        console.log(chalk.red('• La page de statut ne fonctionne pas - Vérifiez le déploiement Vercel'));
    }
    
    if (!results[1].success) {
        console.log(chalk.red('• Le health check échoue - Vérifiez les variables d\'environnement'));
    }
    
    if (!results[3].success) {
        console.log(chalk.red('• L\'IA Gemini ne fonctionne pas - Vérifiez votre clé API GEMINI_API_KEY'));
    }
    
    if (results[0].success && results[1].success) {
        console.log(chalk.green('• APIs de base fonctionnelles ✅'));
    }
    
    if (results[3].success) {
        console.log(chalk.green('• IA Gemini opérationnelle ✅'));
    }
    
    if (results[4].success && results[5].success) {
        console.log(chalk.green('• Système de webhook fonctionnel ✅'));
    }
    
    console.log(chalk.cyan('\n═'.repeat(80)));
    console.log(chalk.white('🔗 URLs importantes:'));
    console.log(chalk.cyan(`   📊 Status: ${BASE_URL}/api/status`));
    console.log(chalk.cyan(`   🏥 Health: ${BASE_URL}/api/health`));
    console.log(chalk.cyan(`   📡 Webhook: ${BASE_URL}/api/webhook`));
    console.log(chalk.cyan('═'.repeat(80)));
    
    return percentage >= 80;
}

// Fonction principale
async function main() {
    try {
        // Vérifier si fetch est disponible
        if (typeof fetch === 'undefined') {
            const { default: fetch } = await import('node-fetch');
            global.fetch = fetch;
        }
        
        const success = await runTests();
        process.exit(success ? 0 : 1);
        
    } catch (error) {
        console.error(chalk.red('💥 Erreur lors des tests:'), error);
        process.exit(1);
    }
}

// Aide d'utilisation
if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log(chalk.cyan('💡 Utilisation:'));
    console.log(chalk.white('  node test-vercel-apis.js [URL_BASE]'));
    console.log(chalk.white(''));
    console.log(chalk.white('Exemples:'));
    console.log(chalk.gray('  node test-vercel-apis.js                           # Test en local'));
    console.log(chalk.gray('  node test-vercel-apis.js https://mon-bot.vercel.app # Test production'));
    console.log(chalk.white(''));
    console.log(chalk.white('Variables d\'environnement:'));
    console.log(chalk.gray('  GEMINI_API_KEY=your_key   # Pour tester l\'IA Gemini'));
    process.exit(0);
}

// Lancer les tests
main();