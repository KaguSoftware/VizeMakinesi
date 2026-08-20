'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { writer } from '@/lib/supabase/writer'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { AdminValidationError } from '@/lib/admin/validators'
import { validateArticles } from '@/lib/admin/blogArticles'
import { getBlogSlugsExcept } from '@/lib/data/blogArticles'
import type { BlogSchengenContent } from '@/data/blogSchengen'

/**
 * Schengen rehberinin makaleleri tek satırda (id = 1) tutulur.
 * Revalidate edilen yollar:
 *   /blog + altındaki makale sayfaları — 'layout' modu bütün makale
 *     sayfalarını kapsar, böylece yeni makale hemen yayına girer
 */
function revalidate() {
  revalidatePath('/blog', 'layout')
  revalidatePath('/admin/blog/schengen')
}

export async function updateBlogSchengenPage(
  input: BlogSchengenContent
): Promise<{ error?: string }> {
  await requireAdmin()

  const takenSlugs = await getBlogSlugsExcept('schengen')

  let payload: Record<string, unknown>
  try {
    payload = {
      id: 1,
      articles: validateArticles(input.articles, { requireAtLeastOne: true, takenSlugs }),
      updated_at: new Date().toISOString(),
    }
  } catch (e) {
    if (e instanceof AdminValidationError) return { error: e.message }
    throw e
  }

  const supabase = await createClient()
  const { error } = await writer(supabase, 'blog_schengen_page').upsert(payload, { onConflict: 'id' })
  if (error) return { error: error.message }

  revalidate()
  return {}
}
