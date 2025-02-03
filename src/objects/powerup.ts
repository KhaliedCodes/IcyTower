import { Scene, Physics } from 'phaser';
import { CONSTANTS } from '../constants';

export class PowerUp extends Physics.Arcade.Sprite {
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, CONSTANTS.POWER_UP);  // Use the image key

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(4);  // Increase the scale to make it more visible (adjust as needed)
        this.setCollideWorldBounds(true);
        this.setImmovable(true);
    }
}
