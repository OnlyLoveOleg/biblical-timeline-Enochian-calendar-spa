import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  // Relative asset paths, so `dist/` can be deployed under any sub-path (or opened from
  // disk) without knowing the final URI ahead of time: a script tag becomes
  // `./assets/foo.js` instead of `/assets/foo.js`. Keep this if you ever add client-side
  // routing with History-mode URLs, which need an absolute base to resolve correctly.
  base: './',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
