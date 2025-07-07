# ⚔️ Combat Arena 3D - Jeu de Combat Épique

Un jeu de combat 3D révolutionnaire où vous contrôlez un héros puissant avec des commandes textuelles en français ! Affrontez des ennemis démoniaques avec des pouvoirs magiques spectaculaires et des animations fluides.

## 🎮 Comment jouer

1. **Ouvrez `index.html`** dans votre navigateur ou démarrez le serveur local
2. **Tapez vos actions de combat** dans le champ de texte
3. **Surveillez vos barres de vie et d'énergie** en haut à gauche
4. **Consultez le journal de combat** pour suivre l'action

## ⚡ Pouvoirs Épiques Disponibles

### 🔥 **Attaques Magiques**
- **boule de feu** / **fireball** - Projectile de feu dévastateur (25 énergie)
- **éclair** / **lightning** - Attaque électrique instantanée (30 énergie)
- **nova** / **explosion** - Explosion de zone massive (40 énergie)
- **ultimate** / **pouvoir final** - Attaque apocalyptique ultime (80 énergie)

### ⚔️ **Combat Physique**
- **attaquer** / **frapper** - Attaque à l'épée énergétique (10 énergie)
- **attaque critique** - 20% de chance de dégâts doubles !

### 🛡️ **Défense & Soutien**
- **bouclier** / **défense** - Protection magique temporaire (20 énergie)
- **soin** / **heal** - Récupération de points de vie (20 énergie)
- **téléportation** / **dash** - Déplacement instantané (15 énergie)

### 🏃 **Mouvements Tactiques**
- **avancer**, **reculer**, **gauche**, **droite** - Déplacements de base
- **sauter** - Saut héroïque
- **esquiver** - Esquive rapide
- **roulade** - Roulade tactique avec rotation

## ✨ Fonctionnalités Épiques

### 🎨 **Graphismes 3D Avancés**
- **Héros détaillé** : Armure, casque, cape et épée énergétique
- **Ennemi démoniaque** : Créature avec cornes, griffes et aura sombre
- **Arène mystique** : Cercles magiques et piliers énergétiques
- **Effets de particules** : Explosions, éclairs, soins lumineux

### 🎭 **Animations Fluides**
- **Attaques dynamiques** : Rotation d'épée, projectiles volants
- **Effets visuels** : Écrans d'éclairs, explosions de feu
- **Secousses d'impact** : Personnages qui tremblent lors des coups critiques
- **Caméra cinématographique** : Rotation automatique autour de l'action

### 🤖 **IA Ennemie Intelligente**
- **Attaques variées** : Coups physiques et explosions sombres
- **Auto-soins** : L'ennemi se soigne quand ses HP sont bas
- **Combat automatique** : Tours d'ennemi toutes les 3 secondes

### 💡 **Interface Immersive**
- **Barres de vie animées** : Effets de brillance et couleurs dynamiques
- **Orbe d'énergie** : Indicateur visuel qui change de couleur
- **Journal de combat** : Historique détaillé des actions
- **Feedback visuel** : Messages de succès, erreur et critique

## 🎯 Système de Combat

### ⚡ **Gestion de l'Énergie**
- **Régénération** : +2 énergie par seconde automatiquement
- **Coûts variables** : Attaques simples (10) aux ultimates (80)
- **Stratégie** : Gérez votre énergie pour les moments cruciaux

### � **Statistiques de Combat**
- **HP Héros** : 100 points de vie
- **HP Ennemi** : 100 points de vie
- **Défense** : Réduit les dégâts subis
- **Attaque critique** : Dégâts doublés avec secousses

### 🏆 **Victoire et Défaite**
- **Conditions** : Réduisez les HP de l'ennemi à 0
- **Auto-restart** : Nouveau combat après 5 secondes
- **Score permanent** : Suivez vos victoires

## 🚀 Démarrage Ultra-Rapide

```bash
# Démarrer le serveur (déjà lancé)
python3 -m http.server 8000

# Ouvrir dans le navigateur
http://localhost:8000
```

## 🛠️ Technologies de Pointe

- **Three.js** - Moteur 3D WebGL haute performance
- **JavaScript ES6** - Logique de combat avancée avec IA
- **CSS3 Animations** - Effets visuels et transitions fluides
- **HTML5 Canvas** - Rendu graphique accéléré
- **Programmation orientée objet** - Architecture modulaire

## 🎪 Exemples de Commandes

```
// Attaques de base
"attaquer" → Coup d'épée (10 énergie)
"boule de feu" → Projectile enflammé (25 énergie)

// Pouvoirs avancés
"éclair" → Attaque électrique (30 énergie)
"nova" → Explosion massive (40 énergie)
"ultimate" → Dévastation totale (80 énergie)

// Soutien tactique
"bouclier" → Protection +10 défense (20 énergie)
"soin" → Récupération HP (20 énergie)
"téléportation" → Déplacement instantané (15 énergie)

// Mouvements
"avancer", "esquiver", "roulade", "sauter"
```

## � Architecture du Jeu

- `index.html` - Interface de combat avec barres de vie
- `style.css` - Design futuriste avec effets lumineux
- `combat-script.js` - Moteur de combat 3D complet
- `README.md` - Guide du guerrier épique

## � Personnalisation Avancée

### Ajouter de Nouveaux Pouvoirs
1. Étendre le dictionnaire `synonyms` 
2. Ajouter un case dans `processAction()`
3. Créer la méthode d'animation correspondante
4. Définir coût en énergie et effets visuels

### Modifier les Modèles 3D
- Éditer `createPlayer()` et `createEnemy()`
- Ajuster géométries, matériaux et positions
- Créer nouvelles animations dans les méthodes `animate*()`

**Préparez-vous au combat légendaire ! ⚔️🔥**