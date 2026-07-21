import Phaser from 'phaser';

export default class InventoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'InventoryScene' });
    }

    create() {
        this.cameras.main.setBackgroundColor(0x1a1a2a);
        this.add.text(480, 320, 'InventoryScene', {
            fontSize: '32px',
            color: '#ffffff',
        }).setOrigin(0.5);
    }
}
