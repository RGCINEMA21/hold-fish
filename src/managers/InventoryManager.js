/**
 * InventoryManager - Mengelola seluruh inventory pemain
 */
import PlayerManager from './PlayerManager.js';
import DataManager from '../core/DataManager.js';

export default class InventoryManager {

    // ==================== FISH ====================

    static getAllFish() {
        return PlayerManager.getInventory().filter(i => i.type === 'fish');
    }

    static addFish(fishData, weight) {
        PlayerManager.addToInventory({
            type: 'fish',
            fishId: fishData.id,
            name: fishData.name,
            rarity: fishData.rarity,
            weight,
            price: fishData.price,
            caughtAt: new Date().toISOString(),
            favorite: false,
            spot: PlayerManager.getCurrentSpot(),
        });
    }

    static removeFish(index) {
        const allFish = this.getAllFish();
        const inv = PlayerManager.getInventory();
        const realIndex = inv.indexOf(allFish[index]);
        if (realIndex !== -1) PlayerManager.removeFromInventory(realIndex);
    }

    static favoriteFish(index) {
        const allFish = this.getAllFish();
        const inv = PlayerManager.getInventory();
        const realIndex = inv.indexOf(allFish[index]);
        if (realIndex !== -1) {
            inv[realIndex].favorite = !inv[realIndex].favorite;
            PlayerManager.save();
        }
    }

    static getFishByRarity(rarity) {
        return this.getAllFish().filter(f => f.rarity === rarity);
    }

    static getLargestFish() {
        const allFish = this.getAllFish();
        if (allFish.length === 0) return null;
        return allFish.reduce((max, f) => f.weight > max.weight ? f : max, allFish[0]);
    }

    static searchFish(query) {
        const q = query.toLowerCase();
        return this.getAllFish().filter(f => f.name.toLowerCase().includes(q));
    }

    static sortFish(fishList, sortBy) {
        const sorted = [...fishList];
        switch (sortBy) {
            case 'newest':      sorted.sort((a, b) => new Date(b.caughtAt) - new Date(a.caughtAt)); break;
            case 'oldest':      sorted.sort((a, b) => new Date(a.caughtAt) - new Date(b.caughtAt)); break;
            case 'highestPrice': sorted.sort((a, b) => b.price - a.price); break;
            case 'lowestPrice':  sorted.sort((a, b) => a.price - b.price); break;
            case 'largestWeight': sorted.sort((a, b) => b.weight - a.weight); break;
            case 'smallestWeight': sorted.sort((a, b) => a.weight - b.weight); break;
            case 'nameAZ':      sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
            case 'nameZA':      sorted.sort((a, b) => b.name.localeCompare(a.name)); break;
        }
        return sorted;
    }

    // ==================== BAIT ====================

    static getBaitInventory() {
        return PlayerManager.getData().equipment;
    }

    // ==================== HOOKS ====================

    static getOwnedHooks() {
        return PlayerManager.getData().hooks ?? ['basic_hook'];
    }

    // ==================== RODS ====================

    static getOwnedRods() {
        return PlayerManager.getData().rods ?? ['wood_rod'];
    }

    // ==================== COLLECTION ====================

    static getCollection() {
        return PlayerManager.getCollection();
    }

    static isCollected(fishId) {
        return PlayerManager.getCollection().some(c => c.id === fishId);
    }

    static getCollectionStats() {
        const allFish = DataManager.getFish();
        const collected = this.getCollection();
        const total = allFish.length;
        const done = collected.length;

        const rarityCount = {};
        const rarityTotal = {};
        allFish.forEach(f => {
            rarityTotal[f.rarity] = (rarityTotal[f.rarity] || 0) + 1;
        });
        collected.forEach(c => {
            const fish = DataManager.getFishByID(c.id);
            if (fish) rarityCount[fish.rarity] = (rarityCount[fish.rarity] || 0) + 1;
        });

        return { total, done, rarityCount, rarityTotal };
    }
}
