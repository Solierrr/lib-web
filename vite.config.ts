import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  publicDir: false,
  build: {
    lib: {
      entry: {
        index: resolve(import.meta.dirname, 'src/index.ts'),
        email: resolve(import.meta.dirname, 'src/email/index.ts'),
        observability: resolve(import.meta.dirname, 'src/observability/index.ts'),
        tokens: resolve(import.meta.dirname, 'src/tokens/index.ts'),
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
      cssFileName: 'index',
    },
    rollupOptions: {
      external: (id) => /^(react|react-dom|react-email|lucide-react|react-icons|react-router-dom|react-i18next|i18next|react-speech-recognition)(\/|$)/.test(id),
    },
  },
})
