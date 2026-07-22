import Phaser from 'phaser';
import SaveManager from '../managers/SaveManager.js';

export default class BootScene extends Phaser.Scene {
    constructor() { super({ key: 'BootScene' }); }

    create() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        this.cameras.main.setBackgroundColor(0x0a0a1a);

        console.log('[Boot] Scene started, canvas:', w, 'x', h);

        this.add.text(w / 2, h / 2 - 60, '🎣', { fontSize: '64px' }).setOrigin(0.5);
        this.add.text(w / 2, h / 2 + 10, 'HOLD FISH', {
            fontSize: '32px', color: '#4ac5ff', fontStyle: 'bold',
        }).setOrigin(0.5);

        const hasSave = SaveManager.hasSave();
        console.log('[Boot] hasSave:', hasSave);

        if (hasSave) {
            this.add.text(w / 2, h / 2 + 50, 'Loading your save...', {
                fontSize: '14px', color: '#888888',
            }).setOrigin(0.5);

            this.time.delayedCall(500, () => {
                console.log('[Boot] Transitioning to FishingHubScene');
                this.scene.start('FishingHubScene');
            });
        } else {
            this.add.text(w / 2, h / 2 + 50, 'Tap to begin your journey', {
                fontSize: '14px', color: '#888888',
            }).setOrigin(0.5);

            this.input.once('pointerdown', () => {
                console.log('[Boot] Transitioning to CharacterCreationScene');
                this.scene.start('CharacterCreationScene');
            });
        }
    }
}
