/**
 * FishingSystem - Logika inti memancing
 * Semua data berasal dari DataManager.
 */
import DataManager from '../core/DataManager.js';
import PlayerManager from '../managers/PlayerManager.js';

export default class FishingSystem {

    /**
     * Proses memancing. Mengembalikan hasil tangkapan.
     * @returns {{ success: boolean, fish: object|null, weight: number, isNew: boolean, message: string }}
     */
    static processCatch() {
        const playerData = PlayerManager.getData();
        const spotId     = playerData.location.currentSpot;
        const baitId     = playerData.equipment.bait;
        const hookId     = playerData.equipment.hook;
        const rodId      = playerData.equipment.rod;
        const level      = playerData.progress.level;

        // Ambil data dari DataManager
        const spot  = DataManager.getSpotByID(spotId);
        const bait  = DataManager.getBaitByID(baitId);
        const hook  = DataManager.getHookByID(hookId);
        const rod   = DataManager.getRodByID(rodId);
        const weather = this._getCurrentWeather();
        const season  = this._getCurrentSeason();
        const time    = this._getCurrentTime();

        // 1. Filter ikan berdasarkan Spot
        let candidates = DataManager.getFish().filter(f => {
            return f.location.includes(spotId);
        });

        // 2. Filter berdasarkan Level
        candidates = candidates.filter(f => f.unlockLevel <= level);

        // 3. Filter berdasarkan Waktu
        candidates = candidates.filter(f => {
            return !f.preferredTime || f.preferredTime.includes(time);
        });

        // 4. Filter berdasarkan Musim
        candidates = candidates.filter(f => {
            return !f.preferredSeason || f.preferredSeason.includes(season);
        });

        // 5. Filter berdasarkan Cuaca
        candidates = candidates.filter(f => {
            return !f.preferredWeather || f.preferredWeather.includes(weather);
        });

        // Jika tidak ada kandidat
        if (candidates.length === 0) {
            return { success: false, fish: null, weight: 0, isNew: false, message: 'Nothing was caught.' };
        }

        // 6. Hitung peluang per ikan (weighted random)
        const weights = candidates.map(fish => {
            let w = this._rarityWeight(fish.rarity);

            // Bonus umpan favorit
            if (bait && fish.preferredBait.includes(baitId)) {
                w += bait.rarityBonus || 0;
                w += 20;
            }

            // Bonus joran
            if (rod) {
                w += rod.luckBonus || 0;
            }

            // Bonus kail
            if (hook) {
                w += Math.floor((hook.catchRate - 50) / 5);
            }

            // Penalty cuaca buruk
            const weatherData = DataManager.getWeatherByID(weather);
            if (weatherData) {
                w = Math.floor(w * weatherData.modifier);
            }

            // Bonus musim
            const seasonData = DataManager.getSeasonByID(season);
            if (seasonData && fish.rarity === seasonData.bonusType) {
                w = Math.floor(w * seasonData.bonus);
            }

            return Math.max(w, 1);
        });

        // 7. Pilih ikan secara acak berdasarkan bobot
        const chosenFish = this._weightedRandom(candidates, weights);

        // 8. Tentukan ukuran ikan
        const weight = this._calculateWeight(chosenFish);

        // 9. Cek apakah spesies baru
        const isNew = PlayerManager.isNewSpecies(chosenFish.id);

        return {
            success: true,
            fish: chosenFish,
            weight,
            isNew,
            message: isNew ? 'NEW SPECIES DISCOVERED!' : 'Already collected.',
        };
    }

    /**
     * Bobot dasar berdasarkan rarity
     */
    static _rarityWeight(rarity) {
        const map = { common: 50, uncommon: 30, rare: 15, epic: 4, legendary: 1 };
        return map[rarity] || 10;
    }

    /**
     * Pilih item secara acak berdasarkan bobot
     */
    static _weightedRandom(items, weights) {
        const total = weights.reduce((sum, w) => sum + w, 0);
        let rand = Math.random() * total;
        for (let i = 0; i < items.length; i++) {
            rand -= weights[i];
            if (rand <= 0) return items[i];
        }
        return items[items.length - 1];
    }

    /**
     * Hitung berat ikan antara minWeight dan maxWeight
     */
    static _calculateWeight(fish) {
        const min = fish.minWeight || 0.1;
        const max = fish.maxWeight || 5.0;
        const raw = min + Math.random() * (max - min);
        return Math.round(raw * 100) / 100;
    }

    /**
     * Waktu dalam game (dummy - nanti dari TimeSystem)
     */
    static _getCurrentTime() {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 8)  return 'morning';
        if (hour >= 8 && hour < 17) return 'afternoon';
        if (hour >= 17 && hour < 20) return 'evening';
        return 'night';
    }

    /**
     * Cuaca dalam game (dummy - nanti dari WeatherSystem)
     */
    static _getCurrentWeather() {
        const weathers = ['sunny', 'cloudy', 'rain', 'fog'];
        return weathers[Math.floor(Math.random() * weathers.length)];
    }

    /**
     * Musim dalam game (dummy - nanti dari SeasonSystem)
     */
    static _getCurrentSeason() {
        const month = new Date().getMonth();
        if (month >= 2 && month <= 4)  return 'spring';
        if (month >= 5 && month <= 7)  return 'summer';
        if (month >= 8 && month <= 10) return 'autumn';
        return 'winter';
    }
}
