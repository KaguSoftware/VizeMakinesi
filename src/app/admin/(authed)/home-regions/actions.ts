'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { AdminValidationError, reqString, optString, reqEnum, reqBool } from '@/lib/admin/validators'

const REGIONS = ['avrupa', 'amerika', 'asya', 'diger'] as const

type SB = Awaited<ReturnType<typeof createClient>>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function tbl(supabase: SB, table: string): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any).from(table)
}

function revalidate() {
  revalidatePath('/', 'layout')
}

export type RegionKey = 'avrupa' | 'amerika' | 'asya' | 'diger'

export interface EntryFormData {
  region: RegionKey
  name: string
  href: string
  preset_key: string
  subtitle: string
  pinned: boolean
  visible: boolean
}

function validateEntry(data: Partial<EntryFormData>, full: boolean) {
  const region = data.region !== undefined ? reqEnum('Bölge', data.region, REGIONS) : undefined
  const name = full
    ? reqString('Ad', data.name, { max: 80 })
    : data.name !== undefined ? reqString('Ad', data.name, { max: 80 }) : undefined
  const href = full
    ? reqString('Bağlantı', data.href, { max: 200 })
    : data.href !== undefined ? reqString('Bağlantı', data.href, { max: 200 }) : undefined
  const preset_key = data.preset_key !== undefined
    ? optString('Preset', data.preset_key, { max: 40 }) ?? ''
    : undefined
  const subtitle = data.subtitle !== undefined
    ? optString('Altyazı', data.subtitle, { max: 120 }) ?? ''
    : undefined
  const pinned = data.pinned !== undefined ? reqBool('pinned', data.pinned) : undefined
  const visible = data.visible !== undefined ? reqBool('visible', data.visible) : undefined
  const result: Partial<EntryFormData> = {}
  if (region !== undefined) result.region = region
  if (name !== undefined) result.name = name
  if (href !== undefined) result.href = href
  if (preset_key !== undefined) result.preset_key = preset_key
  if (subtitle !== undefined) result.subtitle = subtitle
  if (pinned !== undefined) result.pinned = pinned
  if (visible !== undefined) result.visible = visible
  return result
}

export async function createEntry(
  raw: EntryFormData
): Promise<{ id: string } | { error: string }> {
  await requireAdmin()
  let data: EntryFormData
  try { data = validateEntry(raw, true) as EntryFormData }
  catch (e) {
    if (e instanceof AdminValidationError) return { error: e.message }
    throw e
  }
  const supabase = await createClient()

  const { data: maxRaw } = await supabase
    .from('home_region_entries')
    .select('sort_order')
    .eq('region', data.region)
    .eq('pinned', data.pinned)
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle()

  const nextOrder = ((maxRaw as { sort_order: number } | null)?.sort_order ?? 0) + 10

  const { data: row, error } = await tbl(supabase, 'home_region_entries')
    .insert({ ...data, sort_order: nextOrder })
    .select('id')
    .single()

  if (error || !row) return { error: error?.message ?? 'Oluşturma başarısız' }
  revalidate()
  return { id: row.id }
}

export async function updateEntry(
  id: string,
  raw: Partial<EntryFormData>
): Promise<{ error?: string }> {
  await requireAdmin()
  if (typeof id !== 'string' || !id) return { error: 'Geçersiz id' }
  let data: Partial<EntryFormData>
  try { data = validateEntry(raw, false) }
  catch (e) {
    if (e instanceof AdminValidationError) return { error: e.message }
    throw e
  }
  const supabase = await createClient()
  const { error } = await tbl(supabase, 'home_region_entries').update(data).eq('id', id)
  if (error) return { error: error.message }
  revalidate()
  return {}
}

export async function deleteEntry(id: string): Promise<{ error?: string }> {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await tbl(supabase, 'home_region_entries').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidate()
  return {}
}

export async function toggleEntryVisible(
  id: string,
  visible: boolean
): Promise<{ error?: string }> {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await tbl(supabase, 'home_region_entries').update({ visible }).eq('id', id)
  if (error) return { error: error.message }
  revalidate()
  return {}
}

export async function reorderEntries(
  orderedIds: string[]
): Promise<{ error?: string }> {
  await requireAdmin()
  const supabase = await createClient()
  const results = await Promise.all(
    orderedIds.map((id, i) =>
      tbl(supabase, 'home_region_entries').update({ sort_order: (i + 1) * 10 }).eq('id', id)
    )
  )
  const firstError = results.find((r: { error?: { message: string } | null }) => r.error)?.error
  if (firstError) return { error: firstError.message }
  revalidate()
  return {}
}

export async function toggleRegionVisible(
  rawRegion: RegionKey,
  rawVisible: boolean
): Promise<{ error?: string }> {
  await requireAdmin()
  let region: RegionKey
  let visible: boolean
  try {
    region = reqEnum('Bölge', rawRegion, REGIONS)
    visible = reqBool('visible', rawVisible)
  } catch (e) {
    if (e instanceof AdminValidationError) return { error: e.message }
    throw e
  }
  const supabase = await createClient()
  const { error } = await tbl(supabase, 'home_region_settings')
    .upsert({ region, visible }, { onConflict: 'region' })
  if (error) return { error: error.message }
  revalidate()
  return {}
}
