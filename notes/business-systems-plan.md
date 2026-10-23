# Business systems portfolio implementation

Goal: evolve the existing portfolio, preserving frontend experience, contact delivery, motion, and visual language. Execute on the existing main branch with one final commit and normal push, as requested.

Source: both supplied briefs; local JomGo-web source at 0757591. The portfolio previously contained no JomGo content. Use source-pinned public file references; never claim interviews, production outcomes, deployed security verification, or executed JomGo UAT. Analysis artifacts are retrospective portfolio work, not contemporaneous client deliverables.

Design: dedicated /projects/jomgo evidence-led page with anchored chapters, compact cards, native disclosures, source references, and a selectable requirement lifecycle. Promote it in the existing project rail and project listing. Short case studies extend hotel and cinema project presentations. Keep the 2D engineering section, carousel mechanics, real contact form, and reverse chronological journey. Add system/light/dark preference with an early theme bootstrap. All new copy belongs to English and Simplified Chinese dictionaries.

Implementation sequence:
- [x] Source-backed requirements, story/UAT mappings and content integrity tests.
- [x] JomGo case study and responsive interactive traceability, architecture, process, gap, decisions, scope and improvements.
- [x] Homepage/project discovery, shorter existing case studies, clickable thinking arrow, system theme.
- [x] Existing Node/backend suites, production build, and browser review of routes/languages/themes/sizes/interactions.
- [ ] Final diff, commit and normal push.

Review focus: distinguish implementation from validation; preserve source references; no page overflow at 320px; no hover-only behavior; no untranslated new copy; direct navigation under GitHub Pages and Vercel; storage-disabled and dynamically changing system theme.

Verification record: 160 combinations (10 routes × 4 widths: 320/390/768/1440 × English/Simplified Chinese × light/dark) passed without page overflow or broken images. Dynamic OS theme and persistent overrides passed. Lifecycle paths, keyboard/tap selection, native disclosures, anchor targets, reduced motion, contact validation/failure retention, and storage-disabled startup passed. Contact requests were intercepted for the browser check; no real email was sent. Production preview deep links/assets passed under /portfolio-project/. Root node --test: 40 tests passed, including concurrent glass tests; npm test --prefix server: 13 passed. Independent read-only source/content/code review found no actionable issues. A production check exposed closed target disclosures; useArtifactNavigation now reveals linked artifacts, including repeated hash navigation.

Known environment/build notes: GitHub data refresh could not resolve its host, so the existing fallback remains in use. Vite reports the pre-existing optional/lazy HeroScene chunk above 500 kB. There are no configured lint or typecheck scripts. JomGo UAT remains unexecuted, independently of portfolio checks. Real email delivery and deployed Supabase access policies were not audited.
