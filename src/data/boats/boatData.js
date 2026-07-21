const boatData = [
    { id: 'none',            name: 'No Boat',          speed: 0,   unlockSpot: ['village_pond', 'river', 'lake', 'waterfall', 'beach'], price: 0,     description: 'Tidak menggunakan perahu.' },
    { id: 'rowing_boat',     name: 'Rowing Boat',      speed: 5,   unlockSpot: ['ocean'],                                 price: 3000,  description: 'Perahu dayung untuk laut tenang.' },
    { id: 'sailing_boat',    name: 'Sailing Boat',     speed: 10,  unlockSpot: ['ocean', 'deep_ocean'],                   price: 10000, description: 'Perahu layar untuk laut lepas.' },
    { id: 'fishing_trawler', name: 'Fishing Trawler',  speed: 15,  unlockSpot: ['deep_ocean', 'volcano_lake'],             price: 30000, description: 'Kapal penangkap ikan profesional.' },
    { id: 'mystic_boat',     name: 'Mystic Boat',      speed: 20,  unlockSpot: ['crystal_lake'],                          price: 80000, description: 'Perahu mistis yang bisa menembus kabut.' },
];
export default boatData;
