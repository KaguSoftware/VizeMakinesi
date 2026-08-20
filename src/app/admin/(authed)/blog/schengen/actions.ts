'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { writer } from '@/lib/supabase/writer'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { AdminValidationError, optString, reqString } from '@/lib/admin/validators'
import { validateArticles } from '@/lib/admin/blogArticles'
import type { BlogSchengenContent } from '@/data/blogSchengen'

/**
 * Schengen rehberinin içeriği tek satırda (id = 1) tutulur.
 * Revalidate edilen yollar:
 *   /blog/schengen-vize-alma-rehberi + alt sayfaları — 'layout' modu bütün
 *     makale sayfalarını da kapsar, böylece yeni makale hemen yayına girer
 *   /blog — akıştaki kart
 */
function revalidate() {
  revalidatePath('/blog/schengen-vize-alma-rehberi', 'layout')
  revalidatePath('/blog')
  revalidatePath('/admin/blog/schengen')
}

export async function updateBlogSchengenPage(
  input: BlogSchengenContent
): Promise<{ error?: string }> {
  await requireAdmin()

  let payload: Record<string, unknown>
  try {
    payload = {
      id: 1,
      hero_kicker: optString('Hero etiketi', input.hero_kicker, { max: 80 }) ?? '',
      hero_title: reqString('Hero başlığı', input.hero_title, { max: 200 }),
      hero_title_em: optString('Hero başlığı (italik kısım)', input.hero_title_em, { max: 200 }) ?? '',
      hero_excerpt: reqString('Hero özeti', input.hero_excerpt, { max: 1000 }),
      articles: validateArticles(input.articles, { requireAtLeastOne: true }),
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
