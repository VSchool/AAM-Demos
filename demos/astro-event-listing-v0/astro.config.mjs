// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://vschool.github.io',
  base: '/AAM-Demos/astro-event-listing-v0/',
  output: 'static',
  build: {
    format: 'directory',
  },
});
