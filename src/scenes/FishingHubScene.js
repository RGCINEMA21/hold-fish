import Phaser from 'phaser';
import PlayerManager from '../managers/PlayerManager.js';

export default class FishingHubScene extends Phaser.Scene {
    constructor() { super({ key: 'FishingHubScene' }); }

    create() {
        PlayerManager.load();

        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        this.cameras.main.setBackgroundColor(0x0a1628);
        this.cameras.main.fadeIn(300, 0, 0, 0);

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
            fontSize: '13px', color: '#cccccc',
        }).setOrigin(0.5);
        this.add.text(w / 2, 76, `🪙 ${gold}  💎 ${diamond}  🐟 ${hfish}  🪱 ${baitAmt}`, {
            fontSize: '11px', color: '#aaaaaa',
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
            const bg = this.add.rectangle(x, y, btnW - 4, btnH, active ? 0x1a3a2a : 0x1a1a22)
                .setStrokeStyle(1, active ? 0x3a7a4a : 0x333333);

            this.add.text(x, y - 5, b.label, {
                fontSize: '13px', color: active ? '#ffffff' : '#555555', fontStyle: 'bold',
            }).setOrigin(0.5);

            if (!active) {
                this.add.text(x, y + 12, 'Soon', { fontSize: '9px', color: '#444444' }).setOrigin(0.5);
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
