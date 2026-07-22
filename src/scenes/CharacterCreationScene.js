import Phaser from 'phaser';
import SaveManager from '../managers/SaveManager.js';
import PlayerManager from '../managers/PlayerManager.js';

export default class CharacterCreationScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CharacterCreationScene' });
        this.playerName = '';
        this.selectedGender = 'male';
        this.selectedAvatar = 0;
    }

    create() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        this.cameras.main.setBackgroundColor(0x1a2a3a);

        this.add.text(w / 2, 50, '🎣 HOLD FISH', { fontSize: '28px', color: '#4ac5ff', fontStyle: 'bold' }).setOrigin(0.5);
        this.add.text(w / 2, 85, 'Create Your Character', { fontSize: '14px', color: '#ffffff' }).setOrigin(0.5);

        this.add.text(w / 2, 140, 'Character Name', { fontSize: '14px', color: '#cccccc' }).setOrigin(0.5);
        this.nameDisplay = this.add.text(w / 2, 175, 'Tap to enter name...', {
            fontSize: '16px', color: '#888888', backgroundColor: '#2a3a4a',
            padding: { x: 12, y: 10 }, fixedWidth: 280, align: 'center',
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        this.nameDisplay.on('pointerdown', () => {
            const name = prompt('Masukkan nama karakter (3-16):');
            if (name !== null) {
                this.playerName = name.trim();
                this.nameDisplay.setText(this.playerName || 'Tap to enter name...');
                this.nameDisplay.setStyle({ color: this.playerName ? '#ffffff' : '#888888' });
            }
        });

        this.add.text(w / 2, 230, 'Gender', { fontSize: '14px', color: '#cccccc' }).setOrigin(0.5);
        this.maleBtn = this.add.text(w / 2 - 70, 265, '♂ Male', {
            fontSize: '15px', color: '#ffffff', backgroundColor: '#4a9eff',
            padding: { x: 16, y: 8 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        this.femaleBtn = this.add.text(w / 2 + 70, 265, '♀ Female', {
            fontSize: '15px', color: '#ffffff', backgroundColor: '#3a4a5a',
            padding: { x: 16, y: 8 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        this.maleBtn.on('pointerdown', () => this._setGender('male'));
        this.femaleBtn.on('pointerdown', () => this._setGender('female'));

        this.add.text(w / 2, 330, 'Avatar', { fontSize: '14px', color: '#cccccc' }).setOrigin(0.5);
        const colors = [0x4ac5ff, 0xff6b6b, 0x51cf66, 0xffd43b];
        this.avatarBgs = [];
        [0, 1, 2, 3].forEach((idx) => {
            const x = w / 2 - 90 + idx * 60;
            const bg = this.add.rectangle(x, 370, 48, 48, colors[idx], 0.4)
                .setStrokeStyle(2, idx === 0 ? 0xffffff : 0x555555)
                .setInteractive({ useHandCursor: true });
            this.add.text(x, 370, `A${idx + 1}`, { fontSize: '16px', color: '#fff' }).setOrigin(0.5);
            bg.on('pointerdown', () => {
                this.selectedAvatar = idx;
                this.avatarBgs.forEach((b, j) => b.setStrokeStyle(2, j === idx ? 0xffffff : 0x555555));
            });
            this.avatarBgs.push(bg);
        });

        this.errorText = this.add.text(w / 2, 430, '', { fontSize: '13px', color: '#ff6b6b' }).setOrigin(0.5).setAlpha(0);

        const startBtn = this.add.text(w / 2, 500, '🎣  START JOURNEY', {
            fontSize: '18px', color: '#ffffff', backgroundColor: '#2a7a3a',
            padding: { x: 24, y: 12 }, fontStyle: 'bold',
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        startBtn.on('pointerdown', () => this._onStart());
    }

    _setGender(g) {
        this.selectedGender = g;
        this.maleBtn.setStyle({ backgroundColor: g === 'male' ? '#4a9eff' : '#3a4a5a' });
        this.femaleBtn.setStyle({ backgroundColor: g === 'female' ? '#4a9eff' : '#3a4a5a' });
    }

    _onStart() {
        if (this.playerName.length < 3) {
            this.errorText.setText('Nama minimal 3 karakter').setAlpha(1);
            this.time.delayedCall(2000, () => this.errorText.setAlpha(0));
            return;
        }

        const player = SaveManager.createPlayer({
            name: this.playerName,
            gender: this.selectedGender,
            avatar: this.selectedAvatar,
        });
        SaveManager.save(player);
        PlayerManager.load();
        this.scene.start('FishingHubScene');
    }
}
