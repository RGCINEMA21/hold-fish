import Phaser from 'phaser';
import InventoryManager from '../managers/InventoryManager.js';
import DataManager from '../core/DataManager.js';

export default class InventoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'InventoryScene' });
        this.currentTab = 'fish';
        this.currentSort = 'newest';
        this.currentFilter = null;
        this.searchQuery = '';
    }

    create() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        this.cameras.main.setBackgroundColor(0x0a1628);

        this.add.text(w / 2, 20, '📦 INVENTORY', { fontSize: '24px', color: '#4ac5ff', fontStyle: 'bold' }).setOrigin(0.5);

        this._buildTabs(w);
        this._buildSortBar(w);
        this._buildFilterBar(w);
        this._buildSearchBar(w);
        this._buildFishList(w, h);
        this._buildBackButton();
    }

    _buildTabs(w) {
        const tabs = ['fish', 'bait', 'hooks', 'rods', 'boat', 'special', 'currency'];
        const tabW = 90;
        const startX = w / 2 - (tabs.length * tabW) / 2 + tabW / 2;
        tabs.forEach((tab, i) => {
            const x = startX + i * tabW;
            const btn = this.add.text(x, 55, tab.toUpperCase(), {
                fontSize: '11px', color: this.currentTab === tab ? '#ffffff' : '#666666',
                backgroundColor: this.currentTab === tab ? '#2a5a3a' : '#1a2a3a',
                padding: { x: 8, y: 5 },
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });
            btn.on('pointerdown', () => { this.currentTab = tab; this.scene.restart(); });
        });
    }

    _buildSortBar(w) {
        if (this.currentTab !== 'fish') return;
        const sorts = ['newest', 'oldest', 'highestPrice', 'lowestPrice', 'largestWeight', 'smallestWeight', 'nameAZ', 'nameZA'];
        const labels = ['New', 'Old', 'Price↓', 'Price↑', 'Weight↓', 'Weight↑', 'A-Z', 'Z-A'];
        sorts.forEach((s, i) => {
            const x = 30 + i * 110;
            const btn = this.add.text(x, 85, labels[i], {
                fontSize: '11px', color: this.currentSort === s ? '#ffffff' : '#888888',
                backgroundColor: this.currentSort === s ? '#3a4a5a' : '#1a2a3a',
                padding: { x: 6, y: 3 },
            }).setInteractive({ useHandCursor: true });
            btn.on('pointerdown', () => { this.currentSort = s; this.scene.restart(); });
        });
    }

    _buildFilterBar(w) {
        if (this.currentTab !== 'fish') return;
        const filters = [null, 'common', 'uncommon', 'rare', 'epic', 'legendary'];
        const labels = ['All', 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
        const colors = ['#ffffff', '#aaaaaa', '#55cc55', '#5599ff', '#aa55ff', '#ffaa00'];
        filters.forEach((f, i) => {
            const x = 30 + i * 100;
            const btn = this.add.text(x, 105, labels[i], {
                fontSize: '11px', color: this.currentFilter === f ? '#ffffff' : colors[i],
                backgroundColor: this.currentFilter === f ? '#3a4a5a' : '#1a2a3a',
                padding: { x: 6, y: 3 },
            }).setInteractive({ useHandCursor: true });
            btn.on('pointerdown', () => { this.currentFilter = f; this.scene.restart(); });
        });
    }

    _buildSearchBar(w) {
        if (this.currentTab !== 'fish') return;

        const searchBg = this.add.rectangle(w / 2, 128, 300, 28, 0x1a2a3a).setStrokeStyle(1, 0x3a4a5a);
        const searchLabel = this.add.text(w / 2 - 140, 128, '🔍', {
            fontSize: '13px', color: '#888888',
        }).setOrigin(0, 0.5);

        const searchText = this.add.text(w / 2 - 120, 128, this.searchQuery || 'Search fish...', {
            fontSize: '12px', color: this.searchQuery ? '#ffffff' : '#666666',
        }).setOrigin(0, 0.5);

        searchBg.setInteractive({ useHandCursor: true });
        searchBg.on('pointerdown', () => {
            const q = prompt('Search fish by name:', this.searchQuery || '');
            if (q !== null) {
                this.searchQuery = q.trim();
                this.scene.restart();
            }
        });
    }

    _buildFishList(w, h) {
        if (this.currentTab !== 'fish') {
            this.add.text(w / 2, h / 2, 'Coming Soon', { fontSize: '20px', color: '#555555' }).setOrigin(0.5);
            return;
        }

        let fish = InventoryManager.getAllFish();

        // Apply search
        if (this.searchQuery) {
            const q = this.searchQuery.toLowerCase();
            fish = fish.filter(f => f.name.toLowerCase().includes(q));
        }

        // Apply filter
        if (this.currentFilter) {
            fish = fish.filter(f => f.rarity === this.currentFilter);
        }

        // Apply sort
        fish = InventoryManager.sortFish(fish, this.currentSort);

        const startY = 150;
        const slotH = 42;
        const maxSlots = Math.floor((h - startY - 40) / slotH);

        fish.slice(0, maxSlots).forEach((f, i) => {
            const y = startY + i * slotH;
            const rarityColors = { common: 0xaaaaaa, uncommon: 0x55cc55, rare: 0x5599ff, epic: 0xaa55ff, legendary: 0xffaa00 };
            this.add.rectangle(w / 2, y + 15, w - 40, 38, 0x1a2a3a, 0.8);
            this.add.rectangle(20, y + 15, 4, 34, rarityColors[f.rarity] || 0xaaaaaa);
            this.add.text(35, y + 5, `${f.favorite ? '⭐ ' : ''}${f.name}`, { fontSize: '13px', color: '#ffffff' });
            this.add.text(35, y + 22, `${f.weight.toFixed(2)} kg · 🪙${f.price} · ${f.rarity}`, { fontSize: '10px', color: '#888888' });

            const slot = this.add.rectangle(w / 2, y + 15, w - 40, 38).setInteractive({ useHandCursor: true });
            slot.on('pointerdown', () => this._showFishDetail(f));
        });

        // Count display
        this.add.text(w / 2, h - 50, `${fish.length} fish`, {
            fontSize: '12px', color: '#666666',
        }).setOrigin(0.5);

        if (fish.length === 0) {
            this.add.text(w / 2, h / 2, 'No fish in inventory.', {
                fontSize: '16px', color: '#555555',
            }).setOrigin(0.5);
        }
    }

    _showFishDetail(fish) {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const fishData = DataManager.getFishByID(fish.fishId);

        const dim = this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.7).setInteractive();
        const panel = this.add.rectangle(w / 2, h / 2, 380, 320, 0x1a2a3a).setStrokeStyle(2, 0x4a9eff);

        const rarityColors = { common: '#aaaaaa', uncommon: '#55cc55', rare: '#5599ff', epic: '#aa55ff', legendary: '#ffaa00' };
        let y = h / 2 - 130;

        const elements = [];

        elements.push(this.add.text(w / 2, y, fish.name, { fontSize: '22px', color: rarityColors[fish.rarity], fontStyle: 'bold' }).setOrigin(0.5)); y += 30;
        elements.push(this.add.text(w / 2, y, `${fish.rarity.toUpperCase()} · ${fish.weight.toFixed(2)} kg`, { fontSize: '14px', color: '#cccccc' }).setOrigin(0.5)); y += 22;
        elements.push(this.add.text(w / 2, y, `Price: 🪙 ${fish.price}`, { fontSize: '14px', color: '#ffd700' }).setOrigin(0.5)); y += 20;
        elements.push(this.add.text(w / 2, y, `Spot: ${fish.spot ?? '-'}`, { fontSize: '12px', color: '#888888' }).setOrigin(0.5)); y += 18;
        elements.push(this.add.text(w / 2, y, `Caught: ${new Date(fish.caughtAt).toLocaleDateString()}`, { fontSize: '12px', color: '#888888' }).setOrigin(0.5)); y += 20;

        if (fishData) {
            elements.push(this.add.text(w / 2, y, fishData.description, {
                fontSize: '11px', color: '#666666', wordWrap: { width: 340 }, align: 'center',
            }).setOrigin(0.5)); y += 28;

            if (fishData.preferredSeason) {
                elements.push(this.add.text(w / 2, y, `Season: ${fishData.preferredSeason.join(', ')}`, {
                    fontSize: '11px', color: '#aaaaaa',
                }).setOrigin(0.5)); y += 16;
            }
            if (fishData.preferredWeather) {
                elements.push(this.add.text(w / 2, y, `Weather: ${fishData.preferredWeather.join(', ')}`, {
                    fontSize: '11px', color: '#aaaaaa',
                }).setOrigin(0.5)); y += 16;
            }
            if (fishData.preferredTime) {
                elements.push(this.add.text(w / 2, y, `Time: ${fishData.preferredTime.join(', ')}`, {
                    fontSize: '11px', color: '#aaaaaa',
                }).setOrigin(0.5)); y += 16;
            }
        }

        // Favorite toggle
        const favLabel = fish.favorite ? '⭐ Unfavorite' : '☆ Favorite';
        const favBtn = this.add.text(w / 2 - 70, h / 2 + 120, favLabel, {
            fontSize: '13px', color: '#ffd700', backgroundColor: '#2a2a1a',
            padding: { x: 12, y: 6 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        favBtn.on('pointerdown', () => {
            InventoryManager.favoriteFish(
                InventoryManager.getAllFish().indexOf(fish)
            );
            dim.destroy(); panel.destroy(); favBtn.destroy(); okBtn.destroy();
            elements.forEach(e => e.destroy());
            this.scene.restart();
        });

        // Close button
        const okBtn = this.add.text(w / 2 + 70, h / 2 + 120, 'Close', {
            fontSize: '13px', color: '#ffffff', backgroundColor: '#2a7a3a',
            padding: { x: 12, y: 6 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        okBtn.on('pointerdown', () => {
            dim.destroy(); panel.destroy(); favBtn.destroy(); okBtn.destroy();
            elements.forEach(e => e.destroy());
        });
    }

    _buildBackButton() {
        this.add.text(20, this.cameras.main.height - 25, '← Back', {
            fontSize: '14px', color: '#888888',
        }).setInteractive({ useHandCursor: true }).on('pointerdown', () => this.scene.start('FishingHubScene'));
    }
}
