# � Combat 3D - Plateforme de Jeu Complète

Système de jeu 3D épique avec support multi-plateforme : **Arena Combat**, **Monde Ouvert**, et **Version Mobile Android** !

## 🚀 Versions Disponibles

### 📱 **Version Mobile Android** (NOUVEAU!)
**Fichier:** `mobile.html`
- **Contrôles tactiles optimisés** avec joysticks virtuels fluides
- **Interface mobile adaptive** pour tous les écrans Android
- **Retour haptique** (vibrations) pour une immersion totale
- **PWA installable** - Ajoutez à l'écran d'accueil !
- **Paramètres d'optimisation** pour performances mobiles
- **Mode portrait/paysage** automatique

#### Contrôles Mobile :
- **Joystick gauche** : Déplacement du personnage
- **Joystick droit** : Rotation de la caméra
- **Boutons d'action** : Attaque, Magie, Saut, Bouclier, Soin, Ultimate
- **Double-tap** : Ouvre le modal de commandes textuelles
- **Menu paramètres** : Sensibilité, taille boutons, qualité graphique

### ⚔️ **Combat Arena 3D**
**Fichier:** `index.html`
- Combat en arène focalisé avec démons
- Système de pouvoirs magiques (Boule de feu, Foudre, Nova, Ultimate)
- Gestion d'énergie et cooldowns
- Effets visuels spectaculaires
- Commandes textuelles en français

### � **Monde Ouvert 3D**
**Fichier:** `open-world.html`
- Terrain procédural immense (200x200 unités)
- Support complet manettes PlayStation/Xbox/Nintendo
- Système RPG avec niveaux et XP
- 15 démons IA intelligente + 8 cristaux magiques
- Mini-carte temps réel
- Système de quêtes dynamiques

## 🎯 Lanceur de Jeux
**Fichier:** `launcher.html`
Interface centrale permettant de choisir entre les 3 versions du jeu avec aperçu des fonctionnalités.

## 🛠️ Installation et Lancement

### Méthode 1 : Serveur Local
```bash
# Démarrer le serveur HTTP
python3 -m http.server 8000

# Ouvrir dans le navigateur
http://localhost:8000/launcher.html
```

### Méthode 2 : PWA Mobile (Android)
1. Ouvrir `http://localhost:8000/mobile.html` sur Android
2. Menu navigateur → "Ajouter à l'écran d'accueil"
3. L'application sera installée comme app native !

## 🎮 Contrôles Universels

### �️ Manette (PS4/PS5/Xbox/Nintendo Pro)
- **Stick gauche** : Déplacement
- **Stick droit** : Caméra
- **A/X** : Saut
- **B/Carré** : Attaque
- **Y/Triangle** : Magie
- **X/Croix** : Bouclier
- **RB/R1** : Ultimate
- **Gâchettes** : Actions spéciales

### ⌨️ Clavier & Souris
- **WASD** : Déplacement
- **Souris** : Caméra
- **Espace** : Saut
- **Clic gauche** : Attaque
- **E** : Magie
- **Q** : Bouclier
- **R** : Soin
- **T** : Ultimate

### 📱 Mobile (Tactile)
- **Joysticks virtuels** : Mouvement + Caméra
- **Boutons tactiles** : Toutes les actions
- **Double-tap** : Commandes texte
- **Paramètres** : Sensibilité et qualité

### 💬 Commandes Textuelles (Français)
Tapez directement vos actions :
- `attaquer` / `attaque` / `frapper`
- `boule de feu` / `feu` / `magie`
- `foudre` / `éclair` / `lightning`
- `nova` / `explosion`
- `soin` / `guérison`
- `saut` / `sauter`
- `bouclier` / `défense`
- `ultimate` / `ultime` / `super`

## ⚡ Fonctionnalités Techniques

### � Graphismes 3D Avancés
- **Three.js r128** avec WebGL
- **Ombres dynamiques** et éclairage réaliste
- **Effets de particules** magiques
- **Animations fluides** et transitions
- **Optimisations mobiles** adaptatives

### � Effets Immersifs
- **Effets d'écran** (dégâts, soins, magie)
- **Vibrations haptiques** (mobile)
- **Animations de feedback** visuelles
- **Particules explosives** pour les sorts

### � Système de Combat
- **HP/Mana** avec régénération automatique
- **Système de cooldowns** pour équilibrer
- **Niveaux et XP** avec progression
- **IA ennemie** réactive et agressive
- **Détection de collision** précise

### 📊 Optimisations Performance
- **Qualité graphique** ajustable (Mobile)
- **LOD** (Level of Detail) adaptatif
- **Culling** automatique des objets
- **60 FPS** stable sur tous supports

## 🌟 Architecture du Code

### � Structure des Fichiers
```
├── launcher.html          # 🎯 Interface de sélection
├── index.html            # ⚔️ Combat Arena
├── open-world.html       # 🌍 Monde Ouvert  
├── mobile.html           # 📱 Version Android
├── mobile-style.css      # 🎨 Styles mobiles
├── mobile-game.js        # 🎮 Moteur mobile
├── manifest.json         # 📱 PWA manifest
└── README.md            # 📚 Documentation
```

### �️ Classes Principales
- **`MobileGame`** : Moteur principal version tactile
- **`CombatGame`** : Système de combat arena
- **`OpenWorldGame`** : Moteur monde ouvert
- **`VirtualControls`** : Gestion joysticks virtuels
- **`TouchHandler`** : Événements tactiles
- **`PerformanceManager`** : Optimisations mobiles

## 🚀 Fonctionnalités Avancées

### 📱 PWA (Progressive Web App)
- **Installation native** sur Android
- **Mode hors-ligne** partiel
- **Icônes adaptatives** pour launcher
- **Thème système** intégré
- **Gestion orientation** automatique

### � Système de Quêtes (Monde Ouvert)
- **"Éliminer 5 démons"** avec compteur temps réel
- **"Collecter 3 cristaux"** magiques dispersés
- **Récompenses XP** et progression niveaux
- **Respawn automatique** des ennemis/cristaux

### 🗺️ Mini-Carte Interactive
- **Position joueur** (point bleu)
- **Ennemis actifs** (points rouges)
- **Cristaux disponibles** (points cyan)
- **Mise à jour temps réel** 60fps

### ⚙️ Paramètres Adaptatifs
- **Sensibilité caméra** (0.5x à 3x)
- **Taille boutons** (80% à 150%)
- **Qualité graphique** :
  - Économie batterie (shadows off, low pixel ratio)
  - Équilibré (shadows medium, standard)
  - Haute qualité (shadows high, max pixel ratio)
- **Vibrations on/off** avec patterns personnalisés

## � Résumé des Innovations

### 🎮 **Support Multi-Contrôleurs**
Premier jeu web 3D avec support **simultané** :
- Manettes professionnelles (deadzone, mapping)
- Contrôles clavier/souris précis
- Joysticks tactiles fluides
- Commandes textuelles françaises

### 📱 **Optimisations Mobile**
- Interface **100% tactile** sans compromis
- **PWA installable** comme app native
- **Performances 60fps** même sur appareils moyens
- **Gestion batterie** intelligente

### 🌍 **Monde Procédural**
- **200x200 unités** de terrain généré
- **15 démons IA** avec comportements uniques
- **Système respawn** dynamique
- **Mini-carte** en temps réel

### ⚡ **Effets Visuels**
- **Particules magiques** Three.js avancées
- **Ombres dynamiques** avec PCF soft shadows
- **Post-processing** d'écran (damage, heal)
- **Auras animées** et matériaux émissifs

## 🎯 Utilisation Recommandée

### 📱 **Mobile Android**
Idéal pour gaming mobile avec installation PWA
```bash
http://localhost:8000/mobile.html
```

### 🕹️ **Manette + TV**
Mode monde ouvert avec manette PS5/Xbox
```bash
http://localhost:8000/open-world.html
```

### 💻 **Desktop/Laptop**
Combat arena précis clavier/souris
```bash
http://localhost:8000/index.html
```

---

## 🚀 **SERVEUR DÉMARRÉ**
```
� Serveur HTTP actif sur : http://localhost:8000
📱 Version mobile PWA : http://localhost:8000/mobile.html
🎯 Lanceur central : http://localhost:8000/launcher.html
```

**Développé avec ❤️ using Three.js, WebGL, PWA technologies**