// =================================================================
// CONFIGURATION DU JEU (Context)
// =================================================================
class Context {
    constructor() {
        // Dimensions du canvas
        this.CANVAS_WIDTH = 800;
        this.CANVAS_HEIGHT = 608;

        // Taille de chaque tuile (tile) en pixels
        this.TILE_SIZE = 32;

        // Constantes de physique (valeurs par frame à 60FPS)
        this.GRAVITY = 0.6;
        this.FRICTION = 0.8; 

        // Vitesse et saut du joueur
        this.PLAYER_SPEED = 4;
        this.PLAYER_JUMP_FORCE = -14;

        // Vitesse du zombie
        this.ZOMBIE_SPEED = 0.5;

        // Activer/désactiver le mode de débogage
        this.DEBUG = false;
    }
}

export default Context;