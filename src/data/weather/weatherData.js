const weatherData = [
    { id: 'sunny', name: 'Sunny',  modifier: 1.0,  bonusFish: [],                    description: 'Cerah terang. Kondisi normal.' },
    { id: 'cloudy', name: 'Cloudy', modifier: 0.9,  bonusFish: ['catfish', 'trout'],  description: 'Mendung. Ikan air tawar lebih aktif.' },
    { id: 'rain',   name: 'Rain',   modifier: 1.3,  bonusFish: ['trout', 'salmon', 'pike'], description: 'Hujan. Ikan predator aktif.' },
    { id: 'storm',  name: 'Storm',  modifier: 0.6,  bonusFish: ['dragon_fish', 'kraken'], description: 'Badai. Berbahaya tapi menguntungkan.' },
    { id: 'fog',    name: 'Fog',    modifier: 1.1,  bonusFish: ['ghost_fish', 'crystal_koi', 'moon_whisker'], description: 'Kabut tebal. Ikan mistis muncul.' },
];
export default weatherData;
