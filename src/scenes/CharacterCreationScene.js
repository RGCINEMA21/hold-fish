import Phaser from 'phaser';
import SaveManager from '../managers/SaveManager.js';
import PlayerManager from '../managers/PlayerManager.js';

/**
 * CharacterCreationScene - Pembuatan karakter pertama
 */
export default class CharacterCreationScene extends Phaser.Scene {

    constructor() {
        super({ key: 'CharacterCreationScene' });

        this.playerName = '';
        this.selectedGender = 'male';
        this.selectedAvatar = 0;
        this.genderButtons = [];
        this.avatarButtons = [];
        this.nameInput = null;
        this.errorText = null;
        this.startButton = null;
    }

    create() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        this.cameras.main.setBackgroundColor(0x0a1628);

        // ==================== LOGO ====================
        this.add.text(w / 2, 50, '🎣 HOLD FISH', {
            fontSize: '40px',
            color: '#4ac5ff',
            fontStyle: 'bold',
        }).setOrigin(0.5);

        this.add.text(w / 2, 95, 'Create Your Character', {
            fontSize: '18px',
            color: '#8899aa',
        }).setOrigin(0.5);

        // ==================== NAME INPUT ====================
        this.add.text(w / 2 - 160, 140, 'Character Name', {
            fontSize: '16px',
            color: '#cccccc',
        });

        this.nameInput = this.add.text(w / 2, 175, '', {
            fontSize: '20px',
            color: '#ffffff',
            backgroundColor: '#1a2a3a',
            padding: { x: 12, y: 8 },
            fixedWidth: 320,
            align: 'center',
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        this.nameInput.on('pointerdown', () => this._openNamePrompt());

        // ==================== GENDER SELECTION ====================
        this.add.text(w / 2 - 160, 215, 'Gender', {
            fontSize: '16px',
            color: '#cccccc',
        });

        const genders = [
            { id: 'male',   label: '♂ Male',   x: w / 2 - 80 },
            { id: 'female', label: '♀ Female', x: w / 2 + 80 },
        ];

        genders.forEach((g) => {
            const btn = this.add.text(g.x, 250, g.label, {
                fontSize: '18px',
                color: '#ffffff',
                backgroundColor: this.selectedGender === g.id ? '#4a9eff' : '#2a3a4a',
                padding: { x: 20, y: 10 },
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            btn.on('pointerdown', () => this._selectGender(g.id));
            this.genderButtons.push({ id: g.id, btn });
        });

        // ==================== AVATAR SELECTION ====================
        this.add.text(w / 2 - 160, 295, 'Avatar', {
            fontSize: '16px',
            color: '#cccccc',
        });

        const avatars = [0, 1, 2, 3];
        const avatarColors = [0x4ac5ff, 0xff6b6b, 0x51cf66, 0xffd43b];

        avatars.forEach((idx) => {
            const x = w / 2 - 120 + idx * 80;
            const y = 340;

            const bg = this.add.rectangle(x, y, 56, 56, avatarColors[idx], 0.3)
                .setStrokeStyle(2, this.selectedAvatar === idx ? 0x4ac5ff : 0x334455)
                .setInteractive({ useHandCursor: true });

            const label = this.add.text(x, y, `A${idx + 1}`, {
                fontSize: '20px',
                color: '#ffffff',
            }).setOrigin(0.5);

            bg.on('pointerdown', () => this._selectAvatar(idx));
            this.avatarButtons.push({ idx, bg, label });
        });

        // ==================== ERROR TEXT ====================
        this.errorText = this.add.text(w / 2, 390, '', {
            fontSize: '14px',
            color: '#ff6b6b',
        }).setOrigin(0.5).setAlpha(0);

        // ==================== START BUTTON ====================
        this.startButton = this.add.text(w / 2, 450, '🎣  START JOURNEY', {
            fontSize: '22px',
            color: '#ffffff',
            backgroundColor: '#2a7a3a',
            padding: { x: 32, y: 14 },
            fontStyle: 'bold',
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        this.startButton.on('pointerdown', () => this._onStartJourney());
        this.startButton.on('pointerover', () => this.startButton.setStyle({ backgroundColor: '#3a9a4a' }));
        this.startButton.on('pointerout', () => this.startButton.setStyle({ backgroundColor: '#2a7a3a' }));

        this._updateUI();
    }

    // ==================== PRIVATE METHODS ====================

    _openNamePrompt() {
        const name = prompt('Masukkan nama karakter (3-16 karakter):');
        if (name !== null) {
            this.playerName = name.trim();
            this._updateUI();
        }
    }

    _selectGender(gender) {
        this.selectedGender = gender;
        this._updateUI();
    }

    _selectAvatar(idx) {
        this.selectedAvatar = idx;
        this._updateUI();
    }

    _validate() {
        if (this.playerName.length < 3) {
            return 'Nama minimal 3 karakter.';
        }
        if (this.playerName.length > 16) {
            return 'Nama maksimal 16 karakter.';
        }
        if (this.playerName === '') {
            return 'Nama tidak boleh kosong.';
        }
        return null;
    }

    _onStartJourney() {
        const error = this._validate();
        if (error) {
            this._showError(error);
            return;
        }

        const player = SaveManager.createPlayer({
            name: this.playerName,
            gender: this.selectedGender,
            avatar: this.selectedAvatar,
        });

        const success = SaveManager.save(player);
        if (!success) {
            this._showError('Gagal menyimpan data. Coba lagi.');
            return;
        }

        PlayerManager.load();
        this.scene.start('MainMenuScene');
    }

    _showError(msg) {
        this.errorText.setText(msg);
        this.errorText.setAlpha(1);
        this.time.delayedCall(3000, () => this.errorText.setAlpha(0));
    }

    _updateUI() {
        // Update name display
        this.nameInput.setText(this.playerName || 'Tap to enter name...');

        // Update gender buttons
        this.genderButtons.forEach(({ id, btn }) => {
            btn.setStyle({
                backgroundColor: this.selectedGender === id ? '#4a9eff' : '#2a3a4a',
            });
        });

        // Update avatar selection
        this.avatarButtons.forEach(({ idx, bg }) => {
            bg.setStrokeStyle(2, this.selectedAvatar === idx ? 0x4ac5ff : 0x334455);
        });
    }
}
