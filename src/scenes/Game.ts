import { Scene } from 'phaser';
import { Platform } from '../objects/platform';
import { Utils } from '../utils/utils';
import { CONSTANTS } from '../constants';
import { Player } from '../objects/Player';
import { Ground } from '../objects/ground';
import { UnstablePlatform } from '../objects/unstablePlatform';

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text: Phaser.GameObjects.Text;
    platformSpawnHeight: number = CONSTANTS.TERRAIN_TILE_SIZE * 4;
    player: Player;
    platforms: (Platform | UnstablePlatform)[] = [];
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
        if (this.cursor?.left.isDown) {
            this.player.player.setVelocityX(-160);
            this.player.player.flipX = true;
            this.player.player.anims.play(CONSTANTS.PLAYER_RUN, true);
        }
        else if (this.cursor?.right.isDown) {
            this.player.player.setVelocityX(160);
            this.player.player.flipX = false;
            this.player.player.anims.play(CONSTANTS.PLAYER_RUN, true);
        }
        else {
            this.player.player.setVelocityX(0);
        }

        if (this.cursor?.up.isDown && this.player.player.body?.touching.down) {
            this.player.player.setVelocityY(-330);
            this.player.player.anims.play(CONSTANTS.PLAYER_JUMP, true);
        }

        if ((this.player.player.body?.velocity.y ?? 0) > 0) {
            this.player.player.anims.play(CONSTANTS.PLAYER_FALL, true);
        }

        if ((this.player.player.body?.velocity.y ?? 0) < 0) {
            this.player.player.anims.play(CONSTANTS.PLAYER_JUMP, true);
        }

        if ((this.player.player.body?.velocity.x ?? 0) == 0 && (this.player.player.body?.velocity.y ?? 0) == 0) {
            this.player.player.anims.play(CONSTANTS.PLAYER_IDLE, true);
        }

    }


    spawnPlatforms() {
        const platformSpawnX = Utils.getRandomPlatformX();
        const platform1 = Math.random() < 0.5 ? new Platform(this, platformSpawnX, this.platformSpawnHeight, CONSTANTS.PLATFORM, 2)
            : new UnstablePlatform(this, platformSpawnX, this.platformSpawnHeight, CONSTANTS.UNSTABLE_PLATFORM, 0)
        this.platforms.push(platform1);
        this.physics.add.collider(this.player.player, platform1.platform, () => {
            if (platform1 instanceof UnstablePlatform && platform1.isShaking === false) {
                platform1.isShaking = true;
                platform1.platform.children.iterate(child => {
                    this.tweens.add({
                        targets: child,
                        x: '+=5',
                        duration: 50,
                        ease: 'Sine.easeInOut',
                        repeat: 10,
                        yoyo: true,
                        onComplete: () => {
                            platform1.platform.children.iterate(child => {
                                (child.body as Phaser.Physics.Arcade.Body).setImmovable(false);
                                (child.body as Phaser.Physics.Arcade.Body).setVelocityY(300);
                                return true;
                            })
                        }
                    });
                    return true;
                });
            }


        });
        let secondPlatformSpawnX = Utils.getRandomPlatformX();
        while (secondPlatformSpawnX === platformSpawnX) {
            secondPlatformSpawnX = Utils.getRandomPlatformX();
        }
        const platform2 = Math.random() < 0.5 ? new Platform(this, secondPlatformSpawnX, this.platformSpawnHeight, CONSTANTS.PLATFORM, 2)
            : new UnstablePlatform(this, secondPlatformSpawnX, this.platformSpawnHeight, CONSTANTS.UNSTABLE_PLATFORM, 0)
        this.platforms.push(platform2);
        this.physics.add.collider(this.player.player, platform2.platform, () => {
            if (platform2 instanceof UnstablePlatform && platform2.isShaking === false) {
                platform2.isShaking = true;
                platform2.platform.children.iterate(child => {
                    this.tweens.add({
                        targets: child,
                        x: '+=5',
                        duration: 50,
                        ease: 'Sine.easeInOut',
                        repeat: 10,
                        yoyo: true,
                        onComplete: () => {
                            platform2.platform.children.iterate(child => {
                                (child.body as Phaser.Physics.Arcade.Body).setImmovable(false);
                                (child.body as Phaser.Physics.Arcade.Body).setVelocityY(300);
                                return true;
                            })
                        }
                    });
                    return true;
                });
            }


        });
        this.platformSpawnHeight += CONSTANTS.TERRAIN_TILE_SIZE * 3;
    }
    spawnPlayer() {
        this.player = new Player(this, CONSTANTS.WINDOW_WIDTH / 2, CONSTANTS.WINDOW_HEIGHT - CONSTANTS.TERRAIN_TILE_SIZE * 2, CONSTANTS.PLAYER_IDLE);
        this.player.player.anims.play(CONSTANTS.PLAYER_IDLE);
    }
}
