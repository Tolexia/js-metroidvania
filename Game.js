import Context from './Context.js';
import LevelManager from './LevelManager.js';
import Player from './Player.js';
import Zombie from './Zombie.js';
import levelData from './levels.js';

// =================================================================
// MAIN GAME CLASS (Game)
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
        
        // Window resize handler
        this.setupWindowHandlers();
    }

    setupWindowHandlers() {
        // Page visibility handler
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.isPaused = true;
                this.lastTime = 0; // Reset time to avoid large deltaTime
            } else {
                this.isPaused = false;
            }
        });

        // Window focus handler
        window.addEventListener('focus', () => {
            this.isPaused = false;
                this.lastTime = 0; // Reset time
        });

        window.addEventListener('blur', () => {
            this.isPaused = true;
        });
    }

    resetGame() {
        console.log("Collision with enemy! Restarting...");
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
        console.log(`Loading room: ${roomId}`);
        const newEntities = this.levelManager.loadRoom(roomId);
        this.entities = [this.player, ...newEntities];
        
        this.player.x = playerStartX;
        this.player.y = playerStartY;
        this.player.velocityX = 0;
        this.player.velocityY = 0;
    }

    gameLoop(timestamp) {
        // If game is paused, continue loop without updating
        if (this.isPaused) {
            requestAnimationFrame(this.gameLoop.bind(this));
            return;
        }

        // NEW: Calculate deltaTime and normalization factor
        const deltaTime = this.lastTime === 0 ? 0 : timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        // Limit deltaTime to avoid position jumps
        const clampedDeltaTime = Math.min(deltaTime, 50); // Reduced from 100ms to 50ms
        
        // Normalize relative to 60 FPS frame (approximately 16.67ms)
        // If game runs at 30 FPS, dtFactor will be ~2. If it runs at 120 FPS, ~0.5.
        const dtFactor = clampedDeltaTime / (1000 / 60);

        // 1. Update all entities passing dtFactor
        this.entities.forEach(entity => entity.update(this, dtFactor));
        
        // 2. Check player collisions
        this.checkPlayerCollisions();

        // 3. Draw everything
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