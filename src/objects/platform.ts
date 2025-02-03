import { Scene } from 'phaser';
import { CONSTANTS } from '../constants';

export class Platform {
    platform: Phaser.Physics.Arcade.StaticGroup;
    constructor(scene: Scene, x: number, y: number, texture: string, frame: number) {

        this.platform = scene.physics.add.staticGroup();
        this.platform.create(x + CONSTANTS.TERRAIN_TILE_SIZE / 2, y + CONSTANTS.TERRAIN_TILE_SIZE / 2, texture, frame);
        this.platform.create(x + CONSTANTS.TERRAIN_TILE_SIZE * 3 / 2, y + CONSTANTS.TERRAIN_TILE_SIZE / 2, texture, 2);
        this.platform.create(x + CONSTANTS.TERRAIN_TILE_SIZE * 5 / 2, y + CONSTANTS.TERRAIN_TILE_SIZE / 2, texture, 2);
        this.platform.create(x + CONSTANTS.TERRAIN_TILE_SIZE * 7 / 2, y + CONSTANTS.TERRAIN_TILE_SIZE / 2, texture, 2);
    }
}