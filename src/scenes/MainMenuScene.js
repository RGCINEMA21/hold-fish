import Phaser from 'phaser';
import PlayerManager from '../managers/PlayerManager.js';

/**
 * MainMenuScene - Menu utama dengan info pemain
 */
export default class MainMenuScene extends Phaser.Scene {

    constructor() {
        super({ key: 'MainMenuScene' });
    }

    create() {
        PlayerManager.load();

        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        this.cameras.main.setBackgroundColor(0x1a2a3a);

        // LOGO
        this.add.text(w / 2, 50, '🎣 HOLD FISH', {
            fontSize: '32px', color: '#4ac5ff', fontStyle: 'bold',
        }).setOrigin(0.5);

        // PLAYER INFO
        const name = PlayerManager.getName();
        const level = PlayerManager.getLevel();
        const gold = PlayerManager.getGold();
        const diamond = PlayerManager.getDiamond();
        const hfish = PlayerManager.getHfish();
        const avatar = PlayerManager.getAvatar();

        const avatarColors = [0x4ac5ff, 0xff6b6b, 0x51cf66, 0xffd43b];
        this.add.rectangle(w / 2, 140, 56, 56, avatarColors[avatar] || 0x4ac5ff, 0.5);
        this.add.text(w / 2, 140, `A${avatar + 1}`, {
            fontSize: '22px', color: '#ffffff',
        }).setOrigin(0.5);

        this.add.text(w / 2, 190, name, {
            fontSize: '20px', color: '#ffffff', fontStyle: 'bold',
        }).setOrigin(0.5);

        this.add.text(w / 2, 218, `Level ${level}`, {
            fontSize: '14px', color: '#8899aa',
        }).setOrigin(0.5);

        // CURRENCY
        const cy = 260;
        this.add.text(w / 2 - 100, cy, `🪙 ${gold}`, { fontSize: '14px', color: '#ffd700' });
        this.add.text(w / 2, cy, `💎 ${diamond}`, { fontSize: '14px', color: '#00ccff' });
        this.add.text(w / 2 + 100, cy, `🐟 ${hfish}`, { fontSize: '14px', color: '#00ff88' });

        // MENU BUTTONS
        const buttons = [
            { label: '🎣  Start Fishing',   scene: 'FishingHubScene', active: true },
            { label: '📦  Inventory',       scene: 'InventoryScene',  active: true },
            { label: '📖  Fish Book',       scene: 'FishBookScene',   active: true },
            { label: '⚙  Settings',         scene: 'SettingsScene',   active: true },
            { label: '🔒  Coming Soon',     scene: null,              active: false },
        ];

        const startY = 340;
        buttons.forEach((b, i) => {
            const y = startY + i * 60;
            const bgColor = b.active ? '#1a3a2a' : '#1a1a2a';
            const textColor = b.active ? '#ffffff' : '#555555';

            const btn = this.add.text(w / 2, y, b.label, {
                fontSize: '17px', color: textColor,
                backgroundColor: bgColor,
                padding: { x: 24, y: 12 },
            }).setOrigin(0.5);

            if (b.active) {
                btn.setInteractive({ useHandCursor: true });
                btn.on('pointerover', () => btn.setStyle({ backgroundColor: '#2a5a3a' }));
                btn.on('pointerout', () => btn.setStyle({ backgroundColor: bgColor }));
                btn.on('pointerdown', () => {
                    if (b.scene) this.scene.start(b.scene);
                });
            }
        });
    }
}
