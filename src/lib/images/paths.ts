/**
 * Parse a Supabase public storage URL into (bucket, objectPath).
 *
 * Supabase public URLs look like:
 *   https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
 *
 * Returns null when the URL doesn't match that shape (e.g. external CDN, blob:
 * URL, or empty string). Callers should treat null as "nothing to clean up".
 */
export function parseSupabaseStorageUrl(url: string | null | undefined): { bucket: string; path: string } | null {
  if (!url) return null
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return null
  }
  const m = parsed.pathname.match(/^\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/)
  if (!m) return null
  return { bucket: m[1], path: decodeURIComponent(m[2]) }
}
