import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// Use base path only in production (GitHub Pages)
const base = process.env.NODE_ENV === 'production' ? '/folio2026/' : '/';

// https://astro.build/config
export default defineConfig({
  site: 'https://xiaoxuedd.github.io',
  base: base,
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
    domains: ['xiaoxuedd.github.io'],
    formats: ['webp', 'avif'],
    quality: 80
  }
});
