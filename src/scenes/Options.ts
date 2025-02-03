import { Scene, GameObjects } from 'phaser';

export class Options extends Scene {
    background: GameObjects.Image;
    sfxToggle: GameObjects.Text;
    musicToggle: GameObjects.Text;
    backButton: GameObjects.Text;
    sfxEnabled: boolean = true;
    musicEnabled: boolean = true;

    constructor() {
        super('Options');
    }

    create() {
        const bg = this.add.image(0, 0, 'background').setOrigin(0, 0);
        bg.setDisplaySize(this.scale.width, this.scale.height);

        this.add.text(this.scale.width / 2, 100, 'Options', {
            fontFamily: 'Papyrus, fantasy', fontSize: 50, color: '#2ecc71',
            stroke: '#000000', strokeThickness: 6,
            shadow: { offsetX: 4, offsetY: 4, color: '#000000', blur: 4, fill: true },
            align: 'center'
        }).setOrigin(0.5);

        this.sfxToggle = this.add.text(this.scale.width / 2, 200, `SFX: ON`, {
            fontFamily: 'Verdana', fontSize: 36, color: '#ffffff',
            backgroundColor: '#007700', padding: { x: 30, y: 15 },
            align: 'center'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        this.sfxToggle.on('pointerdown', () => {
            this.sfxEnabled = !this.sfxEnabled;
            this.sfxToggle.setText(`SFX: ${this.sfxEnabled ? 'ON' : 'OFF'}`);
        });

        this.musicToggle = this.add.text(this.scale.width / 2, 280, `Music: ON`, {
            fontFamily: 'Verdana', fontSize: 36, color: '#ffffff',
            backgroundColor: '#007700', padding: { x: 30, y: 15 },
            align: 'center'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        this.musicToggle.on('pointerdown', () => {
            this.musicEnabled = !this.musicEnabled;
            this.musicToggle.setText(`Music: ${this.musicEnabled ? 'ON' : 'OFF'}`);
        });

        this.backButton = this.add.text(this.scale.width / 2, 400, 'Back', {
            fontFamily: 'Arial', fontSize: 32, color: '#ffffff',
            backgroundColor: '#000000', padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        this.backButton.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });
    }
}
