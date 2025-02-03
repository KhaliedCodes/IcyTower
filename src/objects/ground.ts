import { Scene } from 'phaser';
import { CONSTANTS } from '../constants';

export class Ground {
    platform: Phaser.Physics.Arcade.StaticGroup;
    constructor(scene: Scene, x: number, y: number, texture: string, frame: number) {

        this.platform = scene.physics.add.staticGroup();
        for (let i = 0, multiplier = 0; i < CONSTANTS.WINDOW_WIDTH; i += CONSTANTS.TERRAIN_TILE_SIZE, multiplier++) {

            this.platform.create(x + CONSTANTS.TERRAIN_TILE_SIZE * multiplier, y, texture, frame);
        }
        this.platform.setOrigin(0, 0);
    }
}