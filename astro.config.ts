// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://spooky063.github.io',
  base: '/tv-guide-astro',
  vite: {
    plugins: [tailwindcss()]
  }
});