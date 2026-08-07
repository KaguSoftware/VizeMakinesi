import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

type PublicClient = ReturnType<typeof createSupabaseClient<Database>>;

let cached: PublicClient | null = null;

/**
 * Cookie-free Supabase client for public, anonymous reads.
 *
 * Why this exists: the server client in `./server` reads cookies, and any
 * route that reads cookies is permanently opted out of static rendering. The
 * public site never needs the visitor's session — it reads tables that are
 * anon-readable via RLS with the same anon key — so using this client instead
 * lets those routes be prerendered and revalidated (ISR) rather than
 * re-queried on every single request.
 *
 * Use this in `src/lib/data/*` only. Anything that must act as the signed-in
 * user (the admin panel, server actions that write) keeps using `./server`.
 *
 * The instance is memoized: it holds no per-request state, so rebuilding it
 * for every call would just burn CPU.
 */
export function createPublicClient(): PublicClient {
  if (!cached) {
    cached = createSupabaseClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)!,
      // No session to persist or refresh on the server.
      { auth: { persistSession: false, autoRefreshToken: false } }
    );
  }
  return cached;
}
