# Vize Makinesi

Turkish visa consultation website. Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 + Supabase.

For full architecture details see [CLAUDE.md](./CLAUDE.md).

---

## Quick start

```bash
cp .env.example .env.local
# Fill in the three Supabase variables (see below)
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
Admin panel at [http://localhost:3000/admin](http://localhost:3000/admin).

---

## Supabase project setup

### 1. Create a project

[supabase.com/dashboard](https://supabase.com/dashboard) → New project.

### 2. Run migrations

In the SQL editor, run each file in `supabase/migrations/` in order:
- `0001_initial_schema.sql`
- `0002_storage.sql`

### 3. Configure Storage buckets

Create these four buckets in Storage → Buckets (set each to **Public**):

| Bucket | Purpose |
|---|---|
| `country-flags` | Country flag images |
| `country-tourism` | Blog / tourism hero images |
| `partnership-logos` | Partnership logo images |
| `team-photos` | Team member photos |

### 4. Create the first admin user

1. Authentication → Users → Add user (email + password)
2. In SQL editor:
   ```sql
   INSERT INTO admin_profiles (id, email)
   SELECT id, email FROM auth.users WHERE email = 'your@email.com';
   ```

---

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Where to find |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Project Settings → API → anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Project Settings → API → service_role key (keep secret, server-only) |

> `npm run build` will error with "supabaseUrl is required" if `.env.local` is missing — this is expected. The build requires live Supabase credentials.

---

## Vercel deployment

1. Import the repo in the Vercel dashboard
2. Add the three env vars in Project Settings → Environment Variables (Production + Preview + Development)
3. Deploy — Vercel runs `npm run build` automatically

---

## Development commands

```bash
npm run dev      # Dev server at http://localhost:3000
npm run build    # Production build (requires env vars)
npm run lint     # ESLint
npm start        # Serve production build locally
```
