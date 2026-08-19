'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { writer } from '@/lib/supabase/writer'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { AdminValidationError, optString, reqString } from '@/lib/admin/validators'
import type { BlogSchengenContent, BlogSection } from '@/data/blogSchengen'

/**
 * /blog/schengen-vize-alma-rehberi yazısının içeriği tek satırda (id = 1) tutulur.
 * Revalidate edilen yollar:
 *   /blog/schengen-vize-alma-rehberi — yazının kendisi
 *   /blog                            — akıştaki kart
 */
function revalidate() {
  revalidatePath('/blog/schengen-vize-alma-rehberi')
  revalidatePath('/blog')
  revalidatePath('/admin/blog/schengen')
}

const MAX_SECTIONS = 20
const MAX_SUBSECTIONS = 40
const MAX_PARAGRAPHS = 30

function textList(field: string, value: unknown, max: number, maxLen: number): string[] {
  if (!Array.isArray(value)) throw new AdminValidationError(field, `${field} geçersiz`)
  if (value.length > max) {
    throw new AdminValidationError(field, `${field} en fazla ${max} öğe içerebilir`)
  }
  return value
    .map((v) => (typeof v === 'string' ? v.trim() : ''))
    .filter(Boolean)
    .map((v) => {
      if (v.length > maxLen) {
        throw new AdminValidationError(field, `${field} en fazla ${maxLen} karakter olabilir`)
      }
      return v
    })
}

function sections(value: unknown): BlogSection[] {
  if (!Array.isArray(value)) throw new AdminValidationError('sections', 'Bölümler geçersiz')
  if (value.length > MAX_SECTIONS) {
    throw new AdminValidationError('sections', `En fazla ${MAX_SECTIONS} bölüm eklenebilir`)
  }

  return value.map((raw, i) => {
    const s = (raw ?? {}) as Record<string, unknown>
    const label = `Bölüm ${i + 1}`
    const subs = Array.isArray(s.subsections) ? s.subsections : []
    if (subs.length > MAX_SUBSECTIONS) {
      throw new AdminValidationError('subsections', `${label} en fazla ${MAX_SUBSECTIONS} alt başlık içerebilir`)
    }

    return {
      kicker: optString(`${label} etiketi`, s.kicker, { max: 80 }) ?? '',
      title: reqString(`${label} başlığı`, s.title, { max: 200 }),
      intro: textList(`${label} giriş paragrafları`, s.intro, MAX_PARAGRAPHS, 4000),
      subsections: subs.map((rawSub, j) => {
        const sub = (rawSub ?? {}) as Record<string, unknown>
        const subLabel = `${label} → alt başlık ${j + 1}`
        return {
          heading: reqString(`${subLabel} başlığı`, sub.heading, { max: 300 }),
          quote: optString(`${subLabel} ret ifadesi`, sub.quote, { max: 2000 }) ?? '',
          quote_en: optString(`${subLabel} İngilizce ifadesi`, sub.quote_en, { max: 2000 }) ?? '',
          paragraphs: textList(`${subLabel} paragrafları`, sub.paragraphs, MAX_PARAGRAPHS, 4000),
          bullets: textList(`${subLabel} maddeleri`, sub.bullets, MAX_PARAGRAPHS, 400),
        }
      }),
    }
  })
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
      sections: sections(input.sections),
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
