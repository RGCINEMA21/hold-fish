import Phaser from 'phaser';
import PlayerManager from '../managers/PlayerManager.js';

export default class SettingsScene extends Phaser.Scene {
    constructor() { super({ key: 'SettingsScene' }); }

    create() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        this.cameras.main.setBackgroundColor(0x1a2a3a);
        PlayerManager.load();
        const settings = PlayerManager.getSettings();

        this.add.text(w / 2, 30, '⚙️ SETTINGS', { fontSize: '22px', color: '#4ac5ff', fontStyle: 'bold' }).setOrigin(0.5);

        this._createSlider(w, 100, '🎵 Music Volume', settings.musicVolume, (val) => { settings.musicVolume = val; PlayerManager.save(); });
        this._createSlider(w, 170, '🔊 SFX Volume', settings.sfxVolume, (val) => { settings.sfxVolume = val; PlayerManager.save(); });

        this.add.text(w / 2, 240, '🌐 Language: English', { fontSize: '15px', color: '#cccccc' }).setOrigin(0.5);

        const resetBtn = this.add.text(w / 2, 320, '🗑️ Reset Save Data', {
            fontSize: '16px', color: '#ff6b6b', backgroundColor: '#2a1a1a',
            padding: { x: 18, y: 10 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        resetBtn.on('pointerdown', () => this._confirmReset(w, h));

        this.add.text(w / 2, h - 60, 'HOLD FISH v0.1.0', { fontSize: '11px', color: '#555555' }).setOrigin(0.5);

        this.add.text(20, h - 25, '← Back', { fontSize: '14px', color: '#888888' })
            .setInteractive({ useHandCursor: true }).on('pointerdown', () => this.scene.start('FishingHubScene'));
    }

    _createSlider(w, y, label, value, onChange) {
        this.add.text(20, y, label, { fontSize: '15px', color: '#cccccc' });
        const barX = w / 2 - 80;
        const barW = 200;
        const barBg = this.add.rectangle(w / 2, y + 5, barW, 10, 0x222233).setInteractive({ useHandCursor: true });
        const barFill = this.add.rectangle(barX - barW / 2, y + 5, (value / 100) * barW, 10, 0x4ac5ff).setOrigin(0, 0.5);
        const valText = this.add.text(w - 40, y, `${value}%`, { fontSize: '14px', color: '#ffd700' }).setOrigin(1, 0);

        barBg.on('pointerdown', (pointer) => {
            const relX = pointer.x - (barX - barW / 2);
            const pct = Math.max(0, Math.min(100, Math.round((relX / barW) * 100)));
            barFill.width = (pct / 100) * barW;
            valText.setText(`${pct}%`);
            onChange(pct);
        });
    }

    _confirmReset(w, h) {
        const dim = this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.7).setInteractive();
        const panel = this.add.rectangle(w / 2, h / 2, w - 80, 160, 0x1a2a3a).setStrokeStyle(2, 0xff6b6b);
        const text = this.add.text(w / 2, h / 2 - 30, 'Delete all save data?', { fontSize: '16px', color: '#ff6b6b', fontStyle: 'bold' }).setOrigin(0.5);
        const sub = this.add.text(w / 2, h / 2 - 5, 'This cannot be undone.', { fontSize: '12px', color: '#888888' }).setOrigin(0.5);

        const yesBtn = this.add.text(w / 2 - 60, h / 2 + 40, 'Yes', {
            fontSize: '14px', color: '#ffffff', backgroundColor: '#aa3333',
            padding: { x: 16, y: 8 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        const noBtn = this.add.text(w / 2 + 60, h / 2 + 40, 'Cancel', {
            fontSize: '14px', color: '#ffffff', backgroundColor: '#333344',
            padding: { x: 16, y: 8 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        const cleanup = () => { dim.destroy(); panel.destroy(); text.destroy(); sub.destroy(); yesBtn.destroy(); noBtn.destroy(); };
        yesBtn.on('pointerdown', () => { cleanup(); localStorage.removeItem('holdfish_save'); this.scene.start('BootScene'); });
        noBtn.on('pointerdown', cleanup);
    }
}
