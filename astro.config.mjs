import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://xiaoxuedd.github.io',
  base: '/folio2026/',
  integrations: [react()],
  output: 'static',
  build: {
    assets: 'assets'
  }
});
