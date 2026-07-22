import Phaser from 'phaser';
import DataManager from '../core/DataManager.js';
import PlayerManager from '../managers/PlayerManager.js';

export default class RodWorkshopScene extends Phaser.Scene {
    constructor() { super({ key: 'RodWorkshopScene' }); }

    create() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        this.cameras.main.setBackgroundColor(0x1a2a3a);
        this.add.text(w / 2, 20, '🔧 ROD WORKSHOP', { fontSize: '20px', color: '#5599ff', fontStyle: 'bold' }).setOrigin(0.5);

        const rods = DataManager.getRods();
        const owned = PlayerManager.getOwnedRods();
        const startY = 65;
        const slotH = 75;

        rods.forEach((r, i) => {
            const y = startY + i * slotH;
            if (y > h - 60) return;
            const isOwned = owned.includes(r.id);
            this.add.rectangle(w / 2, y + 30, w - 20, 66, isOwned ? 0x1a2a1a : 0x1a1a22);
            this.add.text(20, y + 10, `${isOwned ? '✅' : '🔒'} ${r.name} Lv.${r.level}`, {
                fontSize: '13px', color: isOwned ? '#ffffff' : '#666666', fontStyle: 'bold',
            });
            this.add.text(20, y + 32, r.description, { fontSize: '10px', color: '#888888' });
            this.add.text(20, y + 50, `Luck: +${r.luckBonus}  Speed: +${r.speedBonus}  🪙${r.price}`, { fontSize: '10px', color: '#aaaaaa' });
        });

        this.add.text(20, h - 25, '← Back', { fontSize: '14px', color: '#888888' })
            .setInteractive({ useHandCursor: true }).on('pointerdown', () => this.scene.start('FishingHubScene'));
    }
}
