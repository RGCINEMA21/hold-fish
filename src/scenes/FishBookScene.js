import Phaser from 'phaser';
import InventoryManager from '../managers/InventoryManager.js';
import DataManager from '../core/DataManager.js';

export default class FishBookScene extends Phaser.Scene {
    constructor() {
        super({ key: 'FishBookScene' });
    }

    create() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        this.cameras.main.setBackgroundColor(0x0a1628);

        this.add.text(w / 2, 20, '📖 FISH BOOK', { fontSize: '24px', color: '#4ac5ff', fontStyle: 'bold' }).setOrigin(0.5);

        this._buildProgress(w);
        this._buildRarityProgress(w);
        this._buildFishGrid(w, h);
        this._buildBackButton();
    }

    _buildProgress(w) {
        const stats = InventoryManager.getCollectionStats();
        this.add.text(w / 2, 55, `Collected: ${stats.done} / ${stats.total} Species`, {
            fontSize: '14px', color: '#cccccc',
        }).setOrigin(0.5);

        const barW = 300;
        const ratio = stats.total > 0 ? stats.done / stats.total : 0;
        this.add.rectangle(w / 2, 75, barW, 12, 0x222233);
        this.add.rectangle(w / 2 - barW / 2, 75, barW * ratio, 12, 0x4a9eff, 1).setOrigin(0, 0.5);
    }

    _buildRarityProgress(w) {
        const stats = InventoryManager.getCollectionStats();
        const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
        const colors = { common: '#aaaaaa', uncommon: '#55cc55', rare: '#5599ff', epic: '#aa55ff', legendary: '#ffaa00' };
        const startY = 95;
        rarities.forEach((r, i) => {
            const count = stats.rarityCount[r] || 0;
            const total = stats.rarityTotal[r] || 0;
            this.add.text(30, startY + i * 18, `${r.charAt(0).toUpperCase() + r.slice(1)}: ${count}/${total}`, {
                fontSize: '11px', color: colors[r],
            });
        });
    }

    _buildFishGrid(w, h) {
        const allFish = DataManager.getFish();
        const startY = 200;
        const slotH = 44;
        const maxSlots = Math.floor((h - startY - 40) / slotH);

        allFish.slice(0, maxSlots).forEach((f, i) => {
            const y = startY + i * slotH;
            const collected = InventoryManager.isCollected(f.id);
            const rarityColors = { common: 0xaaaaaa, uncommon: 0x55cc55, rare: 0x5599ff, epic: 0xaa55ff, legendary: 0xffaa00 };

            this.add.rectangle(w / 2, y + 15, w - 40, 40, collected ? 0x1a2a3a : 0x111118, 0.8);
            this.add.rectangle(20, y + 15, 4, 36, collected ? (rarityColors[f.rarity] || 0xaaaaaa) : 0x333333);

            if (collected) {
                const coll = InventoryManager.getCollection().find(c => c.id === f.id);
                this.add.text(35, y + 5, f.name, { fontSize: '13px', color: '#ffffff' });
                this.add.text(35, y + 22, `${f.rarity} · ${coll.biggestWeight.toFixed(2)} kg max · Caught: ${coll.caught}`, {
                    fontSize: '10px', color: '#888888',
                });

                const slot = this.add.rectangle(w / 2, y + 15, w - 40, 40).setInteractive({ useHandCursor: true });
                slot.on('pointerdown', () => this._showFishBookDetail(f));
            } else {
                this.add.text(35, y + 12, '???????', { fontSize: '14px', color: '#333344' });
            }
        });
    }

    _showFishBookDetail(fish) {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const coll = InventoryManager.getCollection().find(c => c.id === fish.id);
        const rarityColors = { common: '#aaaaaa', uncommon: '#55cc55', rare: '#5599ff', epic: '#aa55ff', legendary: '#ffaa00' };

        const dim = this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.7).setInteractive();
        const panel = this.add.rectangle(w / 2, h / 2, 380, 340, 0x1a2a3a).setStrokeStyle(2, 0x4a9eff);

        const elements = [];
        let y = h / 2 - 150;

        elements.push(this.add.text(w / 2, y, fish.name, { fontSize: '22px', color: rarityColors[fish.rarity], fontStyle: 'bold' }).setOrigin(0.5)); y += 28;
        elements.push(this.add.text(w / 2, y, fish.description, { fontSize: '12px', color: '#888888', wordWrap: { width: 340 }, align: 'center' }).setOrigin(0.5)); y += 30;
        elements.push(this.add.text(w / 2, y, `Rarity: ${fish.rarity.toUpperCase()}`, { fontSize: '13px', color: rarityColors[fish.rarity] }).setOrigin(0.5)); y += 20;
        elements.push(this.add.text(w / 2, y, `Habitat: ${fish.location.join(', ')}`, { fontSize: '12px', color: '#cccccc' }).setOrigin(0.5)); y += 18;
        elements.push(this.add.text(w / 2, y, `Season: ${fish.preferredSeason?.join(', ') ?? '-'}`, { fontSize: '11px', color: '#aaaaaa' }).setOrigin(0.5)); y += 16;
        elements.push(this.add.text(w / 2, y, `Time: ${fish.preferredTime?.join(', ') ?? '-'}`, { fontSize: '11px', color: '#aaaaaa' }).setOrigin(0.5)); y += 16;
        elements.push(this.add.text(w / 2, y, `Weather: ${fish.preferredWeather?.join(', ') ?? '-'}`, { fontSize: '11px', color: '#aaaaaa' }).setOrigin(0.5)); y += 16;
        elements.push(this.add.text(w / 2, y, `Bait: ${fish.preferredBait?.join(', ') ?? '-'}`, { fontSize: '11px', color: '#aaaaaa' }).setOrigin(0.5)); y += 16;
        elements.push(this.add.text(w / 2, y, `Weight: ${fish.minWeight} - ${fish.maxWeight} kg  |  Price: 🪙 ${fish.price}`, { fontSize: '12px', color: '#ffd700' }).setOrigin(0.5)); y += 22;

        if (coll) {
            elements.push(this.add.text(w / 2, y, `Caught: ${coll.caught}x  |  Best: ${coll.biggestWeight.toFixed(2)} kg`, { fontSize: '12px', color: '#55cc55' }).setOrigin(0.5)); y += 20;
        }

        // Museum Flag placeholder
        elements.push(this.add.text(w / 2, y, '🏛️ Museum: Not Donated', { fontSize: '11px', color: '#666666' }).setOrigin(0.5));

        const closeBtn = this.add.text(w / 2, h / 2 + 150, 'OK', {
            fontSize: '16px', color: '#ffffff', backgroundColor: '#2a7a3a',
            padding: { x: 30, y: 8 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        closeBtn.on('pointerdown', () => {
            dim.destroy(); panel.destroy(); closeBtn.destroy();
            elements.forEach(e => e.destroy());
        });
    }

    _buildBackButton() {
        this.add.text(20, this.cameras.main.height - 25, '← Back', {
            fontSize: '14px', color: '#888888',
        }).setInteractive({ useHandCursor: true }).on('pointerdown', () => this.scene.start('FishingHubScene'));
    }
}
