import Phaser from 'phaser';
import DataManager from '../core/DataManager.js';
import PlayerManager from '../managers/PlayerManager.js';

export default class RodWorkshopScene extends Phaser.Scene {
    constructor() { super({ key: 'RodWorkshopScene' }); }

    create() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        this.cameras.main.setBackgroundColor(0x0a1628);
        this.add.text(w / 2, 20, '🔧 ROD WORKSHOP', { fontSize: '24px', color: '#5599ff', fontStyle: 'bold' }).setOrigin(0.5);

        const rods = DataManager.getRods();
        const owned = PlayerManager.getOwnedRods();
        const startY = 70;
        const slotH = 70;

        rods.forEach((r, i) => {
            const y = startY + i * slotH;
            const isOwned = owned.includes(r.id);
            this.add.rectangle(w / 2, y + 28, w - 40, 62, isOwned ? 0x1a2a1a : 0x1a1a22);
            this.add.text(30, y + 10, `${isOwned ? '✅' : '🔒'} ${r.name} Lv.${r.level}`, {
                fontSize: '14px', color: isOwned ? '#ffffff' : '#666666', fontStyle: 'bold',
            });
            this.add.text(30, y + 32, r.description, { fontSize: '10px', color: '#888888' });
            this.add.text(30, y + 48, `Luck: +${r.luckBonus}  Speed: +${r.speedBonus}  🪙${r.price}`, { fontSize: '10px', color: '#aaaaaa' });
        });

        this.add.text(20, h - 25, '← Back', { fontSize: '14px', color: '#888888' })
            .setInteractive({ useHandCursor: true }).on('pointerdown', () => this.scene.start('FishingHubScene'));
    }
}
