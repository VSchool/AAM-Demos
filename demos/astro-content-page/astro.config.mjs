// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://vschool.github.io',
  base: '/AAM-Demos/astro-content-page/',
  output: 'static',
  build: {
    format: 'directory',
  },
  outDir: '../../_site/astro-content-page',
});
