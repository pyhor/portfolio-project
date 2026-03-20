import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/portfolio-project/',  // MUST match your repo name
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});