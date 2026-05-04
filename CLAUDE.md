# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm start        # Start production server
npm run lint     # Run ESLint
```

No test framework is configured.

## Architecture

**Vize Makinesi** is a Next.js 15 (App Router) + TypeScript + Tailwind CSS 4 visa consultation website for Turkish citizens.

### Path alias
`@/*` maps to `./src/*`

### Key directories

- `src/app/` — Next.js App Router pages. Dynamic routes: `visa/[countrySlug]/` and `blog/[countrySlug]/`
- `src/components/` — Organized by page section (`home/`, `about/`, `visa/`, `schengen/`, etc.) plus `shared/` for reusable components and `global/` for Nav and Footer
- `src/data/` — Central data layer: `countries.ts` (main dataset ~22KB), `countries.types.ts` (TypeScript types), `site.ts` (contact info and business hours)

### Data flow
Country/visa data lives entirely in `src/data/countries.ts`. Dynamic pages (`visa/[countrySlug]`, `blog/[countrySlug]`) consume this data at build time — there is no backend or API. Adding a new country means adding an entry to `countries.ts`.

### Styling
- Tailwind CSS 4 via PostCSS
- Global theme in `src/app/globals.css`: primary colors navy `#1a5c5b` / coral `#309c9b` / cream `#fdfbe5`, fonts Syne + Inter + JetBrains Mono, max container width 1360px
- Animations via Framer Motion 12

### Content language
All user-facing content is in Turkish. Route `danisma-al` = "get consultation".
