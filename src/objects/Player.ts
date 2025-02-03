import { Scene } from 'phaser';
import { CONSTANTS } from '../constants';

export class Player {
    player: Phaser.Physics.Arcade.Sprite;
    constructor(scene: Scene, x: number, y: number, texture: string) {
        this.player = scene.physics.add.sprite(x,y,texture);
        scene.anims.create({
            key:CONSTANTS.PLAYER_IDLE,
            frames: scene.anims.generateFrameNumbers(CONSTANTS.PLAYER_IDLE,{start:0,end:10}),
            frameRate:10,
            repeat:-1
        });
        scene.anims.create({
            key:CONSTANTS.PLAYER_RUN,
            frames: scene.anims.generateFrameNumbers(CONSTANTS.PLAYER_RUN,{start:0,end:11}),
            frameRate:10,
            repeat:-1
        });
        scene.anims.create({
            key:CONSTANTS.PLAYER_JUMP,
            frames: scene.anims.generateFrameNumbers(CONSTANTS.PLAYER_JUMP,{start:0,end:0}),
            frameRate:10,
            repeat:-1
        });
        scene.anims.create({
            key:CONSTANTS.PLAYER_FALL,
            frames: scene.anims.generateFrameNumbers(CONSTANTS.PLAYER_FALL,{start:0,end:0}),
            frameRate:10,
            repeat:-1
        });
    }
}