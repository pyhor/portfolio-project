import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],

  // 👇 IMPORTANT for GitHub Pages
  //base: command === 'build' ? '/portfolio-project/' : '/',
  base: '/pyhor/',

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
}))