import Phaser from 'phaser';
import DataManager from '../core/DataManager.js';
import ShopManager from '../managers/ShopManager.js';
import PlayerManager from '../managers/PlayerManager.js';

export default class BaitShopScene extends Phaser.Scene {
    constructor() { super({ key: 'BaitShopScene' }); }

    create() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        this.cameras.main.setBackgroundColor(0x1a2a3a);
        this.add.text(w / 2, 20, '🪱 BAIT SHOP', { fontSize: '20px', color: '#55cc55', fontStyle: 'bold' }).setOrigin(0.5);
        this.add.text(w / 2, 48, `Gold: 🪙 ${PlayerManager.getGold()}`, { fontSize: '13px', color: '#ffd700' }).setOrigin(0.5);

        const baits = DataManager.getBaits();
        const startY = 80;
        const slotH = 65;

        baits.forEach((b, i) => {
            const y = startY + i * slotH;
            if (y > h - 80) return;
            this.add.rectangle(w / 2, y + 24, w - 20, 56, 0x1a2a3a);
            this.add.text(20, y + 8, b.name, { fontSize: '13px', color: '#ffffff', fontStyle: 'bold' });
            this.add.text(20, y + 28, b.description, { fontSize: '10px', color: '#888888' });
            this.add.text(20, y + 44, `🪙 ${b.price}`, { fontSize: '11px', color: '#ffd700' });

            const buyBtn = this.add.text(w - 50, y + 24, 'BUY', {
                fontSize: '12px', color: '#ffffff', backgroundColor: '#2a7a3a',
                padding: { x: 10, y: 6 },
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });
            buyBtn.on('pointerdown', () => { ShopManager.buyBait(b.id); this.scene.restart(); });
        });

        this.add.text(20, h - 25, '← Back', { fontSize: '14px', color: '#888888' })
            .setInteractive({ useHandCursor: true }).on('pointerdown', () => this.scene.start('FishingHubScene'));
    }
}
