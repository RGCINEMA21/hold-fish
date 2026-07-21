/**
 * ShopManager - Membeli umpan dan item
 */
import PlayerManager from './PlayerManager.js';
import DataManager from '../core/DataManager.js';

export default class ShopManager {

    /**
     * Membeli umpan
     * @returns {{ success: boolean, message: string }}
     */
    static buyBait(baitId) {
        const bait = DataManager.getBaitByID(baitId);
        if (!bait) return { success: false, message: 'Bait not found.' };

        if (PlayerManager.getGold() < bait.price) {
            return { success: false, message: 'Not enough Gold.' };
        }

        PlayerManager.addGold(-bait.price);
        PlayerManager.addBait(baitId, 1);
        return { success: true, message: `Bought ${bait.name} for 🪙${bait.price}` };
    }

    /**
     * Membeli kail
     */
    static buyHook(hookId) {
        const hook = DataManager.getHookByID(hookId);
        if (!hook) return { success: false, message: 'Hook not found.' };
        if (PlayerManager.getGold() < hook.price) {
            return { success: false, message: 'Not enough Gold.' };
        }
        PlayerManager.addGold(-hook.price);
        PlayerManager.setHook(hookId);
        return { success: true, message: `Bought ${hook.name}` };
    }
}
