import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Best-effort client IP. Vercel/most proxies set x-forwarded-for as a
 * comma-separated chain — the left-most entry is the original client.
 * Falls back to a shared bucket so a missing header still throttles
 * (conservatively, everyone together) rather than opening the gate.
 */
export async function getClientIp(): Promise<string> {
  const h = await headers()
  const forwarded = h.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  return h.get('x-real-ip')?.trim() || 'unknown'
}

/**
 * Records a hit against `bucket` and reports whether the caller is still
 * under `limit` for the trailing `windowSeconds`.
 *
 * Fails OPEN: if the rate-limit table/RPC is unreachable we let the
 * request through rather than blocking real leads on infra trouble.
 */
export async function consumeRateLimit(
  bucket: string,
  limit: number,
  windowSeconds: number,
): Promise<boolean> {
  let supabase
  try {
    supabase = createAdminClient()
  } catch {
    supabase = await createClient()
  }

  // Same reason as src/lib/supabase/writer.ts: database.types.ts is a
  // hand-maintained subset, so supabase-js can't resolve the rpc arg
  // types and narrows them to `undefined`. Cast is isolated here.
  const rpc = supabase.rpc as unknown as (
    fn: string,
    args: Record<string, unknown>,
  ) => Promise<{ data: boolean | null; error: { message: string } | null }>

  const { data, error } = await rpc.call(supabase, 'consume_rate_limit', {
    p_bucket: bucket,
    p_limit: limit,
    p_window_seconds: windowSeconds,
  })

  if (error) {
    console.error('[rateLimit] consume failed, allowing through', error)
    return true
  }

  return data !== false
}
