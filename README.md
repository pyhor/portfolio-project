# pyhor portfolio

A cinematic, static-deployable developer portfolio built with React, Vite, Three.js, GSAP, and live GitHub API data.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The production site is emitted to `docs/`, which is ready for GitHub Pages.

## Configuration

Optional Vite environment variables:

```bash
VITE_GITHUB_USER=pyhor
VITE_CONTACT_EMAIL=you@example.com
```

If these are not set, the site defaults to the `pyhor` GitHub profile and routes the primary contact action to GitHub.
