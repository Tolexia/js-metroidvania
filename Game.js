import Context from './Context.js';
import LevelManager from './LevelManager.js';
import Player from './Player.js';
import Zombie from './Zombie.js';
import levelData from './levels.js';

// =================================================================
// CLASSE PRINCIPALE DU JEU (Game)
// =================================================================
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.config = new Context();
        
        this.canvas.width = this.config.CANVAS_WIDTH;
        this.canvas.height = this.config.CANVAS_HEIGHT;

        this.levelManager = new LevelManager(this.config, levelData);
        this.player = new Player(this.config, 100, 100, this.levelManager);
        this.entities = [];
        this.lastTime = 0;
        this.isPaused = false;

        this.initialPlayerX = 100;
        this.initialPlayerY = 400;
        this.initialRoom = 'start_room';
        
        // Gestionnaire pour le redimensionnement de la fenêtre
        this.setupWindowHandlers();
    }

    setupWindowHandlers() {
        // Gestionnaire pour la visibilité de la page
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.isPaused = true;
                this.lastTime = 0; // Reset du temps pour éviter les gros deltaTime
            } else {
                this.isPaused = false;
            }
        });

        // Gestionnaire pour le focus de la fenêtre
        window.addEventListener('focus', () => {
            this.isPaused = false;
            this.lastTime = 0; // Reset du temps
        });

        window.addEventListener('blur', () => {
            this.isPaused = true;
        });
    }

    resetGame() {
        console.log("Collision avec un ennemi ! Redémarrage...");
        this.loadRoom(this.initialRoom, this.initialPlayerX, this.initialPlayerY);
    }
    
    checkPlayerCollisions() {
        for (const entity of this.entities) {
            if (entity instanceof Zombie) {
                if (this.player.x < entity.x + entity.width &&
                    this.player.x + this.player.width > entity.x &&
                    this.player.y < entity.y + entity.height &&
                    this.player.y + this.player.height > entity.y)
                {
                    this.resetGame();
                    return;
                }
            }
        }
    }

    loadRoom(roomId, playerStartX, playerStartY) {
        console.log(`Chargement de la salle: ${roomId}`);
        const newEntities = this.levelManager.loadRoom(roomId);
        this.entities = [this.player, ...newEntities];
        
        this.player.x = playerStartX;
        this.player.y = playerStartY;
        this.player.velocityX = 0;
        this.player.velocityY = 0;
    }

    gameLoop(timestamp) {
        // Si le jeu est en pause, on continue la boucle sans mettre à jour
        if (this.isPaused) {
            requestAnimationFrame(this.gameLoop.bind(this));
            return;
        }

        // NEW: Calcul du deltaTime et du facteur de normalisation
        const deltaTime = this.lastTime === 0 ? 0 : timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        // Limiter le deltaTime pour éviter les sauts de position
        const clampedDeltaTime = Math.min(deltaTime, 50); // Réduit de 100ms à 50ms
        
        // On normalise par rapport à une frame de 60 FPS (environ 16.67ms)
        // Si le jeu tourne à 30 FPS, dtFactor sera ~2. S'il tourne à 120 FPS, ~0.5.
        const dtFactor = clampedDeltaTime / (1000 / 60);

        // 1. Mettre à jour toutes les entités en passant le dtFactor
        this.entities.forEach(entity => entity.update(this, dtFactor));
        
        // 2. Vérifier les collisions du joueur
        this.checkPlayerCollisions();

        // 3. Dessiner le tout
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.levelManager.draw(this.ctx);
        this.entities.forEach(entity => entity.draw(this.ctx));

        requestAnimationFrame(this.gameLoop.bind(this));
    }

    start() {
        this.loadRoom(this.initialRoom, this.initialPlayerX, this.initialPlayerY);
        this.gameLoop(0);
    }
}

export default Game;