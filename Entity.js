// =================================================================
// CLASSE DE BASE "ABSTRAITE" (Entity)
// =================================================================
class Entity {
    constructor(config, x, y, width, height, color, levelManager) {
        this.config = config;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.levelManager = levelManager;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isOnGround = false;
    }

    // NEW: Le facteur de temps (deltaTime) est maintenant passé en argument
    applyPhysics(dtFactor) {
        this.velocityY += this.config.GRAVITY * dtFactor;
        this.y += this.velocityY * dtFactor;
        this.x += this.velocityX * dtFactor;
    }
    
    // NEW: Le facteur de temps (deltaTime) est maintenant passé en argument
    handleCollisions(dtFactor) {
        const TILE_SIZE = this.config.TILE_SIZE;
        
        // On calcule la prochaine position en fonction du dtFactor
        let nextX = this.x + this.velocityX * dtFactor;
        if (this.velocityX < 0) {
            if (this.levelManager.getTile(nextX, this.y) !== 0 || this.levelManager.getTile(nextX, this.y + this.height - 1) !== 0) {
                this.x = Math.floor(nextX / TILE_SIZE) * TILE_SIZE + TILE_SIZE;
                this.velocityX = 0;
            }
        }
        if (this.velocityX > 0) {
            if (this.levelManager.getTile(nextX + this.width, this.y) !== 0 || this.levelManager.getTile(nextX + this.width, this.y + this.height - 1) !== 0) {
                this.x = Math.floor((nextX + this.width) / TILE_SIZE) * TILE_SIZE - this.width;
                this.velocityX = 0;
            }
        }
        
        let nextY = this.y + this.velocityY * dtFactor;
        this.isOnGround = false;
        if (this.velocityY < 0) {
            if (this.levelManager.getTile(this.x, nextY) !== 0 || this.levelManager.getTile(this.x + this.width - 1, nextY) !== 0) {
                this.y = Math.floor(nextY / TILE_SIZE) * TILE_SIZE + TILE_SIZE;
                this.velocityY = 0;
            }
        }
        if (this.velocityY > 0) {
            if (this.levelManager.getTile(this.x, nextY + this.height) !== 0 || this.levelManager.getTile(this.x + this.width - 1, nextY + this.height) !== 0) {
                this.y = Math.floor((nextY + this.height) / TILE_SIZE) * TILE_SIZE - this.height;
                this.velocityY = 0;
                this.isOnGround = true;
            }
        }
    }

    update(game, dtFactor) {
        this.applyPhysics(dtFactor);
        this.handleCollisions(dtFactor);
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        if (this.config.DEBUG) {
            ctx.strokeStyle = 'lime';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
}

export default Entity;