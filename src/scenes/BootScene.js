import Phaser from 'phaser';
import SaveManager from '../managers/SaveManager.js';

export default class BootScene extends Phaser.Scene {
    constructor() { super({ key: 'BootScene' }); }

    create() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        this.cameras.main.setBackgroundColor(0x0a0a1a);

        this.add.text(w / 2, h / 2 - 40, '🎣', { fontSize: '64px' }).setOrigin(0.5);
        this.add.text(w / 2, h / 2 + 30, 'HOLD FISH', {
            fontSize: '32px', color: '#4ac5ff', fontStyle: 'bold',
        }).setOrigin(0.5);

        this.cameras.main.fadeIn(500, 0, 0, 0);

        this.time.delayedCall(1500, () => {
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                if (SaveManager.hasSave()) {
                    this.scene.start('FishingHubScene');
                } else {
                    this.scene.start('CharacterCreationScene');
                }
            });
        });
    }
}
