import { Scene } from 'phaser';
import { CONSTANTS } from '../constants';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        // Add background at the top-left corner
        const bg = this.add.image(0, 0, 'background').setOrigin(0, 0);
    
        // Resize the background to fit the entire game window
        bg.setDisplaySize(this.scale.width, this.scale.height);
    
        // A simple progress bar. This is the outline of the bar.
        this.add.rectangle(this.scale.width / 2, this.scale.height / 2, 468, 32).setStrokeStyle(1, 0xffffff);
    
        // This is the progress bar itself.
        const bar = this.add.rectangle(this.scale.width / 2 - 230, this.scale.height / 2, 4, 28, 0xffffff);
    
        // Update the progress bar as assets load
        this.load.on('progress', (progress: number) => {
            bar.width = 4 + (460 * progress);
        });
    }    

    preload() {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.image('logo', 'EcoTowerLogo.png');
        this.load.spritesheet(CONSTANTS.PLATFORM, CONSTANTS.PLATFORM_TEXTURE_PATH, { frameWidth: CONSTANTS.TERRAIN_TILE_SIZE, frameHeight: CONSTANTS.TERRAIN_TILE_SIZE });
        this.load.image(CONSTANTS.DEBRIS, CONSTANTS.DEBRIS_TEXTURE_PATH);
        this.load.spritesheet(CONSTANTS.ENEMY, CONSTANTS.ENEMY_TEXTURE_PATH, { frameWidth: 38, frameHeight: 38 });

        this.load.spritesheet(CONSTANTS.PLAYER_IDLE, CONSTANTS.PLAYER_IDLE_TEXTURE_PATH, { frameWidth: CONSTANTS.PLAYER_TILE_SIZE, frameHeight: CONSTANTS.PLAYER_TILE_SIZE });
        this.load.spritesheet(CONSTANTS.PLAYER_RUN, CONSTANTS.PLAYER_RUN_TEXTURE_PATH, { frameWidth: CONSTANTS.PLAYER_TILE_SIZE, frameHeight: CONSTANTS.PLAYER_TILE_SIZE });
        this.load.spritesheet(CONSTANTS.PLAYER_JUMP, CONSTANTS.PLAYER_JUMP_TEXTURE_PATH, { frameWidth: CONSTANTS.PLAYER_TILE_SIZE, frameHeight: CONSTANTS.PLAYER_TILE_SIZE });
        this.load.spritesheet(CONSTANTS.PLAYER_FALL, CONSTANTS.PLAYER_FALL_TEXTURE_PATH, { frameWidth: CONSTANTS.PLAYER_TILE_SIZE, frameHeight: CONSTANTS.PLAYER_TILE_SIZE });
        this.load.audio(CONSTANTS.BG_MUSIC_AUDIO, CONSTANTS.BG_MUSIC_TEXTURE_PATH);  
        this.load.audio(CONSTANTS.BUTTON_AUDIO, CONSTANTS.BUTTON_AUDIO_TEXTURE_PATH);  
        this.load.audio(CONSTANTS.DEBRIS_HIT_AUDIO, CONSTANTS.DEBRIS_HIT_AUDIO_TEXTURE_PATH);  
        this.load.audio(CONSTANTS.ENEMY_HIT_AUDIO, CONSTANTS.ENEMY_HIT_AUDIO_TEXTURE_PATH);
        this.load.audio(CONSTANTS.PLAYER_JUMP_AUDIO, CONSTANTS.PLAYER_JUMP_AUDIO_TEXTURE_PATH);
        this.load.audio(CONSTANTS.PLAYER_RUN_AUDIO, CONSTANTS.PLAYER_RUN_AUDIO_TEXTURE_PATH); 
        this.load.audio(CONSTANTS.GAME_OVER_AUDIO, CONSTANTS.GAME_OVER_AUDIO_TEXTURE_PATH);  
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }
}
