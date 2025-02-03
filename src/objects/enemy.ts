import { Scene } from 'phaser';
import { CONSTANTS } from '../constants';

export class Enemy {
    enemy: Phaser.Physics.Arcade.Sprite | null = null;  // Initialize as null
    direction: number;

    constructor(scene: Scene, x: number, y: number) {
        this.enemy = scene.physics.add.sprite(x, y, CONSTANTS.ENEMY);
        this.enemy.setGravityY(0);      // Disable vertical gravity
        this.enemy.setVelocityX(100);   // Move horizontally
        //this.enemy.setCollideWorldBounds(true);        
        this.enemy.setBounce(1, 0);    // Only bounce horizontally

        // Play saw animation
        if (scene.textures.exists(CONSTANTS.ENEMY)) {
            if (!scene.anims.exists('spin')) {
                scene.anims.create({
                    key: 'spin',
                    frames: scene.anims.generateFrameNumbers(CONSTANTS.ENEMY, { start: 0, end: 7 }),
                    frameRate: 10,
                    repeat: -1
                });
            }
            this.enemy.play('spin');
        } else {
            console.error('Enemy texture not found!');
        }        

        this.direction = 1;  // 1 = moving right, -1 = moving left
    }

    update() {
        if (this.enemy) {
            this.enemy.setVelocityY(0);
    
            if (this.enemy.body!.blocked.left || this.enemy.body!.blocked.right) {
                this.direction *= -1;
                this.enemy.setVelocityX(100 * this.direction);
            }
        }
    }
}