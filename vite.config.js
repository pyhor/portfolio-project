import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const repoBase = '/portfolio-project/'

function devBaseRedirect() {
  return {
    name: 'dev-base-redirect',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || ''
        if (url === '/portfolio-project' || url.startsWith('/portfolio-project/')) {
          const target = url.replace(/^\/portfolio-project/, '') || '/'
          res.statusCode = 302
          res.setHeader('Location', target)
          res.end()
          return
        }
        next()
      })
    },
  }
}

function ghPagesSpaFallback() {
  return {
    name: 'gh-pages-spa-fallback',
    closeBundle() {
      const outDir = resolve('docs')
      const indexPath = resolve(outDir, 'index.html')
      if (!existsSync(indexPath)) return
      const redirectScript = `<script>(function(){var r=sessionStorage.getItem('gh-pages-redirect');if(r){sessionStorage.removeItem('gh-pages-redirect');history.replaceState(null,'',r);}})();</script>`
      let html = readFileSync(indexPath, 'utf8')
      if (!html.includes('gh-pages-redirect')) {
        html = html.replace('<head>', `<head>${redirectScript}`)
      }
      writeFileSync(resolve(outDir, '404.html'), html)
      copyFileSync(indexPath, resolve(outDir, '404.html'))
      html = readFileSync(resolve(outDir, '404.html'), 'utf8')
      if (!html.includes('gh-pages-redirect')) {
        writeFileSync(resolve(outDir, '404.html'), html.replace('<head>', `<head>${redirectScript}`))
      }
    },
  }
}

export default defineConfig(({ command }) => ({
  // Dev: open http://localhost:5173/  |  Build: GitHub Pages subpath
  base: command === 'serve' || process.env.VERCEL ? '/' : repoBase,
  plugins: [react(), devBaseRedirect(), ghPagesSpaFallback()],
  build: {
    outDir: 'docs',
    assetsDir: 'assets',
  },
  server: {
    open: '/',
  },
}))
