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

**Vize Makinesi** is a Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 visa consultation website for Turkish citizens.

### Path alias
`@/*` maps to `./src/*`

### Key directories

- `src/app/` — Next.js App Router pages, split into route groups:
  - `(public)/` — all public-facing routes (home, visa pages, blog, contact, etc.) wrapped by Nav + Footer
  - `admin/login/` — login page, no admin chrome, inherits bare root layout
  - `admin/(authed)/` — protected admin pages (dashboard, future CRUD). Layout verifies session + `admin_profiles` membership; redirects to `/admin/login` if not authed. Sign-out at `POST /admin/signout`.
- `src/components/` — Organized by page section (`home/`, `about/`, `visa/`, `schengen/`, etc.) plus `shared/` for reusable components, `global/` for Nav and Footer, and `admin/` for admin-only components
  - `src/components/admin/ui/` — reusable admin UI primitives: `AdminButton`, `AdminInput`, `AdminTextarea`, `AdminSelect`, `AdminLabel`, `AdminCard`, `EyebrowText`. Import from `@/components/admin/ui`.
- `src/data/` — Central data layer: `countries.ts` (main dataset ~22KB), `countries.types.ts` (TypeScript types), `site.ts` (contact info and business hours)

### Data flow
Country/visa data lives in Supabase (`countries` table) and is fetched at build time via `src/lib/data/countries.ts`. Dynamic pages (`visa/[countrySlug]`, `blog/[countrySlug]`) use `generateStaticParams`. The admin panel reads/writes directly to Supabase via the server client.

### Auth
- `src/proxy.ts` — Next.js 16 proxy (formerly middleware): matches `/admin/:path*`, refreshes Supabase session, enforces `admin_profiles` membership, redirects unauthenticated requests to `/admin/login`
- Admin session uses `@supabase/ssr` cookie-based auth; sign-out via `POST /admin/signout`

### Styling
- Tailwind CSS 4 via PostCSS
- Global theme in `src/app/globals.css`: primary colors navy `#1a5c5b` / coral `#309c9b` / cream `#fdfbe5`, fonts Syne + Inter + JetBrains Mono, max container width 1360px
- Animations via Framer Motion 12

### Content language
All user-facing content is in Turkish. Route `danisma-al` = "get consultation".
