'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { writer } from '@/lib/supabase/writer'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { AdminValidationError, optString, reqBool } from '@/lib/admin/validators'
import { validateArticles } from '@/lib/admin/blogArticles'
import { getBlogSlugsExcept } from '@/lib/data/blogArticles'
import type { BlogArticle } from '@/lib/blog/articles'

/**
 * Ülke blogu — Schengen rehberiyle aynı yapı: makaleler /blog akışında
 * listelenir, her makale kendi sayfasında açılır.
 *
 * Yalnızca `countries` satırının blog sütunlarına dokunur; ülkenin vize
 * bilgileri /admin/countries tarafında kalır.
 *
 * Revalidate edilen yollar:
 *   /blog + altındaki makale sayfaları — 'layout' modu bütün makale
 *     sayfalarını kapsar
 *   /admin/blog  — liste ve sayaç
 */
export interface CountryBlogFormData {
  has_tourism: boolean
  hero_image_url: string | null
  articles: BlogArticle[]
}

export async function updateCountryBlog(
  id: string,
  slug: string,
  data: CountryBlogFormData
): Promise<{ error?: string }> {
  await requireAdmin()

  const takenSlugs = await getBlogSlugsExcept(slug)

  let payload: Record<string, unknown>
  try {
    payload = {
      has_tourism: reqBool('has_tourism', data.has_tourism),
      tourism_hero_image_url: optString('Kapak görseli', data.hero_image_url, { max: 2048 }),
      // Yayından kaldırılan bir blogun içeriği korunur; yalnızca bayrak düşer.
      blog_articles: validateArticles(data.articles, { takenSlugs }),
    }
  } catch (e) {
    if (e instanceof AdminValidationError) return { error: e.message }
    throw e
  }

  const supabase = await createClient()
  const { error } = await writer(supabase, 'countries').update(payload).eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/blog', 'layout')
  revalidatePath('/admin/blog')
  return {}
}
