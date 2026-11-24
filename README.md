<div align="center">

# 🛂 Vize Makinesi

**A Turkish-language visa consultation website with a built-in admin CMS.**

Turkish citizens browse visa requirements for 40+ countries, read guides, and send a consultation request.
The team manages every piece of content, and every incoming request, from a private admin panel.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%2B%20Auth%20%2B%20Storage-3ecf8e?logo=supabase&logoColor=white)
![CI](https://github.com/KaguSoftware/VizeMakinesi/actions/workflows/ci.yml/badge.svg)

</div>

---

## Table of contents

- [What it does](#what-it-does)
- [How it works](#how-it-works)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Quick start](#quick-start)
- [Supabase setup](#supabase-setup)
- [Environment variables](#environment-variables)
- [Admin panel](#admin-panel)
- [Deployment](#deployment)
- [Development commands & CI](#development-commands--ci)

For deeper architecture notes and runbooks see [CLAUDE.md](./CLAUDE.md).

---

## What it does

**For visitors** (all content is in Turkish):

| Area | Route | What's there |
|---|---|---|
| Home | `/` | Hero, country marquee, region mosaic, process overview, partners |
| Country guides | `/vize/[countrySlug]` | Requirements, documents, process, FAQs, appointment days, tourism blog posts per country |
| Schengen | `/schengen` | One guide for the whole 29-country zone: rules, C/D visa types, application steps, FAQ |
| Visa types | `/vize-turleri/...` | Tourist, student, work, family, business, transit and more |
| Blog | `/blog/...` | Articles per country and for Schengen |
| Consultation | `/danisma-al` | Request form (visa or expedite), with country and date pickers |
| Company | `/hakkimizda`, `/ekibimiz`, `/ortakliklar`, `/ofis`, `/iletisim` | About, team, partners, office, contact |
| Info pages | `/nasil-calisiriz`, `/ucrete-dahil-hizmetler`, `/cascade-kurali`, `/abd-hizlandirma` | How we work, fees, the cascade rule, US expedite |

**For the team** (`/admin`): edit countries, the Schengen page, the mega menu, the marquee, partners and team members, and read and manage consultation requests, with no code changes or redeploys.

---

## How it works

```
 Visitor ──► Next.js (App Router, ISR pages) ──► src/lib/data/*  ──► Supabase Postgres
                                                                         ▲
 Admin  ──► /admin (auth + admin_profiles check) ──► server actions ─────┘
                                                      │  └─► revalidatePath() refreshes public pages
                                                      └─► Supabase Storage (WebP images)

 Consultation form ──► server action ──► rate limit ──► consultation_requests row
                                                    └──► Resend emails (customer + owner alert)
```

1. **Content lives in Supabase.** Every public page reads through the data layer in `src/lib/data/`, never straight from components.
2. **Pages are statically generated with ISR.** Country pages are pre-rendered at build time (using a cookie-less static Supabase client). When an admin saves a change, the server action calls `revalidatePath` so the public site updates within moments.
3. **The admin panel is locked down twice.** `src/proxy.ts` (Next.js middleware) refreshes the Supabase session on `/admin/*`; the `(authed)` layout then checks the user exists in `admin_profiles`. Every server action also calls `requireAdmin()`, so protection doesn't rely on the UI alone.
4. **Images are compressed in the browser.** `ImageUploader` converts uploads to WebP (max 1 MB / 1920 px) before sending them to Supabase Storage.
5. **Consultation requests are rate-limited and emailed.** The form stores the request, then Resend sends a confirmation to the visitor and an alert to the team. Without `RESEND_API_KEY` the request is still saved and emails are skipped.
6. **Schengen is special.** Its hero comes from the `countries` row with slug `schengen`; all other text comes from the singleton `schengen_page` table (with `src/data/schengenPage.ts` as a fallback). `/vize/schengen` redirects to `/schengen`.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Server Actions, ISR), React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4, Framer Motion 12 (fonts: Syne, Inter, JetBrains Mono) |
| Backend | Supabase (Postgres, Auth, Storage) via `@supabase/ssr` |
| Email | Resend |
| PDF | `pdf-lib` (server-side PDF compression for admin uploads) |
| Admin UX | `@dnd-kit` drag-and-drop ordering, `browser-image-compression` |
| Hosting | Vercel (region `dub1`) |

---

## Project structure

```
src/
├─ app/
│  ├─ (public)/            Public site (wrapped by Nav + Footer)
│  ├─ admin/login/         Login page (bare layout)
│  ├─ admin/(authed)/      Protected admin pages + sidebar layout
│  └─ api/                 compress-pdf, countries/search
├─ components/             Grouped by page section (home, visa, schengen, ...)
│  ├─ shared/              Reusable pieces (e.g. FlagBG)
│  ├─ global/              Nav and Footer
│  └─ admin/ui/            Admin primitives (AdminButton, ImageUploader, Toast, ...)
├─ lib/
│  ├─ data/                All public data fetching
│  ├─ supabase/            Server, browser and static clients + generated types
│  ├─ auth/requireAdmin.ts Guard used in every server action
│  ├─ email/               Resend templates
│  ├─ images/              WebP compression + upload
│  ├─ rateLimit.ts         Form rate limiting
│  └─ routes.ts            countryHref(): single source of truth for country URLs
└─ proxy.ts                Session refresh for /admin/*
supabase/migrations/       SQL schema + seed content (0001 → 0028)
```

---

## Quick start

**Requirements:** Node.js 20+ and a Supabase project (see below).

```bash
git clone https://github.com/KaguSoftware/VizeMakinesi.git
cd VizeMakinesi
npm install
# create .env.local (see "Environment variables")
npm run dev
```

- Site: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

> `npm run build` needs live Supabase credentials because it pre-renders pages from the database.

---

## Supabase setup

1. **Create a project** at [supabase.com/dashboard](https://supabase.com/dashboard).
2. **Run the migrations.** In the SQL editor, run every file in `supabase/migrations/` in order (`0001_…` to `0028_…`; there are two `0014_*` files, so run both). They create the schema and seed the countries and content.
3. **Create four public Storage buckets:** `country-flags`, `country-tourism`, `partnership-logos`, `team-photos`.
4. **Create the first admin:** Authentication → Users → Add user (email + password), then run:
   ```sql
   INSERT INTO admin_profiles (id, email)
   SELECT id, email FROM auth.users WHERE email = 'your@email.com';
   ```
   The same two steps add any later admin.

---

## Environment variables

Create `.env.local`:

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → service_role key (**secret, server-only**) |
| `RESEND_API_KEY` | Resend dashboard → API Keys (optional; consultation emails are skipped without it) |

---

## Admin panel

Sign in at `/admin/login`. Sections:

| Section | Manages |
|---|---|
| Countries | Per-country content, flags, tourism images, visa types, documents, FAQs, blog posts |
| Schengen | The singleton Schengen page copy and FAQs |
| Mega menu | Navigation dropdown groups and links |
| Marquee | The scrolling country strip on the home page |
| Partnerships | Partner logos |
| Team | Team members and photos |
| Requests | Incoming consultation requests |

Always use the shared `ImageUploader` for images rather than a raw file input.

---

## Deployment

1. Import the repo into Vercel.
2. Add the environment variables above (Production, Preview and Development).
3. Deploy. Vercel runs `npm run build` and pins functions to `dub1` (see `vercel.json`).

---

## Development commands & CI

```bash
npm run dev         # Dev server at http://localhost:3000
npm run build       # Production build (needs Supabase env vars)
npm start           # Serve the production build locally
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
```

GitHub Actions (`.github/workflows/ci.yml`) runs on every push to `main` and on pull requests:
`npm ci` → lint → typecheck → `next build --experimental-build-mode compile`. The compile-only build avoids needing live Supabase data in CI. There is no unit-test framework yet.
