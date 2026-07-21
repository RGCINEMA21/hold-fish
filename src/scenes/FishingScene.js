import Phaser from 'phaser';
import PlayerManager from '../managers/PlayerManager.js';
import InventoryManager from '../managers/InventoryManager.js';
import DataManager from '../core/DataManager.js';
import FishingSystem from '../systems/FishingSystem.js';

export default class FishingScene extends Phaser.Scene {

    constructor() {
        super({ key: 'FishingScene' });
        this.isFishing = false;
        this.infoTexts = {};
    }

    create() {
        PlayerManager.load();
        this.isFishing = false;

        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        this.cameras.main.setBackgroundColor(0x0a1628);

        this._buildHUD(w, h);
        this._buildStartButton(w, h);
        this._buildBackButton(w, h);
    }

    // ==================== HUD ====================

    _buildHUD(w, h) {
        const pd = PlayerManager.getData();
        const spot = DataManager.getSpotByID(pd.location.currentSpot);
        const rod  = DataManager.getRodByID(pd.equipment.rod);
        const hook = DataManager.getHookByID(pd.equipment.hook);
        const bait = DataManager.getBaitByID(pd.equipment.bait);

        this.add.text(w / 2, 24, spot?.name ?? 'Unknown Spot', {
            fontSize: '26px', color: '#4ac5ff', fontStyle: 'bold',
        }).setOrigin(0.5);

        const lx = 20, ly = 60;
        const style = { fontSize: '14px', color: '#cccccc' };

        this.add.text(lx, ly,      `🧑 ${pd.character.name}`, style);
        this.add.text(lx, ly + 22, `Lv.${pd.progress.level}`, style);
        this.add.text(lx, ly + 44, `🪙 ${pd.currency.gold}`,   { fontSize: '14px', color: '#ffd700' });
        this.add.text(lx, ly + 66, `💎 ${pd.currency.diamond}`, { fontSize: '14px', color: '#00ccff' });
        this.add.text(lx, ly + 88, `🐟 ${pd.currency.hfish}`,  { fontSize: '14px', color: '#00ff88' });

        const rx = w - 200;
        this.add.text(rx, ly,      `🎣 ${rod?.name ?? '-'}`, style);
        this.add.text(rx, ly + 22, `🪝 ${hook?.name ?? '-'}`, style);
        this.add.text(rx, ly + 44, `🪱 ${bait?.name ?? '-'}`, style);
        this.add.text(rx, ly + 66, `📦 Bait: ${pd.equipment.baitAmount}`, style);

        const cx = w / 2;
        this.infoTexts.weather = this.add.text(cx, ly + 80, '', { fontSize: '13px', color: '#aabbcc' }).setOrigin(0.5);
        this.infoTexts.season  = this.add.text(cx, ly + 98, '', { fontSize: '13px', color: '#aabbcc' }).setOrigin(0.5);
        this.infoTexts.time    = this.add.text(cx, ly + 116,'', { fontSize: '13px', color: '#aabbcc' }).setOrigin(0.5);

        this._updateEnvironmentInfo();
    }

    _updateEnvironmentInfo() {
        const time = FishingSystem._getCurrentTime();
        const weather = FishingSystem._getCurrentWeather();
        const season = FishingSystem._getCurrentSeason();

        const weatherData = DataManager.getWeatherByID(weather);
        const seasonData  = DataManager.getSeasonByID(season);

        this.infoTexts.weather.setText(`☁ Weather: ${weatherData?.name ?? weather}`);
        this.infoTexts.season.setText(`🍂 Season: ${seasonData?.name ?? season}`);
        this.infoTexts.time.setText(`🕐 Time: ${time}`);
    }

    // ==================== START BUTTON ====================

    _buildStartButton(w, h) {
        this.startBtn = this.add.text(w / 2, h - 100, '🎣  START FISHING', {
            fontSize: '22px',
            color: '#ffffff',
            backgroundColor: '#2a7a3a',
            padding: { x: 32, y: 14 },
            fontStyle: 'bold',
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        this.startBtn.on('pointerdown', () => this._onStartFishing());
        this.startBtn.on('pointerover', () => {
            if (!this.isFishing) this.startBtn.setStyle({ backgroundColor: '#3a9a4a' });
        });
        this.startBtn.on('pointerout', () => {
            if (!this.isFishing) this.startBtn.setStyle({ backgroundColor: '#2a7a3a' });
        });
    }

    // ==================== BACK BUTTON ====================

    _buildBackButton(w, h) {
        const backBtn = this.add.text(20, h - 30, '← Back', {
            fontSize: '16px', color: '#888888',
        }).setInteractive({ useHandCursor: true });
        backBtn.on('pointerdown', () => this.scene.start('FishingHubScene'));
    }

    // ==================== FISHING LOGIC ====================

    _onStartFishing() {
        if (this.isFishing) return;

        if (PlayerManager.getBaitAmount() <= 0) {
            this._showMessage("You don't have bait.");
            return;
        }

        PlayerManager.useBait();
        this.isFishing = true;

        this.startBtn.setStyle({ backgroundColor: '#333333' });
        this.startBtn.setText('⏳ Fishing...');
        this.startBtn.disableInteractive();

        this.time.delayedCall(5000, () => {
            this._processResult();
        });
    }

    _processResult() {
        const result = FishingSystem.processCatch();

        if (result.success) {
            const fish = result.fish;
            const weight = result.weight;

            // Gunakan InventoryManager agar type:'fish' ter-include
            InventoryManager.addFish(fish, weight);

            // Tambah ke collection
            PlayerManager.addToCollection(fish.id, weight);

            // Update stats
            PlayerManager.addFishStat(weight);

            // Tambah EXP
            const expGain = Math.floor(fish.price / 2) + 10;
            PlayerManager.addExp(expGain);

            // Tampilkan popup hasil (OK button akan handle restart)
            this._showCatchPopup(fish, weight, result.isNew);
        } else {
            this._showMessage(result.message);
        }
    }

    // ==================== POPUPS ====================

    _showCatchPopup(fish, weight, isNew) {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        const rarityColors = { common: '#aaaaaa', uncommon: '#55cc55', rare: '#5599ff', epic: '#aa55ff', legendary: '#ffaa00' };

        const dim = this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.7).setInteractive();
        const panel = this.add.rectangle(w / 2, h / 2, 360, 260, 0x1a2a3a).setStrokeStyle(2, 0x4a9eff);

        const title = this.add.text(w / 2, h / 2 - 100, isNew ? '🎉 NEW SPECIES DISCOVERED!' : '🐟 Fish Caught!', {
            fontSize: '20px', color: isNew ? '#ffd700' : '#ffffff', fontStyle: 'bold',
        }).setOrigin(0.5);

        const nameText = this.add.text(w / 2, h / 2 - 65, fish.name, {
            fontSize: '24px', color: rarityColors[fish.rarity] || '#ffffff', fontStyle: 'bold',
        }).setOrigin(0.5);

        const infoText = this.add.text(w / 2, h / 2 - 38, `${fish.rarity.toUpperCase()} · ${weight.toFixed(2)} kg`, {
            fontSize: '14px', color: '#cccccc',
        }).setOrigin(0.5);

        const priceText = this.add.text(w / 2, h / 2 - 15, `Sell Price: 🪙 ${fish.price}`, {
            fontSize: '16px', color: '#ffd700',
        }).setOrigin(0.5);

        const descText = this.add.text(w / 2, h / 2 + 12, fish.description, {
            fontSize: '12px', color: '#888888', wordWrap: { width: 300 }, align: 'center',
        }).setOrigin(0.5);

        const expGain = Math.floor(fish.price / 2) + 10;
        const expText = this.add.text(w / 2, h / 2 + 42, `+${expGain} EXP`, {
            fontSize: '14px', color: '#00ff88',
        }).setOrigin(0.5);

        const okBtn = this.add.text(w / 2, h / 2 + 80, 'OK', {
            fontSize: '18px', color: '#ffffff', backgroundColor: '#2a7a3a',
            padding: { x: 40, y: 10 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        okBtn.on('pointerdown', () => {
            dim.destroy(); panel.destroy(); title.destroy();
            nameText.destroy(); infoText.destroy(); priceText.destroy();
            descText.destroy(); expText.destroy(); okBtn.destroy();
            this.scene.restart();
        });
    }

    _showMessage(msg) {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        const dim = this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.6).setInteractive();
        const panel = this.add.rectangle(w / 2, h / 2, 320, 120, 0x1a2a3a).setStrokeStyle(2, 0xff6b6b);

        const text = this.add.text(w / 2, h / 2 - 15, msg, {
            fontSize: '18px', color: '#ff6b6b', fontStyle: 'bold',
        }).setOrigin(0.5);

        const okBtn = this.add.text(w / 2, h / 2 + 30, 'OK', {
            fontSize: '16px', color: '#ffffff', backgroundColor: '#aa3333',
            padding: { x: 30, y: 8 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        okBtn.on('pointerdown', () => {
            dim.destroy(); panel.destroy(); text.destroy(); okBtn.destroy();
            // Re-enable fishing after dismissing error
            this.isFishing = false;
            this.startBtn.setStyle({ backgroundColor: '#2a7a3a' });
            this.startBtn.setText('🎣  START FISHING');
            this.startBtn.setInteractive({ useHandCursor: true });
        });
    }
}
