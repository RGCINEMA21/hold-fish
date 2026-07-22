/**
 * GameConfig.js - Konfigurasi utama Phaser 3
 * Resolusi portrait-friendly untuk mobile, scalable ke desktop
 */
export default {
    type: Phaser.AUTO,
    width: 640,
    height: 960,
    parent: 'game-container',
    backgroundColor: '#0a0a1a',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: {
            width: 320,
            height: 480,
        },
        max: {
            width: 1920,
            height: 1080,
        },
    },
    input: {
        activePointers: 2,
    },
    scene: [],
};
