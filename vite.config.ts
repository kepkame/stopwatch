import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA, type ManifestOptions } from 'vite-plugin-pwa';

const manifest: Partial<ManifestOptions> | false = {
  id: '/',
  name: 'Stopwatch',
  short_name: 'Stopwatch',
  start_url: '.',
  scope: '/',
  display: 'standalone',
  orientation: 'any',
  background_color: '#ffffff',
  theme_color: '#e9773d',
  dir: 'ltr',
  lang: 'en',
  icons: [
    { src: '/icon192.png', sizes: '192x192', type: 'image/png' },
    {
      purpose: 'maskable',
      sizes: '512x512',
      src: '/icon512_maskable.png',
      type: 'image/png',
    },
    {
      purpose: 'any',
      sizes: '512x512',
      src: '/icon512_rounded.png',
      type: 'image/png',
    },
  ],
  screenshots: [
    {
      src: '/screenshots/desktop.png',
      sizes: '1919x1079',
      type: 'image/png',
      form_factor: 'wide',
    },
    {
      src: '/screenshots/mobile.png',
      sizes: '375x667',
      type: 'image/png',
      form_factor: 'narrow',
    },
    {
      src: '/screenshots/mobile-small.png',
      sizes: '360x800',
      type: 'image/png',
    },
  ],
};

export default defineConfig({
  resolve: {
    alias: {
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
      '@utils': '/src/utils',
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,mp3}'],
      },
      manifest: manifest,
    }),
  ],
});
