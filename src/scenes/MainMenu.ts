import { Scene, GameObjects } from 'phaser';
import { CONSTANTS } from '../constants';

export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    startButton: GameObjects.Text;
    exitButton: GameObjects.Text;

    music: {
        bgMusic: Phaser.Sound.BaseSound,
    };

    constructor() {
        super('MainMenu');
    }

    create() {
        let bgMusic = this.sound.get(CONSTANTS.BG_MUSIC_AUDIO);

        if (!bgMusic) {
            bgMusic = this.sound.add(CONSTANTS.BG_MUSIC_AUDIO, { loop: true, volume: 0.5 });
            bgMusic.play();
        } else if (!bgMusic.isPlaying) {
            bgMusic.play();
        }
        const bg = this.add.image(0, 0, 'background').setOrigin(0, 0);
        bg.setDisplaySize(this.scale.width, this.scale.height);

        this.logo = this.add.image(this.scale.width / 2, 250, 'logo');

        this.title = this.add.text(this.scale.width / 2, 500, 'Main Menu', {
            fontFamily: 'Papyrus, fantasy', fontSize: 50, color: '#2ecc71',
            stroke: '#000000', strokeThickness: 6,
            shadow: { offsetX: 4, offsetY: 4, color: '#000000', blur: 4, fill: true },
            align: 'center'
        }).setOrigin(0.5);

        this.startButton = this.add.text(this.scale.width / 2, 600, 'Start Game', {
            fontFamily: 'Verdana', fontSize: 36, color: '#ffffff',
            backgroundColor: '#007700', padding: { x: 30, y: 15 },
            align: 'center'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        this.startButton.on('pointerdown', () => {
            const buttonClicked = this.sound.add(CONSTANTS.BUTTON_AUDIO);
            buttonClicked.play();
            this.scene.start('Game');
        });
        
        
        this.exitButton = this.add.text(this.scale.width / 2, 700, 'Exit', {
            fontFamily: 'Verdana', fontSize: 36, color: '#ffffff',
            backgroundColor: '#005500', padding: { x: 30, y: 15 },
            align: 'center'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        this.exitButton.on('pointerdown', () => {
            window.close();
        });

        [this.startButton, this.exitButton].forEach(button => {
            button.on('pointerover', () => button.setStyle({ backgroundColor: '#009900' }));
            button.on('pointerout', () => button.setStyle({ backgroundColor: button === this.startButton ? '#007700' : '#005500' }));
        });
    }
}