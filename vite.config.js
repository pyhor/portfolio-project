import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/portfolio-project/',
  plugins: [react()],
  build: {
    outDir: 'docs',
    assetsDir: 'assets',
  },
});