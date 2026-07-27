# Vize Makinesi — Handoff

> Read this first when starting a fresh chat. Companion: **CLAUDE.md** (architecture, admin panel
> structure, data layer, runbooks — the durable reference; this file is session state + gotchas).

## Working style
- **Git authorship**: Parsa is the sole author. **Never** add Claude/AI as co-author, never mention
  AI in commit messages or PR bodies.
- **Branch**: work lands on **`dev`** (`KaguSoftware/dev` on GitHub), merged to `main` via PR.
- **Collaborate**: agree before locking user-facing decisions; plan mode for non-trivial work.
- Windows 11 + PowerShell (a Bash tool is also available for POSIX scripts).

## What this is
**Vize Makinesi** — a Next.js 16 (App Router) + TS + Tailwind v4 visa-consultation website for
Turkish citizens (kagusoftware.com client). Public marketing/visa-info site + a Supabase-backed
admin CMS (`/admin`). All user-facing content is Turkish. Two audiences share one codebase: the
public site (Persuade) and the admin panel (Operate).

## Stack & environment
- Next.js 16.2 (App Router, Turbopack), React 19, Tailwind CSS 4, Framer Motion 12.
- Supabase: Postgres + RLS, Auth (admin login), Storage buckets (flags/tourism/logos/photos),
  **Realtime** (newly used — see Current status). Project ref `vycmgmkihxiyyurqephx`, region
  **eu-west-1 (Ireland)**.
- **Resend** for transactional email — DNS verified on `gezimakinesi.com`.
- Env in `.env.local` (gitignored, never commit): `NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `RESEND_API_KEY`, and **`SUPABASE_SERVICE_ROLE_KEY`
  (currently BLANK — must be filled, see gotchas)**.
- Vercel deploy; compute pinned to **`dub1`** (`vercel.json`) next to the Ireland DB.

## Conventions
- Path alias `@/*` → `./src/*`. See CLAUDE.md for the full directory map.
- **Admin auth**: every server action calls `requireAdmin()` first (`src/lib/auth/requireAdmin.ts`);
  `admin_profiles` is keyed by **`id` = `auth.uid()`** (NOT `user_id`). RLS admin checks use
  `EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())`.
- **Writes** go through `writer(supabase, table)` (`src/lib/supabase/writer.ts`) — add any new
  writable table to the `WritableTable` union there. `database.types.ts` is hand-maintained (not
  fully CLI-generated); add new tables/columns by hand matching the existing shape.
- **Admin UI** primitives in `src/components/admin/ui/` (`AdminButton`, `EmptyState`,
  `ConfirmDialog`, `useToast`, etc.). Reuse them; don't hand-roll.
- **Migrations**: CLI is linked. Remote migration history was empty until 2026-07-24; 0001–0009
  were `migration repair`-ed to `applied`, so **`supabase db push` now works** for new migrations.
- Public data flows through `src/lib/data/*`; admin writes call `revalidatePath`.

## Current status (2026-07-24)

### 🟢 WHATSAPP → EMAIL + REAL-TIME ADMIN REQUESTS — BUILT + STATICALLY VERIFIED (lint 0 errors, build green), migration 0010 APPLIED to prod + RLS runtime-verified. Committed on `dev` (`da4da28` + polish `f52d31e`). **NOT pushed to origin yet** (push was blocked in-session — Parsa must `git push origin dev`). Live end-to-end drive by a human PENDING.
The client asked to move every user→owner contact path off WhatsApp onto email, with requests shown
live in the admin panel. A co-worker had already changed the form fields (response-preference field
+ phone/name restrictions); this session did the rest.

1. **Consultation form now persists + emails instead of opening WhatsApp.**
   `src/app/(public)/danisma-al/DanismaAlForm.tsx` submit → new server action
   `submitConsultationRequest` (`danisma-al/actions.ts`): server-side re-validates, inserts into
   `consultation_requests`, then fires owner + customer emails inside Next's **`after()`** (never
   blocks the submit). On success the form is replaced by a Turkish "Talebiniz alındı" panel.
   Old WhatsApp-green button + `window.open(wa.me...)` are gone.
   - Insert prefers the **service client** (`createAdminClient()`), falling back to the anon server
     client if `SUPABASE_SERVICE_ROLE_KEY` is unset. RLS allows anon insert either way.
2. **Emails** — `src/lib/email/resend.ts`: `sendOwnerRequestEmail` → **vize@gezimakinesi.com**
   (brand HTML table of the request, replyTo = customer) and `sendCustomerConfirmationEmail` → the
   customer (Turkish confirmation). From `Vize Makinesi <talep@gezimakinesi.com>`. If
   `RESEND_API_KEY` is missing they log-and-skip rather than throw.
3. **Admin "Talepler" section** (`/admin/requests`) — real-time list.
   `RequestsList.tsx` subscribes to `postgres_changes` on `consultation_requests`. ⚠️ **The
   load-bearing detail:** it calls `supabase.realtime.setAuth(access_token)` BEFORE `.subscribe()`
   — an RLS table streams nothing on an anon socket even though the channel reports SUBSCRIBED.
   New rows prepend + pop a toast; mark read/unread + delete via `requests/actions.ts`. Unread
   count badge on the page header; the section auto-appears on the dashboard grid + sidebar (nav
   entry in `src/lib/admin/nav.ts`, icon in `NavIcon.tsx`).
4. **WhatsApp removed sitewide** — homepage BigCTA, footer, mobile nav, per-country CTA, contact
   page, ABD page all now point at the phone or `/danisma-al` (coral brand, not WhatsApp green).
   `--color-whatsapp` token and `SITE.whatsappHref/whatsappText` deleted. `grep -ri whatsapp src/`
   leaves only the **contact-preference option** (WhatsApp / E-posta / Telefon) — kept deliberately
   as a *choice the customer states* (shown in the admin panel), NOT as a channel. `CONTACT_OPTIONS`
   lives in `danisma-al/requestSummary.ts` (renamed from `buildWhatsAppMessage.ts`).

**Migration 0010** (`supabase/migrations/0010_consultation_requests.sql`): `consultation_requests`
table, RLS (anon INSERT; admin SELECT/UPDATE/DELETE), two indexes, realtime publication + replica
identity full. **Runtime-verified against prod**: anon INSERT → 201, anon SELECT → `[]` (read
blocked). ⚠️ That verification left one junk row `__test __test` in prod — delete it from the admin
panel (it's a fine first test of the delete button).

**Not driven by a human yet.** The checks that matter: (a) fill `/danisma-al` and submit → success
panel + row in DB + owner email at vize@gezimakinesi.com + customer confirmation; (b) two tabs — open
`/admin/requests`, submit the form in the other → row prepends live + toast, no refresh (this proves
the `setAuth` fix); (c) mark read/unread + delete persist.

## File map (key files)
- `src/app/(public)/danisma-al/actions.ts` — form submit server action (insert + `after()` emails).
- `src/app/(public)/danisma-al/DanismaAlForm.tsx` — the public form (async submit + success panel).
- `src/app/(public)/danisma-al/requestSummary.ts` — `CONTACT_OPTIONS`/`ContactPref` +
  `buildRequestSummary` (shared by form, preview, email). Renamed from `buildWhatsAppMessage.ts`.
- `src/app/(public)/danisma-al/FormPreview.tsx` — live request-summary card (already brand-styled).
- `src/lib/email/resend.ts` — Resend client + owner/customer email senders (server-only).
- `src/app/admin/(authed)/requests/` — `page.tsx` (server fetch), `RequestsList.tsx` (realtime
  client — see the `setAuth` warning), `actions.ts` (mark read / delete), `loading.tsx`.
- `src/lib/admin/nav.ts` + `src/components/admin/NavIcon.tsx` — 'Talepler' nav entry + icon.
- `src/lib/supabase/{writer.ts,database.types.ts,admin.ts,client.ts,server.ts}` — DB clients +
  hand-maintained types; `consultation_requests` added to all.
- `supabase/migrations/0010_consultation_requests.sql` — the table + RLS + realtime.
- `vercel.json` — region pin `dub1`.
- `CLAUDE.md` — the durable architecture reference (admin structure, data layer, runbooks).

## Roadmap / next steps
1. **`git push origin dev`** (blocked in-session) — then open/refresh the PR to `main`.
2. **Fill `SUPABASE_SERVICE_ROLE_KEY`** in `.env.local` + Vercel env (Supabase dashboard → Settings
   → API → service_role). Without it the public insert falls back to the anon path (works, but the
   service path is the intended one) — and any future admin-only server-side write needs it.
3. Add `RESEND_API_KEY` to **Vercel** env (it's in local `.env.local` only right now).
4. Delete the `__test __test` junk row from `/admin/requests`.
5. **Human end-to-end drive** of the three checks above (esp. the two-tab realtime test).
6. Verify Resend `talep@gezimakinesi.com` sender is authorized (DNS is verified for the domain;
   confirm the from-address sends). Adjust `FROM` in `resend.ts` if the client prefers another.

## Deliberately partial — grows later (scope ledger)
| Area | What shipped now | Intended full shape | Grows in |
|---|---|---|---|
| Email recipient | Fixed owner inbox `vize@gezimakinesi.com` (const in `resend.ts`) | admin-configurable notification address(es) | if asked |
| Request admin UI | list + realtime + read/unread + delete | filters/search, export, status (contacted/closed), reply-from-panel | later |
| Contact preference | WhatsApp/E-posta/Telefon kept as a stated choice | — (deliberate: the customer's preference, not a channel) | — |
| Confirmation email | one Turkish template, owner + customer | richer branded template, per-preference wording | later |
| Realtime | requests list patches in place via `setAuth`+`postgres_changes` | other admin lists are still static (fetch-on-load) | if needed |

## Gotchas / open issues
- ⚠️ **Realtime needs an authed socket**: `supabase.realtime.setAuth(token)` MUST run before
  `.subscribe()` on any RLS table, or teammate events silently never arrive (channel still reports
  SUBSCRIBED). This is why `RequestsList.tsx` grabs the session first.
- ⚠️ **`SUPABASE_SERVICE_ROLE_KEY` is blank** in `.env.local`. Fill it (see roadmap #2).
- ⚠️ **Migration history**: remote was un-tracked; 0001–0009 were `migration repair --status applied`
  on 2026-07-24 so `db push` works now. Any future migration applied out-of-band must likewise be
  repaired so the next `db push` doesn't try to re-run it.
- **Turbopack stale cache**: a `.next/dev/types/validator.ts` "cannot find module …/page.js" build
  error is a stale-cache artifact — `rm -rf .next` and rebuild.
- Two pre-existing lint **warnings** (`CountryForm.tsx` `setRequirements`, `VizelerPageClient.tsx`
  `settings`) are unrelated to this work; 0 errors.
- `supabase/.temp/*` is CLI-local state — don't commit it (kept unstaged this session).

## Running it
- `npm run dev` · `npm run build` · `npm run lint` · `npm start`
- `npx supabase db push` — apply new migrations (CLI linked; history reconciled).
- `git push origin dev` — publish work (do this; it was blocked in-session).
