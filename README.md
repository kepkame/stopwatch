# ⏲ Interval Timer for Athletes — Stopwatch

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?style=flat) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat)](./LICENSE)

<a href="https://github.com/kepkame/stopwatch" target="_blank" rel="noopener noreferrer">Live Demo</a>

This web application is a stopwatch and interval timer designed for athletes.
It allows users to track workout time, record laps with color coding, switch timer modes by tapping, and receive sound notifications after each interval.
All settings are saved between sessions, ensuring a seamless user experience.

https://github.com/user-attachments/assets/37ebe837-4117-4fe4-bcfc-a96fa93fe995

---

## ✨ Features

- **Large timer** `MM:SS.hh` tailored for training.
- **Laps with color coding** (cyclic palette, consecutive same-color preservation).
- **Tap to switch** timer mode: _elapsed_ ↔ _last lap_ ↔ _countdown to alert_.
- **Sound notifications** after each new lap (configurable interval).
- **Keep Screen On** (Wake Lock) while running.
- **Themes**: `lightPench`, `darkPench`, `light`, `dark`, `black`.
- **Settings persistence** across sessions.
- **Accessibility**: visible focus, ARIA labels, keyboard shortcuts.
- **Onboarding tour** with step-by-step UI guide (implemented via `driver.js`).

---

## ⚙ Settings

- **Sound Notification** — toggle + interval.
- **Change Time by Tap** — switch between elapsed / last lap / countdown.
- **Keep Screen On** — prevents the device screen from turning off.
- **Theme Color** — instant apply of one of 5 themes.

---

## 🛠 Technology Stack

[![React](https://img.shields.io/npm/v/react?label=React&logo=react&logoColor=white&color=61DAFB&style=flat)](https://www.npmjs.com/package/react) [![Redux Toolkit](https://img.shields.io/npm/v/%40reduxjs%2Ftoolkit?label=Redux%20Toolkit&logo=redux&logoColor=white&color=764ABC&style=flat)](https://www.npmjs.com/package/@reduxjs/toolkit) [![React Redux](https://img.shields.io/npm/v/react-redux?label=React%20Redux&logo=redux&logoColor=white&color=764ABC&style=flat)](https://www.npmjs.com/package/react-redux) [![TypeScript](https://img.shields.io/npm/v/typescript?label=TypeScript&logo=typescript&logoColor=white&color=3178C6&style=flat)](https://www.npmjs.com/package/typescript) [![Vite](https://img.shields.io/npm/v/vite?label=Vite&logo=vite&logoColor=white&color=646CFF&style=flat)](https://www.npmjs.com/package/vite) [![Sass](https://img.shields.io/npm/v/sass?label=Sass&logo=sass&logoColor=white&color=CC6699&style=flat)](https://www.npmjs.com/package/sass) [![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-339933?logo=node.js&logoColor=white&style=flat)](https://nodejs.org/)

- **React 19 + TypeScript** — strongly typed UI components.
- **Redux Toolkit** — predictable state management (stopwatch & settings slices).
- **Sass modules** — styling with theme support.
- **Vite** — fast dev server and optimized production build.
- **PWA** — installable, offline-ready with auto-updates.
- **Node.js >=20** — development and build environment.

---

## 🚀 Installation

The project has been tested with:

- **Node.js** v20.17.0 (recommended: Node >=20)
- **npm** v11.4.2 (recommended: npm >=11)

1. Clone the repository

```bash
git clone https://github.com/kepkame/stopwatch.git
cd stopwatch
```

2. Install dependencies

```bash
npm install
```

3. Start in development mode

```bash
npm run dev
```

After starting, the app will be available at http://localhost:5173

---

## 🏗 How to Build

To generate an optimized production build, run:

```bash
npm run build
```

The compiled assets will be available in the **`dist/`** directory.
You can deploy this folder to any static hosting service such as Vercel, Netlify, GitHub Pages, or an Nginx server.

For local testing of the production build, use:

```bash
npm run preview
```

By default, the application will be available at [http://localhost:4173](http://localhost:4173).

---

## 📝 Scripts

| Script    | Description                        |
| --------- | ---------------------------------- |
| `dev`     | Start Vite dev server (HMR)        |
| `build`   | TypeScript build + Vite production |
| `preview` | Local server to preview `dist/`    |
| `lint`    | Run ESLint                         |

---

## 📂 Project Structure

```shell
stopwatch/
├── public/                  # Static public assets (icons, favicon, sounds, screenshots)
├── src/
│   ├── assets/              # Fonts (woff/woff2)
│   ├── components/          # Application UI components (controls, header, laps, settings, timer)
│   │   ├── Controls/        # Control panel (Pause, Lap, Play, Reset)
│   │   ├── Header/          # App header with logo and settings
│   │   ├── LapList/         # Lap list components and types
│   │   ├── SettingsModal/   # Settings modal with feature sections
│   │   ├── TimerDisplay/    # Animated timer display with modes
│   │   └── ui/              # Reusable UI elements (Button, Modal, Switch, etc.)
│   ├── features/            # Feature-specific modules (e.g., theme)
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Application pages (currently StopwatchPage)
│   ├── services/            # Services (sound, onboarding tour, settings persistence, wake lock)
│   ├── shared/              # Shared configuration (settings schema & defaults)
│   ├── store/               # Redux store (slices, selectors, thunks, persistence, types)
│   ├── styles/              # Global SCSS styles, variables, themes
│   ├── utils/               # Utilities (time formatting, lap swipe config, helpers)
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Entry point, Redux and theme setup
│   └── vite-env.d.ts        # Vite type declarations
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite build configuration
└── tsconfig.json            # TypeScript configuration
```

---

## 📦 Import Aliases

Configured in `vite.config.ts`:

```ts
'@': '/src',
'@assets': '/src/assets',
'@components': '/src/components',
'@hooks': '/src/hooks',
'@pages': '/src/pages',
'@services': '/src/services',
'@shared': '/src/shared',
'@store': '/src/store',
'@styles': '/src/styles',
'@types': '/src/types',
'@utils': '/src/utils'
```

---

## 📱 PWA & Offline

- Configured with **vite-plugin-pwa** (`autoUpdate`).
- Workbox caches assets via:

  ```
  globPatterns: **/*.{js,css,html,ico,png,svg,webp,mp3}
  ```

- Manifest includes:

  - icons (192/512, maskable & rounded),
  - theme/background colors,
  - install screenshots.

- Supports **installation on mobile devices** and offline usage.

---

## 📄 License

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat)](./LICENSE)
