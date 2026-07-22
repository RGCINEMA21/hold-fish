import Phaser from 'phaser';

console.log('[MAIN] Script loading...');

// Minimal BootScene - langsung ke game
class BootScene extends Phaser.Scene {
    constructor() { super({ key: 'BootScene' }); }
    create() {
        console.log('[BOOT] Scene started');
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        this.cameras.main.setBackgroundColor(0x1a2a3a);

        this.add.text(w/2, h/2-60, '\uD83C\uDFA3', { fontSize: '64px' }).setOrigin(0.5);
        this.add.text(w/2, h/2+10, 'HOLD FISH', { fontSize: '32px', color: '#4ac5ff', fontStyle: 'bold' }).setOrigin(0.5);
        this.add.text(w/2, h/2+55, 'Tap to Start', { fontSize: '18px', color: '#ffffff' }).setOrigin(0.5);

        this.input.once('pointerdown', () => {
            console.log('[BOOT] Tapped, loading game...');
            this._loadGame();
        });
    }

    async _loadGame() {
        try {
            // Dynamic import - bisa catch error
            const { default: GameConfig } = await import('./config/GameConfig.js');
            const { default: SaveManager } = await import('./managers/SaveManager.js');

            console.log('[BOOT] Config loaded');
            const hasSave = SaveManager.hasSave();
            console.log('[BOOT] hasSave:', hasSave);

            if (hasSave) {
                // Langsung ke game - import scene satu per satu
                const { default: FishingHubScene } = await import('./scenes/FishingHubScene.js');
                console.log('[BOOT] FishingHubScene loaded');
                this.scene.add('FishingHubScene', FishingHubScene, true);
            } else {
                const { default: CharScene } = await import('./scenes/CharacterCreationScene.js');
                console.log('[BOOT] CharacterCreationScene loaded');
                this.scene.add('CharacterCreationScene', CharScene, true);
            }
        } catch(e) {
            console.error('[BOOT] ERROR:', e);
            const w = this.cameras.main.width;
            const h = this.cameras.main.height;
            this.add.text(w/2, h/2+120, 'ERROR: ' + e.message, {
                fontSize: '12px', color: '#ff6b6b', wordWrap: { width: w-40 }
            }).setOrigin(0.5);
        }
    }
}

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
    scene: [BootScene],
});
console.log('[MAIN] Game created');
