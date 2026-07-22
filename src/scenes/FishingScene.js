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
        this.cameras.main.setBackgroundColor(0x1a2a3a);

        this._buildHUD(w, h);
        this._buildStartButton(w, h);
        this._buildBackButton(w, h);
    }

    _buildHUD(w, h) {
        const pd = PlayerManager.getData();
        const spot = DataManager.getSpotByID(pd.location.currentSpot);
        const rod  = DataManager.getRodByID(pd.equipment.rod);
        const hook = DataManager.getHookByID(pd.equipment.hook);
        const bait = DataManager.getBaitByID(pd.equipment.bait);

        // Spot name
        this.add.text(w / 2, 30, spot?.name ?? 'Unknown Spot', {
            fontSize: '22px', color: '#4ac5ff', fontStyle: 'bold',
        }).setOrigin(0.5);

        // Player info panel (left)
        const ly = 80;
        const style = { fontSize: '13px', color: '#cccccc' };
        this.add.text(20, ly,      `🧑 ${pd.character.name}`, style);
        this.add.text(20, ly + 20, `Lv.${pd.progress.level}`, style);
        this.add.text(20, ly + 40, `🪙 ${pd.currency.gold}`,   { fontSize: '13px', color: '#ffd700' });
        this.add.text(20, ly + 60, `💎 ${pd.currency.diamond}`, { fontSize: '13px', color: '#00ccff' });
        this.add.text(20, ly + 80, `🐟 ${pd.currency.hfish}`,  { fontSize: '13px', color: '#00ff88' });

        // Equipment panel (right)
        const rx = w - 180;
        this.add.text(rx, ly,      `🎣 ${rod?.name ?? '-'}`, style);
        this.add.text(rx, ly + 20, `🪝 ${hook?.name ?? '-'}`, style);
        this.add.text(rx, ly + 40, `🪱 ${bait?.name ?? '-'}`, style);
        this.add.text(rx, ly + 60, `📦 Bait: ${pd.equipment.baitAmount}`, style);

        // Environment info
        const cy = ly + 110;
        this.infoTexts.weather = this.add.text(w / 2, cy,      '', { fontSize: '12px', color: '#aabbcc' }).setOrigin(0.5);
        this.infoTexts.season  = this.add.text(w / 2, cy + 18, '', { fontSize: '12px', color: '#aabbcc' }).setOrigin(0.5);
        this.infoTexts.time    = this.add.text(w / 2, cy + 36, '', { fontSize: '12px', color: '#aabbcc' }).setOrigin(0.5);

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

    _buildStartButton(w, h) {
        this.startBtn = this.add.text(w / 2, h - 120, '🎣  START FISHING', {
            fontSize: '20px', color: '#ffffff',
            backgroundColor: '#2a7a3a',
            padding: { x: 28, y: 12 },
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

    _buildBackButton(w, h) {
        const backBtn = this.add.text(20, h - 30, '← Back', {
            fontSize: '15px', color: '#888888',
        }).setInteractive({ useHandCursor: true });
        backBtn.on('pointerdown', () => this.scene.start('FishingHubScene'));
    }

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
            InventoryManager.addFish(result.fish, result.weight);
            PlayerManager.addToCollection(result.fish.id, result.weight);
            PlayerManager.addFishStat(result.weight);
            const expGain = Math.floor(result.fish.price / 2) + 10;
            PlayerManager.addExp(expGain);
            this._showCatchPopup(result.fish, result.weight, result.isNew);
        } else {
            this._showMessage(result.message);
        }
    }

    _showCatchPopup(fish, weight, isNew) {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const rarityColors = { common: '#aaaaaa', uncommon: '#55cc55', rare: '#5599ff', epic: '#aa55ff', legendary: '#ffaa00' };

        const dim = this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.7).setInteractive();
        const panel = this.add.rectangle(w / 2, h / 2, w - 60, 280, 0x1a2a3a).setStrokeStyle(2, 0x4a9eff);

        const elements = [];
        let y = h / 2 - 110;

        elements.push(this.add.text(w / 2, y, isNew ? '🎉 NEW SPECIES!' : '🐟 Fish Caught!', {
            fontSize: '18px', color: isNew ? '#ffd700' : '#ffffff', fontStyle: 'bold',
        }).setOrigin(0.5)); y += 30;

        elements.push(this.add.text(w / 2, y, fish.name, {
            fontSize: '22px', color: rarityColors[fish.rarity] || '#ffffff', fontStyle: 'bold',
        }).setOrigin(0.5)); y += 28;

        elements.push(this.add.text(w / 2, y, `${fish.rarity.toUpperCase()} · ${weight.toFixed(2)} kg`, {
            fontSize: '13px', color: '#cccccc',
        }).setOrigin(0.5)); y += 22;

        elements.push(this.add.text(w / 2, y, `Sell Price: 🪙 ${fish.price}`, {
            fontSize: '14px', color: '#ffd700',
        }).setOrigin(0.5)); y += 20;

        elements.push(this.add.text(w / 2, y, fish.description, {
            fontSize: '11px', color: '#888888', wordWrap: { width: w - 100 }, align: 'center',
        }).setOrigin(0.5)); y += 30;

        const expGain = Math.floor(fish.price / 2) + 10;
        elements.push(this.add.text(w / 2, y, `+${expGain} EXP`, {
            fontSize: '13px', color: '#00ff88',
        }).setOrigin(0.5));

        const okBtn = this.add.text(w / 2, h / 2 + 110, 'OK', {
            fontSize: '16px', color: '#ffffff', backgroundColor: '#2a7a3a',
            padding: { x: 36, y: 10 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        okBtn.on('pointerdown', () => {
            dim.destroy(); panel.destroy(); okBtn.destroy();
            elements.forEach(e => e.destroy());
            this.scene.restart();
        });
    }

    _showMessage(msg) {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        const dim = this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.6).setInteractive();
        const panel = this.add.rectangle(w / 2, h / 2, w - 80, 120, 0x1a2a3a).setStrokeStyle(2, 0xff6b6b);

        const text = this.add.text(w / 2, h / 2 - 15, msg, {
            fontSize: '16px', color: '#ff6b6b', fontStyle: 'bold',
        }).setOrigin(0.5);

        const okBtn = this.add.text(w / 2, h / 2 + 30, 'OK', {
            fontSize: '14px', color: '#ffffff', backgroundColor: '#aa3333',
            padding: { x: 28, y: 8 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        okBtn.on('pointerdown', () => {
            dim.destroy(); panel.destroy(); text.destroy(); okBtn.destroy();
            this.isFishing = false;
            this.startBtn.setStyle({ backgroundColor: '#2a7a3a' });
            this.startBtn.setText('🎣  START FISHING');
            this.startBtn.setInteractive({ useHandCursor: true });
        });
    }
}
