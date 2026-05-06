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
  - `admin/(authed)/` — protected admin pages. Layout verifies session + `admin_profiles` membership; redirects to `/admin/login` if not authed. Sign-out at `POST /admin/signout`.
- `src/components/` — Organized by page section (`home/`, `about/`, `visa/`, `schengen/`, etc.) plus `shared/` for reusable components, `global/` for Nav and Footer, and `admin/` for admin-only components
  - `src/components/admin/ui/` — reusable admin UI primitives: `AdminButton`, `AdminInput`, `AdminTextarea`, `AdminSelect`, `AdminLabel`, `AdminCard`, `EyebrowText`, `RepeatableList`, `ImageUploader`, `ConfirmDialog`, `Toast`. Import from `@/components/admin/ui`.
- `src/lib/data/` — All public data fetching. Every public page sources data from here.
- `src/lib/supabase/` — Supabase client variants (server, client, static/build-time) and `database.types.ts`
- `src/lib/auth/requireAdmin.ts` — Auth guard used in every server action; redirects to `/admin/login` if not authed or not in `admin_profiles`
- `src/lib/images/` — `compress.ts` (WebP compression via browser-image-compression), `upload.ts` (compress → upload to Supabase Storage)

### Admin panel structure

**Route structure:**
- `/admin/login` — unauthenticated login page
- `/admin/(authed)/*` — all protected pages share the layout in `src/app/admin/(authed)/layout.tsx`
- Resources: `/admin/countries`, `/admin/mega-menu`, `/admin/marquee`, `/admin/partnerships`, `/admin/team`

**Auth flow:**
1. `src/proxy.ts` (Next.js middleware) matches `/admin/:path*`, refreshes Supabase session cookies
2. `admin/(authed)/layout.tsx` checks `auth.getUser()` and queries `admin_profiles`; redirects to `/admin/login` if either fails. If `auth.users` exists but `admin_profiles` doesn't, it signs the user out first.
3. Every server action calls `requireAdmin()` which performs the same check and redirects rather than throwing.

**Why the `(authed)` route group exists:** It lets the login page (`admin/login/`) share the bare root layout while all dashboard pages share a separate layout with the sidebar — without nesting login inside the auth-protected segment.

### Data layer

- All public data flows through `src/lib/data/*` (countries, marquee, megaMenu, partnerships, team)
- Public pages use ISR: `revalidatePath` is called from server actions after every write
- Admin pages call `revalidatePath` after writes; the specific paths revalidated are documented in each `actions.ts` file
- Build-time static param generation uses `createStaticClient()` (no cookies) instead of the server client

### Image uploads

- Always use `<ImageUploader>` from `@/components/admin/ui` in admin forms — never raw `<input type="file">`
- `ImageUploader` shows compression progress (Sıkıştırılıyor → Yükleniyor → Tamamlandı) and before/after file sizes
- All uploads are compressed to WebP, max 1MB, max 1920px via `src/lib/images/compress.ts`
- Storage buckets: `country-flags`, `country-tourism`, `partnership-logos`, `team-photos`

### Styling

- Tailwind CSS 4 via PostCSS
- Global theme in `src/app/globals.css`: primary colors navy `#1a5c5b` / coral `#309c9b` / cream `#fdfbe5`, fonts Syne + Inter + JetBrains Mono, max container width 1360px
- Animations via Framer Motion 12

### Content language

All user-facing content is in Turkish. Route `danisma-al` = "get consultation".

---

## Operational runbooks

### Adding a new admin user

1. Create the user in Supabase dashboard → Authentication → Users (set email + password)
2. Run this SQL in the Supabase SQL editor:
   ```sql
   INSERT INTO admin_profiles (id, email)
   SELECT id, email FROM auth.users WHERE email = 'NEW_ADMIN_EMAIL';
   ```

### Adding a new flag preset

1. Add a new `case` to `src/components/shared/FlagBG/FlagBG.tsx`
2. Add the view-box to `FLAG_VIEW_BOXES` in `src/components/shared/FlagBG/constants.ts`
3. Add the key + label to the `PRESET_KEYS` array in `src/app/admin/(authed)/countries/CountryForm.tsx`

### Error boundaries

- `src/app/error.tsx` — root-level catch for public site crashes
- `src/app/admin/(authed)/error.tsx` — admin panel catch with "Tekrar Dene" reset button

### Loading states

Every admin resource route has a `loading.tsx` skeleton. The layout-level `src/app/admin/(authed)/loading.tsx` is the fallback for pages without their own.
