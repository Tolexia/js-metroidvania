import Zombie from './Zombie.js';

// =================================================================
// GESTIONNAIRE DE NIVEAUX (LevelManager)
// =================================================================
class LevelManager {
    constructor(config, levelData) {
        this.config = config;
        this.levelData = levelData;
        this.currentRoomId = null;
        this.currentRoomData = null;
    }

    loadRoom(roomId) {
        if (!this.levelData[roomId]) {
            console.error(`La salle "${roomId}" n'existe pas.`);
            return [];
        }
        this.currentRoomId = roomId;
        this.currentRoomData = this.levelData[roomId];
        const entities = [];
        if (this.currentRoomData.entities) {
            this.currentRoomData.entities.forEach(entityInfo => {
                if (entityInfo.type === 'zombie') {
                    entities.push(new Zombie(this.config, entityInfo.x, entityInfo.y, this));
                }
            });
        }
        return entities;
    }

    getTile(x, y) {
        if (!this.currentRoomData) return 1;
        const tileX = Math.floor(x / this.config.TILE_SIZE);
        const tileY = Math.floor(y / this.config.TILE_SIZE);
        if (tileY < 0 || tileY >= this.currentRoomData.layout.length ||
            tileX < 0 || tileX >= this.currentRoomData.layout[0].length) {
            return 1;
        }
        return this.currentRoomData.layout[tileY][tileX];
    }

    getDoors() {
        return this.currentRoomData ? this.currentRoomData.doors : [];
    }

    draw(ctx) {
        if (!this.currentRoomData) return;
        const TILE_SIZE = this.config.TILE_SIZE;
        for (let row = 0; row < this.currentRoomData.layout.length; row++) {
            for (let col = 0; col < this.currentRoomData.layout[row].length; col++) {
                const tile = this.currentRoomData.layout[row][col];
                if (tile === 1) {
                    ctx.fillStyle = '#555';
                    ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                } else if (tile === 0 && this.config.DEBUG) {
                    ctx.strokeStyle = '#222';
                    ctx.strokeRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                }
            }
        }
        if (this.config.DEBUG) {
            ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
            this.getDoors().forEach(door => {
                ctx.fillRect(door.x * TILE_SIZE, door.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            });
        }
    }
}

export default LevelManager;