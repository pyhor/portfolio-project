# pyhor portfolio

A responsive business and technology portfolio built with React, Vite, Three.js, GSAP, and public GitHub data. The visual system uses navy and slate foundations, blue business accents, indigo development accents, and teal quality accents, with light and dark themes.

The homepage includes a business/build/quality system preview, project image previews, an interactive six-stage delivery workflow, and a contained 3D study. The 3D bundle loads only when its section approaches the viewport and pauses when offscreen or the tab is hidden. Touch dragging preserves vertical page scrolling; keyboard arrow keys, surface/mesh, pause, and reset controls are available.

A brief, skippable identity intro plays once per browser session and never waits for decorative 3D assets. A desktop-only contextual cursor indicates VIEW, OPEN, EXPLORE, and DRAG actions. Forms and modal dialogs retain native cursor behavior. Reduced motion disables the custom cursor, magnetic movement, pointer parallax, and automatic 3D animation, and shortens the intro.

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

```bash
npm run preview
```

Preview uses the production `/portfolio-project/` base path; development uses `/`. Generated `docs/` output is intentionally ignored by Git. There are no configured lint, type-check, or npm test scripts. The existing tilt helper tests run with `node --test src/lib/motion.test.js`. Verify changes with those tests, the production build, and browser checks across the seven routes, touch and keyboard input, reduced motion, and the WebGL fallback. No additional dependencies are required for the interactions.

## Configuration

Optional Vite environment variables:

```bash
VITE_GITHUB_USER=pyhor
VITE_CONTACT_EMAIL=you@example.com
```

If these are not set, the site defaults to the `pyhor` GitHub profile and routes the primary contact action to GitHub.
