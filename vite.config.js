import { resolve } from 'node:path'

import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    minify: false,
    target: 'es2017',
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.js'),
      formats: ['es', 'cjs'],
      fileName: format => (format === 'es' ? 'index.js' : 'index.cjs'),
    },
  },
})
