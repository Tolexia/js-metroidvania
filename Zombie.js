import Entity from './Entity.js';

// =================================================================
// ENEMY CLASS (Zombie)
// =================================================================
class Zombie extends Entity {
    constructor(config, x, y, levelManager) {
        super(config, x, y, config.TILE_SIZE * 0.8, config.TILE_SIZE * 0.9, '#FF0000', levelManager);
        this.direction = 1;
    }

    patrol() {
        this.velocityX = this.config.ZOMBIE_SPEED * this.direction;
        
        const TILE_SIZE = this.config.TILE_SIZE;

        const frontX = this.direction > 0 ? this.x + this.width : this.x;
        const tileBelowFront = this.levelManager.getTile(frontX, this.y + this.height + 1);
        const tileFront = this.levelManager.getTile(this.x + this.direction, this.y);
        
        if (this.isOnGround && (tileBelowFront === 0 || tileFront === 1)) {
            this.direction *= -1;
        }
    }

    update(game, dtFactor) {
        this.patrol();
        super.update(game, dtFactor);
        if (this.velocityX === 0) {
            this.direction *= -1;
        }
    }
}

export default Zombie;