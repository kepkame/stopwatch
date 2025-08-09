import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA, type ManifestOptions } from 'vite-plugin-pwa';

const manifest: Partial<ManifestOptions> | false = {
  theme_color: '#8936FF',
  background_color: '#ffffff',
  icons: [
    {
      purpose: 'maskable',
      sizes: '512x512',
      src: 'icon512_maskable.png',
      type: 'image/png',
    },
    {
      purpose: 'any',
      sizes: '512x512',
      src: 'icon512_rounded.png',
      type: 'image/png',
    },
  ],
  screenshots: [
    {
      src: 'screenshots/desktop.png',
      sizes: '1024x1024',
      type: 'image/png',
      form_factor: 'wide',
    },
    {
      src: 'screenshots/mobile.png',
      sizes: '1024x1024',
      type: 'image/png',
      form_factor: 'narrow',
    },
  ],
  orientation: 'any',
  display: 'standalone',
  dir: 'ltr',
  lang: 'en',
  name: 'SwopWatch',
  start_url: '/',
  short_name: 'SwopWatch',
};

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
      '@styles': '/src/styles',
      '@assets': '/src/assets',
      '@components': '/src/components',
      '@utils': '/src/utils',
      '@types': '/src/types',
      '@hooks': '/src/hooks',
      '@store': '/src/store',
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
      },
      manifest: manifest,
    }),
  ],
});
