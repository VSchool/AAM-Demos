// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://vschool.github.io',
  base: '/AAM-Demos/astro-event-listing-v2/',
  output: 'static',
  integrations: [react()],
  build: {
    format: 'directory',
  },
});
