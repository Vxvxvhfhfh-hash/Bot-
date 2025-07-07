class Game3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.character = null;
        this.isAnimating = false;
        
        this.init();
        this.setupControls();
        this.animate();
    }

    init() {
        // Créer la scène
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87ceeb); // Bleu ciel

        // Créer la caméra
        const container = document.getElementById('game-world');
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.set(5, 5, 5);
        this.camera.lookAt(0, 0, 0);

        // Créer le renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(width, height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(this.renderer.domElement);

        // Ajouter des lumières
        this.addLights();
        
        // Créer le sol
        this.createGround();
        
        // Créer le personnage
        this.createCharacter();
        
        // Gérer le redimensionnement
        window.addEventListener('resize', () => this.onWindowResize());
    }

    addLights() {
        // Lumière ambiante
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        // Lumière directionnelle
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
    }

    createGround() {
        const groundGeometry = new THREE.PlaneGeometry(20, 20);
        const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x90EE90 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Ajouter quelques cubes décoratifs
        for (let i = 0; i < 5; i++) {
            const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
            const cubeMaterial = new THREE.MeshLambertMaterial({ 
                color: Math.random() * 0xffffff 
            });
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.position.set(
                (Math.random() - 0.5) * 15,
                0.25,
                (Math.random() - 0.5) * 15
            );
            cube.castShadow = true;
            this.scene.add(cube);
        }
    }

    createCharacter() {
        // Créer un personnage simple avec des formes géométriques
        const characterGroup = new THREE.Group();

        // Corps (cylindre)
        const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.4, 1.2, 8);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x4169E1 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.6;
        body.castShadow = true;
        characterGroup.add(body);

        // Tête (sphère)
        const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
        const headMaterial = new THREE.MeshLambertMaterial({ color: 0xFFDBB5 });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.45;
        head.castShadow = true;
        characterGroup.add(head);

        // Yeux
        const eyeGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const eyeMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.08, 1.5, 0.2);
        characterGroup.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.08, 1.5, 0.2);
        characterGroup.add(rightEye);

        // Bras
        const armGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.8, 8);
        const armMaterial = new THREE.MeshLambertMaterial({ color: 0xFFDBB5 });
        
        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-0.45, 0.8, 0);
        leftArm.rotation.z = Math.PI / 6;
        leftArm.castShadow = true;
        characterGroup.add(leftArm);
        
        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(0.45, 0.8, 0);
        rightArm.rotation.z = -Math.PI / 6;
        rightArm.castShadow = true;
        characterGroup.add(rightArm);

        // Jambes
        const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 8);
        const legMaterial = new THREE.MeshLambertMaterial({ color: 0x2F4F4F });
        
        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(-0.15, -0.4, 0);
        leftLeg.castShadow = true;
        characterGroup.add(leftLeg);
        
        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(0.15, -0.4, 0);
        rightLeg.castShadow = true;
        characterGroup.add(rightLeg);

        this.character = characterGroup;
        this.scene.add(this.character);
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
                
                // Animation de feedback
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
        
        // Enlever les classes précédentes
        feedbackContainer.classList.remove('success', 'error');
        
        if (this.isAnimating) {
            feedback.textContent = "Le personnage est déjà en mouvement, attendez...";
            feedbackContainer.classList.add('error');
            return;
        }

        // Normaliser l'action
        const normalizedAction = this.normalizeAction(action);
        
        switch (normalizedAction) {
            case 'avancer':
                this.moveCharacter(0, 0, -1);
                feedback.textContent = "Le personnage avance !";
                feedbackContainer.classList.add('success');
                break;
                
            case 'reculer':
                this.moveCharacter(0, 0, 1);
                feedback.textContent = "Le personnage recule !";
                feedbackContainer.classList.add('success');
                break;
                
            case 'gauche':
                this.moveCharacter(-1, 0, 0);
                feedback.textContent = "Le personnage va à gauche !";
                feedbackContainer.classList.add('success');
                break;
                
            case 'droite':
                this.moveCharacter(1, 0, 0);
                feedback.textContent = "Le personnage va à droite !";
                feedbackContainer.classList.add('success');
                break;
                
            case 'sauter':
                this.jumpCharacter();
                feedback.textContent = "Le personnage saute !";
                feedbackContainer.classList.add('success');
                break;
                
            case 'tourner':
                this.rotateCharacter();
                feedback.textContent = "Le personnage tourne !";
                feedbackContainer.classList.add('success');
                break;
                
            case 'danser':
                this.danceCharacter();
                feedback.textContent = "Le personnage danse !";
                feedbackContainer.classList.add('success');
                break;
                
            default:
                feedback.textContent = `Action "${action}" non reconnue. Essayez: avancer, reculer, gauche, droite, sauter, tourner, danser`;
                feedbackContainer.classList.add('error');
        }
    }

    normalizeAction(action) {
        // Dictionnaire de synonymes
        const synonyms = {
            'avancer': ['avancer', 'aller devant', 'marcher', 'forward', 'avant'],
            'reculer': ['reculer', 'aller derrière', 'arrière', 'back', 'backward'],
            'gauche': ['gauche', 'aller à gauche', 'left', 'à gauche'],
            'droite': ['droite', 'aller à droite', 'right', 'à droite'],
            'sauter': ['sauter', 'faire un saut', 'jump', 'saut'],
            'tourner': ['tourner', 'pivoter', 'rotate', 'rotation'],
            'danser': ['danser', 'dance', 'danse', 'bouger']
        };

        for (const [key, values] of Object.entries(synonyms)) {
            if (values.some(synonym => action.includes(synonym))) {
                return key;
            }
        }
        
        return action;
    }

    moveCharacter(dx, dy, dz) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const startPos = this.character.position.clone();
        const endPos = new THREE.Vector3(
            startPos.x + dx,
            startPos.y + dy,
            startPos.z + dz
        );
        
        this.animateMovement(startPos, endPos, 1000);
    }

    jumpCharacter() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const startPos = this.character.position.clone();
        const midPos = new THREE.Vector3(startPos.x, startPos.y + 1.5, startPos.z);
        
        // Animation en deux parties: montée puis descente
        this.animateMovement(startPos, midPos, 500, () => {
            this.animateMovement(midPos, startPos, 500);
        });
    }

    rotateCharacter() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const startRotation = this.character.rotation.y;
        const endRotation = startRotation + Math.PI * 2;
        
        this.animateRotation(startRotation, endRotation, 1500);
    }

    danceCharacter() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        let step = 0;
        const danceSteps = [
            { x: 0.5, y: 0.3, rotation: 0.5 },
            { x: -0.5, y: 0.6, rotation: -0.5 },
            { x: 0.3, y: 0.4, rotation: 0.3 },
            { x: -0.3, y: 0.2, rotation: -0.3 },
            { x: 0, y: 0, rotation: 0 }
        ];
        
        const executeDanceStep = () => {
            if (step >= danceSteps.length) {
                this.isAnimating = false;
                return;
            }
            
            const move = danceSteps[step];
            const startPos = this.character.position.clone();
            const endPos = new THREE.Vector3(move.x, move.y, startPos.z);
            const startRot = this.character.rotation.y;
            const endRot = startRot + move.rotation;
            
            // Animation simultanée de position et rotation
            this.animateMovement(startPos, endPos, 300, () => {
                step++;
                executeDanceStep();
            });
            this.animateRotation(startRot, endRot, 300);
        };
        
        executeDanceStep();
    }

    animateMovement(startPos, endPos, duration, callback) {
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Fonction d'easing pour un mouvement plus naturel
            const easeProgress = this.easeInOutQuad(progress);
            
            this.character.position.lerpVectors(startPos, endPos, easeProgress);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.character.position.copy(endPos);
                if (callback) callback();
                if (!callback) this.isAnimating = false;
            }
        };
        
        animate();
    }

    animateRotation(startRot, endRot, duration, callback) {
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeProgress = this.easeInOutQuad(progress);
            this.character.rotation.y = startRot + (endRot - startRot) * easeProgress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.character.rotation.y = endRot;
                if (callback) callback();
                if (!callback) this.isAnimating = false;
            }
        };
        
        animate();
    }

    easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
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
        
        // Rotation douce de la caméra autour du personnage
        const time = Date.now() * 0.0005;
        this.camera.position.x = Math.cos(time) * 8;
        this.camera.position.z = Math.sin(time) * 8;
        this.camera.lookAt(this.character.position);
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialiser le jeu quand la page est chargée
document.addEventListener('DOMContentLoaded', () => {
    new Game3D();
});