import Phaser from 'phaser';
import SaveManager from './managers/SaveManager.js';
import PlayerManager from './managers/PlayerManager.js';

class BootScene extends Phaser.Scene {
    constructor() { super('BootScene'); }
    create() {
        const w = this.cameras.main.width, h = this.cameras.main.height;
        this.cameras.main.setBackgroundColor(0x1a2a3a);
        this.add.text(w/2, h/2-40, '\uD83C\uDFA3', { fontSize: '64px' }).setOrigin(0.5);
        this.add.text(w/2, h/2+30, 'HOLD FISH', { fontSize: '32px', color: '#4ac5ff', fontStyle: 'bold' }).setOrigin(0.5);
        this.add.text(w/2, h/2+70, 'Tap to Start', { fontSize: '18px', color: '#ffffff' }).setOrigin(0.5);
        this.input.once('pointerdown', () => {
            this.scene.start(SaveManager.hasSave() ? 'HubScene' : 'CreateScene');
        });
    }
}

class CreateScene extends Phaser.Scene {
    constructor() { super('CreateScene'); }
    create() {
        const w = this.cameras.main.width, h = this.cameras.main.height;
        this.cameras.main.setBackgroundColor(0x1a2a3a);
        this.playerName = '';

        this.add.text(w/2, 40, 'CREATE CHARACTER', { fontSize: '22px', color: '#4ac5ff', fontStyle: 'bold' }).setOrigin(0.5);

        this.add.text(w/2, 110, 'Your Name', { fontSize: '14px', color: '#cccccc' }).setOrigin(0.5);
        this.nameText = this.add.text(w/2, 150, 'Tap to type name...', {
            fontSize: '18px', color: '#888888', backgroundColor: '#2a3a4a',
            padding: { x: 16, y: 12 }, fixedWidth: 300, align: 'center',
        }).setOrigin(0.5).setInteractive();

        this.nameText.on('pointerdown', () => {
            const input = document.createElement('input');
            input.type = 'text'; input.maxLength = 16; input.placeholder = 'Name (3-16 chars)';
            const r = this.game.canvas.getBoundingClientRect();
            input.style.cssText = 'position:fixed;top:'+(r.top+r.height*0.14)+'px;left:'+(r.left+r.width*0.15)+'px;width:'+(r.width*0.7)+'px;height:44px;font-size:18px;padding:8px;border:2px solid #4a9eff;border-radius:8px;background:#1a2a3a;color:#fff;text-align:center;z-index:999;outline:none;';
            document.body.appendChild(input);
            input.focus();
            input.addEventListener('blur', () => {
                this.playerName = input.value.trim();
                this.nameText.setText(this.playerName || 'Tap to type name...');
                this.nameText.setStyle({ color: this.playerName ? '#fff' : '#888888' });
                input.remove();
            });
            input.addEventListener('keydown', e => { if(e.key==='Enter') input.blur(); });
        });

        this.err = this.add.text(w/2, 210, '', { fontSize: '13px', color: '#ff6b6b' }).setOrigin(0.5).setAlpha(0);

        const btn = this.add.text(w/2, 280, 'START JOURNEY', {
            fontSize: '20px', color: '#fff', backgroundColor: '#2a7a3a',
            padding: { x: 24, y: 14 }, fontStyle: 'bold',
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        btn.on('pointerdown', () => {
            if (this.playerName.length < 3) {
                this.err.setText('Min 3 characters').setAlpha(1);
                this.time.delayedCall(2000, () => this.err.setAlpha(0));
                return;
            }
            const player = SaveManager.createPlayer({ name: this.playerName, gender: 'male', avatar: 0 });
            SaveManager.save(player);
            PlayerManager.load();
            this.scene.start('HubScene');
        });
    }
}

class HubScene extends Phaser.Scene {
    constructor() { super('HubScene'); }
    create() {
        PlayerManager.load();
        const w = this.cameras.main.width, h = this.cameras.main.height;
        this.cameras.main.setBackgroundColor(0x1a2a3a);

        const pd = PlayerManager.getData();
        this.add.text(w/2, 30, 'FISHING HUB', { fontSize: '24px', color: '#4ac5ff', fontStyle: 'bold' }).setOrigin(0.5);
        this.add.text(w/2, 65, pd?.character?.name+' Lv.'+pd?.progress?.level, { fontSize: '14px', color: '#fff' }).setOrigin(0.5);
        this.add.text(w/2, 88, 'Gold: '+pd?.currency?.gold, { fontSize: '13px', color: '#ffd700' }).setOrigin(0.5);

        const btns = [
            ['FISHING DOCK', 0x2a5a3a],
            ['FISH MARKET', 0x2a4a3a],
            ['BAIT SHOP', 0x2a4a3a],
            ['ROD WORKSHOP', 0x2a4a3a],
            ['HARBOR', 0x2a4a3a],
            ['FISH BOOK', 0x2a4a3a],
            ['INVENTORY', 0x2a4a3a],
            ['SETTINGS', 0x2a4a3a],
        ];

        btns.forEach((b, i) => {
            const col = i % 2, row = Math.floor(i / 2);
            const bx = 20 + col * ((w-50)/2 + 10) + (w-50)/4;
            const by = 130 + row * 60;
            const bg = this.add.rectangle(bx, by, (w-50)/2, 48, b[1]).setStrokeStyle(2, 0x4a9a5a);
            this.add.text(bx, by, b[0], { fontSize: '12px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5);
            bg.setInteractive({ useHandCursor: true });
            bg.on('pointerdown', () => this.add.text(w/2, h-40, b[0]+' - Coming Soon', { fontSize: '14px', color: '#ffd700' }).setOrigin(0.5));
        });
    }
}

new Phaser.Game({
    type: Phaser.AUTO,
    width: 640, height: 960,
    parent: 'game-container',
    backgroundColor: '#1a2a3a',
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: [BootScene, CreateScene, HubScene],
});
