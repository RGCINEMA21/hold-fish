import Phaser from 'phaser';
import SaveManager from '../managers/SaveManager.js';

/**
 * BootScene - Entry point, langsung ke scene yang tepat
 */
export default class BootScene extends Phaser.Scene {

    constructor() {
        super({ key: 'BootScene' });
    }

    create() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        this.cameras.main.setBackgroundColor(0x0a0a1a);

        this.add.text(w / 2, h / 2 - 40, '🎣', { fontSize: '64px' }).setOrigin(0.5);
        this.add.text(w / 2, h / 2 + 30, 'HOLD FISH', {
            fontSize: '32px', color: '#4ac5ff', fontStyle: 'bold',
        }).setOrigin(0.5);
        this.add.text(w / 2, h / 2 + 70, 'Loading...', {
            fontSize: '14px', color: '#667788',
        }).setOrigin(0.5);

        // Langsung transition setelah 1.5 detik
        this.time.delayedCall(1500, () => {
            try {
                if (SaveManager.hasSave()) {
                    this.scene.start('FishingHubScene');
                } else {
                    this.scene.start('CharacterCreationScene');
                }
            } catch (e) {
                console.error('[BootScene] Transition error:', e);
            }
        });
    }
}
