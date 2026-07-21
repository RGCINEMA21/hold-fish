import Phaser from 'phaser';
import SaveManager from '../managers/SaveManager.js';

/**
 * BootScene - Splash screen & flow logic
 * Cek apakah ada data save → arahkan ke scene yang tepat.
 */
export default class BootScene extends Phaser.Scene {

    constructor() {
        super({ key: 'BootScene' });
    }

    create() {
        this.cameras.main.setBackgroundColor(0x0a0a1a);

        this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            '🎣 HOLD FISH',
            { fontSize: '48px', color: '#4ac5ff', fontStyle: 'bold' }
        ).setOrigin(0.5);

        // Delay sebentar lalu pindah scene
        this.time.delayedCall(1500, () => {
            if (SaveManager.hasSave()) {
                this.scene.start('PreloadScene', { hasSave: true });
            } else {
                this.scene.start('PreloadScene', { hasSave: false });
            }
        });
    }
}
