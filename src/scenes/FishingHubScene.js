import Phaser from 'phaser';
import PlayerManager from '../managers/PlayerManager.js';

export default class FishingHubScene extends Phaser.Scene {
    constructor() { super({ key: 'FishingHubScene' }); }

    create() {
        PlayerManager.load();
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        this.cameras.main.setBackgroundColor(0x0a1628);

        this.add.text(w / 2, 20, '🏘️ FISHING HUB', { fontSize: '24px', color: '#4ac5ff', fontStyle: 'bold' }).setOrigin(0.5);
        this._buildCurrencyBar(w);
        this._buildBuildings(w, h);
    }

    _buildCurrencyBar(w) {
        const pd = PlayerManager.getData();
        const y = 55;
        this.add.text(20, y, `🧑 ${pd.character.name} Lv.${pd.progress.level}`, { fontSize: '13px', color: '#cccccc' });
        this.add.text(20, y + 18, `🪙 ${pd.currency.gold}  💎 ${pd.currency.diamond}  🐟 ${pd.currency.hfish}  🪱 Bait: ${pd.equipment.baitAmount}`, { fontSize: '12px', color: '#aaaaaa' });
    }

    _buildBuildings(w, h) {
        const buildings = [
            { label: '🎣 Fishing Dock',    scene: 'FishingScene' },
            { label: '🏪 Fish Market',     scene: 'FishMarketScene' },
            { label: '🪱 Bait Shop',       scene: 'BaitShopScene' },
            { label: '🔧 Rod Workshop',    scene: 'RodWorkshopScene' },
            { label: '⚓ Harbor',           scene: 'HarborScene' },
            { label: '📖 Fish Book',       scene: 'FishBookScene' },
            { label: '📦 Inventory',       scene: 'InventoryScene' },
            { label: '🏛️ Fish Museum',     scene: null },
            { label: '🍽️ Restaurant',      scene: null },
            { label: '🏢 Town Hall',       scene: null },
            { label: '⚙️ Settings',        scene: 'SettingsScene' },
        ];

        const cols = 3;
        const btnW = 260, btnH = 55, gap = 15;
        const totalW = cols * btnW + (cols - 1) * gap;
        const startX = (w - totalW) / 2 + btnW / 2;
        const startY = 110;

        buildings.forEach((b, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = startX + col * (btnW + gap);
            const y = startY + row * (btnH + gap);

            const active = b.scene !== null;
            const bg = this.add.rectangle(x, y, btnW, btnH, active ? 0x1a3a2a : 0x1a1a22)
                .setStrokeStyle(1, active ? 0x3a7a4a : 0x333333);

            const label = b.label.replace(/^[^\s]+ /, '');
            this.add.text(x, y - 8, b.label, {
                fontSize: '15px', color: active ? '#ffffff' : '#555555', fontStyle: 'bold',
            }).setOrigin(0.5);

            if (!active) {
                this.add.text(x, y + 12, 'Coming Soon', { fontSize: '10px', color: '#444444' }).setOrigin(0.5);
            }

            if (active) {
                bg.setInteractive({ useHandCursor: true });
                bg.on('pointerover', () => bg.setFillStyle(0x2a5a3a));
                bg.on('pointerout', () => bg.setFillStyle(0x1a3a2a));
                bg.on('pointerdown', () => this.scene.start(b.scene));
            }
        });
    }
}
