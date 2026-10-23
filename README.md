# pyhor portfolio

A responsive business and technology portfolio built with React, Vite, Three.js, GSAP, and public GitHub data. The visual system uses navy and slate foundations, blue business accents, indigo development accents, and teal quality accents, with light and dark themes.

Full-width editorial chapters connect a business/build/quality preview, detailed project presentations, an interactive delivery workflow, a strictly 2D engineering study, and project reflections. Sections span the viewport while paragraphs keep readable line lengths. The combined career/project timeline sorts machine-readable end dates newest first.

The homepage project rail leads with JomGo, followed by the documented hotel, cinema, veterinary, and ASEAN research projects. It renders one accessible copy of each project and recycles offscreen positions for a slow desktop loop. Hover, focus, the pause button, hidden tabs, and offscreen visibility stop the loop. Touch and reduced-motion visitors browse a native horizontal scroll area. Text-led summaries are labeled where local project screenshots are unavailable.

Scroll-linked chapter entrances use the existing GSAP/ScrollTrigger stack without pinning or wheel interception. Selective heading accents reveal meaningful English words and Chinese phrases; reduced motion keeps all text immediately readable and removes chapter movement.

The only Three.js scene is an optional hero disclosure. Its bundle loads after the visitor chooses to open the study, pauses while offscreen or the tab is hidden, and unmounts when closed. Section 05 has no 3D content. Touch dragging preserves vertical scrolling; arrow keys, surface/mesh, pause, and reset controls remain available.

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

Preview uses the production `/portfolio-project/` base path; development uses `/`. Generated `docs/` output is intentionally ignored by Git. There are no configured lint, type-check, or root npm test scripts. Run the existing Node suite with `node --test`; backend tests also run with `npm test --prefix server`. They cover validation and delivery failures, Vercel request parsing, date ordering, motion bounds, and English/Chinese translation coverage. Verify the production build and all seven routes across screen sizes, touch and keyboard input, reduced motion, and the WebGL fallback. No additional dependencies are required for the interactions.

## Configuration

Optional Vite environment variables:

```bash
VITE_GITHUB_USER=pyhor
VITE_CONTACT_API_URL=https://your-api.example/api/contact
```

The site defaults to the `pyhor` GitHub profile. The contact form uses `/api/contact` on Vercel or the explicit public API URL on a static host. Email recipients and Resend credentials stay server-side. See [CONTACT_SETUP.md](CONTACT_SETUP.md) and the root/server `.env.example` files for deployment and private configuration. No credentials are included; live email delivery must be enabled and verified on the deployed backend.

The GitHub Pages workflow accepts the public `VITE_CONTACT_API_URL` repository variable. Pages alone cannot run the email API. Vercel also has explicit rewrites for the six secondary portfolio routes.

## Business systems case studies

`/projects/jomgo` is the primary evidence-led case study. Its retrospective requirements, stakeholder map, As-Is/To-Be flows, gap analysis, MoSCoW priorities, user stories, acceptance criteria, business rules, architecture, integration analysis, six **unexecuted** UAT designs, traceability matrix, and interactive lifecycle use source-pinned references to `pyhor/JomGo-web` at `0757591`. Source presence is distinguished from production validation; community reporting and reliability changes are explicitly proposed. `/projects/hotel-website-2023` and `/projects/cinema-mgmt-system-2020` provide shorter case studies grounded in the existing portfolio content.

English and Simplified Chinese copy lives in the existing locale dictionaries. New data relationships are in `src/data/jomgoCaseStudy.json`; case-specific styles are scoped in `src/styles/case-study.scss`. The chapter navigator scrolls normally, native disclosures reveal detail, and lifecycle buttons support keyboard, mouse, and touch. Complex flows stack on phones and the traceability table scrolls inside its own container.

Theme preference defaults to **System**, follows OS changes dynamically, and supports persisted Light/Dark overrides. An early HTML bootstrap resolves the theme before React loads. Existing contact API and email delivery configuration remain unchanged.
