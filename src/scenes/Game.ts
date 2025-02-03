import { Scene } from 'phaser';
import { Platform } from '../objects/platform';
import { Utils } from '../utils/utils';
import { CONSTANTS } from '../constants';
import { Debris } from '../objects/debris';
import { Player } from '../objects/Player';
import { Ground } from '../objects/ground';
import { UnstablePlatform } from '../objects/unstablePlatform';
import { Enemy } from '../objects/enemy';
import { PowerUp } from '../objects/powerup';

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text: Phaser.GameObjects.Text;
    powerUps!: Phaser.Physics.Arcade.Group;  // Group to manage multiple power-ups
    debrisManager: Debris;
    platformSpawnHeight: number = CONSTANTS.WINDOW_HEIGHT - CONSTANTS.TERRAIN_TILE_SIZE*4;
    player:Player;
    platforms: (Platform | UnstablePlatform)[] = [];
    cursor?: Phaser.Types.Input.Keyboard.CursorKeys;
    escKey!: Phaser.Input.Keyboard.Key;
    powerUp!: PowerUp;
    hasDoubleJump: boolean = false;
    canDoubleJump: boolean = false;
    lastPowerUpHeight: number = 0;

    enemies: Enemy[] = [];
    scoreText: Phaser.GameObjects.Text;

    constructor() {
        super('Game');
    }

    create() {
        this.camera = this.cameras.main;
        this.background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.background.setDisplaySize(this.scale.width, this.scale.height);
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
                const y = this.camera.scrollY;  // Spawn at the top of the screen
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
        
        this.powerUps = this.physics.add.group();

        // Add a single overlap for the group instead of individual power-ups
        this.physics.add.overlap(this.player.player, this.powerUps, this.collectPowerUp as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);

        this.spawnPowerUp();



        this.spawnEnemies();  // Spawn enemies after platforms are created

        
    }
    
    update(time: number, delta: number): void {
        if ((this.player.player.body?.position.x??0)<0){
            this.player.player.setX(0+CONSTANTS.PLAYER_TILE_SIZE/2);
        }
        if ((this.player.player.body?.position.x??0)>CONSTANTS.WINDOW_WIDTH-CONSTANTS.PLAYER_TILE_SIZE){
            this.player.player.setX(CONSTANTS.WINDOW_WIDTH-CONSTANTS.PLAYER_TILE_SIZE/2);
        }
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
        
        if (this.cursor?.up && Phaser.Input.Keyboard.JustDown(this.cursor.up)) {
            if (this.player.player.body?.touching.down) {
                // First Jump from Ground
                this.player.player.setVelocityY(-330);
                this.player.player.anims.play(CONSTANTS.PLAYER_JUMP, true);
        
                // Allow double jump if the power-up has been collected
                if (this.hasDoubleJump) {
                    this.canDoubleJump = true;  // Enable double jump after first jump
                }
            } else if (this.canDoubleJump) {
                // Double Jump Mid-Air
                this.player.player.setVelocityY(-230);
                this.player.player.anims.play(CONSTANTS.PLAYER_JUMP, true);
                this.canDoubleJump = false;  // Disable double jump after using it
            }
        }
        
        if (this.player.player.body?.touching.down && this.hasDoubleJump) {
            this.canDoubleJump = true;  // Reset double jump when the player lands
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
            this.spawnEnemies();
        }

        if(-this.camera.scrollY+(this.player.player.body?.position.y??0)>CONSTANTS.WINDOW_HEIGHT)
        {
            this.scene.start('GameOver');
        }
        CONSTANTS.SCORE = -Math.floor(this.camera.scrollY/(CONSTANTS.TERRAIN_TILE_SIZE*3))*10;
        this.scoreText.setText('Score: ' + CONSTANTS.SCORE);
        this.scoreText.setPosition(50,this.camera.scrollY+50);
        this.enemies.forEach(enemy => enemy.update());

        if (this.player.player.y < this.lastPowerUpHeight - CONSTANTS.TERRAIN_TILE_SIZE * 6) {
            this.spawnPowerUp();
            this.lastPowerUpHeight = this.player.player.y;
        }
        this.background.setPosition(0,this.camera.scrollY);
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
            if (Math.random() < 0.2&&(this.platformSpawnHeight > (platform.platform.getChildren()[0].body?.position.y??0)-CONSTANTS.TERRAIN_TILE_SIZE*6)) {
                const platformTile = platform.platform.getChildren()[0] as Phaser.GameObjects.Sprite;
                const enemy = new Enemy(this, platformTile.x, platformTile.y - CONSTANTS.TERRAIN_TILE_SIZE);
                this.enemies.push(enemy);
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
            }
        });
    }

    spawnPowerUp() {
        const spawnChance = Phaser.Math.Between(1, 5);

        if (spawnChance === 3) {
            const randomPlatform = Phaser.Utils.Array.GetRandom(this.platforms);
            const platformSprite = randomPlatform.platform.getChildren()[0] as Phaser.GameObjects.Sprite;
            const platformX = platformSprite.x;
            const platformY = platformSprite.y - 50;
    
            // Create the power-up without playing any animation
            const powerUp = new PowerUp(this, platformX, platformY);
            this.powerUps.add(powerUp);  // Add to the power-up group
    
            // Add collision with platform
            this.physics.add.collider(powerUp, randomPlatform.platform);
        }
    }    
      
    
    collectPowerUp(player: Phaser.Physics.Arcade.Sprite, powerUp: Phaser.Physics.Arcade.Sprite) {
        this.hasDoubleJump = true;  // Enable double jump
        powerUp.destroy();  // Remove the power-up from the scene
    }    
}
