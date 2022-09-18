import { fileURLToPath, URL } from "node:url";
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

import preprocess from 'svelte-preprocess';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte({ preprocess: preprocess({ postcss: true }) })],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
})
