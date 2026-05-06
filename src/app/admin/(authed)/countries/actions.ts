'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import type { CountryFormData } from './validation'

// ── Helpers ───────────────────────────────────────────────────────────────────

function revalidateAll() {
  revalidatePath('/')
  revalidatePath('/visa', 'layout')
  revalidatePath('/blog', 'layout')
}

type SB = Awaited<ReturnType<typeof createClient>>

// Cast to any to work around Supabase TS narrowing to never[] on insert/update
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function tbl(supabase: SB, table: string): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any).from(table)
}

async function upsertChildren(supabase: SB, countryId: string, data: CountryFormData) {
  await tbl(supabase, 'country_requirements').delete().eq('country_id', countryId)
  await tbl(supabase, 'country_handles').delete().eq('country_id', countryId)
  await tbl(supabase, 'country_faqs').delete().eq('country_id', countryId)

  if (data.requirements.length > 0) {
    await tbl(supabase, 'country_requirements').insert(
      data.requirements.map((r, i) => ({ country_id: countryId, text: r.text, sort_order: i }))
    )
  }
  if (data.handles.length > 0) {
    await tbl(supabase, 'country_handles').insert(
      data.handles.map((h, i) => ({ country_id: countryId, text: h.text, sort_order: i }))
    )
  }
  if (data.faqs.length > 0) {
    await tbl(supabase, 'country_faqs').insert(
      data.faqs.map((f, i) => ({
        country_id: countryId,
        question: f.question,
        answer: f.answer,
        sort_order: i,
      }))
    )
  }
}

function buildTourismPayload(data: CountryFormData) {
  if (!data.has_tourism) {
    return {
      tourism_hero_image_url: null,
      tourism_intro: null,
      tourism_highlights: null,
      tourism_tips: null,
      tourism_best_time: null,
    }
  }
  return {
    tourism_hero_image_url: data.tourism_hero_image_url,
    tourism_intro: data.tourism_intro,
    tourism_highlights: data.tourism_highlights,
    tourism_tips: data.tourism_tips,
    tourism_best_time: data.tourism_best_time,
  }
}

// ── Actions ───────────────────────────────────────────────────────────────────

export async function createCountry(data: CountryFormData): Promise<{ id: string } | { error: string }> {
  await requireAdmin()
  const supabase = await createClient()

  const { data: maxRowRaw } = await supabase
    .from('countries')
    .select('mosaic_order')
    .order('mosaic_order', { ascending: false })
    .limit(1)
    .single()

  const maxRow = maxRowRaw as { mosaic_order: number | null } | null
  const nextOrder = (maxRow?.mosaic_order ?? 0) + 1

  const payload = {
    name: data.name,
    slug: data.slug,
    flag_emoji: data.flag_emoji,
    flag_type: data.flag_type,
    flag_preset_key: data.flag_preset_key,
    flag_image_url: data.flag_image_url,
    visa_type: data.visa_type,
    summary: data.summary,
    mosaic_visible: data.mosaic_visible,
    mosaic_span: data.mosaic_span,
    mosaic_order: nextOrder,
    has_tourism: data.has_tourism,
    ...buildTourismPayload(data),
  }

  const { data: country, error } = await tbl(supabase, 'countries').insert(payload).select('id').single()

  if (error || !country) return { error: error?.message ?? 'Oluşturma başarısız' }

  await upsertChildren(supabase, country.id, data)
  revalidateAll()
  return { id: country.id }
}

export async function updateCountry(id: string, data: CountryFormData): Promise<{ error?: string }> {
  await requireAdmin()
  const supabase = await createClient()

  const payload = {
    name: data.name,
    slug: data.slug,
    flag_emoji: data.flag_emoji,
    flag_type: data.flag_type,
    flag_preset_key: data.flag_preset_key,
    flag_image_url: data.flag_image_url,
    visa_type: data.visa_type,
    summary: data.summary,
    mosaic_visible: data.mosaic_visible,
    mosaic_span: data.mosaic_span,
    has_tourism: data.has_tourism,
    ...buildTourismPayload(data),
  }

  const { error } = await tbl(supabase, 'countries').update(payload).eq('id', id)
  if (error) return { error: error.message }

  await upsertChildren(supabase, id, data)
  revalidateAll()
  revalidatePath(`/visa/${data.slug}`)
  revalidatePath(`/blog/${data.slug}`)
  return {}
}

export async function deleteCountry(id: string): Promise<{ error?: string }> {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await supabase.from('countries').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidateAll()
  return {}
}

export async function reorderCountries(orderedIds: string[]): Promise<{ error?: string }> {
  await requireAdmin()
  const supabase = await createClient()
  await Promise.all(
    orderedIds.map((id, i) =>
      tbl(supabase, 'countries').update({ mosaic_order: i }).eq('id', id)
    )
  )
  revalidateAll()
  return {}
}

export async function toggleCountryVisible(id: string, visible: boolean): Promise<{ error?: string }> {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await tbl(supabase, 'countries').update({ mosaic_visible: visible }).eq('id', id)
  if (error) return { error: error.message }
  revalidateAll()
  return {}
}

export async function checkSlugUnique(slug: string, excludeId?: string): Promise<boolean> {
  await requireAdmin()
  const supabase = await createClient()
  let q = supabase.from('countries').select('id').eq('slug', slug)
  if (excludeId) q = q.neq('id', excludeId)
  const { data } = await q
  return !data || data.length === 0
}
