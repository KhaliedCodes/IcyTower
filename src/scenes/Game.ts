import { Scene } from 'phaser';
import { Platform } from '../objects/platform';
import { Utils } from '../utils/utils';
import { CONSTANTS } from '../constants';
import { Player } from '../objects/Player';

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text: Phaser.GameObjects.Text;
    platformSpawnHeight: number = CONSTANTS.TERRAIN_TILE_SIZE * 4;
    player:Player;
    platforms: Platform[] = [];

    constructor() {
        super('Game');
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);
        this.spawnPlayer();
        this.spawnPlatforms();
        this.spawnPlatforms();
        this.spawnPlatforms();
        this.spawnPlatforms();
        
        





        this.input.once('pointerdown', () => {

            // this.scene.start('GameOver');

        });
    }


    spawnPlatforms() {
        const platformSpawnX = Utils.getRandomPlatformX();
        const platform1 = new Platform(this, platformSpawnX, this.platformSpawnHeight, CONSTANTS.PLATFORM, 2);
        this.platforms.push(platform1);
        this.physics.add.collider(this.player.player, platform1.platform);
        let secondPlatformSpawnX = Utils.getRandomPlatformX();
        while (secondPlatformSpawnX === platformSpawnX) {
            secondPlatformSpawnX = Utils.getRandomPlatformX();
        }
        const platform2 = new Platform(this, secondPlatformSpawnX, this.platformSpawnHeight, CONSTANTS.PLATFORM, 2);
        this.platforms.push(platform2);
        this.physics.add.collider(this.player.player, platform2.platform);
        this.platformSpawnHeight += CONSTANTS.TERRAIN_TILE_SIZE * 4;
    }
    spawnPlayer() {
        this.player = new Player(this, 0, CONSTANTS.TERRAIN_TILE_SIZE, CONSTANTS.PLAYER);
        this.player.player.anims.play('idle');
    }
}
