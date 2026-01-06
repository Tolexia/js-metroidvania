import Entity from './Entity.js';

// =================================================================
// PLAYER CLASS (Player)
// =================================================================
class Player extends Entity {
    constructor(config, x, y, levelManager) {
        super(config, x, y, config.TILE_SIZE * 0.8, config.TILE_SIZE * 0.95, '#00FFFF', levelManager);
        this.keys = {};
        this.setupControls();
        
        // Variables for dash system
        this.isDashing = false;
        this.dashDirection = 0; // -1 for left, 1 for right
        this.dashTimer = 0;
        this.dashCooldown = 0;
    }

    setupControls() {
        window.addEventListener('keydown', (e) => this.keys[e.code] = true);
        window.addEventListener('keyup', (e) => this.keys[e.code] = false);
    }

    handleInput() {
        // Dash handling
        if (this.dashCooldown > 0) {
            this.dashCooldown--;
        }
        
        if (this.isDashing) {
            console.log("Dashing");
            this.dashTimer--;

            this.velocityX = this.dashDirection * this.config.DASH_SPEED;
            this.velocityY = 0;
            if (this.dashTimer <= 0) {
                this.isDashing = false;
                this.velocityX = 0;
            }
        } else {
            // Dash with Shift + left/right arrow
            if (this.dashCooldown <= 0 && (this.keys['ShiftLeft'] || this.keys['ShiftRight'])) {
                if (this.keys['ArrowLeft']) {
                    this.startDash(-1);
                } else if (this.keys['ArrowRight']) {
                    this.startDash(1);
                }
            }
            
            // Normal movement
            if (this.keys['ArrowLeft']) {
                this.velocityX = -this.config.PLAYER_SPEED;
            } else if (this.keys['ArrowRight']) {
                this.velocityX = this.config.PLAYER_SPEED;
            } else {
                this.velocityX *= this.config.FRICTION;
            }
        }
        
        if (this.keys['Space'] && this.isOnGround) {
            this.velocityY = this.config.PLAYER_JUMP_FORCE;
            this.isOnGround = false;
        }
    }
    
    startDash(direction) {
        this.isDashing = true;
        this.dashDirection = direction;
        this.dashTimer = this.config.DASH_DURATION;
        this.dashCooldown = this.config.DASH_COOLDOWN;
        this.velocityX = direction * this.config.DASH_SPEED;
        this.velocityY = 0;
    }
    
    checkDoors(game) {
        const TILE_SIZE = this.config.TILE_SIZE;
        const doors = this.levelManager.getDoors();
        for (const door of doors) {
            const doorRect = { x: door.x * TILE_SIZE, y: door.y * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE };
            if (this.x < doorRect.x + doorRect.width &&
                this.x + this.width > doorRect.x &&
                this.y < doorRect.y + doorRect.height &&
                this.y + this.height > doorRect.y) {
                game.loadRoom(door.targetRoom, door.targetX * TILE_SIZE, door.targetY * TILE_SIZE);
                break;
            }
        }
    }

    update(game, dtFactor) {
        this.handleInput();
        super.update(game, dtFactor);
        this.checkDoors(game);
    }
}

export default Player;