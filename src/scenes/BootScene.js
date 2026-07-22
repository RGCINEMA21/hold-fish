import Phaser from 'phaser';
import SaveManager from '../managers/SaveManager.js';

export default class BootScene extends Phaser.Scene {
    constructor() { super({ key: 'BootScene' }); }

    create() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        this.cameras.main.setBackgroundColor(0x1a2a3a);

        this.add.text(w / 2, h / 2 - 40, '🎣', { fontSize: '64px' }).setOrigin(0.5);
        this.add.text(w / 2, h / 2 + 30, 'HOLD FISH', {
            fontSize: '32px', color: '#4ac5ff', fontStyle: 'bold',
        }).setOrigin(0.5);
        this.add.text(w / 2, h / 2 + 70, 'Loading...', {
            fontSize: '16px', color: '#ffffff',
        }).setOrigin(0.5);

        this.time.delayedCall(1500, () => {
            if (SaveManager.hasSave()) {
                this.scene.start('FishingHubScene');
            } else {
                this.scene.start('CharacterCreationScene');
            }
        });
    }
}
