import Phaser from 'phaser';

/**
 * PreloadScene - Loading aset & transisi
 */
export default class PreloadScene extends Phaser.Scene {

    constructor() {
        super({ key: 'PreloadScene' });
    }

    create() {
        this.cameras.main.setBackgroundColor(0x0a0a2a);

        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        this.add.text(w / 2, h / 2 - 30, 'Loading...', {
            fontSize: '24px',
            color: '#ffffff',
        }).setOrigin(0.5);

        // Placeholder progress bar
        const barBg = this.add.rectangle(w / 2, h / 2 + 20, 300, 16, 0x222233);
        const barFill = this.add.rectangle(w / 2 - 150, h / 2 + 20, 0, 16, 0x4a9eff).setOrigin(0, 0.5);

        this.tweens.add({
            targets: barFill,
            width: 300,
            duration: 1200,
            ease: 'Power2',
            onComplete: () => {
                this._goNext();
            },
        });
    }

    _goNext() {
        const hasSave = this.scene.settings.data?.hasSave ?? false;
        if (hasSave) {
            this.scene.start('MainMenuScene');
        } else {
            this.scene.start('CharacterCreationScene');
        }
    }
}
