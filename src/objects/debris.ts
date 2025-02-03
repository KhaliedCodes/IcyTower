import { Scene } from 'phaser';
import { CONSTANTS } from '../constants';

export class Debris {
    debrisGroup: Phaser.Physics.Arcade.Group;

    constructor(scene: Scene) {
        this.debrisGroup = scene.physics.add.group();
    }

    spawnDebris(scene: Scene, x: number, y: number) {
        const debris = this.debrisGroup.create(x, y, CONSTANTS.DEBRIS);

        debris.setGravityY(Phaser.Math.Between(200, 400));
        debris.setVelocityX(Phaser.Math.Between(-50, 50));
        debris.setAngularVelocity(Phaser.Math.Between(-100, 100));
        debris.setBounce(0);
        debris.setCollideWorldBounds(false);
        debris.allowGravity = true;
    }
}