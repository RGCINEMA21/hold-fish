import Phaser from 'phaser';
import GameConfig from './config/GameConfig.js';

import BootScene from './scenes/BootScene.js';
import PreloadScene from './scenes/PreloadScene.js';
import CharacterCreationScene from './scenes/CharacterCreationScene.js';
import MainMenuScene from './scenes/MainMenuScene.js';
import FishingHubScene from './scenes/FishingHubScene.js';
import FishingScene from './scenes/FishingScene.js';
import InventoryScene from './scenes/InventoryScene.js';
import FishBookScene from './scenes/FishBookScene.js';
import FishMarketScene from './scenes/FishMarketScene.js';
import BaitShopScene from './scenes/BaitShopScene.js';
import RodWorkshopScene from './scenes/RodWorkshopScene.js';
import HarborScene from './scenes/HarborScene.js';
import SettingsScene from './scenes/SettingsScene.js';

const config = {
    ...GameConfig,
    scene: [
        BootScene,
        PreloadScene,
        CharacterCreationScene,
        MainMenuScene,
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
};

new Phaser.Game(config);
