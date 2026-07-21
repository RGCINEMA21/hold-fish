const settingsData = {
    musicVolume: { default: 100, min: 0, max: 100 },
    sfxVolume: { default: 100, min: 0, max: 100 },
    language: { default: 'english', options: ['english', 'indonesian'] },
    screenShake: { default: true },
    autoSave: { default: true },
};
export default settingsData;
