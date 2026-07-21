import Phaser from 'phaser';
import DataManager from '../core/DataManager.js';
import PlayerManager from '../managers/PlayerManager.js';

export default class HarborScene extends Phaser.Scene {
    constructor() { super({ key: 'HarborScene' }); }

    create() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        this.cameras.main.setBackgroundColor(0x0a1628);
        this.add.text(w / 2, 20, '⚓ HARBOR', { fontSize: '24px', color: '#4ac5ff', fontStyle: 'bold' }).setOrigin(0.5);

        const spots = DataManager.getSpots();
        const unlocked = PlayerManager.getUnlockedSpots();
        const level = PlayerManager.getLevel();
        const startY = 70;
        const slotH = 65;

        spots.forEach((s, i) => {
            const y = startY + i * slotH;
            const isUnlocked = unlocked.includes(s.id);
            const canUnlock = level >= s.unlockLevel;
            this.add.rectangle(w / 2, y + 26, w - 40, 58, isUnlocked ? 0x1a2a1a : 0x1a1a22);

            const statusIcon = isUnlocked ? '✅' : (canUnlock ? '🔓' : '🔒');
            this.add.text(30, y + 8, `${statusIcon} ${s.name}`, {
                fontSize: '14px', color: isUnlocked ? '#ffffff' : (canUnlock ? '#ffd700' : '#666666'), fontStyle: 'bold',
            });
            this.add.text(30, y + 30, s.description, { fontSize: '10px', color: '#888888' });
            this.add.text(30, y + 46, `Lv.${s.unlockLevel} req  |  💎${s.diamondRequired}`, { fontSize: '10px', color: '#aaaaaa' });

            if (isUnlocked) {
                const btn = this.add.text(w - 70, y + 26, 'GO', {
                    fontSize: '13px', color: '#ffffff', backgroundColor: '#2a5a3a',
                    padding: { x: 12, y: 6 },
                }).setOrigin(0.5).setInteractive({ useHandCursor: true });
                btn.on('pointerdown', () => {
                    PlayerManager.setCurrentSpot(s.id);
                    this.scene.start('FishingScene');
                });
            }
        });

        this.add.text(20, h - 25, '← Back', { fontSize: '14px', color: '#888888' })
            .setInteractive({ useHandCursor: true }).on('pointerdown', () => this.scene.start('FishingHubScene'));
    }
}
