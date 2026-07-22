import Phaser from 'phaser';
import PlayerManager from '../managers/PlayerManager.js';

export default class FishingHubScene extends Phaser.Scene {
    constructor() { super({ key: 'FishingHubScene' }); }

    create() {
        try {
            PlayerManager.load();
        } catch (e) {
            console.warn('[FishingHub] Failed to load player:', e);
        }

        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        this.cameras.main.setBackgroundColor(0x0a1628);

        this.add.text(w / 2, 24, '🏘️ FISHING HUB', {
            fontSize: '22px', color: '#4ac5ff', fontStyle: 'bold',
        }).setOrigin(0.5);

        // Player info - safe access
        const pd = PlayerManager.getData();
        const name = pd?.character?.name ?? 'Fisher';
        const level = pd?.progress?.level ?? 1;
        const gold = pd?.currency?.gold ?? 0;
        const diamond = pd?.currency?.diamond ?? 0;
        const hfish = pd?.currency?.hfish ?? 0;
        const baitAmt = pd?.equipment?.baitAmount ?? 0;

        this.add.text(w / 2, 58, `🧑 ${name} Lv.${level}`, {
            fontSize: '13px', color: '#cccccc',
        }).setOrigin(0.5);
        this.add.text(w / 2, 78, `🪙 ${gold}  💎 ${diamond}  🐟 ${hfish}  🪱 ${baitAmt}`, {
            fontSize: '11px', color: '#aaaaaa',
        }).setOrigin(0.5);

        // Buildings - 2 columns for portrait
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
            { label: '🏢 Town Hall',       scene: null },
            { label: '⚙️ Settings',        scene: 'SettingsScene' },
        ];

        const cols = 2;
        const btnW = (w - 60) / cols;
        const btnH = 52;
        const gap = 10;
        const startX = 30 + btnW / 2;
        const startY = 115;

        buildings.forEach((b, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = startX + col * (btnW + gap);
            const y = startY + row * (btnH + gap);

            const active = b.scene !== null;
            const bg = this.add.rectangle(x, y, btnW - 4, btnH, active ? 0x1a3a2a : 0x1a1a22)
                .setStrokeStyle(1, active ? 0x3a7a4a : 0x333333);

            this.add.text(x, y - 6, b.label, {
                fontSize: '13px', color: active ? '#ffffff' : '#555555', fontStyle: 'bold',
            }).setOrigin(0.5);

            if (!active) {
                this.add.text(x, y + 12, 'Coming Soon', {
                    fontSize: '9px', color: '#444444',
                }).setOrigin(0.5);
            }

            if (active) {
                bg.setInteractive({ useHandCursor: true });
                bg.on('pointerover', () => bg.setFillStyle(0x2a5a3a));
                bg.on('pointerout', () => bg.setFillStyle(0x1a3a2a));
                bg.on('pointerdown', () => {
                    try {
                        this.scene.start(b.scene);
                    } catch (e) {
                        console.error('[FishingHub] Failed to start scene:', b.scene, e);
                    }
                });
            }
        });
    }
}
