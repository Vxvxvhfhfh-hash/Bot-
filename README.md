# 🌍⚔️ Univers 3D Épique - Collection de Jeux de Combat

Une collection révolutionnaire de jeux 3D en français avec support complet des joysticks et commandes textuelles ! Explorez des mondes fantastiques, combattez des démons et maîtrisez la magie.

## 🎮 Deux Expériences Uniques

### ⚔️ **Combat Arena 3D** - Combat d'Arène Intense
Affrontez des démons dans une arène magique avec des pouvoirs spectaculaires !

### 🌍 **Monde Ouvert 3D** - Aventure Épique 
Explorez un vaste monde avec votre manette, accomplissez des quêtes et progressez !

## 🚀 Démarrage Ultra-Rapide

```bash
# Le serveur est déjà lancé !
# Ouvrez votre navigateur à :
http://localhost:8000/launcher.html
```

## 🎮 Support Complet Joystick/Manette

### 🎯 **Manettes Compatibles**
- ✅ PlayStation 4/5 (DualShock/DualSense)
- ✅ Xbox One/Series (toutes versions)
- ✅ Manettes PC génériques
- ✅ Nintendo Pro Controller
- ✅ Détection automatique temps réel

### �️ **Contrôles Manette Universels**
- **Stick Gauche** → Déplacement du personnage
- **Stick Droit** → Rotation de la caméra libre
- **A/X** → Saut héroïque
- **B/Carré** → Attaque à l'épée
- **Y/Triangle** → Magie/Projectiles
- **LB/L1** → Esquive rapide
- **RB/R1** → Bouclier magique
- **LT/L2** → Course (speed boost)
- **D-Pad** → Raccourcis d'actions

## 🌍 Monde Ouvert 3D - Fonctionnalités

### 🏞️ **Exploration Libre**
- **Terrain procédural** de 200x200 unités
- **Génération dynamique** de collines et vallées
- **30+ arbres magiques** répartis aléatoirement
- **50+ rochers** et éléments décoratifs
- **Limites de monde** invisibles mais sécurisées

### 🎯 **Système de Quêtes**
- 🐉 **Éliminer 5 démons** dans la région
- 💎 **Collecter 3 cristaux** de pouvoir magique
- ⭐ **Progression en temps réel** dans l'interface
- 🏆 **Récompenses** : XP, objets, amélioration stats

### 📊 **Système de Progression**
- **Niveaux illimités** avec montée en puissance
- **Points de vie** : 100 de base, +20 par niveau
- **Mana magique** : 100 de base, +15 par niveau
- **Expérience** : +100 par démon, seuil croissant
- **Régénération automatique** de mana

### 🗺️ **Mini-Carte Temps Réel**
- **Position du joueur** en bleu
- **Ennemis vivants** en rouge
- **Cristaux non collectés** en cyan
- **Mise à jour 60 FPS** fluide
- **Zoom automatique** centré sur le joueur

### 🤖 **IA Ennemie Avancée**
- **15 démons** répartis dans le monde
- **Détection de proximité** : attaque si < 25 unités
- **Mouvement intelligent** vers le joueur
- **Rotation automatique** pour faire face
- **Animations d'aura** sombre en continu

## ⚔️ Combat Arena 3D - Fonctionnalités

### 🔥 **Pouvoirs Magiques Épiques**
- **Boule de feu** → Projectile avec explosion de particules
- **Éclair divin** → Attaque électrique avec flash écran
- **Nova dévastatrice** → Explosion de zone massive  
- **Ultimate** → Séquence apocalyptique multi-phases

### 🎭 **Animations Spectaculaires**
- **Rotation d'épée** pour attaques physiques
- **Projectiles volants** avec trajectoires fluides
- **Particules de soin** vertes convergentes
- **Secousses d'impact** pour coups critiques
- **Effets plein écran** pour sorts puissants

### 🤖 **IA de Combat**
- **Attaques automatiques** toutes les 3 secondes
- **Soins intelligents** quand HP < 50%
- **Explosions sombres** dévastatrices
- **Auto-restart** après victoire/défaite

## 💬 Système de Commandes Textuelles

### 🎯 **Actions de Combat**
```
"attaquer" / "frapper" → Attaque épée
"boule de feu" / "fireball" → Sort de feu
"éclair" / "lightning" → Attaque électrique
"bouclier" / "défense" → Protection magique
"soin" / "heal" → Récupération HP
"téléportation" / "dash" → Déplacement instantané
"ultimate" / "pouvoir final" → Super attaque
```

### 🏃 **Mouvements & Actions**
```
"avancer" / "reculer" / "gauche" / "droite"
"sauter" / "esquiver" / "roulade"
"ramasser" / "collecter" / "interagir"
```

### ✨ **Synonymes Intelligents**
Le système reconnaît les variations :
- "attaque", "attaquer", "frapper", "hit"
- "magie", "sort", "projectile", "magic"
- "défense", "bouclier", "protection", "shield"

## 🛠️ Technologies de Pointe

### 🎨 **Moteur 3D**
- **Three.js r128** - Dernier moteur WebGL
- **Ombres PCF** douces haute qualité
- **Fog atmosphérique** pour la profondeur
- **4096x4096** shadow maps ultra-détaillées

### 🎮 **APIs Natives**
- **Gamepad API** HTML5 standard
- **RequestAnimationFrame** 60 FPS garantis
- **Canvas 2D** pour la mini-carte
- **WebGL 2.0** accélération graphique

### �️ **Architecture**
- **Programmation orientée objet** ES6+
- **Gestion d'état centralisée** pour les stats
- **Système d'événements** asynchrone
- **Optimisations de performance** automatiques

## � Structure du Projet

```
📂 Univers 3D Épique/
├── 🚀 launcher.html          # Sélecteur de jeu principal
├── ⚔️ index.html            # Combat Arena 3D
├── 🌍 open-world.html       # Monde Ouvert 3D
├── 🎨 style.css             # Styles Combat Arena
├── 🎨 open-world-style.css  # Styles Monde Ouvert
├── ⚙️ combat-script.js      # Moteur Combat Arena
├── ⚙️ open-world-game.js    # Moteur Monde Ouvert
└── 📖 README.md             # Guide complet
```

## 🎮 Guide de Jeu Complet

### 🌍 **Monde Ouvert - Première Session**
1. **Connectez votre manette** (détection auto)
2. **Explorez librement** avec le stick gauche
3. **Caméra libre** avec stick droit ou souris
4. **Trouvez les démons rouges** sur la mini-carte
5. **Collectez les cristaux cyan** pour la mana
6. **Utilisez Y/Triangle** pour magie à distance
7. **Montez de niveau** en tuant des ennemis

### ⚔️ **Combat Arena - Mastery**
1. **Gérez votre énergie** (régénération auto)
2. **Enchainez les attaques** selon les cooldowns
3. **Esquivez les explosions** sombres
4. **Soignez-vous** quand HP critique
5. **Chargez l'ultimate** pour 80 énergie
6. **Maîtrisez les timings** d'attaque

## 🏆 Objectifs & Achievements

### 🎯 **Défis Monde Ouvert**
- 🐉 Éliminer 5 démons → Quête principale
- 💎 Récolter 3 cristaux → Quête collection  
- ⭐ Atteindre niveau 5 → Maîtrise progression
- 🗺️ Explorer 4 coins du monde → Explorateur
- 🔮 Lancer 50 sorts → Mage puissant

### ⚔️ **Défis Combat Arena**
- 🔥 10 victoires consécutives → Champion
- ⚡ 5 ultimates en un combat → Maître mage
- 🛡️ Survivre 2 min sans dégâts → Tank parfait
- 💀 Coup critique fatal → Guerrier létal

## 🔧 Personnalisation Avancée

### 🎮 **Contrôles Personnalisables**
Modifiez `processGamepadInput()` pour remapper :
```javascript
// Exemple : inverser les sticks
const leftStickX = this.gamepad.axes[2];  // Stick droit → mouvement
const rightStickX = this.gamepad.axes[0]; // Stick gauche → caméra
```

### 🌍 **Génération de Monde**
Ajustez `generateTerrain()` pour modifier :
- Taille du monde (`this.worldSize`)
- Hauteur des collines (coefficients `Math.sin`)
- Nombre d'ennemis/cristaux

### ⚔️ **Équilibrage Combat**
Personnalisez dans les stats :
- Dégâts d'attaque (`playerStats.attack`)
- Coûts en mana des sorts
- Vitesse de régénération

## 🌟 Fonctionnalités Futures

### 🔮 **Roadmap Technique**
- 🏠 **Multijoueur local** écran partagé
- 🎵 **Audio spatial** 3D immersif  
- 🌅 **Cycle jour/nuit** dynamique
- 🏰 **Donjons procéduraux** instanciés
- 📱 **Support mobile** tactile

### 🎨 **Améliorations Visuelles**
- 🌊 **Shaders avancés** eau/feu
- 🌫️ **Système de particules** dense
- 🌈 **Post-processing** effets
- 🦋 **Animations skeletal** complexes

---

**🚀 Prêt pour l'aventure épique ? Connectez votre manette et lancez-vous ! 🎮✨**

**⚡ Performance garantie 60 FPS | 🎨 Graphismes immersifs | 🔥 Combats légendaires**