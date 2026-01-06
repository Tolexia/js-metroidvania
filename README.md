# Metroidvania JS

A Metroidvania platformer game developed in vanilla JavaScript with HTML5 Canvas.  

## Preview

![screenshot](./screenshot.png)

## 🎮 Features

- **Smooth movement** : Horizontal movement, jumping, and dash system
- **Room system** : Navigation between multiple interconnected rooms via doors
- **Enemies** : Patrolling zombies with collision detection
- **Physics** : Gravity, friction, and tile-based collisions
- **Level editor** : Built-in tool to create and modify levels

## 🚀 Installation

No installation required. Simply open `index.html` in a modern browser.

```bash
# Optional: serve via a local server
python -m http.server 8000
# Then open http://localhost:8000/index.html
```

## 🎯 Controls

- **Left/Right Arrow Keys** : Horizontal movement
- **Space** : Jump
- **Shift + Left/Right Arrow Keys** : Dash (with cooldown)

## 📁 Project Structure

```
├── index.html          # Main entry point
├── level-editor.html   # Visual level editor
├── Game.js             # Main game class
├── Player.js           # Player logic
├── Entity.js           # Base class for entities
├── Zombie.js           # Zombie enemy
├── LevelManager.js     # Level and room manager
├── levels.js           # Level data (rooms, doors, entities)
└── Context.js          # Game configuration and constants
```

## 🛠️ Technologies

- JavaScript ES6+ (modules)
- HTML5 Canvas
- CSS3

## 📝 Notes

The game uses a deltaTime system to ensure consistent physics regardless of framerate. Collisions are handled at the tile level for crisp pixel-art rendering.
