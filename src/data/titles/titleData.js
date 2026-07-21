const titleData = [
    { id: 'new_fisher', name: 'New Fisher', description: 'Start your journey.', requirement: 'none', bonus: {} },
    { id: 'river_master', name: 'River Master', description: 'Catch 50 fish in rivers.', requirement: 'catch_50_river', bonus: { luck: 5 } },
    { id: 'ocean_hunter', name: 'Ocean Hunter', description: 'Catch 30 fish in the ocean.', requirement: 'catch_30_ocean', bonus: { speed: 5 } },
    { id: 'legend_fisher', name: 'Legend Fisher', description: 'Catch a legendary fish.', requirement: 'catch_legendary', bonus: { luck: 15 } },
    { id: 'treasure_hunter', name: 'Treasure Hunter', description: 'Find 10 secret fish.', requirement: 'find_10_secret', bonus: { gold_find: 20 } },
    { id: 'night_owl', name: 'Night Owl', description: 'Catch 20 fish at night.', requirement: 'catch_20_night', bonus: { night_bonus: 10 } },
];
export default titleData;
