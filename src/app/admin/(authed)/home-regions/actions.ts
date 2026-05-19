'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'

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

export async function createEntry(
  data: EntryFormData
): Promise<{ id: string } | { error: string }> {
  await requireAdmin()
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
  data: Partial<EntryFormData>
): Promise<{ error?: string }> {
  await requireAdmin()
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
  region: RegionKey,
  visible: boolean
): Promise<{ error?: string }> {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await tbl(supabase, 'home_region_settings')
    .upsert({ region, visible }, { onConflict: 'region' })
  if (error) return { error: error.message }
  revalidate()
  return {}
}
