// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://vschool.github.io',
  base: '/AAM-Demos/astro-blog/',
  outDir: '../../_site/astro-blog',
  integrations: [mdx()],
});
