/**
 * PlayerManager - Mengelola data pemain aktif
 */
import SaveManager from './SaveManager.js';

export default class PlayerManager {

    constructor() { this._data = null; }

    getData()     { return this._data; }
    load()        { this._data = SaveManager.load(); return this._data; }
    save()        { if (this._data) SaveManager.save(this._data); }
    hasData()     { return this._data !== null; }

    // ==================== IDENTITY ====================
    getName()     { return this._data?.character?.name ?? ''; }
    getGender()   { return this._data?.character?.gender ?? 'male'; }
    getAvatar()   { return this._data?.character?.avatar ?? 0; }

    // ==================== PROGRESS ====================
    getLevel()    { return this._data?.progress?.level ?? 1; }
    getExp()      { return this._data?.progress?.exp ?? 0; }
    addExp(amount) {
        this._data.progress.exp += amount;
        const needed = this._data.progress.level * 100;
        while (this._data.progress.exp >= needed) {
            this._data.progress.exp -= needed;
            this._data.progress.level++;
        }
        this.save();
    }

    // ==================== CURRENCY ====================
    getGold()     { return this._data?.currency?.gold ?? 0; }
    getDiamond()  { return this._data?.currency?.diamond ?? 0; }
    getHfish()    { return this._data?.currency?.hfish ?? 0; }
    addGold(amount)    { this._data.currency.gold += amount; this.save(); }
    addDiamond(amount) { this._data.currency.diamond += amount; this.save(); }

    // ==================== EQUIPMENT ====================
    getRod()        { return this._data?.equipment?.rod ?? ''; }
    getHook()       { return this._data?.equipment?.hook ?? ''; }
    getBait()       { return this._data?.equipment?.bait ?? ''; }
    getBaitAmount() { return this._data?.equipment?.baitAmount ?? 0; }
    getBoat()       { return this._data?.equipment?.boat ?? null; }
    useBait() {
        if (this._data.equipment.baitAmount > 0) {
            this._data.equipment.baitAmount--;
            this.save();
            return true;
        }
        return false;
    }
    addBait(baitId, amount) {
        if (this._data.equipment.bait === baitId) {
            this._data.equipment.baitAmount += amount;
        } else {
            this._data.equipment.bait = baitId;
            this._data.equipment.baitAmount = amount;
        }
        this.save();
    }
    setHook(hookId) {
        this._data.equipment.hook = hookId;
        this.save();
    }
    setRod(rodId) {
        this._data.equipment.rod = rodId;
        this.save();
    }

    // ==================== OWNED ITEMS ====================
    getOwnedRods()  { return this._data?.rods ?? ['wood_rod']; }
    getOwnedHooks() { return this._data?.hooks ?? ['basic_hook']; }
    addOwnedRod(rodId) {
        if (!this._data.rods) this._data.rods = ['wood_rod'];
        if (!this._data.rods.includes(rodId)) this._data.rods.push(rodId);
        this.save();
    }
    addOwnedHook(hookId) {
        if (!this._data.hooks) this._data.hooks = ['basic_hook'];
        if (!this._data.hooks.includes(hookId)) this._data.hooks.push(hookId);
        this.save();
    }

    // ==================== LOCATION ====================
    getCurrentSpot() { return this._data?.location?.currentSpot ?? ''; }
    setCurrentSpot(spotId) { this._data.location.currentSpot = spotId; this.save(); }

    // ==================== INVENTORY ====================
    getInventory()  { return this._data?.inventory ?? []; }
    addToInventory(item) {
        if (!this._data.inventory) this._data.inventory = [];
        this._data.inventory.push(item);
        this.save();
    }
    removeFromInventory(index) {
        this._data.inventory.splice(index, 1);
        this.save();
    }

    // ==================== FISH COLLECTION ====================
    getCollection() { return this._data?.fishCollection ?? []; }
    addToCollection(fishId, weight) {
        if (!this._data.fishCollection) this._data.fishCollection = [];
        const existing = this._data.fishCollection.find(c => c.id === fishId);
        if (existing) {
            existing.caught++;
            if (weight > existing.biggestWeight) existing.biggestWeight = weight;
            existing.lastCaught = new Date().toISOString();
        } else {
            this._data.fishCollection.push({
                id: fishId,
                caught: 1,
                biggestWeight: weight,
                firstCaught: new Date().toISOString(),
                lastCaught: new Date().toISOString(),
            });
        }
        this.save();
    }
    isNewSpecies(fishId) {
        return !this._data.fishCollection?.some(c => c.id === fishId);
    }

    // ==================== STATS ====================
    getStats()      { return this._data?.stats ?? {}; }
    addFishStat(weight) {
        this._data.stats.totalFish++;
        if (weight > this._data.stats.biggestFish) this._data.stats.biggestFish = weight;
        this.save();
    }

    // ==================== SPOTS ====================
    getUnlockedSpots() { return this._data?.unlockedSpots ?? []; }

    // ==================== SETTINGS ====================
    getSettings()   { return this._data?.settings ?? {}; }
}
