class CombatGame {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.player = null;
        this.enemy = null;
        this.isAnimating = false;
        
        // Stats de combat
        this.playerStats = {
            hp: 100,
            maxHp: 100,
            power: 100,
            maxPower: 100,
            attack: 25,
            defense: 5
        };
        
        this.enemyStats = {
            hp: 100,
            maxHp: 100,
            attack: 20,
            defense: 3
        };
        
        this.combatLog = [];
        
        this.init();
        this.setupControls();
        this.animate();
        this.startCombatLoop();
    }

    init() {
        // Créer la scène avec un arrière-plan de combat épique
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x1a1a2e, 10, 50);
        
        // Créer un arrière-plan avec des étoiles
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 2 });
        
        const starVertices = [];
        for (let i = 0; i < 1000; i++) {
            starVertices.push(
                THREE.MathUtils.randFloatSpread(200),
                THREE.MathUtils.randFloatSpread(200),
                THREE.MathUtils.randFloatSpread(200)
            );
        }
        
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(stars);

        // Configuration de la caméra
        const container = document.getElementById('game-world');
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.set(0, 8, 12);
        this.camera.lookAt(0, 2, 0);

        // Créer le renderer avec des effets avancés
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(width, height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor(0x1a1a2e, 0.8);
        container.appendChild(this.renderer.domElement);

        // Ajouter l'éclairage dramatique
        this.setupLighting();
        
        // Créer l'arène de combat
        this.createArena();
        
        // Créer le joueur héros
        this.createPlayer();
        
        // Créer l'ennemi
        this.createEnemy();
        
        // Gérer le redimensionnement
        window.addEventListener('resize', () => this.onWindowResize());
    }

    setupLighting() {
        // Lumière ambiante douce
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);

        // Lumière principale dramatique
        const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
        mainLight.position.set(10, 20, 10);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 4096;
        mainLight.shadow.mapSize.height = 4096;
        mainLight.shadow.camera.near = 0.5;
        mainLight.shadow.camera.far = 50;
        mainLight.shadow.camera.left = -20;
        mainLight.shadow.camera.right = 20;
        mainLight.shadow.camera.top = 20;
        mainLight.shadow.camera.bottom = -20;
        this.scene.add(mainLight);

        // Lumières colorées pour l'ambiance
        const redLight = new THREE.PointLight(0xff4757, 0.8, 30);
        redLight.position.set(-8, 5, 5);
        this.scene.add(redLight);

        const blueLight = new THREE.PointLight(0x74b9ff, 0.8, 30);
        blueLight.position.set(8, 5, 5);
        this.scene.add(blueLight);
    }

    createArena() {
        // Sol de l'arène avec motifs magiques
        const arenaGeometry = new THREE.CircleGeometry(15, 32);
        const arenaMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x2d3436,
            transparent: true,
            opacity: 0.9
        });
        const arena = new THREE.Mesh(arenaGeometry, arenaMaterial);
        arena.rotation.x = -Math.PI / 2;
        arena.receiveShadow = true;
        this.scene.add(arena);

        // Cercle magique lumineux
        const circleGeometry = new THREE.RingGeometry(12, 13, 32);
        const circleMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xff6b35,
            transparent: true,
            opacity: 0.6
        });
        const magicCircle = new THREE.Mesh(circleGeometry, circleMaterial);
        magicCircle.rotation.x = -Math.PI / 2;
        magicCircle.position.y = 0.01;
        this.scene.add(magicCircle);

        // Piliers énergétiques autour de l'arène
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const pillarGroup = new THREE.Group();
            
            // Base du pilier
            const baseGeometry = new THREE.CylinderGeometry(0.8, 1.2, 1, 8);
            const baseMaterial = new THREE.MeshLambertMaterial({ color: 0x636e72 });
            const base = new THREE.Mesh(baseGeometry, baseMaterial);
            base.castShadow = true;
            pillarGroup.add(base);
            
            // Cristal énergétique
            const crystalGeometry = new THREE.OctahedronGeometry(0.5);
            const crystalMaterial = new THREE.MeshLambertMaterial({ 
                color: 0x74b9ff,
                transparent: true,
                opacity: 0.8
            });
            const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
            crystal.position.y = 1.5;
            crystal.rotation.y = i * 0.5;
            pillarGroup.add(crystal);
            
            pillarGroup.position.set(
                Math.cos(angle) * 18,
                0.5,
                Math.sin(angle) * 18
            );
            
            this.scene.add(pillarGroup);
        }
    }

    createPlayer() {
        this.player = new THREE.Group();
        
        // Corps principal du héros (plus imposant)
        const bodyGeometry = new THREE.CylinderGeometry(0.8, 1.0, 2.5, 8);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x0984e3 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1.25;
        body.castShadow = true;
        this.player.add(body);

        // Tête héroïque
        const headGeometry = new THREE.SphereGeometry(0.6, 16, 16);
        const headMaterial = new THREE.MeshLambertMaterial({ color: 0xFFE4B5 });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 3.1;
        head.castShadow = true;
        this.player.add(head);

        // Casque de combat
        const helmetGeometry = new THREE.SphereGeometry(0.65, 16, 16, 0, Math.PI);
        const helmetMaterial = new THREE.MeshLambertMaterial({ color: 0x2d3436 });
        const helmet = new THREE.Mesh(helmetGeometry, helmetMaterial);
        helmet.position.y = 3.2;
        helmet.castShadow = true;
        this.player.add(helmet);

        // Yeux brillants
        const eyeGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x74b9ff });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.15, 3.15, 0.5);
        this.player.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.15, 3.15, 0.5);
        this.player.add(rightEye);

        // Bras puissants avec armure
        this.createPlayerArm(-1.2, 'left');
        this.createPlayerArm(1.2, 'right');

        // Jambes avec armure
        this.createPlayerLeg(-0.5, 'left');
        this.createPlayerLeg(0.5, 'right');

        // Cape héroïque
        const capeGeometry = new THREE.ConeGeometry(1.5, 3, 8);
        const capeMaterial = new THREE.MeshLambertMaterial({ color: 0xe17055 });
        const cape = new THREE.Mesh(capeGeometry, capeMaterial);
        cape.position.set(0, 1.5, -0.8);
        cape.rotation.x = 0.3;
        cape.castShadow = true;
        this.player.add(cape);

        // Épée énergétique
        this.createPlayerSword();

        this.player.position.set(-5, 0, 0);
        this.scene.add(this.player);
    }

    createPlayerArm(xPos, side) {
        const armGroup = new THREE.Group();
        
        // Bras
        const armGeometry = new THREE.CylinderGeometry(0.25, 0.3, 1.8, 8);
        const armMaterial = new THREE.MeshLambertMaterial({ color: 0xFFE4B5 });
        const arm = new THREE.Mesh(armGeometry, armMaterial);
        arm.castShadow = true;
        armGroup.add(arm);
        
        // Épaulière
        const shoulderGeometry = new THREE.SphereGeometry(0.4, 8, 8);
        const shoulderMaterial = new THREE.MeshLambertMaterial({ color: 0x2d3436 });
        const shoulder = new THREE.Mesh(shoulderGeometry, shoulderMaterial);
        shoulder.position.y = 0.7;
        shoulder.castShadow = true;
        armGroup.add(shoulder);
        
        armGroup.position.set(xPos, 1.8, 0);
        armGroup.rotation.z = side === 'left' ? Math.PI / 8 : -Math.PI / 8;
        this.player.add(armGroup);
    }

    createPlayerLeg(xPos, side) {
        const legGroup = new THREE.Group();
        
        // Cuisse
        const thighGeometry = new THREE.CylinderGeometry(0.3, 0.35, 1.2, 8);
        const thighMaterial = new THREE.MeshLambertMaterial({ color: 0x0984e3 });
        const thigh = new THREE.Mesh(thighGeometry, thighMaterial);
        thigh.position.y = 0.3;
        thigh.castShadow = true;
        legGroup.add(thigh);
        
        // Mollet
        const calfGeometry = new THREE.CylinderGeometry(0.25, 0.3, 1.0, 8);
        const calfMaterial = new THREE.MeshLambertMaterial({ color: 0xFFE4B5 });
        const calf = new THREE.Mesh(calfGeometry, calfMaterial);
        calf.position.y = -0.5;
        calf.castShadow = true;
        legGroup.add(calf);
        
        // Botte
        const bootGeometry = new THREE.BoxGeometry(0.4, 0.3, 0.8);
        const bootMaterial = new THREE.MeshLambertMaterial({ color: 0x2d3436 });
        const boot = new THREE.Mesh(bootGeometry, bootMaterial);
        boot.position.y = -1.1;
        boot.position.z = 0.2;
        boot.castShadow = true;
        legGroup.add(boot);
        
        legGroup.position.set(xPos, -0.7, 0);
        this.player.add(legGroup);
    }

    createPlayerSword() {
        const swordGroup = new THREE.Group();
        
        // Lame énergétique
        const bladeGeometry = new THREE.BoxGeometry(0.1, 2.5, 0.05);
        const bladeMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x74b9ff,
            transparent: true,
            opacity: 0.9
        });
        const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
        blade.position.y = 1.5;
        swordGroup.add(blade);
        
        // Garde
        const guardGeometry = new THREE.BoxGeometry(0.8, 0.1, 0.1);
        const guardMaterial = new THREE.MeshLambertMaterial({ color: 0x2d3436 });
        const guard = new THREE.Mesh(guardGeometry, guardMaterial);
        guard.position.y = 0.3;
        swordGroup.add(guard);
        
        // Poignée
        const handleGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.6, 8);
        const handleMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
        const handle = new THREE.Mesh(handleGeometry, handleMaterial);
        swordGroup.add(handle);
        
        swordGroup.position.set(1.5, 1.5, 0);
        swordGroup.rotation.z = -Math.PI / 6;
        this.player.add(swordGroup);
        
        this.playerSword = swordGroup;
    }

    createEnemy() {
        this.enemy = new THREE.Group();
        
        // Corps de l'ennemi (plus sombre et menaçant)
        const bodyGeometry = new THREE.CylinderGeometry(0.9, 1.1, 2.8, 6);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x2d1b69 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1.4;
        body.castShadow = true;
        this.enemy.add(body);

        // Tête démoniaque
        const headGeometry = new THREE.SphereGeometry(0.7, 12, 12);
        const headMaterial = new THREE.MeshLambertMaterial({ color: 0x8b0000 });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 3.4;
        head.castShadow = true;
        this.enemy.add(head);

        // Cornes démoniaques
        const hornGeometry = new THREE.ConeGeometry(0.1, 0.8, 8);
        const hornMaterial = new THREE.MeshLambertMaterial({ color: 0x2d1b69 });
        
        const leftHorn = new THREE.Mesh(hornGeometry, hornMaterial);
        leftHorn.position.set(-0.3, 4.0, 0.2);
        leftHorn.rotation.z = -Math.PI / 6;
        this.enemy.add(leftHorn);
        
        const rightHorn = new THREE.Mesh(hornGeometry, hornMaterial);
        rightHorn.position.set(0.3, 4.0, 0.2);
        rightHorn.rotation.z = Math.PI / 6;
        this.enemy.add(rightHorn);

        // Yeux rougeoyants
        const eyeGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.2, 3.5, 0.6);
        this.enemy.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.2, 3.5, 0.6);
        this.enemy.add(rightEye);

        // Bras massifs
        this.createEnemyArm(-1.4, 'left');
        this.createEnemyArm(1.4, 'right');

        // Jambes puissantes
        this.createEnemyLeg(-0.6, 'left');
        this.createEnemyLeg(0.6, 'right');

        // Aura sombre
        const auraGeometry = new THREE.SphereGeometry(2.5, 16, 16);
        const auraMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x8b0000,
            transparent: true,
            opacity: 0.1
        });
        const aura = new THREE.Mesh(auraGeometry, auraMaterial);
        aura.position.y = 2;
        this.enemy.add(aura);

        this.enemy.position.set(5, 0, 0);
        this.scene.add(this.enemy);
    }

    createEnemyArm(xPos, side) {
        const armGroup = new THREE.Group();
        
        const armGeometry = new THREE.CylinderGeometry(0.3, 0.4, 2.2, 6);
        const armMaterial = new THREE.MeshLambertMaterial({ color: 0x8b0000 });
        const arm = new THREE.Mesh(armGeometry, armMaterial);
        arm.castShadow = true;
        armGroup.add(arm);
        
        // Griffe
        const clawGeometry = new THREE.ConeGeometry(0.15, 0.6, 6);
        const clawMaterial = new THREE.MeshLambertMaterial({ color: 0x2d1b69 });
        const claw = new THREE.Mesh(clawGeometry, clawMaterial);
        claw.position.y = -1.4;
        claw.rotation.x = Math.PI;
        armGroup.add(claw);
        
        armGroup.position.set(xPos, 2.0, 0);
        armGroup.rotation.z = side === 'left' ? Math.PI / 6 : -Math.PI / 6;
        this.enemy.add(armGroup);
    }

    createEnemyLeg(xPos, side) {
        const legGroup = new THREE.Group();
        
        const legGeometry = new THREE.CylinderGeometry(0.35, 0.4, 2.5, 6);
        const legMaterial = new THREE.MeshLambertMaterial({ color: 0x2d1b69 });
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        leg.castShadow = true;
        legGroup.add(leg);
        
        legGroup.position.set(xPos, -0.25, 0);
        this.enemy.add(legGroup);
    }

    setupControls() {
        const input = document.getElementById('action-input');
        const button = document.getElementById('execute-btn');
        const feedback = document.getElementById('last-action');

        const executeAction = () => {
            const action = input.value.toLowerCase().trim();
            if (action) {
                this.processAction(action);
                input.value = '';
                
                feedback.parentElement.classList.add('action-feedback');
                setTimeout(() => {
                    feedback.parentElement.classList.remove('action-feedback');
                }, 600);
            }
        };

        button.addEventListener('click', executeAction);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                executeAction();
            }
        });
    }

    processAction(action) {
        const feedback = document.getElementById('last-action');
        const feedbackContainer = feedback.parentElement;
        
        feedbackContainer.classList.remove('success', 'error', 'critical');
        
        if (this.isAnimating) {
            feedback.textContent = "Action en cours, attendez...";
            feedbackContainer.classList.add('error');
            return;
        }

        const normalizedAction = this.normalizeAction(action);
        
        switch (normalizedAction) {
            case 'attaquer':
                this.performAttack();
                break;
            case 'boule de feu':
                this.castFireball();
                break;
            case 'éclair':
                this.castLightning();
                break;
            case 'bouclier':
                this.castShield();
                break;
            case 'téléportation':
                this.performTeleport();
                break;
            case 'soin':
                this.castHeal();
                break;
            case 'nova':
                this.castNova();
                break;
            case 'ultimate':
                this.castUltimate();
                break;
            case 'avancer':
                this.movePlayer(0, 0, 2);
                break;
            case 'reculer':
                this.movePlayer(0, 0, -2);
                break;
            case 'gauche':
                this.movePlayer(-2, 0, 0);
                break;
            case 'droite':
                this.movePlayer(2, 0, 0);
                break;
            case 'sauter':
                this.playerJump();
                break;
            case 'esquiver':
                this.performDodge();
                break;
            case 'roulade':
                this.performRoll();
                break;
            default:
                feedback.textContent = `Action "${action}" non reconnue.`;
                feedbackContainer.classList.add('error');
                this.addCombatLog(`Action inconnue: ${action}`, 'error');
        }
    }

    normalizeAction(action) {
        const synonyms = {
            'attaquer': ['attaquer', 'frapper', 'attaque', 'hit', 'strike'],
            'boule de feu': ['boule de feu', 'fireball', 'feu', 'fire', 'flamme'],
            'éclair': ['éclair', 'lightning', 'électrique', 'electric', 'thunder'],
            'bouclier': ['bouclier', 'défense', 'shield', 'protection', 'block'],
            'téléportation': ['téléportation', 'dash', 'teleport', 'blink'],
            'soin': ['soin', 'heal', 'healing', 'cure', 'soigner'],
            'nova': ['nova', 'explosion', 'blast', 'boom'],
            'ultimate': ['ultimate', 'pouvoir final', 'super', 'final'],
            'avancer': ['avancer', 'forward', 'avant'],
            'reculer': ['reculer', 'back', 'arrière'],
            'gauche': ['gauche', 'left'],
            'droite': ['droite', 'right'],
            'sauter': ['sauter', 'jump', 'saut'],
            'esquiver': ['esquiver', 'dodge', 'éviter'],
            'roulade': ['roulade', 'roll', 'rouler']
        };

        for (const [key, values] of Object.entries(synonyms)) {
            if (values.some(synonym => action.includes(synonym))) {
                return key;
            }
        }
        
        return action;
    }

    // === COMBAT ACTIONS ===
    
    performAttack() {
        if (this.playerStats.power < 10) {
            this.showFeedback("Pas assez d'énergie pour attaquer !", 'error');
            return;
        }
        
        this.isAnimating = true;
        this.playerStats.power -= 10;
        this.updatePowerDisplay();
        
        // Animation d'attaque épée
        const startRot = this.playerSword.rotation.z;
        const attackRot = startRot - Math.PI / 2;
        
        this.animateRotation(this.playerSword, 'z', startRot, attackRot, 300, () => {
            this.animateRotation(this.playerSword, 'z', attackRot, startRot, 200);
        });
        
        // Dégâts à l'ennemi
        setTimeout(() => {
            const damage = Math.floor(Math.random() * 20) + this.playerStats.attack;
            const isCritical = Math.random() < 0.2;
            const finalDamage = isCritical ? damage * 2 : damage;
            
            this.dealDamageToEnemy(finalDamage, isCritical);
            this.showFeedback(`Attaque réussie ! ${finalDamage} dégâts`, isCritical ? 'critical' : 'success');
            this.addCombatLog(`Vous infligez ${finalDamage} dégâts${isCritical ? ' (CRITIQUE!)' : ''}`, 'damage');
        }, 400);
        
        setTimeout(() => { this.isAnimating = false; }, 600);
    }

    castFireball() {
        if (this.playerStats.power < 25) {
            this.showFeedback("Pas assez d'énergie pour la boule de feu !", 'error');
            return;
        }
        
        this.isAnimating = true;
        this.playerStats.power -= 25;
        this.updatePowerDisplay();
        
        // Créer la boule de feu
        const fireballGeometry = new THREE.SphereGeometry(0.5, 16, 16);
        const fireballMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xff4500,
            transparent: true,
            opacity: 0.8
        });
        const fireball = new THREE.Mesh(fireballGeometry, fireballMaterial);
        fireball.position.copy(this.player.position);
        fireball.position.y += 2;
        fireball.position.x += 1;
        this.scene.add(fireball);
        
        // Animation de vol
        const startPos = fireball.position.clone();
        const endPos = this.enemy.position.clone();
        endPos.y += 2;
        
        this.animateMovement(fireball, startPos, endPos, 800, () => {
            // Explosion !
            this.createFireExplosion(endPos);
            this.scene.remove(fireball);
            
            const damage = Math.floor(Math.random() * 30) + 35;
            this.dealDamageToEnemy(damage);
            this.showFeedback(`🔥 BOULE DE FEU ! ${damage} dégâts`, 'critical');
            this.addCombatLog(`Boule de feu inflige ${damage} dégâts de feu`, 'damage');
        });
        
        setTimeout(() => { this.isAnimating = false; }, 1000);
    }

    castLightning() {
        if (this.playerStats.power < 30) {
            this.showFeedback("Pas assez d'énergie pour l'éclair !", 'error');
            return;
        }
        
        this.isAnimating = true;
        this.playerStats.power -= 30;
        this.updatePowerDisplay();
        
        // Effet d'éclair
        const lightningEffect = document.createElement('div');
        lightningEffect.className = 'lightning-effect';
        document.getElementById('game-world').appendChild(lightningEffect);
        
        // Son et flash
        setTimeout(() => {
            lightningEffect.remove();
            const damage = Math.floor(Math.random() * 25) + 40;
            this.dealDamageToEnemy(damage);
            this.showFeedback(`⚡ ÉCLAIR DIVIN ! ${damage} dégâts`, 'critical');
            this.addCombatLog(`Éclair électrise l'ennemi pour ${damage} dégâts`, 'damage');
            
            // Animation de secousse pour l'ennemi
            this.shakeCharacter(this.enemy, 500);
        }, 300);
        
        setTimeout(() => { this.isAnimating = false; }, 800);
    }

    castShield() {
        if (this.playerStats.power < 20) {
            this.showFeedback("Pas assez d'énergie pour le bouclier !", 'error');
            return;
        }
        
        this.isAnimating = true;
        this.playerStats.power -= 20;
        this.updatePowerDisplay();
        
        // Créer bouclier protecteur
        const shieldGeometry = new THREE.SphereGeometry(2, 16, 16);
        const shieldMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x74b9ff,
            transparent: true,
            opacity: 0.3,
            wireframe: true
        });
        const shield = new THREE.Mesh(shieldGeometry, shieldMaterial);
        shield.position.copy(this.player.position);
        shield.position.y += 1.5;
        this.scene.add(shield);
        
        // Animation du bouclier
        shield.scale.set(0, 0, 0);
        this.animateScale(shield, new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 1, 1), 300);
        
        // Bouclier temporaire
        setTimeout(() => {
            this.animateScale(shield, new THREE.Vector3(1, 1, 1), new THREE.Vector3(0, 0, 0), 300, () => {
                this.scene.remove(shield);
            });
        }, 3000);
        
        this.playerStats.defense += 10;
        this.showFeedback("🛡️ BOUCLIER MAGIQUE activé !", 'success');
        this.addCombatLog("Bouclier magique vous protège (+10 défense)", 'power');
        
        // Retirer le bonus après 5 secondes
        setTimeout(() => {
            this.playerStats.defense -= 10;
            this.addCombatLog("L'effet du bouclier se dissipe", 'info');
        }, 5000);
        
        setTimeout(() => { this.isAnimating = false; }, 400);
    }

    performTeleport() {
        if (this.playerStats.power < 15) {
            this.showFeedback("Pas assez d'énergie pour se téléporter !", 'error');
            return;
        }
        
        this.isAnimating = true;
        this.playerStats.power -= 15;
        this.updatePowerDisplay();
        
        // Effet de disparition
        this.player.material = new THREE.MeshBasicMaterial({ 
            transparent: true,
            opacity: 0.3
        });
        
        // Nouvelle position aléatoire
        const newX = (Math.random() - 0.5) * 10;
        const newZ = (Math.random() - 0.5) * 10;
        
        setTimeout(() => {
            this.player.position.set(newX, 0, newZ);
            this.player.children.forEach(child => {
                if (child.material) {
                    child.material.opacity = 1;
                }
            });
            
            this.showFeedback("💨 TÉLÉPORTATION réussie !", 'success');
            this.addCombatLog("Vous vous téléportez en sécurité", 'power');
        }, 300);
        
        setTimeout(() => { this.isAnimating = false; }, 600);
    }

    castHeal() {
        if (this.playerStats.power < 20) {
            this.showFeedback("Pas assez d'énergie pour se soigner !", 'error');
            return;
        }
        
        if (this.playerStats.hp >= this.playerStats.maxHp) {
            this.showFeedback("Vous êtes déjà en pleine forme !", 'error');
            return;
        }
        
        this.isAnimating = true;
        this.playerStats.power -= 20;
        this.updatePowerDisplay();
        
        // Effet de soin
        const healParticles = [];
        for (let i = 0; i < 20; i++) {
            const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
            const particleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            
            particle.position.set(
                this.player.position.x + (Math.random() - 0.5) * 4,
                this.player.position.y + Math.random() * 4,
                this.player.position.z + (Math.random() - 0.5) * 4
            );
            
            this.scene.add(particle);
            healParticles.push(particle);
            
            // Animation vers le joueur
            setTimeout(() => {
                this.animateMovement(particle, particle.position.clone(), this.player.position.clone(), 1000, () => {
                    this.scene.remove(particle);
                });
            }, i * 50);
        }
        
        const healAmount = Math.floor(Math.random() * 20) + 25;
        this.playerStats.hp = Math.min(this.playerStats.maxHp, this.playerStats.hp + healAmount);
        this.updateHealthDisplay();
        
        this.showFeedback(`💚 SOIN DIVIN ! +${healAmount} HP`, 'success');
        this.addCombatLog(`Vous récupérez ${healAmount} points de vie`, 'heal');
        
        setTimeout(() => { this.isAnimating = false; }, 1200);
    }

    castNova() {
        if (this.playerStats.power < 40) {
            this.showFeedback("Pas assez d'énergie pour Nova !", 'error');
            return;
        }
        
        this.isAnimating = true;
        this.playerStats.power -= 40;
        this.updatePowerDisplay();
        
        // Effet de nova
        const novaGeometry = new THREE.SphereGeometry(0.5, 16, 16);
        const novaMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xff6b35,
            transparent: true,
            opacity: 0.8
        });
        const nova = new THREE.Mesh(novaGeometry, novaMaterial);
        nova.position.copy(this.player.position);
        nova.position.y += 1.5;
        this.scene.add(nova);
        
        // Expansion explosive
        this.animateScale(nova, new THREE.Vector3(1, 1, 1), new THREE.Vector3(20, 20, 20), 800, () => {
            this.scene.remove(nova);
        });
        
        // Effet visuel sur l'écran
        const fireEffect = document.createElement('div');
        fireEffect.className = 'fire-effect';
        document.getElementById('game-world').appendChild(fireEffect);
        
        setTimeout(() => {
            fireEffect.remove();
            const damage = Math.floor(Math.random() * 40) + 50;
            this.dealDamageToEnemy(damage);
            this.showFeedback(`💥 NOVA DÉVASTATRICE ! ${damage} dégâts`, 'critical');
            this.addCombatLog(`Nova explose pour ${damage} dégâts massifs`, 'damage');
        }, 400);
        
        setTimeout(() => { this.isAnimating = false; }, 1000);
    }

    castUltimate() {
        if (this.playerStats.power < 80) {
            this.showFeedback("Pas assez d'énergie pour l'Ultimate !", 'error');
            return;
        }
        
        this.isAnimating = true;
        this.playerStats.power -= 80;
        this.updatePowerDisplay();
        
        // Séquence épique d'ultimate
        this.showFeedback("🌟 PRÉPARATION DE L'ULTIMATE...", 'critical');
        this.addCombatLog("CHARGEMENT DU POUVOIR ULTIME...", 'power');
        
        // Phase 1: Charge d'énergie
        setTimeout(() => {
            this.showFeedback("⚡ ÉNERGIE MAXIMALE ATTEINTE !", 'critical');
        }, 1000);
        
        // Phase 2: Explosion finale
        setTimeout(() => {
            const ultimateDamage = Math.floor(Math.random() * 60) + 80;
            this.dealDamageToEnemy(ultimateDamage);
            this.showFeedback(`🔥⚡💀 ULTIMATE ! ${ultimateDamage} DÉGÂTS CRITIQUES !`, 'critical');
            this.addCombatLog(`ULTIMATE DÉVASTATION ! ${ultimateDamage} dégâts apocalyptiques`, 'damage');
            
            // Effets visuels combinés
            const lightningEffect = document.createElement('div');
            lightningEffect.className = 'lightning-effect';
            document.getElementById('game-world').appendChild(lightningEffect);
            
            const fireEffect = document.createElement('div');
            fireEffect.className = 'fire-effect';
            document.getElementById('game-world').appendChild(fireEffect);
            
            setTimeout(() => {
                lightningEffect.remove();
                fireEffect.remove();
            }, 1000);
            
            this.shakeCharacter(this.enemy, 1000);
        }, 2000);
        
        setTimeout(() => { this.isAnimating = false; }, 3500);
    }

    // === MOVEMENT & ANIMATIONS ===
    
    movePlayer(dx, dy, dz) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const startPos = this.player.position.clone();
        const endPos = new THREE.Vector3(
            Math.max(-10, Math.min(10, startPos.x + dx)),
            startPos.y + dy,
            Math.max(-10, Math.min(10, startPos.z + dz))
        );
        
        this.animateMovement(this.player, startPos, endPos, 500);
        this.showFeedback("Déplacement", 'success');
        
        setTimeout(() => { this.isAnimating = false; }, 500);
    }

    playerJump() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const startPos = this.player.position.clone();
        const midPos = new THREE.Vector3(startPos.x, startPos.y + 3, startPos.z);
        
        this.animateMovement(this.player, startPos, midPos, 300, () => {
            this.animateMovement(this.player, midPos, startPos, 300);
        });
        
        this.showFeedback("Saut héroïque !", 'success');
        setTimeout(() => { this.isAnimating = false; }, 600);
    }

    performDodge() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const direction = (Math.random() - 0.5) * 6;
        const startPos = this.player.position.clone();
        const dodgePos = new THREE.Vector3(startPos.x + direction, startPos.y, startPos.z);
        const endPos = startPos.clone();
        
        this.animateMovement(this.player, startPos, dodgePos, 200, () => {
            this.animateMovement(this.player, dodgePos, endPos, 200);
        });
        
        this.showFeedback("Esquive parfaite !", 'success');
        this.addCombatLog("Vous esquivez avec agilité", 'info');
        
        setTimeout(() => { this.isAnimating = false; }, 400);
    }

    performRoll() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const startPos = this.player.position.clone();
        const endPos = new THREE.Vector3(startPos.x, startPos.y, startPos.z + 3);
        
        // Animation de roulade avec rotation
        let rotations = 0;
        const rollInterval = setInterval(() => {
            this.player.rotation.x += Math.PI / 4;
            rotations++;
            if (rotations >= 8) {
                clearInterval(rollInterval);
                this.player.rotation.x = 0;
            }
        }, 50);
        
        this.animateMovement(this.player, startPos, endPos, 400);
        this.showFeedback("Roulade tactique !", 'success');
        
        setTimeout(() => { this.isAnimating = false; }, 500);
    }

    // === UTILITY METHODS ===
    
    animateMovement(object, startPos, endPos, duration, callback) {
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = this.easeInOutQuad(progress);
            
            object.position.lerpVectors(startPos, endPos, easeProgress);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                object.position.copy(endPos);
                if (callback) callback();
            }
        };
        
        animate();
    }

    animateRotation(object, axis, startRot, endRot, duration, callback) {
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = this.easeInOutQuad(progress);
            
            object.rotation[axis] = startRot + (endRot - startRot) * easeProgress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                object.rotation[axis] = endRot;
                if (callback) callback();
            }
        };
        
        animate();
    }

    animateScale(object, startScale, endScale, duration, callback) {
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = this.easeInOutQuad(progress);
            
            object.scale.lerpVectors(startScale, endScale, easeProgress);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                object.scale.copy(endScale);
                if (callback) callback();
            }
        };
        
        animate();
    }

    shakeCharacter(character, duration) {
        const originalPos = character.position.clone();
        const shakeIntensity = 0.3;
        const startTime = Date.now();
        
        const shake = () => {
            const elapsed = Date.now() - startTime;
            if (elapsed < duration) {
                character.position.set(
                    originalPos.x + (Math.random() - 0.5) * shakeIntensity,
                    originalPos.y + (Math.random() - 0.5) * shakeIntensity,
                    originalPos.z + (Math.random() - 0.5) * shakeIntensity
                );
                requestAnimationFrame(shake);
            } else {
                character.position.copy(originalPos);
            }
        };
        
        shake();
    }

    createFireExplosion(position) {
        for (let i = 0; i < 15; i++) {
            const particleGeometry = new THREE.SphereGeometry(0.2, 8, 8);
            const particleMaterial = new THREE.MeshBasicMaterial({ 
                color: Math.random() > 0.5 ? 0xff4500 : 0xff6b35 
            });
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            
            particle.position.copy(position);
            this.scene.add(particle);
            
            const randomDir = new THREE.Vector3(
                (Math.random() - 0.5) * 10,
                Math.random() * 5,
                (Math.random() - 0.5) * 10
            );
            
            this.animateMovement(particle, position, position.clone().add(randomDir), 800, () => {
                this.scene.remove(particle);
            });
        }
    }

    easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    // === UI UPDATES ===
    
    updateHealthDisplay() {
        const playerHealthBar = document.getElementById('player-health');
        const playerHpText = document.getElementById('player-hp');
        const healthPercent = (this.playerStats.hp / this.playerStats.maxHp) * 100;
        
        playerHealthBar.style.width = healthPercent + '%';
        playerHpText.textContent = this.playerStats.hp;
    }

    updateEnemyHealthDisplay() {
        const enemyHealthBar = document.getElementById('enemy-health');
        const enemyHpText = document.getElementById('enemy-hp');
        const healthPercent = (this.enemyStats.hp / this.enemyStats.maxHp) * 100;
        
        enemyHealthBar.style.width = healthPercent + '%';
        enemyHpText.textContent = this.enemyStats.hp;
    }

    updatePowerDisplay() {
        const powerOrb = document.getElementById('power-orb');
        const powerText = document.getElementById('power-level');
        const powerPercent = (this.playerStats.power / this.playerStats.maxPower) * 100;
        
        powerText.textContent = this.playerStats.power;
        
        // Changer la couleur selon le niveau d'énergie
        if (powerPercent > 70) {
            powerOrb.style.background = 'radial-gradient(circle, #74b9ff, #0984e3)';
        } else if (powerPercent > 30) {
            powerOrb.style.background = 'radial-gradient(circle, #fdcb6e, #e17055)';
        } else {
            powerOrb.style.background = 'radial-gradient(circle, #e74c3c, #c0392b)';
        }
    }

    showFeedback(message, type) {
        const feedback = document.getElementById('last-action');
        const feedbackContainer = feedback.parentElement;
        
        feedback.textContent = message;
        feedbackContainer.classList.remove('success', 'error', 'critical');
        feedbackContainer.classList.add(type);
    }

    addCombatLog(message, type) {
        const logContent = document.getElementById('log-content');
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry log-${type}`;
        logEntry.textContent = message;
        
        logContent.appendChild(logEntry);
        logContent.scrollTop = logContent.scrollHeight;
        
        // Garder seulement les 10 dernières entrées
        while (logContent.children.length > 10) {
            logContent.removeChild(logContent.firstChild);
        }
    }

    // === COMBAT MECHANICS ===
    
    dealDamageToEnemy(damage, isCritical = false) {
        const finalDamage = Math.max(1, damage - this.enemyStats.defense);
        this.enemyStats.hp = Math.max(0, this.enemyStats.hp - finalDamage);
        this.updateEnemyHealthDisplay();
        
        if (isCritical) {
            this.shakeCharacter(this.enemy, 600);
        }
        
        if (this.enemyStats.hp <= 0) {
            this.endCombat(true);
        }
    }

    dealDamageToPlayer(damage) {
        const finalDamage = Math.max(1, damage - this.playerStats.defense);
        this.playerStats.hp = Math.max(0, this.playerStats.hp - finalDamage);
        this.updateHealthDisplay();
        
        this.addCombatLog(`Vous subissez ${finalDamage} dégâts`, 'damage');
        
        if (this.playerStats.hp <= 0) {
            this.endCombat(false);
        }
    }

    // === ENEMY AI ===
    
    enemyTurn() {
        if (this.enemyStats.hp <= 0 || this.playerStats.hp <= 0) return;
        
        const actions = ['attack', 'darkBlast', 'heal'];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        
        switch (randomAction) {
            case 'attack':
                this.enemyAttack();
                break;
            case 'darkBlast':
                this.enemyDarkBlast();
                break;
            case 'heal':
                if (this.enemyStats.hp < this.enemyStats.maxHp * 0.5) {
                    this.enemyHeal();
                } else {
                    this.enemyAttack();
                }
                break;
        }
    }

    enemyAttack() {
        const damage = Math.floor(Math.random() * 15) + this.enemyStats.attack;
        this.dealDamageToPlayer(damage);
        this.addCombatLog(`L'ennemi vous attaque pour ${damage} dégâts`, 'damage');
        this.shakeCharacter(this.player, 300);
    }

    enemyDarkBlast() {
        const damage = Math.floor(Math.random() * 20) + 25;
        this.dealDamageToPlayer(damage);
        this.addCombatLog(`L'ennemi lance une explosion sombre ! ${damage} dégâts`, 'damage');
        
        // Effet visuel sombre
        const darkEffect = document.createElement('div');
        darkEffect.style.cssText = `
            position: absolute; top: 0; left: 0; right: 0; bottom: 0;
            background: radial-gradient(circle, rgba(139, 0, 0, 0.6), transparent);
            animation: darkBlast 0.5s ease-out; pointer-events: none; z-index: 50;
        `;
        document.getElementById('game-world').appendChild(darkEffect);
        
        setTimeout(() => darkEffect.remove(), 500);
        this.shakeCharacter(this.player, 500);
    }

    enemyHeal() {
        const healAmount = Math.floor(Math.random() * 15) + 20;
        this.enemyStats.hp = Math.min(this.enemyStats.maxHp, this.enemyStats.hp + healAmount);
        this.updateEnemyHealthDisplay();
        this.addCombatLog(`L'ennemi se soigne de ${healAmount} HP`, 'heal');
    }

    // === GAME MANAGEMENT ===
    
    startCombatLoop() {
        // Régénération d'énergie
        setInterval(() => {
            if (this.playerStats.power < this.playerStats.maxPower) {
                this.playerStats.power = Math.min(this.playerStats.maxPower, this.playerStats.power + 2);
                this.updatePowerDisplay();
            }
        }, 1000);
        
        // Tour de l'ennemi
        setInterval(() => {
            if (!this.isAnimating && this.enemyStats.hp > 0 && this.playerStats.hp > 0) {
                this.enemyTurn();
            }
        }, 3000);
    }

    endCombat(playerWon) {
        if (playerWon) {
            this.showFeedback("🎉 VICTOIRE ! Vous avez triomphé !", 'critical');
            this.addCombatLog("=== VICTOIRE HÉROÏQUE ===", 'power');
        } else {
            this.showFeedback("💀 DÉFAITE... Vous avez été vaincu.", 'error');
            this.addCombatLog("=== DÉFAITE ===", 'damage');
        }
        
        // Relancer le combat après 5 secondes
        setTimeout(() => {
            this.resetCombat();
        }, 5000);
    }

    resetCombat() {
        this.playerStats.hp = this.playerStats.maxHp;
        this.playerStats.power = this.playerStats.maxPower;
        this.enemyStats.hp = this.enemyStats.maxHp;
        
        this.updateHealthDisplay();
        this.updateEnemyHealthDisplay();
        this.updatePowerDisplay();
        
        this.showFeedback("Nouveau combat commence !", 'success');
        this.addCombatLog("=== NOUVEAU COMBAT ===", 'info');
        
        // Repositionner les personnages
        this.player.position.set(-5, 0, 0);
        this.enemy.position.set(5, 0, 0);
    }

    onWindowResize() {
        const container = document.getElementById('game-world');
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Rotation dynamique de la caméra
        const time = Date.now() * 0.0003;
        this.camera.position.x = Math.cos(time) * 15;
        this.camera.position.z = Math.sin(time) * 15;
        this.camera.lookAt(0, 2, 0);
        
        // Animations automatiques des cristaux
        this.scene.children.forEach(child => {
            if (child.userData && child.userData.isEnergyPillar) {
                child.rotation.y += 0.01;
            }
        });
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialiser le jeu de combat
document.addEventListener('DOMContentLoaded', () => {
    new CombatGame();
});