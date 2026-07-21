import Phaser from 'phaser';

export default class SettingsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SettingsScene' });
    }

    create() {
        this.cameras.main.setBackgroundColor(0x2a1a1a);
        this.add.text(480, 320, 'SettingsScene', {
            fontSize: '32px',
            color: '#ffffff',
        }).setOrigin(0.5);
    }
}
