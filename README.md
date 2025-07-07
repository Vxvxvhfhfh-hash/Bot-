# Jeu 3D - Contrôle par Texte

Un jeu web interactif où vous contrôlez un personnage 3D en tapant des actions en français !

## 🎮 Comment jouer

1. **Démarrer le jeu** : Ouvrez `index.html` dans votre navigateur ou utilisez un serveur local
2. **Contrôler le personnage** : Tapez des actions dans le champ de texte et appuyez sur "Exécuter" ou "Entrée"

## 🎯 Actions disponibles

- **avancer** / **aller devant** / **marcher** - Le personnage avance
- **reculer** / **aller derrière** / **arrière** - Le personnage recule  
- **gauche** / **aller à gauche** - Le personnage va à gauche
- **droite** / **aller à droite** - Le personnage va à droite
- **sauter** / **faire un saut** / **saut** - Le personnage saute
- **tourner** / **pivoter** - Le personnage tourne sur lui-même
- **danser** / **dance** - Le personnage fait une petite danse !

## 🚀 Démarrage rapide

```bash
# Cloner ou télécharger le projet
# Démarrer un serveur local (optionnel)
python3 -m http.server 8000

# Ouvrir dans le navigateur
# http://localhost:8000
```

## 🛠️ Technologies utilisées

- **HTML5** - Structure de la page
- **CSS3** - Design moderne et responsive
- **JavaScript ES6** - Logique du jeu
- **Three.js** - Rendu 3D et animations
- **WebGL** - Accélération graphique

## ✨ Fonctionnalités

- 🎨 Personnage 3D entièrement modélisé avec des formes géométriques
- 🌍 Environnement 3D avec sol, éclairage et objets décoratifs
- 🎭 Animations fluides et naturelles
- 📝 Système de reconnaissance de texte en français
- 🎪 Caméra rotative automatique autour du personnage
- 💡 Interface utilisateur moderne et intuitive
- 📱 Design responsive (fonctionne sur mobile)

## 🔧 Architecture du code

- `index.html` - Page principale du jeu
- `style.css` - Styles et animations CSS
- `script.js` - Moteur de jeu 3D et logique de contrôle
- `README.md` - Documentation du projet

## 🎪 Personnalisation

Vous pouvez facilement ajouter de nouvelles actions en modifiant :
1. Le dictionnaire `synonyms` dans la fonction `normalizeAction()`
2. Les cas dans la fonction `processAction()`
3. Créer de nouvelles méthodes d'animation

Amusez-vous bien ! 🎮