// =================================================================
// GAME CONFIGURATION (Context)
// =================================================================
class Context {
    constructor() {
        // Canvas dimensions
        this.CANVAS_WIDTH = 800;
        this.CANVAS_HEIGHT = 608;

        // Size of each tile in pixels
        this.TILE_SIZE = 32;

        // Physics constants (values per frame at 60FPS)
        this.GRAVITY = 0.6;
        this.FRICTION = 0.8; 

        // Player speed and jump
        this.PLAYER_SPEED = 4;
        this.PLAYER_JUMP_FORCE = -14;

        // Dash system
        this.DASH_SPEED = 12;
        this.DASH_DURATION = 10; // frames
        this.DASH_COOLDOWN = 30; // frames

        // Zombie speed
        this.ZOMBIE_SPEED = 0.5;

        // Enable/disable debug mode
        this.DEBUG = false;
    }
}

export default Context;