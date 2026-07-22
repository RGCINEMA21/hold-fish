import Phaser from 'phaser';
import InventoryManager from '../managers/InventoryManager.js';
import MarketManager from '../managers/MarketManager.js';

export default class FishMarketScene extends Phaser.Scene {
    constructor() { super({ key: 'FishMarketScene' }); }

    create() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        this.cameras.main.setBackgroundColor(0x0a1628);
        this.add.text(w / 2, 20, '🏪 FISH MARKET', { fontSize: '20px', color: '#ffd700', fontStyle: 'bold' }).setOrigin(0.5);

        let fish = InventoryManager.getAllFish();
        const startY = 60;
        const slotH = 46;
        const maxSlots = Math.floor((h - startY - 100) / slotH);
        const rc = { common: 0xaaaaaa, uncommon: 0x55cc55, rare: 0x5599ff, epic: 0xaa55ff, legendary: 0xffaa00 };

        fish.slice(0, maxSlots).forEach((f, i) => {
            const y = startY + i * slotH;
            this.add.rectangle(w / 2, y + 16, w - 20, 40, 0x1a2a3a);
            this.add.rectangle(10, y + 16, 4, 36, rc[f.rarity] || 0xaaaaaa);
            this.add.text(22, y + 6, `${f.favorite ? '⭐ ' : ''}${f.name}`, { fontSize: '12px', color: '#ffffff' });
            this.add.text(22, y + 22, `${f.weight.toFixed(2)} kg · 🪙${f.price}`, { fontSize: '10px', color: '#ffd700' });

            const slot = this.add.rectangle(w / 2, y + 16, w - 20, 40).setInteractive({ useHandCursor: true });
            slot.on('pointerdown', () => { MarketManager.sellOne(InventoryManager.getAllFish().indexOf(f)); this.scene.restart(); });
        });

        if (fish.length > 0) {
            this.add.text(w / 2, h - 60, '💰 SELL ALL (except ⭐)', {
                fontSize: '14px', color: '#ffffff', backgroundColor: '#8a6a1a',
                padding: { x: 14, y: 8 },
            }).setOrigin(0.5).setInteractive({ useHandCursor: true })
            .on('pointerdown', () => { MarketManager.sellAll(); this.scene.restart(); });
        } else {
            this.add.text(w / 2, h / 2, 'No fish to sell.', { fontSize: '14px', color: '#555555' }).setOrigin(0.5);
        }

        this.add.text(20, h - 25, '← Back', { fontSize: '14px', color: '#888888' })
            .setInteractive({ useHandCursor: true }).on('pointerdown', () => this.scene.start('FishingHubScene'));
    }
}
