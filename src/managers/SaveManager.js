/**
 * SaveManager - Menyimpan dan memuat data pemain via LocalStorage
 */
const SAVE_KEY = 'holdfish_save';

export default class SaveManager {

    /**
     * Buat data pemain baru
     */
    static createPlayer({ name, gender, avatar }) {
        const now = new Date().toISOString();
        const player = {
            character: {
                name,
                gender,
                avatar,
            },
            progress: {
                level: 1,
                exp: 0,
            },
            currency: {
                gold: 500,
                diamond: 0,
                hfish: 0,
            },
            equipment: {
                rod: 'wood_rod',
                hook: 'basic_hook',
                bait: 'worm_bait',
                baitAmount: 20,
                boat: null,
            },
            location: {
                currentSpot: 'village_pond',
            },
            inventory: [],
            fishCollection: [],
            achievements: [],
            unlockedSpots: ['village_pond'],
            stats: {
                totalFish: 0,
                biggestFish: 0,
                playTime: 0,
            },
            settings: {
                musicVolume: 100,
                sfxVolume: 100,
                language: 'english',
            },
            meta: {
                tutorialFinished: false,
                createdDate: now,
                lastLogin: now,
            },
        };
        return player;
    }

    /**
     * Simpan data ke LocalStorage
     */
    static save(playerData) {
        try {
            playerData.meta.lastLogin = new Date().toISOString();
            localStorage.setItem(SAVE_KEY, JSON.stringify(playerData));
            return true;
        } catch (e) {
            console.warn('[SaveManager] Gagal save:', e);
            return false;
        }
    }

    /**
     * Muat data dari LocalStorage
     */
    static load() {
        try {
            const raw = localStorage.getItem(SAVE_KEY);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (e) {
            console.warn('[SaveManager] Gagal load:', e);
            return null;
        }
    }

    /**
     * Hapus data save
     */
    static deleteSave() {
        localStorage.removeItem(SAVE_KEY);
    }

    /**
     * Cek apakah ada data save
     */
    static hasSave() {
        return localStorage.getItem(SAVE_KEY) !== null;
    }
}
