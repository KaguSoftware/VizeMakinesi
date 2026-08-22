'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { writer } from '@/lib/supabase/writer'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import {
  AdminValidationError,
  optString,
  reqArrayOfStrings,
  reqString,
} from '@/lib/admin/validators'
import type { SchengenFaqItem, SchengenListItem, SchengenPageContent } from '@/data/schengenPage'

/**
 * /schengen sayfasının içeriği tek satırda (id = 1) tutulur.
 * Revalidate edilen yollar:
 *   /schengen  — sayfanın kendisi
 */
function revalidate() {
  revalidatePath('/schengen')
  revalidatePath('/admin/schengen')
}

const MAX_ITEMS = 40

function listItems(field: string, value: unknown): SchengenListItem[] {
  if (!Array.isArray(value)) throw new AdminValidationError(field, `${field} geçersiz`)
  if (value.length > MAX_ITEMS) {
    throw new AdminValidationError(field, `${field} en fazla ${MAX_ITEMS} madde içerebilir`)
  }
  return value.map((raw, i) => {
    const v = (raw ?? {}) as Record<string, unknown>
    const title = reqString(`${field}[${i + 1}] başlığı`, v.title, { max: 200 })
    const description = reqString(`${field}[${i + 1}] açıklaması`, v.description, { max: 4000 })
    return { title, description }
  })
}

function faqItems(field: string, value: unknown): SchengenFaqItem[] {
  if (!Array.isArray(value)) throw new AdminValidationError(field, `${field} geçersiz`)
  if (value.length > MAX_ITEMS) {
    throw new AdminValidationError(field, `${field} en fazla ${MAX_ITEMS} soru içerebilir`)
  }
  return value.map((raw, i) => {
    const v = (raw ?? {}) as Record<string, unknown>
    const question = reqString(`${field}[${i + 1}] sorusu`, v.question, { max: 300 })
    const answer = reqString(`${field}[${i + 1}] cevabı`, v.answer, { max: 6000 })
    return { question, answer }
  })
}

export async function updateSchengenPage(
  input: SchengenPageContent
): Promise<{ error?: string }> {
  await requireAdmin()

  let payload: Record<string, unknown>
  try {
    payload = {
      id: 1,

      hero_lead: reqString('Hero açıklaması', input.hero_lead, { max: 500 }),
      hero_note: optString('Hero notu', input.hero_note, { max: 300 }) ?? '',
      hero_bullets: reqArrayOfStrings('Hero maddeleri', input.hero_bullets, {
        maxItems: 8,
        maxLen: 300,
      }),

      intro_title: reqString('Giriş başlığı', input.intro_title, { max: 200 }),

      rules_title: reqString('Temel kurallar başlığı', input.rules_title, { max: 200 }),
      rules_description: optString('Temel kurallar açıklaması', input.rules_description, { max: 2000 }) ?? '',
      rules: listItems('Temel kural', input.rules),

      visa_types_title: reqString('Vize türleri başlığı', input.visa_types_title, { max: 200 }),
      visa_types_description: optString('Vize türleri açıklaması', input.visa_types_description, { max: 2000 }) ?? '',
      visa_types_c_title: reqString('C Tipi başlığı', input.visa_types_c_title, { max: 200 }),
      visa_types_c: listItems('C Tipi vize', input.visa_types_c),
      visa_types_d_title: reqString('D Tipi başlığı', input.visa_types_d_title, { max: 200 }),
      visa_types_d_description: optString('D Tipi açıklaması', input.visa_types_d_description, { max: 2000 }) ?? '',
      visa_types_d: listItems('D Tipi vize', input.visa_types_d),

      process_title: reqString('Başvuru bölümü başlığı', input.process_title, { max: 200 }),
      process_lead: optString('Başvuru bölümü giriş cümlesi', input.process_lead, { max: 500 }) ?? '',
      process_description: optString('Başvuru bölümü paragrafı', input.process_description, { max: 4000 }) ?? '',

      faq_title: reqString('SSS başlığı', input.faq_title, { max: 200 }),
      faqs: faqItems('SSS', input.faqs),

      updated_at: new Date().toISOString(),
    }
  } catch (e) {
    if (e instanceof AdminValidationError) return { error: e.message }
    throw e
  }

  const supabase = await createClient()
  const { error } = await writer(supabase, 'schengen_page').upsert(payload, { onConflict: 'id' })
  if (error) return { error: error.message }

  revalidate()
  return {}
}
