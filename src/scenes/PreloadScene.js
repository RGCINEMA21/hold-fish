import Phaser from 'phaser';

/**
 * PreloadScene - Loading aset & transisi
 */
export default class PreloadScene extends Phaser.Scene {

    constructor() {
        super({ key: 'PreloadScene' });
        this._hasSave = false;
    }

    init(data) {
        this._hasSave = data?.hasSave ?? false;
    }

    create() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        this.cameras.main.setBackgroundColor(0x1a2a3a);

        this.add.text(w / 2, h / 2 - 40, '🎣', {
            fontSize: '48px',
        }).setOrigin(0.5);

        this.add.text(w / 2, h / 2 + 10, 'Loading...', {
            fontSize: '20px',
            color: '#ffffff',
        }).setOrigin(0.5);

        const barBg = this.add.rectangle(w / 2, h / 2 + 50, 280, 14, 0x222233);
        const barFill = this.add.rectangle(w / 2 - 140, h / 2 + 50, 0, 14, 0x4ac5ff).setOrigin(0, 0.5);

        this.tweens.add({
            targets: barFill,
            width: 280,
            duration: 1200,
            ease: 'Power2',
            onComplete: () => {
                this._goNext();
            },
        });
    }

    _goNext() {
        if (this._hasSave) {
            this.scene.start('FishingHubScene');
        } else {
            this.scene.start('CharacterCreationScene');
        }
    }
}
