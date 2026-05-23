import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { parseSupabaseStorageUrl } from './paths'

/**
 * Best-effort cleanup for storage objects referenced by deleted entities.
 * Failures are swallowed: an orphaned file is preferable to a half-deleted
 * entity. Callers should still surface errors from the entity delete itself.
 */
export async function removeStorageObjects(urls: ReadonlyArray<string | null | undefined>) {
  const parsed = urls
    .map(parseSupabaseStorageUrl)
    .filter((p): p is { bucket: string; path: string } => p !== null)

  if (parsed.length === 0) return

  const byBucket = new Map<string, string[]>()
  for (const { bucket, path } of parsed) {
    const arr = byBucket.get(bucket) ?? []
    arr.push(path)
    byBucket.set(bucket, arr)
  }

  const supabase = await createClient()
  await Promise.all(
    Array.from(byBucket.entries()).map(([bucket, paths]) =>
      supabase.storage.from(bucket).remove(paths).catch(() => {})
    )
  )
}
