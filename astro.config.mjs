import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://designdoings.com',
  base: '/',
  integrations: [react()],
  output: 'static',
  build: {
    assets: 'assets',
    inlineStylesheets: 'always'
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react/jsx-runtime'],
            'framer': ['framer-motion'],
          }
        }
      }
    }
  },
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
    domains: ['designdoings.com'],
    formats: ['webp', 'avif'],
    quality: 80
  }
});
