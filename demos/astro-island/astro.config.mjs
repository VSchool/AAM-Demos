// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  base: '/AAM-Demos/astro-island/',
  outDir: '../../_site/astro-island',
});