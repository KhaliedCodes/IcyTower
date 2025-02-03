import { Scene } from 'phaser';
import { CONSTANTS } from '../constants';

export class Player {
    player: Phaser.Physics.Arcade.Sprite;
    constructor(scene: Scene, x: number, y: number, texture: string) {
        this.player = scene.physics.add.sprite(x,y,texture);
        scene.anims.create({
            key:'idle',
            frames: scene.anims.generateFrameNumbers(CONSTANTS.PLAYER,{start:0,end:11}),
            frameRate:10,
            repeat:-1
        })
    }
}