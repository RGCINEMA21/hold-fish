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

        this.add.text(w / 2, 50, '\uD83C\uDFA3 HOLD FISH', { fontSize: '28px', color: '#4ac5ff', fontStyle: 'bold' }).setOrigin(0.5);
        this.add.text(w / 2, 85, 'Create Your Character', { fontSize: '14px', color: '#ffffff' }).setOrigin(0.5);

        // Name input - gunakan DOM input
        this.add.text(w / 2, 140, 'Character Name', { fontSize: '14px', color: '#cccccc' }).setOrigin(0.5);

        this.nameText = this.add.text(w / 2, 180, 'Tap here to type...', {
            fontSize: '16px', color: '#888888', backgroundColor: '#2a3a4a',
            padding: { x: 12, y: 10 }, fixedWidth: 280, align: 'center',
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        this.nameText.on('pointerdown', () => this._showNameInput());

        // Gender
        this.add.text(w / 2, 240, 'Gender', { fontSize: '14px', color: '#cccccc' }).setOrigin(0.5);
        this.maleBtn = this.add.text(w / 2 - 70, 275, '\u2642 Male', {
            fontSize: '15px', color: '#ffffff', backgroundColor: '#4a9eff',
            padding: { x: 16, y: 8 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        this.femaleBtn = this.add.text(w / 2 + 70, 275, '\u2640 Female', {
            fontSize: '15px', color: '#ffffff', backgroundColor: '#3a4a5a',
            padding: { x: 16, y: 8 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        this.maleBtn.on('pointerdown', () => this._setGender('male'));
        this.femaleBtn.on('pointerdown', () => this._setGender('female'));

        // Avatar
        this.add.text(w / 2, 340, 'Avatar', { fontSize: '14px', color: '#cccccc' }).setOrigin(0.5);
        const colors = [0x4ac5ff, 0xff6b6b, 0x51cf66, 0xffd43b];
        this.avatarBgs = [];
        [0, 1, 2, 3].forEach((idx) => {
            const x = w / 2 - 90 + idx * 60;
            const bg = this.add.rectangle(x, 380, 48, 48, colors[idx], 0.4)
                .setStrokeStyle(2, idx === 0 ? 0xffffff : 0x555555)
                .setInteractive({ useHandCursor: true });
            this.add.text(x, 380, `A${idx + 1}`, { fontSize: '16px', color: '#fff' }).setOrigin(0.5);
            bg.on('pointerdown', () => {
                this.selectedAvatar = idx;
                this.avatarBgs.forEach((b, j) => b.setStrokeStyle(2, j === idx ? 0xffffff : 0x555555));
            });
            this.avatarBgs.push(bg);
        });

        // Error
        this.errorText = this.add.text(w / 2, 440, '', { fontSize: '13px', color: '#ff6b6b' }).setOrigin(0.5).setAlpha(0);

        // Start button
        const startBtn = this.add.text(w / 2, 510, '\uD83C\uDFA3  START JOURNEY', {
            fontSize: '18px', color: '#ffffff', backgroundColor: '#2a7a3a',
            padding: { x: 24, y: 12 }, fontStyle: 'bold',
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        startBtn.on('pointerdown', () => this._onStart());
    }

    _showNameInput() {
        // Buat DOM input element
        const gameCanvas = this.game.canvas;
        const rect = gameCanvas.getBoundingClientRect();

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Masukkan nama (3-16)';
        input.maxLength = 16;
        input.value = this.playerName;
        input.style.cssText = `
            position: fixed;
            top: ${rect.top + rect.height * 0.17}px;
            left: ${rect.left + rect.width * 0.15}px;
            width: ${rect.width * 0.7}px;
            height: 40px;
            font-size: 18px;
            padding: 8px 12px;
            border: 2px solid #4a9eff;
            border-radius: 8px;
            background: #1a2a3a;
            color: #ffffff;
            text-align: center;
            z-index: 1000;
            outline: none;
        `;

        document.body.appendChild(input);
        input.focus();

        const cleanup = () => {
            if (input.parentNode) {
                this.playerName = input.value.trim();
                this.nameText.setText(this.playerName || 'Tap here to type...');
                this.nameText.setStyle({ color: this.playerName ? '#ffffff' : '#888888' });
                input.remove();
            }
        };

        input.addEventListener('blur', cleanup);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') input.blur();
        });
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
