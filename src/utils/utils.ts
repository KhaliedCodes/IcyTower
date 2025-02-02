import { CONSTANTS } from '../constants';

export const Utils = {
    platformPositions: [0,
        CONSTANTS.WINDOW_WIDTH - CONSTANTS.TERRAIN_TILE_SIZE * 4,
        (CONSTANTS.WINDOW_WIDTH / 2) - CONSTANTS.TERRAIN_TILE_SIZE * 2],
    getRandomPlatformX: function (): number {
        const randomIndex = Math.floor(Math.random() * this.platformPositions.length);
        return this.platformPositions[randomIndex];
    }
}