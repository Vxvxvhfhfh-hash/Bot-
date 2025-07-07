class OpenWorldGame {
    constructor() {
        // Core Three.js components
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        
        // Player and world
        this.player = null;
        this.enemies = [];
        this.crystals = [];
        this.terrain = null;
        
        // Controls
        this.gamepad = null;
        this.keys = {};
        this.mouse = { x: 0, y: 0, lastX: 0, lastY: 0, sensitivity: 0.002 };
        this.textMode = false;
        
        // Player stats
        this.playerStats = {
            hp: 100,
            maxHp: 100,
            mana: 100,
            maxMana: 100,
            level: 1,
            exp: 45,
            maxExp: 100,
            position: new THREE.Vector3(0, 0, 0),
            speed: 0.3,
            jumpSpeed: 0.8,
            isGrounded: true,
            velocity: new THREE.Vector3(0, 0, 0)
        };
        
        // Game state
        this.quests = {
            demonsKilled: 0,
            crystalsCollected: 0
        };
        
        // Camera settings
        this.cameraDistance = 8;
        this.cameraHeight = 6;
        this.cameraTarget = new THREE.Vector3();
        
        // World bounds
        this.worldSize = 200;
        
        this.init();
        this.setupControls();
        this.gameLoop();
    }

    init() {
        // Créer la scène
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x1a1a2e, 50, 200);
        
        // Créer un ciel étoilé
        this.createStarfield();
        
        // Configuration de la caméra (caméra libre)
        const container = document.getElementById('game-world');
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.set(0, this.cameraHeight, this.cameraDistance);
        
        // Créer le renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: false
        });
        this.renderer.setSize(width, height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor(0x1a1a2e);
        container.appendChild(this.renderer.domElement);
        
        // Éclairage dynamique
        this.setupLighting();
        
        // Générer le terrain
        this.generateTerrain();
        
        // Créer le joueur
        this.createPlayer();
        
        // Peupler le monde
        this.populateWorld();
        
        // Initialiser la mini-carte
        this.initMinimap();
        
        // Détecter les gamepads
        this.detectGamepads();
        
        // Gérer le redimensionnement
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Masquer l'indicateur gamepad après l'init
        setTimeout(() => {
            document.getElementById('gamepad-status').style.display = 'none';
        }, 3000);
    }

    createStarfield() {
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({ 
            color: 0xffffff, 
            size: 2,
            transparent: true,
            opacity: 0.8
        });
        
        const starVertices = [];
        for (let i = 0; i < 2000; i++) {
            starVertices.push(
                THREE.MathUtils.randFloatSpread(400),
                THREE.MathUtils.randFloat(50, 200),
                THREE.MathUtils.randFloatSpread(400)
            );
        }
        
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(stars);
    }

    setupLighting() {
        // Lumière ambiante douce
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        // Soleil principal
        const sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
        sunLight.position.set(50, 100, 50);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 4096;
        sunLight.shadow.mapSize.height = 4096;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 200;
        sunLight.shadow.camera.left = -100;
        sunLight.shadow.camera.right = 100;
        sunLight.shadow.camera.top = 100;
        sunLight.shadow.camera.bottom = -100;
        this.scene.add(sunLight);

        // Lumières d'ambiance colorées
        const moonLight = new THREE.PointLight(0x9bb5ff, 0.5, 150);
        moonLight.position.set(-50, 80, -50);
        this.scene.add(moonLight);

        const magicLight = new THREE.PointLight(0xff6b35, 0.7, 100);
        magicLight.position.set(0, 20, 0);
        this.scene.add(magicLight);
    }

    generateTerrain() {
        // Créer un terrain varié avec des collines
        const terrainGeometry = new THREE.PlaneGeometry(this.worldSize, this.worldSize, 50, 50);
        const vertices = terrainGeometry.attributes.position.array;
        
        // Génération procédurale avec du bruit
        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];
            const z = vertices[i + 1];
            
            // Créer des collines avec du bruit de Perlin simulé
            const height = Math.sin(x * 0.02) * 5 + 
                          Math.cos(z * 0.02) * 3 + 
                          Math.sin(x * 0.05) * 2 + 
                          Math.cos(z * 0.05) * 1;
            
            vertices[i + 2] = height;
        }
        
        terrainGeometry.computeVertexNormals();
        
        // Matériau du terrain avec texture procédurale
        const terrainMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x4a7c59,
            wireframe: false
        });
        
        this.terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
        this.terrain.rotation.x = -Math.PI / 2;
        this.terrain.receiveShadow = true;
        this.scene.add(this.terrain);
        
        // Ajouter des éléments décoratifs
        this.addTerrainDetails();
    }

    addTerrainDetails() {
        // Ajouter des arbres/piliers magiques
        for (let i = 0; i < 30; i++) {
            const treeGroup = new THREE.Group();
            
            // Tronc
            const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.8, 8, 8);
            const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
            const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
            trunk.position.y = 4;
            trunk.castShadow = true;
            treeGroup.add(trunk);
            
            // Feuillage magique
            const foliageGeometry = new THREE.SphereGeometry(3, 12, 12);
            const foliageMaterial = new THREE.MeshLambertMaterial({ 
                color: Math.random() > 0.5 ? 0x228b22 : 0x4169e1,
                transparent: true,
                opacity: 0.8
            });
            const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
            foliage.position.y = 10;
            foliage.castShadow = true;
            treeGroup.add(foliage);
            
            // Position aléatoire
            treeGroup.position.set(
                (Math.random() - 0.5) * this.worldSize * 0.8,
                0,
                (Math.random() - 0.5) * this.worldSize * 0.8
            );
            
            this.scene.add(treeGroup);
        }
        
        // Ajouter des rochers
        for (let i = 0; i < 50; i++) {
            const rockGeometry = new THREE.DodecahedronGeometry(
                Math.random() * 2 + 1, 
                Math.floor(Math.random() * 2)
            );
            const rockMaterial = new THREE.MeshLambertMaterial({ 
                color: 0x696969 
            });
            const rock = new THREE.Mesh(rockGeometry, rockMaterial);
            
            rock.position.set(
                (Math.random() - 0.5) * this.worldSize * 0.9,
                Math.random() * 2,
                (Math.random() - 0.5) * this.worldSize * 0.9
            );
            
            rock.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            
            rock.castShadow = true;
            rock.receiveShadow = true;
            this.scene.add(rock);
        }
    }

    createPlayer() {
        this.player = new THREE.Group();
        
        // Corps principal plus détaillé
        const bodyGeometry = new THREE.CylinderGeometry(0.6, 0.8, 2.2, 12);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x1e3d59 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1.1;
        body.castShadow = true;
        this.player.add(body);

        // Tête
        const headGeometry = new THREE.SphereGeometry(0.5, 16, 16);
        const headMaterial = new THREE.MeshLambertMaterial({ color: 0xffdbac });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 2.7;
        head.castShadow = true;
        this.player.add(head);

        // Casque héroïque
        const helmetGeometry = new THREE.SphereGeometry(0.55, 16, 16, 0, Math.PI);
        const helmetMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x2c3e50,
            metalness: 0.8 
        });
        const helmet = new THREE.Mesh(helmetGeometry, helmetMaterial);
        helmet.position.y = 2.8;
        helmet.castShadow = true;
        this.player.add(helmet);

        // Bras
        this.createPlayerLimb(-0.9, 1.5, 0, 'arm');
        this.createPlayerLimb(0.9, 1.5, 0, 'arm');

        // Jambes
        this.createPlayerLimb(-0.4, -0.5, 0, 'leg');
        this.createPlayerLimb(0.4, -0.5, 0, 'leg');

        // Cape
        const capeGeometry = new THREE.ConeGeometry(1.2, 2.5, 8);
        const capeMaterial = new THREE.MeshLambertMaterial({ color: 0xdc143c });
        const cape = new THREE.Mesh(capeGeometry, capeMaterial);
        cape.position.set(0, 1, -0.6);
        cape.rotation.x = 0.2;
        cape.castShadow = true;
        this.player.add(cape);

        // Épée magique
        this.createPlayerWeapon();

        // Aura magique
        const auraGeometry = new THREE.SphereGeometry(1.8, 16, 16);
        const auraMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x74b9ff,
            transparent: true,
            opacity: 0.1,
            wireframe: true
        });
        const aura = new THREE.Mesh(auraGeometry, auraMaterial);
        aura.position.y = 1.5;
        this.player.add(aura);

        this.player.position.set(0, 0, 0);
        this.scene.add(this.player);
    }

    createPlayerLimb(x, y, z, type) {
        const limbGroup = new THREE.Group();
        
        if (type === 'arm') {
            const armGeometry = new THREE.CylinderGeometry(0.2, 0.25, 1.5, 8);
            const armMaterial = new THREE.MeshLambertMaterial({ color: 0xffdbac });
            const arm = new THREE.Mesh(armGeometry, armMaterial);
            arm.castShadow = true;
            limbGroup.add(arm);
            
            // Épaulière
            const shoulderGeometry = new THREE.SphereGeometry(0.35, 8, 8);
            const shoulderMaterial = new THREE.MeshLambertMaterial({ color: 0x2c3e50 });
            const shoulder = new THREE.Mesh(shoulderGeometry, shoulderMaterial);
            shoulder.position.y = 0.6;
            shoulder.castShadow = true;
            limbGroup.add(shoulder);
        } else {
            const legGeometry = new THREE.CylinderGeometry(0.25, 0.3, 1.8, 8);
            const legMaterial = new THREE.MeshLambertMaterial({ color: 0x1e3d59 });
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            leg.castShadow = true;
            limbGroup.add(leg);
            
            // Botte
            const bootGeometry = new THREE.BoxGeometry(0.4, 0.3, 0.8);
            const bootMaterial = new THREE.MeshLambertMaterial({ color: 0x2c3e50 });
            const boot = new THREE.Mesh(bootGeometry, bootMaterial);
            boot.position.y = -1.1;
            boot.position.z = 0.2;
            boot.castShadow = true;
            limbGroup.add(boot);
        }
        
        limbGroup.position.set(x, y, z);
        if (type === 'arm') {
            limbGroup.rotation.z = x > 0 ? -Math.PI / 8 : Math.PI / 8;
        }
        
        this.player.add(limbGroup);
    }

    createPlayerWeapon() {
        const weaponGroup = new THREE.Group();
        
        // Lame énergétique
        const bladeGeometry = new THREE.BoxGeometry(0.1, 3.0, 0.05);
        const bladeMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x00ffff,
            transparent: true,
            opacity: 0.9
        });
        const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
        blade.position.y = 2;
        weaponGroup.add(blade);
        
        // Garde
        const guardGeometry = new THREE.BoxGeometry(0.8, 0.1, 0.1);
        const guardMaterial = new THREE.MeshLambertMaterial({ color: 0x2c3e50 });
        const guard = new THREE.Mesh(guardGeometry, guardMaterial);
        guard.position.y = 0.5;
        weaponGroup.add(guard);
        
        // Poignée
        const handleGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.8, 8);
        const handleMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
        const handle = new THREE.Mesh(handleGeometry, handleMaterial);
        weaponGroup.add(handle);
        
        weaponGroup.position.set(1.2, 1.5, 0);
        weaponGroup.rotation.z = -Math.PI / 6;
        this.player.add(weaponGroup);
        
        this.playerWeapon = weaponGroup;
    }

    populateWorld() {
        // Créer des ennemis répartis dans le monde
        for (let i = 0; i < 15; i++) {
            this.createEnemy(
                (Math.random() - 0.5) * this.worldSize * 0.7,
                (Math.random() - 0.5) * this.worldSize * 0.7
            );
        }
        
        // Créer des cristaux à collecter
        for (let i = 0; i < 8; i++) {
            this.createCrystal(
                (Math.random() - 0.5) * this.worldSize * 0.8,
                (Math.random() - 0.5) * this.worldSize * 0.8
            );
        }
    }

    createEnemy(x, z) {
        const enemy = new THREE.Group();
        
        // Corps démoniaque
        const bodyGeometry = new THREE.CylinderGeometry(0.7, 0.9, 2.5, 6);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x8b0000 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1.25;
        body.castShadow = true;
        enemy.add(body);

        // Tête
        const headGeometry = new THREE.SphereGeometry(0.6, 10, 10);
        const headMaterial = new THREE.MeshLambertMaterial({ color: 0x4a0e0e });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 3.2;
        head.castShadow = true;
        enemy.add(head);

        // Cornes
        for (let i = 0; i < 2; i++) {
            const hornGeometry = new THREE.ConeGeometry(0.1, 0.8, 6);
            const hornMaterial = new THREE.MeshLambertMaterial({ color: 0x2c2c2c });
            const horn = new THREE.Mesh(hornGeometry, hornMaterial);
            horn.position.set(i === 0 ? -0.3 : 0.3, 3.8, 0.2);
            horn.rotation.z = i === 0 ? -Math.PI / 6 : Math.PI / 6;
            enemy.add(horn);
        }

        // Yeux rougeoyants
        const eyeGeometry = new THREE.SphereGeometry(0.08, 6, 6);
        const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.15, 3.3, 0.5);
        enemy.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.15, 3.3, 0.5);
        enemy.add(rightEye);

        // Aura sombre
        const auraGeometry = new THREE.SphereGeometry(2, 12, 12);
        const auraMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x8b0000,
            transparent: true,
            opacity: 0.15,
            wireframe: true
        });
        const aura = new THREE.Mesh(auraGeometry, auraMaterial);
        aura.position.y = 1.5;
        enemy.add(aura);

        enemy.position.set(x, 0, z);
        enemy.userData = {
            type: 'enemy',
            hp: 50,
            maxHp: 50,
            attackCooldown: 0,
            lastAttack: 0
        };
        
        this.enemies.push(enemy);
        this.scene.add(enemy);
    }

    createCrystal(x, z) {
        const crystal = new THREE.Group();
        
        // Cristal principal
        const crystalGeometry = new THREE.OctahedronGeometry(0.8);
        const crystalMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x00ffff,
            transparent: true,
            opacity: 0.8
        });
        const crystalMesh = new THREE.Mesh(crystalGeometry, crystalMaterial);
        crystalMesh.position.y = 1.5;
        crystalMesh.castShadow = true;
        crystal.add(crystalMesh);

        // Base du cristal
        const baseGeometry = new THREE.CylinderGeometry(0.5, 0.8, 0.3, 8);
        const baseMaterial = new THREE.MeshLambertMaterial({ color: 0x606060 });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = 0.15;
        crystal.add(base);

        // Particules autour
        for (let i = 0; i < 8; i++) {
            const particleGeometry = new THREE.SphereGeometry(0.05, 4, 4);
            const particleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            
            const angle = (i / 8) * Math.PI * 2;
            particle.position.set(
                Math.cos(angle) * 1.2,
                1.5 + Math.sin(Date.now() * 0.002 + i) * 0.3,
                Math.sin(angle) * 1.2
            );
            crystal.add(particle);
        }

        crystal.position.set(x, 0, z);
        crystal.userData = {
            type: 'crystal',
            collected: false,
            rotationSpeed: Math.random() * 0.02 + 0.01
        };
        
        this.crystals.push(crystal);
        this.scene.add(crystal);
    }

    detectGamepads() {
        // Vérifier périodiquement les gamepads
        setInterval(() => {
            const gamepads = navigator.getGamepads();
            let gamepadFound = false;
            
            for (let i = 0; i < gamepads.length; i++) {
                if (gamepads[i]) {
                    this.gamepad = gamepads[i];
                    gamepadFound = true;
                    document.getElementById('gamepad-text').textContent = `${gamepads[i].id} connectée`;
                    break;
                }
            }
            
            if (!gamepadFound) {
                this.gamepad = null;
                document.getElementById('gamepad-text').textContent = 'Connectez une manette';
            }
        }, 1000);
    }

    setupControls() {
        // Contrôles clavier
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            if (e.code === 'Enter' && this.textMode) {
                this.processTextInput();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        // Contrôles souris pour la caméra
        let isMouseDown = false;
        document.addEventListener('mousedown', (e) => {
            if (e.button === 0) isMouseDown = true;
        });
        
        document.addEventListener('mouseup', (e) => {
            if (e.button === 0) isMouseDown = false;
        });

        document.addEventListener('mousemove', (e) => {
            if (isMouseDown) {
                this.mouse.x += e.movementX * this.mouse.sensitivity;
                this.mouse.y -= e.movementY * this.mouse.sensitivity;
                this.mouse.y = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.mouse.y));
            }
        });

        // Toggle du panneau latéral
        document.getElementById('panel-toggle').addEventListener('click', () => {
            const panel = document.getElementById('side-panel');
            panel.classList.toggle('minimized');
        });

        // Empêcher le menu contextuel
        document.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    initMinimap() {
        this.minimapCanvas = document.getElementById('minimap-canvas');
        this.minimapCtx = this.minimapCanvas.getContext('2d');
        this.minimapScale = 0.5;
    }

    updateMinimap() {
        const ctx = this.minimapCtx;
        const canvas = this.minimapCanvas;
        
        // Effacer la minimap
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Dessiner le terrain
        ctx.fillStyle = '#2d4a22';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const scale = canvas.width / (this.worldSize * this.minimapScale);
        
        // Dessiner le joueur
        const playerX = centerX + this.player.position.x * scale;
        const playerY = centerY + this.player.position.z * scale;
        
        ctx.fillStyle = '#74b9ff';
        ctx.beginPath();
        ctx.arc(playerX, playerY, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Dessiner les ennemis
        ctx.fillStyle = '#e74c3c';
        this.enemies.forEach(enemy => {
            if (!enemy.userData.dead) {
                const enemyX = centerX + enemy.position.x * scale;
                const enemyY = centerY + enemy.position.z * scale;
                ctx.beginPath();
                ctx.arc(enemyX, enemyY, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        
        // Dessiner les cristaux
        ctx.fillStyle = '#00ffff';
        this.crystals.forEach(crystal => {
            if (!crystal.userData.collected) {
                const crystalX = centerX + crystal.position.x * scale;
                const crystalY = centerY + crystal.position.z * scale;
                ctx.fillRect(crystalX - 2, crystalY - 2, 4, 4);
            }
        });
    }

    processInput() {
        const deltaTime = 0.016; // Environ 60 FPS
        
        // Input du gamepad
        if (this.gamepad) {
            this.processGamepadInput(deltaTime);
        }
        
        // Input du clavier
        this.processKeyboardInput(deltaTime);
        
        // Mise à jour de la position du joueur
        this.updatePlayerPosition(deltaTime);
        
        // Mise à jour de la caméra
        this.updateCamera();
    }

    processGamepadInput(deltaTime) {
        if (!this.gamepad) return;
        
        const deadzone = 0.15;
        
        // Stick gauche pour le mouvement
        const leftStickX = Math.abs(this.gamepad.axes[0]) > deadzone ? this.gamepad.axes[0] : 0;
        const leftStickY = Math.abs(this.gamepad.axes[1]) > deadzone ? this.gamepad.axes[1] : 0;
        
        // Stick droit pour la caméra
        const rightStickX = Math.abs(this.gamepad.axes[2]) > deadzone ? this.gamepad.axes[2] : 0;
        const rightStickY = Math.abs(this.gamepad.axes[3]) > deadzone ? this.gamepad.axes[3] : 0;
        
        // Mouvement du joueur
        if (leftStickX !== 0 || leftStickY !== 0) {
            const speed = this.keys['ShiftLeft'] || this.gamepad.buttons[6]?.pressed ? 
                         this.playerStats.speed * 2 : this.playerStats.speed;
            
            this.playerStats.velocity.x = leftStickX * speed;
            this.playerStats.velocity.z = leftStickY * speed;
        }
        
        // Rotation de la caméra
        if (rightStickX !== 0 || rightStickY !== 0) {
            this.mouse.x += rightStickX * 0.03;
            this.mouse.y -= rightStickY * 0.03;
            this.mouse.y = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.mouse.y));
        }
        
        // Boutons d'action
        if (this.gamepad.buttons[0]?.pressed) { // A/X - Saut
            this.playerJump();
        }
        
        if (this.gamepad.buttons[1]?.pressed) { // B/Carré - Attaque
            this.playerAttack();
        }
        
        if (this.gamepad.buttons[2]?.pressed) { // Y/Triangle - Magie
            this.playerMagic();
        }
        
        if (this.gamepad.buttons[4]?.pressed) { // LB/L1 - Esquive
            this.playerDodge();
        }
        
        if (this.gamepad.buttons[5]?.pressed) { // RB/R1 - Bouclier
            this.playerShield();
        }
    }

    processKeyboardInput(deltaTime) {
        const speed = this.keys['ShiftLeft'] ? 
                     this.playerStats.speed * 2 : this.playerStats.speed;
        
        // Réinitialiser la vélocité horizontale
        this.playerStats.velocity.x = 0;
        this.playerStats.velocity.z = 0;
        
        // Mouvement WASD
        if (this.keys['KeyW']) this.playerStats.velocity.z = -speed;
        if (this.keys['KeyS']) this.playerStats.velocity.z = speed;
        if (this.keys['KeyA']) this.playerStats.velocity.x = -speed;
        if (this.keys['KeyD']) this.playerStats.velocity.x = speed;
        
        // Actions
        if (this.keys['Space']) this.playerJump();
        if (this.keys['KeyE']) this.playerMagic();
        if (this.keys['KeyQ']) this.playerShield();
        if (this.keys['KeyF']) this.playerInteract();
    }

    updatePlayerPosition(deltaTime) {
        // Appliquer la gravité
        if (!this.playerStats.isGrounded) {
            this.playerStats.velocity.y -= 0.5 * deltaTime * 60;
        }
        
        // Mettre à jour la position
        this.player.position.add(this.playerStats.velocity);
        
        // Vérifier les limites du monde
        const halfWorld = this.worldSize / 2;
        this.player.position.x = Math.max(-halfWorld, Math.min(halfWorld, this.player.position.x));
        this.player.position.z = Math.max(-halfWorld, Math.min(halfWorld, this.player.position.z));
        
        // Collision avec le sol (simple)
        if (this.player.position.y <= 0) {
            this.player.position.y = 0;
            this.playerStats.velocity.y = 0;
            this.playerStats.isGrounded = true;
        } else {
            this.playerStats.isGrounded = false;
        }
        
        // Stocker la position pour les stats
        this.playerStats.position.copy(this.player.position);
    }

    updateCamera() {
        // Caméra third-person avec rotation libre
        const offset = new THREE.Vector3(
            Math.sin(this.mouse.x) * this.cameraDistance,
            this.cameraHeight + Math.sin(this.mouse.y) * this.cameraDistance * 0.5,
            Math.cos(this.mouse.x) * this.cameraDistance
        );
        
        this.camera.position.copy(this.player.position).add(offset);
        this.camera.lookAt(this.player.position.x, this.player.position.y + 2, this.player.position.z);
    }

    // === PLAYER ACTIONS ===
    
    playerJump() {
        if (this.playerStats.isGrounded) {
            this.playerStats.velocity.y = this.playerStats.jumpSpeed;
            this.showAction("Saut héroïque !");
        }
    }

    playerAttack() {
        if (this.playerStats.mana < 10) return;
        
        this.playerStats.mana -= 10;
        this.updateUI();
        
        // Animation d'attaque
        const weapon = this.playerWeapon;
        const originalRot = weapon.rotation.z;
        
        weapon.rotation.z = originalRot - Math.PI / 2;
        setTimeout(() => {
            weapon.rotation.z = originalRot;
        }, 200);
        
        // Vérifier les ennemis à proximité
        this.enemies.forEach(enemy => {
            if (!enemy.userData.dead) {
                const distance = this.player.position.distanceTo(enemy.position);
                if (distance < 3) {
                    this.damageEnemy(enemy, 25 + Math.random() * 15);
                }
            }
        });
        
        this.showAction("Attaque à l'épée !");
        this.createScreenEffect('magic');
    }

    playerMagic() {
        if (this.playerStats.mana < 25) return;
        
        this.playerStats.mana -= 25;
        this.updateUI();
        
        // Créer projectile magique
        const projectile = new THREE.Group();
        
        const orb = new THREE.Mesh(
            new THREE.SphereGeometry(0.3, 8, 8),
            new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.8 })
        );
        projectile.add(orb);
        
        // Particules
        for (let i = 0; i < 6; i++) {
            const particle = new THREE.Mesh(
                new THREE.SphereGeometry(0.05, 4, 4),
                new THREE.MeshBasicMaterial({ color: 0x74b9ff })
            );
            const angle = (i / 6) * Math.PI * 2;
            particle.position.set(Math.cos(angle) * 0.5, 0, Math.sin(angle) * 0.5);
            projectile.add(particle);
        }
        
        projectile.position.copy(this.player.position);
        projectile.position.y += 2;
        this.scene.add(projectile);
        
        // Direction du projectile
        const direction = new THREE.Vector3(
            Math.sin(this.mouse.x),
            0,
            Math.cos(this.mouse.x)
        );
        
        // Animation du projectile
        const speed = 0.8;
        const maxDistance = 20;
        let travelDistance = 0;
        
        const moveProjectile = () => {
            projectile.position.add(direction.clone().multiplyScalar(speed));
            projectile.rotation.y += 0.2;
            travelDistance += speed;
            
            // Vérifier collision avec ennemis
            this.enemies.forEach(enemy => {
                if (!enemy.userData.dead) {
                    const distance = projectile.position.distanceTo(enemy.position);
                    if (distance < 2) {
                        this.damageEnemy(enemy, 35 + Math.random() * 20);
                        this.scene.remove(projectile);
                        return;
                    }
                }
            });
            
            if (travelDistance < maxDistance) {
                requestAnimationFrame(moveProjectile);
            } else {
                this.scene.remove(projectile);
            }
        };
        
        moveProjectile();
        this.showAction("Projectile magique lancé !");
        this.createScreenEffect('magic');
    }

    playerShield() {
        if (this.playerStats.mana < 15) return;
        
        this.playerStats.mana -= 15;
        this.updateUI();
        
        // Créer bouclier temporaire
        const shield = new THREE.Mesh(
            new THREE.SphereGeometry(2.5, 16, 16),
            new THREE.MeshBasicMaterial({ 
                color: 0x74b9ff,
                transparent: true,
                opacity: 0.3,
                wireframe: true 
            })
        );
        
        shield.position.copy(this.player.position);
        shield.position.y += 1.5;
        this.scene.add(shield);
        
        setTimeout(() => {
            this.scene.remove(shield);
        }, 3000);
        
        this.showAction("Bouclier magique activé !");
    }

    playerDodge() {
        const dodgeDirection = new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            0,
            (Math.random() - 0.5) * 2
        ).normalize().multiplyScalar(4);
        
        this.player.position.add(dodgeDirection);
        this.showAction("Esquive rapide !");
    }

    playerInteract() {
        // Vérifier les cristaux à proximité
        this.crystals.forEach(crystal => {
            if (!crystal.userData.collected) {
                const distance = this.player.position.distanceTo(crystal.position);
                if (distance < 3) {
                    this.collectCrystal(crystal);
                }
            }
        });
    }

    // === GAME LOGIC ===
    
    damageEnemy(enemy, damage) {
        enemy.userData.hp -= damage;
        
        // Animation de dégâts
        enemy.material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        setTimeout(() => {
            enemy.children.forEach(child => {
                if (child.material) {
                    child.material = child.userData.originalMaterial || child.material;
                }
            });
        }, 200);
        
        if (enemy.userData.hp <= 0) {
            enemy.userData.dead = true;
            this.quests.demonsKilled++;
            this.updateQuests();
            
            // Animation de mort
            enemy.scale.set(0.1, 0.1, 0.1);
            setTimeout(() => {
                this.scene.remove(enemy);
            }, 1000);
            
            this.showAction(`Démon éliminé ! (+100 XP)`);
            this.playerStats.exp += 100;
            this.checkLevelUp();
        }
    }

    collectCrystal(crystal) {
        crystal.userData.collected = true;
        this.quests.crystalsCollected++;
        this.updateQuests();
        
        // Animation de collecte
        crystal.scale.set(0, 0, 0);
        this.scene.remove(crystal);
        
        // Bonus
        this.playerStats.mana = Math.min(this.playerStats.maxMana, this.playerStats.mana + 25);
        this.updateUI();
        
        this.showAction("Cristal collecté ! (+25 Mana)");
        this.createScreenEffect('heal');
    }

    checkLevelUp() {
        if (this.playerStats.exp >= this.playerStats.maxExp) {
            this.playerStats.level++;
            this.playerStats.exp = 0;
            this.playerStats.maxExp += 50;
            this.playerStats.maxHp += 20;
            this.playerStats.maxMana += 15;
            this.playerStats.hp = this.playerStats.maxHp;
            this.playerStats.mana = this.playerStats.maxMana;
            
            this.showAction(`NIVEAU ${this.playerStats.level} ATTEINT !`);
            this.createScreenEffect('magic');
            this.updateUI();
        }
    }

    // === UI UPDATES ===
    
    updateUI() {
        // Barres de vie et mana
        document.getElementById('player-health').style.width = 
            (this.playerStats.hp / this.playerStats.maxHp * 100) + '%';
        document.getElementById('player-hp').textContent = this.playerStats.hp;
        
        document.getElementById('player-mana').style.width = 
            (this.playerStats.mana / this.playerStats.maxMana * 100) + '%';
        document.getElementById('player-mana-num').textContent = this.playerStats.mana;
        
        document.getElementById('player-exp').style.width = 
            (this.playerStats.exp / this.playerStats.maxExp * 100) + '%';
        document.getElementById('player-level').textContent = this.playerStats.level;
    }

    updateQuests() {
        document.querySelector('.quest-item.active .quest-progress').textContent = 
            `${this.quests.demonsKilled}/5`;
        document.querySelector('.quest-item:not(.active) .quest-progress').textContent = 
            `${this.quests.crystalsCollected}/3`;
    }

    showAction(message) {
        const display = document.getElementById('action-display');
        display.textContent = message;
        display.style.opacity = '1';
        
        setTimeout(() => {
            display.style.opacity = '0.7';
        }, 2000);
    }

    createScreenEffect(type) {
        const effect = document.createElement('div');
        effect.className = `screen-effect ${type}-screen`;
        document.getElementById('game-world').appendChild(effect);
        
        setTimeout(() => {
            effect.remove();
        }, 1000);
    }

    // === TEXT SYSTEM ===
    
    toggleTextMode() {
        this.textMode = !this.textMode;
        const textInput = document.getElementById('text-input');
        
        if (this.textMode) {
            textInput.style.display = 'block';
            textInput.focus();
            document.body.style.cursor = 'auto';
        } else {
            textInput.style.display = 'none';
            textInput.blur();
            document.body.style.cursor = 'none';
        }
    }

    processTextInput() {
        const input = document.getElementById('text-input');
        const action = input.value.toLowerCase().trim();
        
        if (action) {
            this.executeTextAction(action);
            input.value = '';
            
            // Ajouter à l'historique
            const history = document.querySelector('.action-history');
            history.textContent = `Dernière action: ${action}`;
        }
    }

    executeTextAction(action) {
        // Système de reconnaissance d'actions textuelles
        const actionMap = {
            'attaquer': () => this.playerAttack(),
            'attaque': () => this.playerAttack(),
            'frapper': () => this.playerAttack(),
            'magie': () => this.playerMagic(),
            'sort': () => this.playerMagic(),
            'projectile': () => this.playerMagic(),
            'sauter': () => this.playerJump(),
            'saut': () => this.playerJump(),
            'bouclier': () => this.playerShield(),
            'protection': () => this.playerShield(),
            'esquiver': () => this.playerDodge(),
            'esquive': () => this.playerDodge(),
            'interagir': () => this.playerInteract(),
            'ramasser': () => this.playerInteract(),
            'collecter': () => this.playerInteract()
        };
        
        // Chercher une action correspondante
        for (const [keyword, actionFunc] of Object.entries(actionMap)) {
            if (action.includes(keyword)) {
                actionFunc();
                this.showAction(`Action: ${keyword}`);
                return;
            }
        }
        
        // Actions spéciales
        if (action.includes('téléport') || action.includes('teleport')) {
            const newX = (Math.random() - 0.5) * 20;
            const newZ = (Math.random() - 0.5) * 20;
            this.player.position.set(newX, 0, newZ);
            this.showAction("Téléportation !");
            this.createScreenEffect('magic');
            return;
        }
        
        if (action.includes('soin') || action.includes('heal')) {
            const healAmount = 25;
            this.playerStats.hp = Math.min(this.playerStats.maxHp, this.playerStats.hp + healAmount);
            this.updateUI();
            this.showAction(`Soin: +${healAmount} HP`);
            this.createScreenEffect('heal');
            return;
        }
        
        this.showAction(`Action "${action}" non reconnue`);
    }

    // === GAME LOOP ===
    
    gameLoop() {
        requestAnimationFrame(() => this.gameLoop());
        
        // Traitement des entrées
        this.processInput();
        
        // Animations automatiques
        this.updateAnimations();
        
        // Mise à jour de la minimap
        this.updateMinimap();
        
        // Rendu
        this.renderer.render(this.scene, this.camera);
    }

    updateAnimations() {
        const time = Date.now() * 0.001;
        
        // Rotation des cristaux
        this.crystals.forEach(crystal => {
            if (!crystal.userData.collected) {
                crystal.rotation.y += crystal.userData.rotationSpeed;
                crystal.position.y = Math.sin(time * 2) * 0.2;
            }
        });
        
        // Animation de l'aura du joueur
        if (this.player.children.length > 0) {
            const aura = this.player.children.find(child => 
                child.material && child.material.wireframe
            );
            if (aura) {
                aura.rotation.y += 0.01;
                aura.material.opacity = 0.1 + Math.sin(time * 3) * 0.05;
            }
        }
        
        // Animation des ennemis
        this.enemies.forEach(enemy => {
            if (!enemy.userData.dead) {
                // Mouvement vers le joueur
                const direction = new THREE.Vector3()
                    .subVectors(this.player.position, enemy.position)
                    .normalize();
                
                const distance = enemy.position.distanceTo(this.player.position);
                if (distance > 5 && distance < 25) {
                    enemy.position.add(direction.multiplyScalar(0.02));
                }
                
                // Rotation vers le joueur
                enemy.lookAt(this.player.position);
                
                // Animation de l'aura
                const aura = enemy.children.find(child => 
                    child.material && child.material.wireframe
                );
                if (aura) {
                    aura.rotation.y -= 0.02;
                }
            }
        });
        
        // Régénération de mana
        if (this.playerStats.mana < this.playerStats.maxMana) {
            this.playerStats.mana = Math.min(
                this.playerStats.maxMana, 
                this.playerStats.mana + 0.1
            );
            this.updateUI();
        }
    }

    onWindowResize() {
        const container = document.getElementById('game-world');
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
}

// Fonction globale pour toggle le mode texte
function toggleTextMode() {
    if (window.game) {
        window.game.toggleTextMode();
    }
}

// Initialiser le jeu
document.addEventListener('DOMContentLoaded', () => {
    window.game = new OpenWorldGame();
    
    // Masquer les contrôles après quelques secondes
    setTimeout(() => {
        const controls = document.getElementById('controls-info');
        controls.style.opacity = '0.3';
        controls.style.transition = 'opacity 0.5s ease';
        
        controls.addEventListener('mouseenter', () => {
            controls.style.opacity = '1';
        });
        
        controls.addEventListener('mouseleave', () => {
            controls.style.opacity = '0.3';
        });
    }, 10000);
});