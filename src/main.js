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

        // Tombol besar yang bisa di-tap
        const btn = this.add.rectangle(w/2, h/2+110, 280, 60, 0x2a7a3a)
            .setStrokeStyle(3, 0x4ac5ff)
            .setInteractive({ useHandCursor: true });
        this.add.text(w/2, h/2+110, 'TAP TO START', { fontSize: '20px', color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5);

        // Klik tombol
        btn.on('pointerdown', () => {
            this.scene.start(SaveManager.hasSave() ? 'HubScene' : 'CreateScene');
        });

        // Fallback: klik di mana saja
        this.input.on('pointerdown', () => {
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
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        this.nameText.on('pointerdown', (pointer) => {
            pointer.event.stopPropagation();
            this._showInput();
        });

        this.err = this.add.text(w/2, 210, '', { fontSize: '13px', color: '#ff6b6b' }).setOrigin(0.5).setAlpha(0);

        const btn = this.add.rectangle(w/2, 280, 260, 52, 0x2a7a3a).setStrokeStyle(2, 0x4ac5ff).setInteractive({ useHandCursor: true });
        this.add.text(w/2, 280, 'START JOURNEY', { fontSize: '18px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5);

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

    _showInput() {
        const r = this.game.canvas.getBoundingClientRect();
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 16;
        input.placeholder = 'Name (3-16)';
        input.value = this.playerName;
        input.style.cssText = 'position:fixed;top:'+(r.top+r.height*0.14)+'px;left:'+(r.left+r.width*0.1)+'px;width:'+(r.width*0.8)+'px;height:48px;font-size:20px;padding:8px;border:2px solid #4a9eff;border-radius:10px;background:#1a2a3a;color:#fff;text-align:center;z-index:9999;outline:none;';
        document.body.appendChild(input);
        input.focus();
        input.addEventListener('blur', () => {
            this.playerName = input.value.trim();
            this.nameText.setText(this.playerName || 'Tap to type name...');
            this.nameText.setStyle({ color: this.playerName ? '#fff' : '#888888' });
            if (input.parentNode) input.remove();
        });
        input.addEventListener('keydown', e => { if (e.key === 'Enter') input.blur(); });
    }
}

class HubScene extends Phaser.Scene {
    constructor() { super('HubScene'); }
    create() {
        PlayerManager.load();
        const w = this.cameras.main.width, h = this.cameras.main.height;
        this.cameras.main.setBackgroundColor(0x1a2a3a);

        const pd = PlayerManager.getData();
        this.add.text(w/2, 30, '\uD83C\uDFE0 FISHING HUB', { fontSize: '24px', color: '#4ac5ff', fontStyle: 'bold' }).setOrigin(0.5);
        this.add.text(w/2, 65, (pd?.character?.name||'Fisher')+' Lv.'+(pd?.progress?.level||1), { fontSize: '14px', color: '#fff' }).setOrigin(0.5);
        this.add.text(w/2, 88, '\uD83E\uDE99 '+(pd?.currency?.gold||0), { fontSize: '13px', color: '#ffd700' }).setOrigin(0.5);

        const labels = ['\uD83C\uDFA3 Fishing Dock','\uD83C\uDFEA Fish Market','\uD83E\uDEB1 Bait Shop','\uD83D\uDD27 Rod Workshop','\u2693 Harbor','\uD83D\uDCD6 Fish Book','\uD83D\uDCE6 Inventory','\u2699\uFE0F Settings'];
        const cols = 2;
        const bw = (w-50)/cols;

        labels.forEach((label, i) => {
            const col = i % cols, row = Math.floor(i/cols);
            const bx = 25 + col*(bw+10) + bw/2;
            const by = 130 + row*65;
            const bg = this.add.rectangle(bx, by, bw, 52, 0x2a4a3a).setStrokeStyle(2, 0x4a9a5a).setInteractive({ useHandCursor: true });
            this.add.text(bx, by, label, { fontSize: '12px', color: '#fff', fontStyle: 'bold', align: 'center', wordWrap: { width: bw-20 } }).setOrigin(0.5);
            bg.on('pointerdown', () => {
                const t = this.add.text(w/2, h-50, label+' - Coming Soon', { fontSize: '14px', color: '#ffd700' }).setOrigin(0.5);
                this.time.delayedCall(1500, () => t.destroy());
            });
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
