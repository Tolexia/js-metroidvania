import Entity from './Entity.js';

// =================================================================
// CLASSE ENNEMI (Zombie)
// =================================================================
class Zombie extends Entity {
    constructor(config, x, y, levelManager) {
        super(config, x, y, config.TILE_SIZE * 0.8, config.TILE_SIZE * 0.9, '#FF0000', levelManager);
        this.direction = 1;
    }

    patrol() {
        this.velocityX = this.config.ZOMBIE_SPEED * this.direction;
        if (this.velocityX === 0) {
            this.direction *= -1;
        }
        const TILE_SIZE = this.config.TILE_SIZE;
        const frontX = this.direction > 0 ? this.x + this.width : this.x;
        const tileBelowFront = this.levelManager.getTile(frontX, this.y + this.height + 1);
        if (this.isOnGround && tileBelowFront === 0) {
            this.direction *= -1;
        }
    }

    update(game, dtFactor) {
        this.patrol();
        super.update(game, dtFactor);
    }
}

export default Zombie;