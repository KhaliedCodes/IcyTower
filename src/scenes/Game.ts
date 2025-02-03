import { Input, Scene, Types } from 'phaser';
import { Platform } from '../objects/platform';
import { Utils } from '../utils/utils';
import { CONSTANTS } from '../constants';
import { Debris } from '../objects/debris';
import { Player } from '../objects/Player';
import { Ground } from '../objects/ground';
import { Enemy } from '../objects/enemy';
import { PowerUp } from '../objects/powerup';

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text: Phaser.GameObjects.Text;
    powerUps!: Phaser.Physics.Arcade.Group;  // Group to manage multiple power-ups
    platformSpawnHeight: number = CONSTANTS.TERRAIN_TILE_SIZE * 4;
    debrisManager: Debris;
    player:Player;
    platforms: Platform[] = [];
    cursor?: Phaser.Types.Input.Keyboard.CursorKeys;
    escKey!: Phaser.Input.Keyboard.Key;
    powerUp!: PowerUp;
    hasDoubleJump: boolean = false;
    canDoubleJump: boolean = false;

    enemies: Enemy[] = [];

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
        
        this.powerUps = this.physics.add.group();

        // Add a single overlap for the group instead of individual power-ups
        this.physics.add.overlap(this.player.player, this.powerUps, this.collectPowerUp as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);

        this.spawnPowerUp();

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
        if (this.cursor?.left.isDown)
        {
            // if(!playerRunning.isPlaying){
            //     playerRunning.play();
            // }
            this.player.player.setVelocityX(-160);
            this.player.player.flipX = true;
            this.player.player.anims.play(CONSTANTS.PLAYER_RUN, true);
        }
        else if (this.cursor?.right.isDown)
        {
            // if(!playerRunning.isPlaying){
            //     playerRunning.play();
            // }
            this.player.player.setVelocityX(160);
            this.player.player.flipX = false;
            this.player.player.anims.play(CONSTANTS.PLAYER_RUN, true);
        }
        else
        {
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
        
        this.enemies.forEach(enemy => enemy.update());
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
        this.platformSpawnHeight += CONSTANTS.TERRAIN_TILE_SIZE * 3;
    }
    spawnPlayer() {
        this.player = new Player(this, CONSTANTS.WINDOW_WIDTH / 2 , CONSTANTS.WINDOW_HEIGHT - CONSTANTS.TERRAIN_TILE_SIZE * 2, CONSTANTS.PLAYER_IDLE);
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

    spawnPowerUp() {
        const spawnChance = Phaser.Math.Between(1, 10);
        
        // if (spawnChance === 3) {
        if(true){
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
