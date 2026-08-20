import { AdminValidationError, optString, reqString } from '@/lib/admin/validators'
import { slugifyTr } from '@/lib/text/slug'
import type { BlogArticle } from '@/lib/blog/articles'

/**
 * Blog makalelerinin sunucu tarafı doğrulaması — Schengen rehberi ile ülke
 * blogları aynı kuralları paylaşır. Slug'lar normalleştirilir, boş bırakılan
 * slug başlıktan türetilir, aynı sayfada yinelenen slug reddedilir.
 */

const MAX_ARTICLES = 30
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

export function validateArticles(
  value: unknown,
  opts: { requireAtLeastOne?: boolean } = {}
): BlogArticle[] {
  if (!Array.isArray(value)) throw new AdminValidationError('articles', 'Makaleler geçersiz')
  if (opts.requireAtLeastOne && value.length === 0) {
    throw new AdminValidationError('articles', 'En az bir makale gereklidir')
  }
  if (value.length > MAX_ARTICLES) {
    throw new AdminValidationError('articles', `En fazla ${MAX_ARTICLES} makale eklenebilir`)
  }

  const seen = new Set<string>()

  return value.map((raw, i) => {
    const a = (raw ?? {}) as Record<string, unknown>
    const label = `Makale ${i + 1}`
    const title = reqString(`${label} başlığı`, a.title, { max: 200 })

    // Slug boş bırakılabilir: başlıktan türetilir. Girildiyse biçimi ve
    // benzersizliği doğrulanır — makalenin URL'si buna bağlı.
    const rawSlug = optString(`${label} URL adresi`, a.slug, { max: 120 })
    const slug = slugifyTr(rawSlug ?? title)
    if (!slug) {
      throw new AdminValidationError('slug', `${label}: URL adresi üretilemedi, elle girin`)
    }
    if (seen.has(slug)) {
      throw new AdminValidationError(
        'slug',
        `${label}: "${slug}" URL adresi başka bir makalede kullanılıyor`
      )
    }
    seen.add(slug)

    const subs = Array.isArray(a.subsections) ? a.subsections : []
    if (subs.length > MAX_SUBSECTIONS) {
      throw new AdminValidationError(
        'subsections',
        `${label} en fazla ${MAX_SUBSECTIONS} alt başlık içerebilir`
      )
    }

    return {
      slug,
      kicker: optString(`${label} etiketi`, a.kicker, { max: 80 }) ?? '',
      title,
      excerpt: optString(`${label} özeti`, a.excerpt, { max: 1000 }) ?? '',
      intro: textList(`${label} giriş paragrafları`, a.intro, MAX_PARAGRAPHS, 4000),
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
