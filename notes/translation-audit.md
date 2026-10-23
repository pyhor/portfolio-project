# Portfolio translation audit

Reviewed on 23 October 2026.

## Coverage

All five supported languages now contain 1,127 nonempty entries with matching interpolation tokens and markup: English, Simplified Chinese, Traditional Chinese, Cantonese, and Malay. The three previously incomplete catalogs each contained 420 entries; they now include the missing 707 entries. Existing translations were also reviewed against current English copy, correcting stale biographies, project descriptions, headings, and claims.

## Changes

- Completed page, navigation, component, form validation, error recovery, project, and case-study translations.
- Bundled every supported catalog before first render to avoid an English flash when loading a saved language.
- Localized page titles, descriptions, repository summaries, lifecycle labels, and remaining legacy interface text.
- Preserved official names, brands, technical identifiers, source evidence, and historical screenshots in their original form. The language greeting display intentionally presents greetings in each native language.
- Unknown external repository descriptions use a translated generic summary outside English rather than displaying untranslated English.

## Verification

- `npm run audit:locales`: zero missing, extra, empty, token-mismatched, or unreviewed entries in all five catalogs; no flagged hardcoded interface text in scanned JavaScript/JSX sources.
- `node --test src/lib/*.test.js tests/*.test.mjs`: 36 tests passed.
- `npx vite build`: production build passed; existing bundle-size advisory remains.
- Browser review: 10 routes in each of five languages (50 page checks), plus 55 interactive-state checks covering workflow stages, engineering scenarios, form errors, and requirement lifecycle labels. Expanded case-study disclosures were inspected.
- Mobile review: all five languages at 390 × 844 without horizontal overflow or hero/header overlap.

## Future checks

The audit command checks catalog parity, placeholders, markup, literal translation references, case-study data references, and rendered source text. A source fingerprint flags English meaning changes that require reviewing the other four catalogs, preventing stale translations from passing solely because their keys exist. Reviewed proper names and technical literals have explicit exceptions. Automated checks supplement meaning-level review and browser checks.
