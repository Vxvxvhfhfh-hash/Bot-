// Mobile 3D Combat Game - Android Optimized
class MobileGame {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.player = null;
        this.enemies = [];
        this.particles = [];
        
        // Mobile specific
        this.virtualControls = {
            movement: { x: 0, y: 0 },
            camera: { x: 0, y: 0 },
            isMoving: false,
            isCameraMoving: false
        };
        
        // Touch handling
        this.touches = new Map();
        this.joystickStates = {
            movement: { active: false, startPos: null, currentPos: null },
            camera: { active: false, startPos: null, currentPos: null }
        };
        
        // Performance settings
        this.settings = {
            cameraSensitivity: 1.5,
            buttonSize: 1.0,
            graphicsQuality: 'medium',
            vibrationEnabled: true
        };
        
        // Game state
        this.gameState = {
            playerHealth: 100,
            playerMana: 100,
            playerLevel: 1,
            playerXP: 0,
            enemyHealth: 100,
            inCombat: false,
            lastAction: 'Touchez pour commencer !',
            actionCooldowns: {}
        };
        
        // Actions and French commands
        this.frenchCommands = {
            'attaquer': 'attack',
            'attaque': 'attack',
            'frapper': 'attack',
            'épée': 'attack',
            'magie': 'magic',
            'sortilège': 'magic',
            'boule de feu': 'fireball',
            'feu': 'fireball',
            'foudre': 'lightning',
            'éclair': 'lightning',
            'nova': 'nova',
            'explosion': 'nova',
            'soin': 'heal',
            'guérison': 'heal',
            'saut': 'jump',
            'sauter': 'jump',
            'bouclier': 'shield',
            'défense': 'shield',
            'ultimate': 'ultimate',
            'ultime': 'ultimate',
            'super': 'ultimate'
        };
        
        this.spellCosts = {
            fireball: 15,
            lightning: 20,
            nova: 30,
            heal: 25,
            shield: 20,
            ultimate: 50
        };
        
        this.init();
    }
    
    async init() {
        await this.showLoadingScreen();
        this.checkOrientation();
        this.setupEventListeners();
        this.initThreeJS();
        this.createScene();
        this.setupVirtualControls();
        this.startGameLoop();
        this.hideLoadingScreen();
    }
    
    async showLoadingScreen() {
        const progress = document.getElementById('loading-progress');
        for (let i = 0; i <= 100; i += 2) {
            progress.style.width = i + '%';
            await new Promise(resolve => setTimeout(resolve, 30));
        }
    }
    
    hideLoadingScreen() {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('game-container').style.display = 'block';
    }
    
    checkOrientation() {
        const updateOrientation = () => {
            const orientationWarning = document.getElementById('orientation-warning');
            if (window.innerHeight > window.innerWidth) {
                orientationWarning.style.display = 'flex';
            } else {
                orientationWarning.style.display = 'none';
            }
        };
        
        window.addEventListener('orientationchange', updateOrientation);
        window.addEventListener('resize', updateOrientation);
        updateOrientation();
    }
    
    setupEventListeners() {
        // Prevent default behaviors
        document.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
        document.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
        document.addEventListener('touchend', (e) => e.preventDefault(), { passive: false });
        
        // Action buttons
        const actionButtons = document.querySelectorAll('.action-btn');
        actionButtons.forEach(btn => {
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handleActionButton(btn.dataset.action);
                this.vibrate(50);
            });
        });
        
        // Long press for text modal
        let longPressTimer;
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                longPressTimer = setTimeout(() => {
                    this.showTextModal();
                    this.vibrate(100);
                }, 1000);
            }
        });
        
        document.addEventListener('touchend', () => {
            clearTimeout(longPressTimer);
        });
        
        // Text command input
        document.getElementById('text-command').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.executeTextCommand();
            }
        });
    }
    
    initThreeJS() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a0a);
        this.scene.fog = new THREE.Fog(0x0a0a0a, 50, 200);
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 8, 15);
        
        // Create renderer with mobile optimizations
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: this.settings.graphicsQuality !== 'low',
            powerPreference: this.settings.graphicsQuality === 'high' ? 'high-performance' : 'low-power'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = this.settings.graphicsQuality !== 'low';
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Add to DOM
        document.getElementById('game-world').appendChild(this.renderer.domElement);
        
        // Handle resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    
    createScene() {
        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(50, 50, 50);
        directionalLight.castShadow = this.settings.graphicsQuality !== 'low';
        directionalLight.shadow.mapSize.width = this.settings.graphicsQuality === 'high' ? 2048 : 1024;
        directionalLight.shadow.mapSize.height = this.settings.graphicsQuality === 'high' ? 2048 : 1024;
        this.scene.add(directionalLight);
        
        // Create arena
        this.createArena();
        
        // Create player
        this.createPlayer();
        
        // Create enemies
        this.createEnemies();
        
        // Add magical effects
        this.createMagicalEnvironment();
    }
    
    createArena() {
        // Ground
        const groundGeometry = new THREE.CircleGeometry(30, 32);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x2c3e50,
            transparent: true,
            opacity: 0.8
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // Arena border
        const borderGeometry = new THREE.TorusGeometry(30, 2, 8, 32);
        const borderMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xff6b35,
            emissive: 0x331a0d
        });
        const border = new THREE.Mesh(borderGeometry, borderMaterial);
        border.rotation.x = -Math.PI / 2;
        border.position.y = 1;
        this.scene.add(border);
        
        // Energy pillars
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const pillarGeometry = new THREE.CylinderGeometry(1, 1.5, 8, 8);
            const pillarMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x74b9ff,
                emissive: 0x1a2e4a,
                transparent: true,
                opacity: 0.7
            });
            const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
            pillar.position.set(
                Math.cos(angle) * 25,
                4,
                Math.sin(angle) * 25
            );
            pillar.castShadow = true;
            this.scene.add(pillar);
            
            // Pillar glow
            const glowGeometry = new THREE.SphereGeometry(1.5, 8, 8);
            const glowMaterial = new THREE.MeshBasicMaterial({ 
                color: 0x74b9ff,
                transparent: true,
                opacity: 0.3
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            glow.position.copy(pillar.position);
            glow.position.y += 4;
            this.scene.add(glow);
        }
    }
    
    createPlayer() {
        const playerGroup = new THREE.Group();
        
        // Body
        const bodyGeometry = new THREE.CylinderGeometry(1, 1.2, 3, 8);
        const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x2c3e50 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1.5;
        body.castShadow = true;
        playerGroup.add(body);
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.8, 8, 8);
        const headMaterial = new THREE.MeshPhongMaterial({ color: 0xfdbcb4 });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 3.8;
        head.castShadow = true;
        playerGroup.add(head);
        
        // Helmet
        const helmetGeometry = new THREE.SphereGeometry(0.9, 8, 8);
        const helmetMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xff6b35,
            emissive: 0x331a0d
        });
        const helmet = new THREE.Mesh(helmetGeometry, helmetMaterial);
        helmet.position.y = 3.8;
        helmet.castShadow = true;
        playerGroup.add(helmet);
        
        // Cape
        const capeGeometry = new THREE.PlaneGeometry(2, 3);
        const capeMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x8b0000,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        });
        const cape = new THREE.Mesh(capeGeometry, capeMaterial);
        cape.position.set(0, 2, -1.5);
        cape.rotation.x = 0.2;
        playerGroup.add(cape);
        
        // Energy sword
        const swordGeometry = new THREE.BoxGeometry(0.1, 4, 0.1);
        const swordMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x74b9ff,
            transparent: true,
            opacity: 0.8
        });
        const sword = new THREE.Mesh(swordGeometry, swordMaterial);
        sword.position.set(1.5, 2, 0);
        sword.rotation.z = -Math.PI / 6;
        playerGroup.add(sword);
        
        // Player aura
        const auraGeometry = new THREE.SphereGeometry(2, 16, 16);
        const auraMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x74b9ff,
            transparent: true,
            opacity: 0.1
        });
        const aura = new THREE.Mesh(auraGeometry, auraMaterial);
        aura.position.y = 2;
        playerGroup.add(aura);
        
        playerGroup.position.set(0, 0, 0);
        this.player = playerGroup;
        this.scene.add(playerGroup);
    }
    
    createEnemies() {
        for (let i = 0; i < 3; i++) {
            const enemyGroup = new THREE.Group();
            
            // Demon body
            const bodyGeometry = new THREE.CylinderGeometry(1.2, 1.5, 3.5, 6);
            const bodyMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x800080,
                emissive: 0x2d0a2d
            });
            const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
            body.position.y = 1.75;
            body.castShadow = true;
            enemyGroup.add(body);
            
            // Demon head
            const headGeometry = new THREE.SphereGeometry(1, 8, 8);
            const headMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x4a0e4e,
                emissive: 0x1a051a
            });
            const head = new THREE.Mesh(headGeometry, headMaterial);
            head.position.y = 4.2;
            head.castShadow = true;
            enemyGroup.add(head);
            
            // Horns
            const hornGeometry = new THREE.ConeGeometry(0.2, 1, 6);
            const hornMaterial = new THREE.MeshPhongMaterial({ color: 0x2c1810 });
            
            const leftHorn = new THREE.Mesh(hornGeometry, hornMaterial);
            leftHorn.position.set(-0.5, 5, 0.3);
            leftHorn.rotation.z = -0.3;
            enemyGroup.add(leftHorn);
            
            const rightHorn = new THREE.Mesh(hornGeometry, hornMaterial);
            rightHorn.position.set(0.5, 5, 0.3);
            rightHorn.rotation.z = 0.3;
            enemyGroup.add(rightHorn);
            
            // Glowing eyes
            const eyeGeometry = new THREE.SphereGeometry(0.1, 8, 8);
            const eyeMaterial = new THREE.MeshBasicMaterial({ 
                color: 0xff0000,
                emissive: 0xff0000
            });
            
            const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
            leftEye.position.set(-0.3, 4.2, 0.8);
            enemyGroup.add(leftEye);
            
            const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
            rightEye.position.set(0.3, 4.2, 0.8);
            enemyGroup.add(rightEye);
            
            // Dark aura
            const auraGeometry = new THREE.SphereGeometry(2.5, 16, 16);
            const auraMaterial = new THREE.MeshBasicMaterial({ 
                color: 0x800080,
                transparent: true,
                opacity: 0.1
            });
            const aura = new THREE.Mesh(auraGeometry, auraMaterial);
            aura.position.y = 2;
            enemyGroup.add(aura);
            
            // Position enemies in circle around player
            const angle = (i / 3) * Math.PI * 2;
            enemyGroup.position.set(
                Math.cos(angle) * 12,
                0,
                Math.sin(angle) * 12
            );
            
            enemyGroup.userData = {
                health: 100,
                maxHealth: 100,
                lastAttack: Date.now(),
                attackCooldown: 3000
            };
            
            this.enemies.push(enemyGroup);
            this.scene.add(enemyGroup);
        }
    }
    
    createMagicalEnvironment() {
        // Create floating energy orbs
        for (let i = 0; i < 20; i++) {
            const orbGeometry = new THREE.SphereGeometry(0.3, 8, 8);
            const orbMaterial = new THREE.MeshBasicMaterial({ 
                color: Math.random() > 0.5 ? 0x74b9ff : 0xff6b35,
                transparent: true,
                opacity: 0.6
            });
            const orb = new THREE.Mesh(orbGeometry, orbMaterial);
            
            orb.position.set(
                (Math.random() - 0.5) * 60,
                Math.random() * 20 + 5,
                (Math.random() - 0.5) * 60
            );
            
            orb.userData = {
                speed: Math.random() * 0.02 + 0.01,
                direction: Math.random() * Math.PI * 2
            };
            
            this.scene.add(orb);
            this.particles.push(orb);
        }
    }
    
    setupVirtualControls() {
        // Movement joystick
        const movementJoystick = document.getElementById('movement-joystick');
        const movementKnob = document.getElementById('movement-knob');
        
        this.setupJoystick(movementJoystick, movementKnob, 'movement');
        
        // Camera joystick
        const cameraJoystick = document.getElementById('camera-joystick');
        const cameraKnob = document.getElementById('camera-knob');
        
        this.setupJoystick(cameraJoystick, cameraKnob, 'camera');
    }
    
    setupJoystick(container, knob, type) {
        const handleTouch = (e) => {
            e.preventDefault();
            const rect = container.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const touch = e.touches[0] || e.changedTouches[0];
            const deltaX = touch.clientX - centerX;
            const deltaY = touch.clientY - centerY;
            
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const maxDistance = rect.width / 2 - 20;
            
            if (distance <= maxDistance) {
                knob.style.transform = `translate(-50%, -50%) translate(${deltaX}px, ${deltaY}px)`;
                
                this.virtualControls[type].x = deltaX / maxDistance;
                this.virtualControls[type].y = deltaY / maxDistance;
                this.virtualControls[type === 'movement' ? 'isMoving' : 'isCameraMoving'] = true;
            } else {
                const normalizedX = (deltaX / distance) * maxDistance;
                const normalizedY = (deltaY / distance) * maxDistance;
                
                knob.style.transform = `translate(-50%, -50%) translate(${normalizedX}px, ${normalizedY}px)`;
                
                this.virtualControls[type].x = normalizedX / maxDistance;
                this.virtualControls[type].y = normalizedY / maxDistance;
                this.virtualControls[type === 'movement' ? 'isMoving' : 'isCameraMoving'] = true;
            }
        };
        
        const resetJoystick = () => {
            knob.style.transform = 'translate(-50%, -50%)';
            this.virtualControls[type].x = 0;
            this.virtualControls[type].y = 0;
            this.virtualControls[type === 'movement' ? 'isMoving' : 'isCameraMoving'] = false;
        };
        
        container.addEventListener('touchstart', handleTouch);
        container.addEventListener('touchmove', handleTouch);
        container.addEventListener('touchend', resetJoystick);
        container.addEventListener('touchcancel', resetJoystick);
    }
    
    handleActionButton(action) {
        if (this.isActionOnCooldown(action)) {
            this.showActionFeedback(`${action} en cours de recharge...`);
            return;
        }
        
        switch (action) {
            case 'attack':
                this.performAttack();
                break;
            case 'magic':
                this.performMagic('fireball');
                break;
            case 'jump':
                this.performJump();
                break;
            case 'shield':
                this.performShield();
                break;
            case 'heal':
                this.performHeal();
                break;
            case 'ultimate':
                this.performUltimate();
                break;
        }
        
        this.setCooldown(action, 1000);
    }
    
    performAttack() {
        const nearestEnemy = this.findNearestEnemy();
        if (nearestEnemy && this.getDistanceToEnemy(nearestEnemy) < 8) {
            const damage = Math.floor(Math.random() * 30) + 20;
            nearestEnemy.userData.health -= damage;
            
            this.showDamageNumber(damage);
            this.showActionFeedback('⚔️ Attaque puissante !');
            this.showScreenEffect('damage');
            this.updateEnemyHealth(nearestEnemy);
            
            // Attack animation
            this.animatePlayer('attack');
            
            if (nearestEnemy.userData.health <= 0) {
                this.defeatedEnemy(nearestEnemy);
            }
        } else {
            this.showActionFeedback('Aucun ennemi à portée !');
        }
    }
    
    performMagic(spellType = 'fireball') {
        const cost = this.spellCosts[spellType] || 15;
        
        if (this.gameState.playerMana < cost) {
            this.showActionFeedback('Pas assez de mana !');
            return;
        }
        
        this.gameState.playerMana -= cost;
        this.updateUI();
        
        const nearestEnemy = this.findNearestEnemy();
        if (nearestEnemy) {
            const damage = Math.floor(Math.random() * 40) + 30;
            nearestEnemy.userData.health -= damage;
            
            this.showDamageNumber(damage);
            this.showActionFeedback(`🔥 ${spellType.toUpperCase()} !`);
            this.showScreenEffect('magic');
            this.createMagicParticles(nearestEnemy.position);
            this.updateEnemyHealth(nearestEnemy);
            
            if (nearestEnemy.userData.health <= 0) {
                this.defeatedEnemy(nearestEnemy);
            }
        }
    }
    
    performJump() {
        this.showActionFeedback('⬆️ Saut épique !');
        this.animatePlayer('jump');
    }
    
    performShield() {
        if (this.gameState.playerMana >= this.spellCosts.shield) {
            this.gameState.playerMana -= this.spellCosts.shield;
            this.showActionFeedback('🛡️ Bouclier activé !');
            this.showScreenEffect('heal');
            this.updateUI();
        } else {
            this.showActionFeedback('Pas assez de mana !');
        }
    }
    
    performHeal() {
        if (this.gameState.playerMana >= this.spellCosts.heal) {
            this.gameState.playerMana -= this.spellCosts.heal;
            this.gameState.playerHealth = Math.min(100, this.gameState.playerHealth + 30);
            this.showActionFeedback('💚 Soins magiques !');
            this.showScreenEffect('heal');
            this.updateUI();
        } else {
            this.showActionFeedback('Pas assez de mana !');
        }
    }
    
    performUltimate() {
        if (this.gameState.playerMana >= this.spellCosts.ultimate) {
            this.gameState.playerMana -= this.spellCosts.ultimate;
            
            // Damage all enemies
            this.enemies.forEach(enemy => {
                if (enemy.userData.health > 0) {
                    const damage = Math.floor(Math.random() * 60) + 40;
                    enemy.userData.health -= damage;
                    this.updateEnemyHealth(enemy);
                    
                    if (enemy.userData.health <= 0) {
                        this.defeatedEnemy(enemy);
                    }
                }
            });
            
            this.showDamageNumber(100, 'ULTIMATE!');
            this.showActionFeedback('💥 ULTIMATE DEVASTATEUR !');
            this.showScreenEffect('magic');
            this.updateUI();
            
            // Create massive particle effect
            this.createUltimateEffect();
        } else {
            this.showActionFeedback('Pas assez de mana pour l\'ultimate !');
        }
    }
    
    executeTextCommand(command = null) {
        const textInput = document.getElementById('text-command');
        const inputCommand = command || textInput.value.toLowerCase().trim();
        
        if (!inputCommand) return;
        
        const action = this.frenchCommands[inputCommand];
        if (action) {
            switch (action) {
                case 'attack':
                    this.performAttack();
                    break;
                case 'fireball':
                case 'lightning':
                case 'nova':
                    this.performMagic(action);
                    break;
                case 'heal':
                    this.performHeal();
                    break;
                case 'jump':
                    this.performJump();
                    break;
                case 'shield':
                    this.performShield();
                    break;
                case 'ultimate':
                    this.performUltimate();
                    break;
                default:
                    this.showActionFeedback('Commande non reconnue !');
            }
        } else {
            this.showActionFeedback('Commande non reconnue !');
        }
        
        textInput.value = '';
        this.closeTextModal();
    }
    
    // Utility functions
    findNearestEnemy() {
        let nearest = null;
        let minDistance = Infinity;
        
        this.enemies.forEach(enemy => {
            if (enemy.userData.health > 0) {
                const distance = this.getDistanceToEnemy(enemy);
                if (distance < minDistance) {
                    minDistance = distance;
                    nearest = enemy;
                }
            }
        });
        
        return nearest;
    }
    
    getDistanceToEnemy(enemy) {
        return this.player.position.distanceTo(enemy.position);
    }
    
    updateEnemyHealth(enemy) {
        const healthPercentage = (enemy.userData.health / enemy.userData.maxHealth) * 100;
        
        if (enemy === this.findNearestEnemy() && this.getDistanceToEnemy(enemy) < 15) {
            document.getElementById('enemy-health-display').style.display = 'block';
            document.getElementById('enemy-health').style.width = healthPercentage + '%';
            document.getElementById('enemy-hp').textContent = Math.max(0, enemy.userData.health);
        }
    }
    
    defeatedEnemy(enemy) {
        enemy.userData.health = 0;
        enemy.visible = false;
        
        // Gain XP
        this.gameState.playerXP += 25;
        if (this.gameState.playerXP >= 100) {
            this.gameState.playerLevel++;
            this.gameState.playerXP = 0;
            this.showActionFeedback(`🎉 Niveau ${this.gameState.playerLevel} !`);
        }
        
        this.showActionFeedback('👹 Démon vaincu !');
        this.updateUI();
        
        // Respawn enemy after 10 seconds
        setTimeout(() => {
            enemy.userData.health = enemy.userData.maxHealth;
            enemy.visible = true;
            this.showActionFeedback('👹 Un nouveau démon apparaît !');
        }, 10000);
    }
    
    isActionOnCooldown(action) {
        return this.gameState.actionCooldowns[action] && 
               Date.now() < this.gameState.actionCooldowns[action];
    }
    
    setCooldown(action, duration) {
        this.gameState.actionCooldowns[action] = Date.now() + duration;
    }
    
    showActionFeedback(message) {
        const actionText = document.getElementById('action-text');
        actionText.textContent = message;
        actionText.style.animation = 'none';
        actionText.offsetHeight; // Trigger reflow
        actionText.style.animation = 'pulse 2s infinite ease-in-out';
        
        this.gameState.lastAction = message;
    }
    
    showDamageNumber(damage, text = null) {
        const damageDiv = document.getElementById('damage-numbers');
        damageDiv.textContent = text || `-${damage}`;
        damageDiv.style.animation = 'none';
        damageDiv.offsetHeight;
        damageDiv.style.animation = 'damageFloat 1s ease-out';
    }
    
    showScreenEffect(type) {
        const gameWorld = document.getElementById('game-world');
        const effect = document.createElement('div');
        effect.className = `screen-${type}`;
        gameWorld.appendChild(effect);
        
        setTimeout(() => {
            effect.remove();
        }, 1000);
    }
    
    createMagicParticles(position) {
        for (let i = 0; i < 10; i++) {
            const particleGeometry = new THREE.SphereGeometry(0.2, 4, 4);
            const particleMaterial = new THREE.MeshBasicMaterial({ 
                color: Math.random() > 0.5 ? 0x74b9ff : 0xff6b35,
                transparent: true,
                opacity: 0.8
            });
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            
            particle.position.copy(position);
            particle.position.add(new THREE.Vector3(
                (Math.random() - 0.5) * 4,
                Math.random() * 3,
                (Math.random() - 0.5) * 4
            ));
            
            particle.userData = {
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.2,
                    Math.random() * 0.3,
                    (Math.random() - 0.5) * 0.2
                ),
                life: 1.0
            };
            
            this.scene.add(particle);
            this.particles.push(particle);
        }
    }
    
    createUltimateEffect() {
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                this.createMagicParticles(new THREE.Vector3(
                    (Math.random() - 0.5) * 30,
                    Math.random() * 10,
                    (Math.random() - 0.5) * 30
                ));
            }, i * 50);
        }
    }
    
    animatePlayer(type) {
        switch (type) {
            case 'attack':
                this.player.rotation.y += 0.3;
                setTimeout(() => {
                    this.player.rotation.y -= 0.3;
                }, 200);
                break;
            case 'jump':
                this.player.position.y += 3;
                setTimeout(() => {
                    this.player.position.y -= 3;
                }, 500);
                break;
        }
    }
    
    updateUI() {
        // Health bar
        document.getElementById('player-health').style.width = this.gameState.playerHealth + '%';
        document.getElementById('player-hp').textContent = this.gameState.playerHealth;
        
        // Mana bar
        document.getElementById('player-mana').style.width = this.gameState.playerMana + '%';
        document.getElementById('player-mana-num').textContent = this.gameState.playerMana;
        
        // Level
        document.getElementById('player-level').textContent = this.gameState.playerLevel;
    }
    
    vibrate(duration) {
        if (this.settings.vibrationEnabled && navigator.vibrate) {
            navigator.vibrate(duration);
        }
    }
    
    // UI Controls
    showTextModal() {
        document.getElementById('text-modal').style.display = 'flex';
        document.getElementById('text-command').focus();
    }
    
    closeTextModal() {
        document.getElementById('text-modal').style.display = 'none';
    }
    
    toggleSettings() {
        const settingsMenu = document.getElementById('settings-menu');
        settingsMenu.style.display = settingsMenu.style.display === 'flex' ? 'none' : 'flex';
    }
    
    closeSettings() {
        document.getElementById('settings-menu').style.display = 'none';
    }
    
    applySettings() {
        this.settings.cameraSensitivity = parseFloat(document.getElementById('camera-sensitivity').value);
        this.settings.buttonSize = parseFloat(document.getElementById('button-size').value);
        this.settings.graphicsQuality = document.getElementById('graphics-quality').value;
        this.settings.vibrationEnabled = document.getElementById('vibration-enabled').checked;
        
        // Apply button size
        const buttons = document.querySelectorAll('.action-btn');
        buttons.forEach(btn => {
            btn.style.transform = `scale(${this.settings.buttonSize})`;
        });
        
        // Apply graphics quality
        this.renderer.setPixelRatio(
            this.settings.graphicsQuality === 'high' ? 
            Math.min(window.devicePixelRatio, 2) : 1
        );
        
        this.closeSettings();
        this.showActionFeedback('⚙️ Paramètres appliqués !');
    }
    
    updateControls() {
        // Movement
        if (this.virtualControls.isMoving) {
            const moveSpeed = 0.15;
            const angle = Math.atan2(-this.virtualControls.movement.x, -this.virtualControls.movement.y);
            
            this.player.position.x += Math.sin(angle) * moveSpeed;
            this.player.position.z += Math.cos(angle) * moveSpeed;
            
            // Keep player in arena
            const distance = Math.sqrt(this.player.position.x ** 2 + this.player.position.z ** 2);
            if (distance > 25) {
                const normalizedX = (this.player.position.x / distance) * 25;
                const normalizedZ = (this.player.position.z / distance) * 25;
                this.player.position.x = normalizedX;
                this.player.position.z = normalizedZ;
            }
        }
        
        // Camera
        if (this.virtualControls.isCameraMoving) {
            const sensitivity = this.settings.cameraSensitivity * 0.02;
            
            // Update camera angle around player
            this.cameraAngle = this.cameraAngle || 0;
            this.cameraAngle += this.virtualControls.camera.x * sensitivity;
            
            const cameraDistance = 15;
            const cameraHeight = 8;
            
            this.camera.position.x = this.player.position.x + Math.sin(this.cameraAngle) * cameraDistance;
            this.camera.position.z = this.player.position.z + Math.cos(this.cameraAngle) * cameraDistance;
            this.camera.position.y = this.player.position.y + cameraHeight;
            
            this.camera.lookAt(this.player.position);
        }
    }
    
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            if (particle.userData.velocity) {
                particle.position.add(particle.userData.velocity);
                particle.userData.life -= 0.02;
                particle.material.opacity = particle.userData.life;
                
                if (particle.userData.life <= 0) {
                    this.scene.remove(particle);
                    this.particles.splice(i, 1);
                }
            } else {
                // Floating orbs
                particle.position.y += Math.sin(Date.now() * particle.userData.speed) * 0.01;
                particle.rotation.y += particle.userData.speed;
            }
        }
    }
    
    updateEnemies() {
        this.enemies.forEach(enemy => {
            if (enemy.userData.health > 0) {
                // Simple AI: look at player and attack if close
                enemy.lookAt(this.player.position);
                
                const distance = this.getDistanceToEnemy(enemy);
                if (distance < 10 && Date.now() - enemy.userData.lastAttack > enemy.userData.attackCooldown) {
                    // Enemy attacks player
                    const damage = Math.floor(Math.random() * 15) + 10;
                    this.gameState.playerHealth -= damage;
                    
                    if (this.gameState.playerHealth <= 0) {
                        this.gameState.playerHealth = 0;
                        this.showActionFeedback('💀 Vous êtes mort ! Rechargez la page.');
                    }
                    
                    this.showActionFeedback(`👹 Attaque démoniaque ! -${damage} HP`);
                    this.showScreenEffect('damage');
                    this.updateUI();
                    this.vibrate(200);
                    
                    enemy.userData.lastAttack = Date.now();
                }
                
                // Rotate enemy aura
                const aura = enemy.children.find(child => child.material && child.material.transparent);
                if (aura) {
                    aura.rotation.y += 0.02;
                }
            }
        });
    }
    
    regenerateMana() {
        if (this.gameState.playerMana < 100) {
            this.gameState.playerMana = Math.min(100, this.gameState.playerMana + 1);
            this.updateUI();
        }
    }
    
    startGameLoop() {
        const animate = () => {
            requestAnimationFrame(animate);
            
            this.updateControls();
            this.updateParticles();
            this.updateEnemies();
            
            // Regenerate mana slowly
            if (Date.now() % 60 === 0) {
                this.regenerateMana();
            }
            
            this.renderer.render(this.scene, this.camera);
        };
        
        animate();
    }
}

// Initialize the mobile game
const mobileGame = new MobileGame();

// Add CSS for damage animation
const style = document.createElement('style');
style.textContent = `
    @keyframes damageFloat {
        0% { 
            transform: translateX(-50%) translateY(0px);
            opacity: 1;
        }
        100% { 
            transform: translateX(-50%) translateY(-50px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);