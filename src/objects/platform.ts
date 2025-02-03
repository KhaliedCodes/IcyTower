import { Scene } from 'phaser';
import { CONSTANTS } from '../constants';

export class Platform {
    platform: Phaser.Physics.Arcade.StaticGroup;
    constructor(scene: Scene, x: number, y: number, texture: string, frame: number) {

        this.platform = scene.physics.add.staticGroup();
        this.platform.create(x, y, texture, frame);
        this.platform.create(x + CONSTANTS.TERRAIN_TILE_SIZE, y, texture, frame);
        this.platform.create(x + CONSTANTS.TERRAIN_TILE_SIZE * 2, y, texture, frame);
        this.platform.create(x + CONSTANTS.TERRAIN_TILE_SIZE * 3, y, texture, frame);
        this.platform.setOrigin(0, 0);
    }
}