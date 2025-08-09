// @ts-check
import { defineConfig } from 'astro/config';

import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
  integrations: [preact()],
  markdown: {
    shikiConfig: {
      theme: 'catppuccin-mocha',
    },
  },
});
