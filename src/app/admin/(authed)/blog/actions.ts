'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { writer } from '@/lib/supabase/writer'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import {
  AdminValidationError,
  optString,
  reqArrayOfStrings,
  reqBool,
} from '@/lib/admin/validators'

/**
 * Ülke turizm (blog) içeriği — eskiden ülke formunun "Turizm İçeriği"
 * bölümüydü, artık /admin/blog altında düzenlenir. Yalnızca `countries`
 * satırının turizm sütunlarına dokunur; ülkenin diğer alanları
 * /admin/countries tarafında kalır.
 *
 * Revalidate edilen yollar:
 *   /blog            — yazı akışı
 *   /blog/[slug]     — yazının kendisi
 *   /admin/blog      — liste ve sayaç
 */
export interface TourismFormData {
  has_tourism: boolean
  tourism_hero_image_url: string | null
  tourism_intro: string[]
  tourism_highlights: string[]
  tourism_tips: string[]
  tourism_best_time: string | null
}

export async function updateCountryTourism(
  id: string,
  slug: string,
  data: TourismFormData
): Promise<{ error?: string }> {
  await requireAdmin()

  let payload: Record<string, unknown>
  try {
    const has_tourism = reqBool('has_tourism', data.has_tourism)
    payload = has_tourism
      ? {
          has_tourism: true,
          tourism_hero_image_url: optString('tourism_hero_image_url', data.tourism_hero_image_url, { max: 2048 }),
          tourism_intro: reqArrayOfStrings('Giriş paragrafları', data.tourism_intro, { minItems: 1, maxItems: 20, maxLen: 2000 }),
          tourism_highlights: reqArrayOfStrings('Öne çıkanlar', data.tourism_highlights, { minItems: 1, maxItems: 30, maxLen: 240 }),
          tourism_tips: reqArrayOfStrings('İpuçları', data.tourism_tips, { minItems: 1, maxItems: 30, maxLen: 240 }),
          tourism_best_time: optString('tourism_best_time', data.tourism_best_time, { max: 120 }),
        }
      : // Yayından kaldırıldığında içerik korunur; yalnızca bayrak düşer.
        { has_tourism: false }
  } catch (e) {
    if (e instanceof AdminValidationError) return { error: e.message }
    throw e
  }

  const supabase = await createClient()
  const { error } = await writer(supabase, 'countries').update(payload).eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/blog')
  revalidatePath(`/blog/${slug}`)
  revalidatePath('/admin/blog')
  return {}
}
