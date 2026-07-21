import fishData from '../data/fish/fishData.js';
import spotData from '../data/spots/spotData.js';
import rodData from '../data/rods/rodData.js';
import hookData from '../data/hooks/hookData.js';
import baitData from '../data/bait/baitData.js';
import boatData from '../data/boats/boatData.js';
import weatherData from '../data/weather/weatherData.js';
import seasonData from '../data/season/seasonData.js';
import currencyData from '../data/currency/currencyData.js';
import achievementData from '../data/achievement/achievementData.js';
import titleData from '../data/titles/titleData.js';
import museumData from '../data/museum/museumData.js';
import restaurantData from '../data/restaurants/restaurantData.js';
import npcData from '../data/npc/npcData.js';
import itemData from '../data/items/itemData.js';
import rarityData from '../data/rarity/rarityData.js';
import settingsData from '../data/settings/settingsData.js';

const DataManager = {
    fish: fishData,
    spots: spotData,
    rods: rodData,
    hooks: hookData,
    baits: baitData,
    boats: boatData,
    weather: weatherData,
    seasons: seasonData,
    currencies: currencyData,
    achievements: achievementData,
    titles: titleData,
    museum: museumData,
    restaurants: restaurantData,
    npcs: npcData,
    items: itemData,
    rarity: rarityData,
    settings: settingsData,

    // === Fish ===
    getFish()         { return this.fish; },
    getFishByID(id)   { return this.fish.find(f => f.id === id) || null; },

    // === Spots ===
    getSpots()        { return this.spots; },
    getSpotByID(id)   { return this.spots.find(s => s.id === id) || null; },

    // === Rods ===
    getRods()         { return this.rods; },
    getRodByID(id)    { return this.rods.find(r => r.id === id) || null; },

    // === Hooks ===
    getHooks()        { return this.hooks; },
    getHookByID(id)   { return this.hooks.find(h => h.id === id) || null; },

    // === Baits ===
    getBaits()        { return this.baits; },
    getBaitByID(id)   { return this.baits.find(b => b.id === id) || null; },

    // === Boats ===
    getBoats()        { return this.boats; },
    getBoatByID(id)   { return this.boats.find(b => b.id === id) || null; },

    // === Weather ===
    getWeather()              { return this.weather; },
    getWeatherByID(id)        { return this.weather.find(w => w.id === id) || null; },

    // === Seasons ===
    getSeasons()              { return this.seasons; },
    getSeasonByID(id)         { return this.seasons.find(s => s.id === id) || null; },

    // === Currency ===
    getCurrencies()           { return this.currencies; },
    getCurrencyByID(id)       { return this.currencies.find(c => c.id === id) || null; },

    // === Achievements ===
    getAchievements()         { return this.achievements; },
    getAchievementByID(id)    { return this.achievements.find(a => a.id === id) || null; },

    // === Titles ===
    getTitles()               { return this.titles; },
    getTitleByID(id)          { return this.titles.find(t => t.id === id) || null; },

    // === Museum ===
    getMuseum()               { return this.museum; },
    getMuseumByID(id)         { return this.museum.find(m => m.id === id) || null; },

    // === Restaurants ===
    getRestaurants()          { return this.restaurants; },
    getRestaurantByID(id)     { return this.restaurants.find(r => r.id === id) || null; },

    // === NPCs ===
    getNPCs()                 { return this.npcs; },
    getNPCByID(id)            { return this.npcs.find(n => n.id === id) || null; },

    // === Items ===
    getItems()                { return this.items; },
    getItemByID(id)           { return this.items.find(i => i.id === id) || null; },

    // === Rarity ===
    getRarity(id)             { return this.rarity[id] || null; },

    // === Settings ===
    getSettings()             { return this.settings; },
};

export default DataManager;
