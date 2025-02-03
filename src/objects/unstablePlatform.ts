import { Scene } from 'phaser';
import { CONSTANTS } from '../constants';

export class UnstablePlatform {
    platform: Phaser.Physics.Arcade.Group;
    isShaking = false;
    constructor(scene: Scene, x: number, y: number, texture: string, frame: number) {

        this.platform = scene.physics.add.group({
            allowGravity: false,
            immovable: true,

        });
        // this.platform.children.iterate(child => {
        //     (child.body as Phaser.Physics.Arcade.Body).setGravityY(0)
        //     return true;
        // });
        this.platform.children.iterate(child => {
            (child.body as Phaser.Physics.Arcade.Body).setGravityY(300);
            return true;
        })
        this.platform.create(x + CONSTANTS.TERRAIN_TILE_SIZE / 2, y + CONSTANTS.TERRAIN_TILE_SIZE / 2, texture, frame);
        this.platform.create(x + CONSTANTS.TERRAIN_TILE_SIZE * 3 / 2, y + CONSTANTS.TERRAIN_TILE_SIZE / 2, texture, frame);
        this.platform.create(x + CONSTANTS.TERRAIN_TILE_SIZE * 5 / 2, y + CONSTANTS.TERRAIN_TILE_SIZE / 2, texture, frame);
        this.platform.create(x + CONSTANTS.TERRAIN_TILE_SIZE * 7 / 2, y + CONSTANTS.TERRAIN_TILE_SIZE / 2, texture, frame);
    }
}