import Phaser from 'phaser';

export default class LoginScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LoginScene' });
    }

    create() {
        this.cameras.main.setBackgroundColor(0x0a1a2a);
        this.add.text(480, 320, 'LoginScene', {
            fontSize: '32px',
            color: '#ffffff',
        }).setOrigin(0.5);
    }
}
