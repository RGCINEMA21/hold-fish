import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import CharacterCreationScene from './scenes/CharacterCreationScene.js';
import FishingHubScene from './scenes/FishingHubScene.js';
import FishingScene from './scenes/FishingScene.js';
import InventoryScene from './scenes/InventoryScene.js';
import FishBookScene from './scenes/FishBookScene.js';
import FishMarketScene from './scenes/FishMarketScene.js';
import BaitShopScene from './scenes/BaitShopScene.js';
import RodWorkshopScene from './scenes/RodWorkshopScene.js';
import HarborScene from './scenes/HarborScene.js';
import SettingsScene from './scenes/SettingsScene.js';

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
    scene: [
        BootScene,
        CharacterCreationScene,
        FishingHubScene,
        FishingScene,
        InventoryScene,
        FishBookScene,
        FishMarketScene,
        BaitShopScene,
        RodWorkshopScene,
        HarborScene,
        SettingsScene,
    ],
});
