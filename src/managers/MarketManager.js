/**
 * MarketManager - Menjual ikan
 */
import PlayerManager from './PlayerManager.js';
import DataManager from '../core/DataManager.js';

export default class MarketManager {

    /**
     * Menjual 1 ikan dari inventory berdasarkan index
     * @returns {{ success: boolean, goldEarned: number, message: string }}
     */
    static sellOne(index) {
        const inv = PlayerManager.getInventory();
        if (index < 0 || index >= inv.length) {
            return { success: false, goldEarned: 0, message: 'Invalid item.' };
        }
        const item = inv[index];
        const fishData = DataManager.getFishByID(item.fishId);
        if (!fishData) {
            return { success: false, goldEarned: 0, message: 'Fish data not found.' };
        }
        const gold = fishData.price;
        PlayerManager.removeFromInventory(index);
        PlayerManager.addGold(gold);
        return { success: true, goldEarned: gold, message: `Sold ${fishData.name} for 🪙${gold}` };
    }

    /**
     * Menjual semua ikan kecuali yang di-favorite
     * @returns {{ totalGold: number, soldCount: number }}
     */
    static sellAll() {
        let totalGold = 0;
        let soldCount = 0;
        const inv = PlayerManager.getInventory();
        // Sell from end to start to avoid index shifting
        for (let i = inv.length - 1; i >= 0; i--) {
            if (inv[i].favorite) continue;
            const fishData = DataManager.getFishByID(inv[i].fishId);
            if (fishData) {
                totalGold += fishData.price;
                PlayerManager.removeFromInventory(i);
                soldCount++;
            }
        }
        PlayerManager.addGold(totalGold);
        return { totalGold, soldCount };
    }
}
