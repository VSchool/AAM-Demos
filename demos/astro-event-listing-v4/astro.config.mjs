// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://vschool.github.io',
  base: '/AAM-Demos/astro-event-listing-v4/',
  output: 'static',
  integrations: [react(), sitemap()],
  build: {
    format: 'directory',
  },
});
