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

        this.cameras.main.setBackgroundColor(0x0a1628);

        // ==================== LOGO ====================
        this.add.text(w / 2, 40, '🎣 HOLD FISH', {
            fontSize: '36px',
            color: '#4ac5ff',
            fontStyle: 'bold',
        }).setOrigin(0.5);

        // ==================== PLAYER INFO ====================
        const name = PlayerManager.getName();
        const level = PlayerManager.getLevel();
        const gold = PlayerManager.getGold();
        const diamond = PlayerManager.getDiamond();
        const hfish = PlayerManager.getHfish();
        const avatar = PlayerManager.getAvatar();

        const avatarColors = [0x4ac5ff, 0xff6b6b, 0x51cf66, 0xffd43b];
        this.add.rectangle(w / 2, 130, 64, 64, avatarColors[avatar] || 0x4ac5ff, 0.5);
        this.add.text(w / 2, 130, `A${avatar + 1}`, {
            fontSize: '24px',
            color: '#ffffff',
        }).setOrigin(0.5);

        this.add.text(w / 2, 180, name, {
            fontSize: '22px',
            color: '#ffffff',
            fontStyle: 'bold',
        }).setOrigin(0.5);

        this.add.text(w / 2, 205, `Level ${level}`, {
            fontSize: '16px',
            color: '#8899aa',
        }).setOrigin(0.5);

        const currencyY = 240;
        this.add.text(w / 2 - 120, currencyY, `🪙 ${gold}`, { fontSize: '16px', color: '#ffd700' });
        this.add.text(w / 2, currencyY, `💎 ${diamond}`, { fontSize: '16px', color: '#00ccff' });
        this.add.text(w / 2 + 120, currencyY, `🐟 ${hfish}`, { fontSize: '16px', color: '#00ff88' });

        // ==================== MENU BUTTONS ====================
        const buttons = [
            { label: '🎣  Start Fishing',   scene: 'FishingHubScene', active: true },
            { label: '📦  Inventory',       scene: 'InventoryScene',  active: true },
            { label: '📖  Fish Book',       scene: 'FishBookScene',   active: true },
            { label: '⚙  Settings',         scene: 'SettingsScene',   active: true },
            { label: '🔒  Coming Soon',     scene: null,              active: false },
        ];

        buttons.forEach((b, i) => {
            const y = 310 + i * 52;
            const bgColor = b.active ? '#1a3a2a' : '#1a1a2a';
            const textColor = b.active ? '#ffffff' : '#555555';

            const btn = this.add.text(w / 2, y, b.label, {
                fontSize: '18px',
                color: textColor,
                backgroundColor: bgColor,
                padding: { x: 24, y: 10 },
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
