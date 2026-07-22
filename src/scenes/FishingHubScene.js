import Phaser from 'phaser';
import PlayerManager from '../managers/PlayerManager.js';

export default class FishingHubScene extends Phaser.Scene {
    constructor() { super({ key: 'FishingHubScene' }); }

    create() {
        PlayerManager.load();

        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        this.cameras.main.setBackgroundColor(0x1a2a3a);

        this.add.text(w / 2, 24, '🏘️ FISHING HUB', {
            fontSize: '22px', color: '#4ac5ff', fontStyle: 'bold',
        }).setOrigin(0.5);

        const pd = PlayerManager.getData();
        const name = pd?.character?.name ?? 'Fisher';
        const level = pd?.progress?.level ?? 1;
        const gold = pd?.currency?.gold ?? 0;
        const diamond = pd?.currency?.diamond ?? 0;
        const hfish = pd?.currency?.hfish ?? 0;
        const baitAmt = pd?.equipment?.baitAmount ?? 0;

        this.add.text(w / 2, 56, `🧑 ${name} Lv.${level}`, {
            fontSize: '13px', color: '#ffffff',
        }).setOrigin(0.5);
        this.add.text(w / 2, 76, `🪙 ${gold}  💎 ${diamond}  🐟 ${hfish}  🪱 ${baitAmt}`, {
            fontSize: '11px', color: '#cccccc',
        }).setOrigin(0.5);

        const buildings = [
            { label: '🎣 Fishing Dock',    scene: 'FishingScene' },
            { label: '🏪 Fish Market',     scene: 'FishMarketScene' },
            { label: '🪱 Bait Shop',       scene: 'BaitShopScene' },
            { label: '🔧 Rod Workshop',    scene: 'RodWorkshopScene' },
            { label: '⚓ Harbor',           scene: 'HarborScene' },
            { label: '📖 Fish Book',       scene: 'FishBookScene' },
            { label: '📦 Inventory',       scene: 'InventoryScene' },
            { label: '🏛️ Museum',          scene: null },
            { label: '🍽️ Restaurant',      scene: null },
            { label: '⚙️ Settings',        scene: 'SettingsScene' },
        ];

        const cols = 2;
        const btnW = (w - 40) / cols;
        const btnH = 50;
        const gap = 8;
        const startX = 20 + btnW / 2;
        const startY = 110;

        buildings.forEach((b, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = startX + col * (btnW + gap);
            const y = startY + row * (btnH + gap);
            if (y > h - 50) return;

            const active = b.scene !== null;
            const bg = this.add.rectangle(x, y, btnW - 4, btnH, active ? 0x2a4a3a : 0x2a2a3a)
                .setStrokeStyle(2, active ? 0x4a9a5a : 0x555555);

            this.add.text(x, y - 5, b.label, {
                fontSize: '13px', color: active ? '#ffffff' : '#888888', fontStyle: 'bold',
            }).setOrigin(0.5);

            if (!active) {
                this.add.text(x, y + 12, 'Soon', { fontSize: '9px', color: '#666666' }).setOrigin(0.5);
            }

            if (active) {
                bg.setInteractive({ useHandCursor: true });
                bg.on('pointerover', () => bg.setFillStyle(0x3a6a4a));
                bg.on('pointerout', () => bg.setFillStyle(0x2a4a3a));
                bg.on('pointerdown', () => this.scene.start(b.scene));
            }
        });
    }
}
