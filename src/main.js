import Phaser from "phaser";
// ZERO IMPORTS - EVERYTHING INLINE
const SAVE_KEY = 'holdfish_save';

function saveData(d) { try { localStorage.setItem(SAVE_KEY, JSON.stringify(d)); } catch(e) {} }
function loadData() { try { const r = localStorage.getItem(SAVE_KEY); return r ? JSON.parse(r) : null; } catch(e) { return null; } }
function hasSave() { return localStorage.getItem(SAVE_KEY) !== null; }

function createPlayer(name) {
    return {
        character: { name, gender: 'male', avatar: 0 },
        progress: { level: 1, exp: 0 },
        currency: { gold: 500, diamond: 0, hfish: 0 },
        equipment: { rod: 'wood_rod', hook: 'basic_hook', bait: 'worm_bait', baitAmount: 20 },
        location: { currentSpot: 'village_pond' },
        inventory: [], fishCollection: [],
        settings: { musicVolume: 100, sfxVolume: 100 },
        meta: { createdDate: new Date().toISOString() }
    };
}

var playerData = null;
function loadPlayer() { playerData = loadData(); return playerData; }
function getPlayer() { return playerData; }

// ===== BOOT SCENE =====
class BootScene extends Phaser.Scene {
    constructor() { super('BootScene'); }
    create() {
        var w = this.cameras.main.width, h = this.cameras.main.height;
        this.cameras.main.setBackgroundColor(0x1a2a3a);
        this.add.text(w/2, h/2 - 50, '\uD83C\uDFA3', { fontSize: '72px' }).setOrigin(0.5);
        this.add.text(w/2, h/2 + 30, 'HOLD FISH', { fontSize: '36px', color: '#4ac5ff', fontStyle: 'bold' }).setOrigin(0.5);

        var startBtn = this.add.rectangle(w/2, h/2 + 120, 300, 60, 0x2a7a3a).setStrokeStyle(3, 0x4ac5ff);
        startBtn.setInteractive({ useHandCursor: true });
        this.add.text(w/2, h/2 + 120, 'TAP TO START', { fontSize: '22px', color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5);

        var self = this;
        startBtn.on('pointerdown', function() { self.goNext(); });
        // Also allow tapping anywhere
        this.input.on('pointerdown', function() { self.goNext(); });
    }
    goNext() {
        this.scene.start(hasSave() ? 'HubScene' : 'CreateScene');
    }
}

// ===== CREATE SCENE =====
class CreateScene extends Phaser.Scene {
    constructor() { super('CreateScene'); }
    create() {
        var w = this.cameras.main.width, h = this.cameras.main.height;
        this.cameras.main.setBackgroundColor(0x1a2a3a);
        this.playerName = '';

        this.add.text(w/2, 60, 'CREATE CHARACTER', { fontSize: '24px', color: '#4ac5ff', fontStyle: 'bold' }).setOrigin(0.5);

        this.add.text(w/2, 140, 'Character Name', { fontSize: '16px', color: '#cccccc' }).setOrigin(0.5);

        this.nameDisplay = this.add.text(w/2, 185, 'Tap here to type...', {
            fontSize: '18px', color: '#888888', backgroundColor: '#2a3a4a',
            padding: { x: 16, y: 12 }, fixedWidth: 320, align: 'center'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        var self = this;
        this.nameDisplay.on('pointerdown', function() {
            var input = document.createElement('input');
            input.type = 'text';
            input.maxLength = 16;
            input.placeholder = 'Name 3-16 chars';
            input.value = self.playerName;
            var rect = self.game.canvas.getBoundingClientRect();
            input.style.position = 'fixed';
            input.style.top = (rect.top + rect.height * 0.17) + 'px';
            input.style.left = (rect.left + rect.width * 0.1) + 'px';
            input.style.width = (rect.width * 0.8) + 'px';
            input.style.height = '50px';
            input.style.fontSize = '20px';
            input.style.padding = '8px';
            input.style.border = '2px solid #4a9eff';
            input.style.borderRadius = '10px';
            input.style.background = '#1a2a3a';
            input.style.color = '#ffffff';
            input.style.textAlign = 'center';
            input.style.zIndex = '9999';
            input.style.outline = 'none';
            document.body.appendChild(input);
            input.focus();
            input.addEventListener('blur', function() {
                self.playerName = input.value.trim();
                self.nameDisplay.setText(self.playerName || 'Tap here to type...');
                self.nameDisplay.setStyle({ color: self.playerName ? '#ffffff' : '#888888' });
                if (input.parentNode) input.remove();
            });
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') input.blur();
            });
        });

        this.errText = this.add.text(w/2, 250, '', { fontSize: '14px', color: '#ff6b6b' }).setOrigin(0.5).setAlpha(0);

        var startBtn = this.add.rectangle(w/2, 330, 280, 56, 0x2a7a3a).setStrokeStyle(2, 0x4ac5ff);
        startBtn.setInteractive({ useHandCursor: true });
        this.add.text(w/2, 330, 'START JOURNEY', { fontSize: '20px', color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5);

        startBtn.on('pointerdown', function() {
            if (self.playerName.length < 3) {
                self.errText.setText('Min 3 characters!').setAlpha(1);
                self.time.delayedCall(2000, function() { self.errText.setAlpha(0); });
                return;
            }
            var player = createPlayer(self.playerName);
            saveData(player);
            loadPlayer();
            self.scene.start('HubScene');
        });
    }
}

// ===== HUB SCENE =====
class HubScene extends Phaser.Scene {
    constructor() { super('HubScene'); }
    create() {
        loadPlayer();
        var pd = getPlayer();
        var w = this.cameras.main.width, h = this.cameras.main.height;
        this.cameras.main.setBackgroundColor(0x1a2a3a);

        this.add.text(w/2, 30, '\uD83C\uDFE0 FISHING HUB', { fontSize: '26px', color: '#4ac5ff', fontStyle: 'bold' }).setOrigin(0.5);

        var name = pd ? pd.character.name : 'Fisher';
        var level = pd ? pd.progress.level : 1;
        var gold = pd ? pd.currency.gold : 0;

        this.add.text(w/2, 70, name + '  Lv.' + level, { fontSize: '16px', color: '#ffffff' }).setOrigin(0.5);
        this.add.text(w/2, 95, '\uD83E\uDE99 ' + gold + ' Gold', { fontSize: '14px', color: '#ffd700' }).setOrigin(0.5);

        var labels = [
            '\uD83C\uDFA3  Fishing Dock',
            '\uD83C\uDFEA  Fish Market',
            '\uD83E\uDEB1  Bait Shop',
            '\uD83D\uDD27  Rod Workshop',
            '\u2693  Harbor',
            '\uD83D\uDCD6  Fish Book',
            '\uD83D\uDCE6  Inventory',
            '\u2699\uFE0F  Settings'
        ];

        var cols = 2;
        var bw = (w - 60) / cols;

        for (var i = 0; i < labels.length; i++) {
            var col = i % cols;
            var row = Math.floor(i / cols);
            var bx = 30 + col * (bw + 10) + bw / 2;
            var by = 145 + row * 70;

            var bg = this.add.rectangle(bx, by, bw, 55, 0x2a4a3a).setStrokeStyle(2, 0x4a9a5a);
            bg.setInteractive({ useHandCursor: true });
            this.add.text(bx, by, labels[i], { fontSize: '13px', color: '#ffffff', fontStyle: 'bold', align: 'center' }).setOrigin(0.5);

            (function(label) {
                bg.on('pointerdown', function() {
                    var msg = this.add.text(w/2, h - 60, label + ' - Coming Soon', { fontSize: '14px', color: '#ffd700' }).setOrigin(0.5);
                    this.time.delayedCall(1500, function() { msg.destroy(); });
                });
            }).call(this, labels[i]);
        }
    }
}

// ===== START GAME =====
new Phaser.Game({
    type: Phaser.AUTO,
    width: 640,
    height: 960,
    parent: 'game-container',
    backgroundColor: '#1a2a3a',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [BootScene, CreateScene, HubScene],
});
