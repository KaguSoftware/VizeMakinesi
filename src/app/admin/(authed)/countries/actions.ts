'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { writer } from '@/lib/supabase/writer'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import type { CountryFormData } from './validation'
import {
  AdminValidationError,
  reqString,
  optString,
  reqBool,
  reqSlug,
  reqEnum,
  reqArrayOfStrings,
} from '@/lib/admin/validators'
import { removeStorageObjects } from '@/lib/images/serverDelete'
import { countryHref } from '@/lib/routes'

function validateCountryServer(data: CountryFormData): CountryFormData {
  const name = reqString('Ad', data.name, { max: 100 })
  const slug = reqSlug('Slug', data.slug)
  const flag_emoji = reqString('Bayrak emoji', data.flag_emoji, { max: 16 })
  const visa_type = reqString('Vize türü', data.visa_type, { max: 80 })
  const summary = reqString('Özet', data.summary, { max: 600 })
  const flag_type = reqEnum('Bayrak türü', data.flag_type, ['preset', 'image'] as const)
  const flag_preset_key = flag_type === 'preset'
    ? reqString('Hazır SVG', data.flag_preset_key, { max: 40 })
    : null
  const flag_image_url = flag_type === 'image'
    ? reqString('Bayrak görseli', data.flag_image_url, { max: 2048 })
    : null
  const mosaic_visible = reqBool('mosaic_visible', data.mosaic_visible)
  const mosaic_span = optString('mosaic_span', data.mosaic_span, { max: 80 })
  const has_tourism = reqBool('has_tourism', data.has_tourism)
  const danisma_visible = reqBool('danisma_visible', data.danisma_visible)
  const appointment_days = optString('appointment_days', data.appointment_days, { max: 80 })
  const general_info = Array.isArray(data.general_info)
    ? data.general_info.map((s) => (typeof s === 'string' ? s.trim() : '')).filter(Boolean)
    : []
  const general_info_title = optString('general_info_title', data.general_info_title, { max: 160 })
  const general_info_description = optString('general_info_description', data.general_info_description, { max: 1000 })
  const visa_types_title = optString('visa_types_title', data.visa_types_title, { max: 160 })
  const visa_types_lead = optString('visa_types_lead', data.visa_types_lead, { max: 600 })
  const visa_types_description = optString('visa_types_description', data.visa_types_description, { max: 1000 })
  const visa_types_hero_description = optString('visa_types_hero_description', data.visa_types_hero_description, { max: 1000 })

  let tourism_hero_image_url: string | null = null
  let tourism_intro: string[] = []
  let tourism_highlights: string[] = []
  let tourism_tips: string[] = []
  let tourism_best_time: string | null = null

  if (has_tourism) {
    tourism_hero_image_url = optString('tourism_hero_image_url', data.tourism_hero_image_url, { max: 2048 })
    tourism_intro = reqArrayOfStrings('Giriş paragrafları', data.tourism_intro, { minItems: 1, maxItems: 20, maxLen: 2000 })
    tourism_highlights = reqArrayOfStrings('Öne çıkanlar', data.tourism_highlights, { minItems: 1, maxItems: 30, maxLen: 240 })
    tourism_tips = reqArrayOfStrings('İpuçları', data.tourism_tips, { minItems: 1, maxItems: 30, maxLen: 240 })
    tourism_best_time = optString('tourism_best_time', data.tourism_best_time, { max: 120 })
  }

  if (!Array.isArray(data.requirements)) throw new AdminValidationError('requirements', 'Gerekli belgeler geçersiz')
  if (!Array.isArray(data.faqs)) throw new AdminValidationError('faqs', 'SSS geçersiz')
  if (!Array.isArray(data.documents)) throw new AdminValidationError('documents', 'PDF belgeler geçersiz')
  if (!Array.isArray(data.process_steps)) throw new AdminValidationError('process_steps', 'Başvuru süreci adımları geçersiz')
  if (!Array.isArray(data.visa_types)) throw new AdminValidationError('visa_types', 'Vize türleri geçersiz')

  const handles: { text: string }[] = []
  const requirements = data.requirements
    .map((r) => ({ text: typeof r?.text === 'string' ? r.text.trim() : '' }))
    .filter((r) => r.text.length > 0)
  const faqs = data.faqs
    .filter((f) => f && typeof f.question === 'string' && typeof f.answer === 'string')
    .map((f) => ({ question: f.question.trim(), answer: f.answer.trim() }))
    .filter((f) => f.question.length > 0 && f.answer.length > 0)
  const documents = data.documents
    .filter((d) => d && typeof d.label === 'string' && typeof d.pdf_url === 'string')
    .map((d) => ({ label: d.label.trim(), pdf_url: d.pdf_url.trim() }))
    .filter((d) => d.label.length > 0 && d.pdf_url.length > 0)
  const process_steps = data.process_steps
    .filter((s) => s && typeof s.title === 'string' && typeof s.description === 'string')
    .map((s) => ({ title: s.title.trim(), description: s.description.trim() }))
    .filter((s) => s.title.length > 0 && s.description.length > 0)
  const visa_types = data.visa_types
    .filter((v) => v && typeof v.title === 'string' && typeof v.description === 'string')
    .map((v) => ({ title: v.title.trim(), description: v.description.trim() }))
    .filter((v) => v.title.length > 0 && v.description.length > 0)

  return {
    name,
    slug,
    flag_emoji,
    flag_type,
    flag_preset_key,
    flag_image_url,
    visa_type,
    summary,
    mosaic_visible,
    mosaic_span,
    has_tourism,
    danisma_visible,
    tourism_hero_image_url,
    tourism_intro,
    tourism_highlights,
    tourism_tips,
    tourism_best_time,
    appointment_days,
    general_info,
    general_info_title,
    general_info_description,
    visa_types_title,
    visa_types_lead,
    visa_types_description,
    visa_types_hero_description,
    requirements,
    handles,
    faqs,
    documents,
    process_steps,
    visa_types,
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

// Ülke verisi yalnızca /vize, /blog gibi alt ağaçlarda değil, her sayfanın
// üstündeki Nav mega menüsünde de görünür. Bu yüzden kök layout'un tamamı
// yenilenir — aksi hâlde /iletisim, /ofis gibi statik sayfalarda eski ülke
// adı/bayrağı takılı kalır. Aynı yaklaşım mega-menu ve marquee action'larında
// da kullanılıyor.
function revalidateAll() {
  revalidatePath('/', 'layout')
}

type SB = Awaited<ReturnType<typeof createClient>>

async function upsertChildren(supabase: SB, countryId: string, data: CountryFormData) {
  await writer(supabase, 'country_requirements').delete().eq('country_id', countryId)
  await writer(supabase, 'country_faqs').delete().eq('country_id', countryId)
  await writer(supabase, 'country_documents').delete().eq('country_id', countryId)
  await writer(supabase, 'country_process_steps').delete().eq('country_id', countryId)
  await writer(supabase, 'country_visa_types').delete().eq('country_id', countryId)

  if (data.requirements.length > 0) {
    await writer(supabase, 'country_requirements').insert(
      data.requirements.map((r, i) => ({ country_id: countryId, text: r.text, sort_order: i }))
    )
  }
  if (data.faqs.length > 0) {
    await writer(supabase, 'country_faqs').insert(
      data.faqs.map((f, i) => ({
        country_id: countryId,
        question: f.question,
        answer: f.answer,
        sort_order: i,
      }))
    )
  }
  if (data.documents.length > 0) {
    await writer(supabase, 'country_documents').insert(
      data.documents.map((d, i) => ({
        country_id: countryId,
        label: d.label,
        pdf_url: d.pdf_url,
        sort_order: i,
      }))
    )
  }
  if (data.process_steps.length > 0) {
    await writer(supabase, 'country_process_steps').insert(
      data.process_steps.map((s, i) => ({
        country_id: countryId,
        title: s.title,
        description: s.description,
        sort_order: i,
      }))
    )
  }
  if (data.visa_types.length > 0) {
    await writer(supabase, 'country_visa_types').insert(
      data.visa_types.map((v, i) => ({
        country_id: countryId,
        title: v.title,
        description: v.description,
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

export async function createCountry(rawData: CountryFormData): Promise<{ id: string } | { error: string }> {
  await requireAdmin()

  let data: CountryFormData
  try {
    data = validateCountryServer(rawData)
  } catch (e) {
    if (e instanceof AdminValidationError) return { error: e.message }
    throw e
  }

  const supabase = await createClient()

  // Atomic next-order helper avoids two concurrent createCountry() calls
  // assigning the same mosaic_order. See migration 0008.
  // The generated Database types don't include custom RPCs, so the rpc
  // method is locally typed to the shape this function returns.
  type NextOrderRpc = (name: 'next_country_mosaic_order') => Promise<{
    data: number | null
    error: { message: string } | null
  }>
  const rpc = await (supabase.rpc as unknown as NextOrderRpc)('next_country_mosaic_order')
  let nextOrder: number
  if (rpc.error || typeof rpc.data !== 'number') {
    // Fall back to the legacy read-then-write path if the RPC is missing
    // (e.g. migration 0008 not yet applied in this environment).
    const { data: maxRowRaw } = await supabase
      .from('countries')
      .select('mosaic_order')
      .order('mosaic_order', { ascending: false })
      .limit(1)
      .maybeSingle()
    const maxRow = maxRowRaw as { mosaic_order: number | null } | null
    nextOrder = (maxRow?.mosaic_order ?? 0) + 1
  } else {
    nextOrder = rpc.data
  }

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
    danisma_visible: data.danisma_visible,
    appointment_days: data.appointment_days || null,
    general_info: data.general_info,
    general_info_title: data.general_info_title,
    general_info_description: data.general_info_description,
    visa_types_title: data.visa_types_title,
    visa_types_lead: data.visa_types_lead,
    visa_types_description: data.visa_types_description,
    visa_types_hero_description: data.visa_types_hero_description,
    ...buildTourismPayload(data),
  }

  // writer() avoids the Supabase-v2 `never` narrowing on insert payloads.
  // We can't chain .select().single() through the narrowed type, so we
  // run the insert then look up the new row by slug (slug is unique).
  const insertErr = (await writer(supabase, 'countries').insert(payload)).error
  if (insertErr) return { error: insertErr.message }
  // Look up the freshly-inserted row by its unique slug. Result is cast
  // because Supabase v2's typed builder narrows .single() to never here
  // (same GenericSchema issue documented in lib/supabase/writer.ts).
  const { data: countryRaw } = await supabase
    .from('countries')
    .select('id')
    .eq('slug', data.slug)
    .single()
  const country = countryRaw as { id: string } | null
  if (!country) return { error: 'Oluşturma başarısız' }

  await upsertChildren(supabase, country.id, data)
  revalidateAll()
  return { id: country.id }
}

export async function updateCountry(id: string, rawData: CountryFormData): Promise<{ error?: string }> {
  await requireAdmin()
  if (typeof id !== 'string' || !id) return { error: 'Geçersiz id' }

  let data: CountryFormData
  try {
    data = validateCountryServer(rawData)
  } catch (e) {
    if (e instanceof AdminValidationError) return { error: e.message }
    throw e
  }

  const supabase = await createClient()

  // Used by #36 (revalidate old slug too) below.
  const { data: existing } = await supabase
    .from('countries')
    .select('slug')
    .eq('id', id)
    .maybeSingle()
  const previousSlug = (existing as { slug: string } | null)?.slug

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
    danisma_visible: data.danisma_visible,
    appointment_days: data.appointment_days || null,
    general_info: data.general_info,
    general_info_title: data.general_info_title,
    general_info_description: data.general_info_description,
    visa_types_title: data.visa_types_title,
    visa_types_lead: data.visa_types_lead,
    visa_types_description: data.visa_types_description,
    visa_types_hero_description: data.visa_types_hero_description,
    ...buildTourismPayload(data),
  }

  const { error } = await writer(supabase, 'countries').update(payload).eq('id', id)
  if (error) return { error: error.message }

  await upsertChildren(supabase, id, data)
  revalidateAll()
  revalidatePath(countryHref(data.slug))
  revalidatePath(`/vize-turleri/${data.slug}`)
  revalidatePath(`/blog/${data.slug}`)
  if (previousSlug && previousSlug !== data.slug) {
    revalidatePath(countryHref(previousSlug))
    revalidatePath(`/vize-turleri/${previousSlug}`)
    revalidatePath(`/blog/${previousSlug}`)
  }
  return {}
}

export async function deleteCountry(id: string): Promise<{ error?: string }> {
  await requireAdmin()
  if (typeof id !== 'string' || !id) return { error: 'Geçersiz id' }
  const supabase = await createClient()

  // Fetch URLs before deleting so we can clean up storage afterwards.
  const { data: existing } = await supabase
    .from('countries')
    .select('flag_image_url, tourism_hero_image_url')
    .eq('id', id)
    .maybeSingle()

  const { error } = await supabase.from('countries').delete().eq('id', id)
  if (error) return { error: error.message }

  const e = existing as { flag_image_url: string | null; tourism_hero_image_url: string | null } | null
  if (e) {
    await removeStorageObjects([e.flag_image_url, e.tourism_hero_image_url])
  }

  revalidateAll()
  return {}
}

export async function reorderCountries(orderedIds: string[]): Promise<{ error?: string }> {
  await requireAdmin()
  const supabase = await createClient()
  const results = await Promise.all(
    orderedIds.map((id, i) =>
      writer(supabase, 'countries').update({ mosaic_order: i }).eq('id', id)
    )
  )
  const firstError = results.find((r) => r.error)?.error
  if (firstError) return { error: firstError.message }
  revalidateAll()
  return {}
}

export async function toggleCountryVisible(id: string, visible: boolean): Promise<{ error?: string }> {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await writer(supabase, 'countries').update({ mosaic_visible: visible }).eq('id', id)
  if (error) return { error: error.message }
  revalidateAll()
  return {}
}

export async function toggleDanismaVisible(id: string, visible: boolean): Promise<{ error?: string }> {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await writer(supabase, 'countries').update({ danisma_visible: visible }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/danisma-al')
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
