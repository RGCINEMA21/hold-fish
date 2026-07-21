# HOLD FISH 🎣

Casual Fishing RPG — Browser Game

## Deskripsi

HOLD FISH adalah game casual fishing RPG yang dimainkan di browser. Pemain membuat karakter, memilih spot memancing, memilih umpan dan kail, lalu memancing secara otomatis.

## Cara Install

```bash
git clone <repo-url>
cd hold-fish
npm install
```

## Cara Menjalankan (Development)

```bash
npm run dev
```

Buka browser di `http://localhost:3000`.

## Cara Build

```bash
npm run build
```

Output ada di folder `dist/`.

## Cara Deploy ke GitHub Pages

1. Build project: `npm run build`
2. Push branch `main` ke GitHub
3. Buka Settings → Pages → Source: `gh-pages` branch
4. Jalankan deploy script (atau manual dari folder `dist/`)

## Struktur Folder

```
hold-fish/
├── assets/              # Aset game (gambar, audio, font)
│   ├── audio/
│   ├── fonts/
│   ├── icons/
│   ├── images/
│   ├── fish/
│   ├── boats/
│   ├── rods/
│   ├── hooks/
│   ├── bait/
│   ├── ui/
│   ├── backgrounds/
│   ├── tiles/
│   ├── characters/
│   └── weather/
├── src/
│   ├── core/
│   ├── config/          # Konfigurasi game
│   ├── data/            # Data game (fish, bait, rods, dll)
│   ├── managers/        # Manager classes
│   ├── systems/         # System classes
│   ├── scenes/          # Phaser scenes
│   ├── objects/
│   ├── entities/
│   ├── ui/
│   └── utils/
├── styles/              # CSS
├── public/
├── index.html
├── package.json
└── vite.config.js
```

## Tech Stack

- HTML5
- CSS3
- JavaScript ES6 Modules
- Phaser 3
- Vite

## License

Private
