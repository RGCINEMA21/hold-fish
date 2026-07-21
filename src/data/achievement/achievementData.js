const achievementData = [
    { id: 'catch_10', name: 'First Catch', description: 'Catch 10 fish', reward: { gold: 100 }, icon: '🐟' },
    { id: 'catch_100', name: 'Experienced Angler', description: 'Catch 100 fish', reward: { gold: 500 }, icon: '🎣' },
    { id: 'catch_1000', name: 'Master Angler', description: 'Catch 1000 fish', reward: { gold: 2000, diamond: 10 }, icon: '🏆' },
    { id: 'catch_legendary', name: 'Legendary Catch', description: 'Catch a legendary fish', reward: { gold: 1000, diamond: 5 }, icon: '⭐' },
    { id: 'catch_boss', name: 'Boss Slayer', description: 'Catch a boss fish', reward: { gold: 5000, diamond: 20 }, icon: '👑' },
    { id: 'unlock_ocean', name: 'Ocean Explorer', description: 'Unlock Ocean spot', reward: { gold: 300 }, icon: '🌊' },
    { id: 'fish_book_50', name: 'Fish Collector', description: 'Complete 50% Fish Book', reward: { diamond: 15 }, icon: '📖' },
    { id: 'fish_book_100', name: 'Fish Encyclopedia', description: 'Complete Fish Book', reward: { diamond: 50 }, icon: '📚' },
    { id: 'upgrade_rod_10', name: 'Rod Master', description: 'Upgrade rod to Lv10', reward: { gold: 800 }, icon: '🔧' },
    { id: 'biggest_10kg', name: 'Big Catch', description: 'Catch a fish over 10kg', reward: { gold: 200 }, icon: '⚖️' },
];
export default achievementData;
