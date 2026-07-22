export default {
    type: Phaser.AUTO,
    width: 640,
    height: 960,
    parent: 'game-container',
    backgroundColor: '#1a2a3a',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    input: {
        activePointers: 2,
    },
    scene: [],
};
