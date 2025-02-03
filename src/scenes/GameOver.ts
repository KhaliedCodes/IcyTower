import { Scene ,GameObjects } from 'phaser';

export class GameOver extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    gameover_text : Phaser.GameObjects.Text;
    mainButton: GameObjects.Text;
    exitButton: GameObjects.Text;


    constructor ()
    {
        super('GameOver');
    }

    create ()
    {
        this.camera = this.cameras.main
        this.camera.setBackgroundColor(0xff0000);

        this.gameover_text = this.add.text(512, 384, 'Game Over', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        });
        this.gameover_text.setOrigin(0.5);

        this.mainButton = this.add.text(this.scale.width / 2, 600, 'Main Menu', {
            fontFamily: 'Verdana', fontSize: 36, color: '#ffffff',
            backgroundColor: '#000000', padding: { x: 30, y: 15 },
            align: 'center'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        this.mainButton.on('pointerdown', () => {
            this.scene.start('MainMenu');
            window.location.reload();
        });
        

        this.exitButton = this.add.text(this.scale.width / 2, 700, 'Exit', {
            fontFamily: 'Verdana', fontSize: 36, color: '#ffffff',
            backgroundColor: '#000000', padding: { x: 30, y: 15 },
            align: 'center'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        this.exitButton.on('pointerdown', () => {
            window.close();
        });

        [this.mainButton, this.exitButton].forEach(button => {
            button.on('pointerover', () => button.setStyle({ backgroundColor: '#942222' }));
            button.on('pointerout', () => button.setStyle({ backgroundColor: button === this.mainButton ? '#000000' : '#000000' }));
        });
    }
}
