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

        this.add.text(w / 2, 20, '📦 INVENTORY', { fontSize: '20px', color: '#4ac5ff', fontStyle: 'bold' }).setOrigin(0.5);

        this._buildTabs(w);
        this._buildSortBar(w);
        this._buildFilterBar(w);
        this._buildSearchBar(w);
        this._buildFishList(w, h);
        this._buildBackButton(h);
    }

    _buildTabs(w) {
        const tabs = ['fish', 'bait', 'hooks', 'rods', 'boat', 'special', 'currency'];
        const tabW = w / tabs.length;
        tabs.forEach((tab, i) => {
            const x = tabW * i + tabW / 2;
            const btn = this.add.text(x, 50, tab.toUpperCase(), {
                fontSize: '10px', color: this.currentTab === tab ? '#ffffff' : '#666666',
                backgroundColor: this.currentTab === tab ? '#2a5a3a' : '#1a2a3a',
                padding: { x: 4, y: 4 },
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });
            btn.on('pointerdown', () => { this.currentTab = tab; this.scene.restart(); });
        });
    }

    _buildSortBar(w) {
        if (this.currentTab !== 'fish') return;
        const sorts = ['newest', 'oldest', 'highestPrice', 'lowestPrice', 'largestWeight', 'smallestWeight', 'nameAZ', 'nameZA'];
        const labels = ['New', 'Old', '$↓', '$↑', 'Wt↓', 'Wt↑', 'A-Z', 'Z-A'];
        const btnW = w / sorts.length;
        sorts.forEach((s, i) => {
            const x = btnW * i + btnW / 2;
            const btn = this.add.text(x, 75, labels[i], {
                fontSize: '10px', color: this.currentSort === s ? '#ffffff' : '#888888',
                backgroundColor: this.currentSort === s ? '#3a4a5a' : '#1a2a3a',
                padding: { x: 4, y: 3 },
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });
            btn.on('pointerdown', () => { this.currentSort = s; this.scene.restart(); });
        });
    }

    _buildFilterBar(w) {
        if (this.currentTab !== 'fish') return;
        const filters = [null, 'common', 'uncommon', 'rare', 'epic', 'legendary'];
        const labels = ['All', 'Cmn', 'Unc', 'Rar', 'Epi', 'Leg'];
        const colors = ['#ffffff', '#aaaaaa', '#55cc55', '#5599ff', '#aa55ff', '#ffaa00'];
        const btnW = w / filters.length;
        filters.forEach((f, i) => {
            const x = btnW * i + btnW / 2;
            const btn = this.add.text(x, 96, labels[i], {
                fontSize: '10px', color: this.currentFilter === f ? '#ffffff' : colors[i],
                backgroundColor: this.currentFilter === f ? '#3a4a5a' : '#1a2a3a',
                padding: { x: 4, y: 3 },
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });
            btn.on('pointerdown', () => { this.currentFilter = f; this.scene.restart(); });
        });
    }

    _buildSearchBar(w) {
        if (this.currentTab !== 'fish') return;
        const bg = this.add.rectangle(w / 2, 118, w - 40, 26, 0x1a2a3a).setStrokeStyle(1, 0x3a4a5a);
        this.add.text(w / 2 - 100, 118, '🔍', { fontSize: '12px' }).setOrigin(0, 0.5);
        this.add.text(w / 2 - 80, 118, this.searchQuery || 'Search fish...', {
            fontSize: '11px', color: this.searchQuery ? '#ffffff' : '#666666',
        }).setOrigin(0, 0.5);
        bg.setInteractive({ useHandCursor: true });
        bg.on('pointerdown', () => {
            const q = prompt('Search fish by name:', this.searchQuery || '');
            if (q !== null) { this.searchQuery = q.trim(); this.scene.restart(); }
        });
    }

    _buildFishList(w, h) {
        if (this.currentTab !== 'fish') {
            this.add.text(w / 2, h / 2, 'Coming Soon', { fontSize: '18px', color: '#555555' }).setOrigin(0.5);
            return;
        }

        let fish = InventoryManager.getAllFish();
        if (this.searchQuery) {
            const q = this.searchQuery.toLowerCase();
            fish = fish.filter(f => f.name.toLowerCase().includes(q));
        }
        if (this.currentFilter) fish = fish.filter(f => f.rarity === this.currentFilter);
        fish = InventoryManager.sortFish(fish, this.currentSort);

        const startY = 140;
        const slotH = 48;
        const maxSlots = Math.floor((h - startY - 50) / slotH);
        const rarityColors = { common: 0xaaaaaa, uncommon: 0x55cc55, rare: 0x5599ff, epic: 0xaa55ff, legendary: 0xffaa00 };

        fish.slice(0, maxSlots).forEach((f, i) => {
            const y = startY + i * slotH;
            this.add.rectangle(w / 2, y + 18, w - 20, 42, 0x1a2a3a, 0.8);
            this.add.rectangle(10, y + 18, 4, 38, rarityColors[f.rarity] || 0xaaaaaa);
            this.add.text(22, y + 6, `${f.favorite ? '⭐ ' : ''}${f.name}`, { fontSize: '13px', color: '#ffffff' });
            this.add.text(22, y + 24, `${f.weight.toFixed(2)} kg · 🪙${f.price} · ${f.rarity}`, { fontSize: '10px', color: '#888888' });

            const slot = this.add.rectangle(w / 2, y + 18, w - 20, 42).setInteractive({ useHandCursor: true });
            slot.on('pointerdown', () => this._showFishDetail(f));
        });

        this.add.text(w / 2, h - 40, `${fish.length} fish`, { fontSize: '11px', color: '#666666' }).setOrigin(0.5);

        if (fish.length === 0) {
            this.add.text(w / 2, h / 2, 'No fish in inventory.', { fontSize: '14px', color: '#555555' }).setOrigin(0.5);
        }
    }

    _showFishDetail(fish) {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const fishData = DataManager.getFishByID(fish.fishId);
        const rarityColors = { common: '#aaaaaa', uncommon: '#55cc55', rare: '#5599ff', epic: '#aa55ff', legendary: '#ffaa00' };

        const dim = this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.7).setInteractive();
        const panel = this.add.rectangle(w / 2, h / 2, w - 50, 320, 0x1a2a3a).setStrokeStyle(2, 0x4a9eff);

        const elements = [];
        let y = h / 2 - 140;

        elements.push(this.add.text(w / 2, y, fish.name, { fontSize: '20px', color: rarityColors[fish.rarity], fontStyle: 'bold' }).setOrigin(0.5)); y += 28;
        elements.push(this.add.text(w / 2, y, `${fish.rarity.toUpperCase()} · ${fish.weight.toFixed(2)} kg`, { fontSize: '13px', color: '#cccccc' }).setOrigin(0.5)); y += 20;
        elements.push(this.add.text(w / 2, y, `Price: 🪙 ${fish.price}`, { fontSize: '13px', color: '#ffd700' }).setOrigin(0.5)); y += 18;
        elements.push(this.add.text(w / 2, y, `Spot: ${fish.spot ?? '-'}`, { fontSize: '11px', color: '#888888' }).setOrigin(0.5)); y += 16;
        elements.push(this.add.text(w / 2, y, `Caught: ${new Date(fish.caughtAt).toLocaleDateString()}`, { fontSize: '11px', color: '#888888' }).setOrigin(0.5)); y += 20;

        if (fishData) {
            elements.push(this.add.text(w / 2, y, fishData.description, {
                fontSize: '10px', color: '#666666', wordWrap: { width: w - 90 }, align: 'center',
            }).setOrigin(0.5)); y += 28;
        }

        const favLabel = fish.favorite ? '⭐ Unfavorite' : '☆ Favorite';
        const favBtn = this.add.text(w / 2 - 60, h / 2 + 120, favLabel, {
            fontSize: '12px', color: '#ffd700', backgroundColor: '#2a2a1a',
            padding: { x: 10, y: 6 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        favBtn.on('pointerdown', () => {
            InventoryManager.favoriteFish(InventoryManager.getAllFish().indexOf(fish));
            dim.destroy(); panel.destroy(); favBtn.destroy(); closeBtn.destroy();
            elements.forEach(e => e.destroy());
            this.scene.restart();
        });

        const closeBtn = this.add.text(w / 2 + 60, h / 2 + 120, 'Close', {
            fontSize: '12px', color: '#ffffff', backgroundColor: '#2a7a3a',
            padding: { x: 10, y: 6 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        closeBtn.on('pointerdown', () => {
            dim.destroy(); panel.destroy(); favBtn.destroy(); closeBtn.destroy();
            elements.forEach(e => e.destroy());
        });
    }

    _buildBackButton(h) {
        this.add.text(20, h - 25, '← Back', {
            fontSize: '14px', color: '#888888',
        }).setInteractive({ useHandCursor: true }).on('pointerdown', () => this.scene.start('FishingHubScene'));
    }
}
