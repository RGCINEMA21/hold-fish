import Phaser from 'phaser';
import GameConfig from './config/GameConfig.js';

import BootScene from './scenes/BootScene.js';
import PreloadScene from './scenes/PreloadScene.js';
import CharacterCreationScene from './scenes/CharacterCreationScene.js';
import MainMenuScene from './scenes/MainMenuScene.js';
import FishingScene from './scenes/FishingScene.js';
import InventoryScene from './scenes/InventoryScene.js';
import SettingsScene from './scenes/SettingsScene.js';

const config = {
    ...GameConfig,
    scene: [
        BootScene,
        PreloadScene,
        CharacterCreationScene,
        MainMenuScene,
        FishingScene,
        InventoryScene,
        SettingsScene,
    ],
};

new Phaser.Game(config);
