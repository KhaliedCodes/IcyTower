import { Scene } from 'phaser';
import { Platform } from '../objects/platform';
import { Utils } from '../utils/utils';
import { CONSTANTS } from '../constants';
import { Debris } from '../objects/debris';
import { Player } from '../objects/Player';
import { Ground } from '../objects/ground';
import { UnstablePlatform } from '../objects/unstablePlatform';
import { Enemy } from '../objects/enemy';

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text: Phaser.GameObjects.Text;
    platformSpawnHeight: number = CONSTANTS.WINDOW_HEIGHT - CONSTANTS.TERRAIN_TILE_SIZE*4;
    player:Player;
    platforms: (Platform | UnstablePlatform)[] = [];
    debrisManager: Debris;
    cursor?: Phaser.Types.Input.Keyboard.CursorKeys;
    escKey!: Phaser.Input.Keyboard.Key;

    enemies: Enemy[] = [];
    scoreText: Phaser.GameObjects.Text;

    constructor() {
        super('Game');
    }

    create() {
        this.camera = this.cameras.main;
        const bg = this.add.image(0, 0, 'background').setOrigin(0, 0);
        bg.setDisplaySize(this.scale.width, this.scale.height);
        this.spawnPlayer();
        let ground = new Ground(this, 0, CONSTANTS.WINDOW_HEIGHT - CONSTANTS.TERRAIN_TILE_SIZE, CONSTANTS.PLATFORM, 2);
        this.platforms.push(ground);
        this.physics.add.collider(this.player.player, ground.platform);
        this.spawnPlatforms();
        this.spawnPlatforms();
        this.spawnPlatforms();
        this.spawnPlatforms();
        this.debrisManager = new Debris(this);
        if (this.input.keyboard) {
            this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        }
        this.time.addEvent({
            delay: 2000,
            callback: () => {
                const x = Phaser.Math.Between(100, CONSTANTS.WINDOW_WIDTH - 100);
                const y = 0;  // Spawn at the top of the screen
                this.debrisManager.spawnDebris(this, x, y);
                this.physics.add.collider(this.player.player, this.debrisManager.debrisGroup, () => {
                    const debrisHitPlayer = this.sound.add(CONSTANTS.DEBRIS_HIT_AUDIO);
                    debrisHitPlayer.play();
                    this.scene.start('GameOver');
                });
            },
            loop: true
        });
        this.cursor = this.input?.keyboard?.createCursorKeys();
        this.scoreText = this.add.text(50, 50, 'score : 0', { fontSize: '32px', color:'000000',stroke: '#ffffff', strokeThickness: 8 });
        
        



        this.spawnEnemies();  // Spawn enemies after platforms are created

        this.enemies.forEach(enemy => {
            if (enemy.enemy) {
                this.platforms.forEach(platform => {
                    this.physics.add.collider(enemy.enemy!, platform.platform);
                });
            }
            this.physics.add.collider(this.player.player, enemy.enemy!, () => {
                const enemyHitPlayer = this.sound.add(CONSTANTS.ENEMY_HIT_AUDIO);
                enemyHitPlayer.play();
                this.scene.start('GameOver');
            });
        });
    }

    update(time: number, delta: number): void {
        // const playerRunning = this.sound.add(CONSTANTS.PLAYER_RUN_AUDIO);
        if (this.cursor?.left.isDown) {
            // if(!playerRunning.isPlaying){
            //     playerRunning.play();
            // }
            this.player.player.setVelocityX(-160);
            this.player.player.flipX = true;
            this.player.player.anims.play(CONSTANTS.PLAYER_RUN, true);
        }
        else if (this.cursor?.right.isDown) {
            // if(!playerRunning.isPlaying){
            //     playerRunning.play();
            // }
            this.player.player.setVelocityX(160);
            this.player.player.flipX = false;
            this.player.player.anims.play(CONSTANTS.PLAYER_RUN, true);
        }
        else {
            // if(playerRunning.isPlaying){
            //     playerRunning.play();
            // }
            this.player.player.setVelocityX(0);
        }
        
        if ((this.cursor?.up.isDown || this.cursor?.space.isDown) && this.player.player.body?.touching.down)
        {
            this.player.player.setVelocityY(-330);
            this.player.player.anims.play(CONSTANTS.PLAYER_JUMP, true);
        }

        if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
            window.location.reload();
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
        CONSTANTS.SCORE = -Math.floor(this.camera.scrollY/(CONSTANTS.TERRAIN_TILE_SIZE*3))*10;
        this.scoreText.setText('Score: ' + CONSTANTS.SCORE);
        this.scoreText.setPosition(50,this.camera.scrollY+50);
        this.enemies.forEach(enemy => enemy.update());
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
        this.platformSpawnHeight -= CONSTANTS.TERRAIN_TILE_SIZE * 3;
    }
    spawnPlayer() {
        this.player = new Player(this, CONSTANTS.WINDOW_WIDTH / 2, CONSTANTS.WINDOW_HEIGHT - CONSTANTS.TERRAIN_TILE_SIZE * 2, CONSTANTS.PLAYER_IDLE);
        this.player.player.anims.play(CONSTANTS.PLAYER_IDLE);
    }

    spawnEnemies() {
        this.platforms.forEach(platform => {
            if (Math.random() < 0.2) {
                const platformTile = platform.platform.getChildren()[0] as Phaser.GameObjects.Sprite;
                const enemy = new Enemy(this, platformTile.x, platformTile.y - CONSTANTS.TERRAIN_TILE_SIZE);
                this.enemies.push(enemy);
            }
        });
    }
}
