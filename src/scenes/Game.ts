import { Input, Scene, Types } from 'phaser';
import { Platform } from '../objects/platform';
import { Utils } from '../utils/utils';
import { CONSTANTS } from '../constants';
import { Player } from '../objects/Player';
import { Ground } from '../objects/ground';

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text: Phaser.GameObjects.Text;
    platformSpawnHeight: number = CONSTANTS.WINDOW_HEIGHT - CONSTANTS.TERRAIN_TILE_SIZE*4;
    player:Player;
    platforms: Platform[] = [];
    cursor?: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor() {
        super('Game');
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);
        this.spawnPlayer();
        let ground = new Ground(this, 0, CONSTANTS.WINDOW_HEIGHT - CONSTANTS.TERRAIN_TILE_SIZE, CONSTANTS.PLATFORM, 2);
        this.platforms.push(ground);
        this.physics.add.collider(this.player.player, ground.platform);
        this.spawnPlatforms();
        this.spawnPlatforms();
        this.spawnPlatforms();
        this.spawnPlatforms();
        this.cursor = this.input?.keyboard?.createCursorKeys();
        
        





        this.input.once('pointerdown', () => {

            // this.scene.start('GameOver');

        });
    }

    update(time: number, delta: number): void {
        if (this.cursor?.left.isDown)
        {
            this.player.player.setVelocityX(-160);
            this.player.player.flipX = true;
            this.player.player.anims.play(CONSTANTS.PLAYER_RUN, true);
        }
        else if (this.cursor?.right.isDown)
        {
            this.player.player.setVelocityX(160);
            this.player.player.flipX = false;
            this.player.player.anims.play(CONSTANTS.PLAYER_RUN, true);
        }
        else
        {
            this.player.player.setVelocityX(0);
        }
        
        if ((this.cursor?.up.isDown || this.cursor?.space.isDown) && this.player.player.body?.touching.down)
        {
            this.player.player.setVelocityY(-330);
            this.player.player.anims.play(CONSTANTS.PLAYER_JUMP, true);
        }

        if ((this.player.player.body?.velocity.y ?? 0) > 0)
        {
            this.player.player.anims.play(CONSTANTS.PLAYER_FALL, true);
        }

        if ((this.player.player.body?.velocity.y ?? 0) < 0)
        {
            this.player.player.anims.play(CONSTANTS.PLAYER_JUMP, true);
        }
        
        if ((this.player.player.body?.velocity.x??0)==0 && (this.player.player.body?.velocity.y??0)==0)
        {
            this.player.player.anims.play(CONSTANTS.PLAYER_IDLE, true);
        }

        if (CONSTANTS.WINDOW_HEIGHT-CONSTANTS.TERRAIN_TILE_SIZE*5-(this.player.player.body?.position.y??0)>-this.camera.scrollY)
        {
            this.camera.scrollY = -CONSTANTS.WINDOW_HEIGHT+CONSTANTS.TERRAIN_TILE_SIZE*5+(this.player.player.body?.position.y??0);
        }

        if (this.camera.scrollY - CONSTANTS.TERRAIN_TILE_SIZE*2 < this.platformSpawnHeight)
        {
            this.spawnPlatforms();
        }

        if(-this.camera.scrollY+(this.player.player.body?.position.y??0)>CONSTANTS.WINDOW_HEIGHT)
        {
            this.scene.start('GameOver');
        }
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
        this.platformSpawnHeight -= CONSTANTS.TERRAIN_TILE_SIZE * 3;
    }
    spawnPlayer() {
        this.player = new Player(this, CONSTANTS.WINDOW_WIDTH / 2 , CONSTANTS.WINDOW_HEIGHT - CONSTANTS.TERRAIN_TILE_SIZE * 2, CONSTANTS.PLAYER_IDLE);
        this.player.player.anims.play(CONSTANTS.PLAYER_IDLE);
    }
}
