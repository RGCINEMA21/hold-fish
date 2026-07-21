/**
 * CurrencyConfig.js - Konfigurasi currency
 */
export default {
    currencies: [
        { id: 'gold',    name: 'Gold',    symbol: 'G',   color: 0xffd700 },
        { id: 'diamond', name: 'Diamond', symbol: 'D',   color: 0x00ccff },
        { id: 'hfish',   name: '$HFISH',  symbol: 'HF',  color: 0x00ff88, active: false },
    ],
    startGold: 500,
    startDiamond: 0,
};
