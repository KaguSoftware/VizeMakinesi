'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { AdminValidationError, reqString, reqEnum, reqBool, optUrl } from '@/lib/admin/validators'

const LOCATIONS = ['home', 'nav_ticker'] as const

type SB = Awaited<ReturnType<typeof createClient>>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function tbl(supabase: SB, table: string): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any).from(table)
}

function revalidate() {
  revalidatePath('/', 'layout')
}

export async function createMarqueeItem(
  rawLocation: 'home' | 'nav_ticker',
  rawText: string,
  rawUrl?: string
): Promise<{ id: string } | { error: string }> {
  await requireAdmin()
  let location: 'home' | 'nav_ticker'
  let text: string
  let url: string | null
  try {
    location = reqEnum('Konum', rawLocation, LOCATIONS)
    text = reqString('Metin', rawText, { max: 200 })
    url = rawUrl == null ? null : optUrl('Bağlantı', rawUrl)
  } catch (e) {
    if (e instanceof AdminValidationError) return { error: e.message }
    throw e
  }
  const supabase = await createClient()

  const { data: maxRaw } = await supabase
    .from('marquee_items')
    .select('sort_order')
    .eq('location', location)
    .order('sort_order', { ascending: false })
    .limit(1)
    .single()

  const nextOrder = ((maxRaw as { sort_order: number } | null)?.sort_order ?? 0) + 1

  const { data, error } = await tbl(supabase, 'marquee_items')
    .insert({ location, text, url, sort_order: nextOrder, visible: true })
    .select('id')
    .single()

  if (error || !data) return { error: error?.message ?? 'Oluşturma başarısız' }
  revalidate()
  return { id: data.id }
}

export async function updateMarqueeItem(
  id: string,
  rawText: string,
  rawUrl?: string
): Promise<{ error?: string }> {
  await requireAdmin()
  if (typeof id !== 'string' || !id) return { error: 'Geçersiz id' }
  let text: string
  let url: string | null
  try {
    text = reqString('Metin', rawText, { max: 200 })
    url = rawUrl == null ? null : optUrl('Bağlantı', rawUrl)
  } catch (e) {
    if (e instanceof AdminValidationError) return { error: e.message }
    throw e
  }
  const supabase = await createClient()
  const { error } = await tbl(supabase, 'marquee_items')
    .update({ text, url })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidate()
  return {}
}

export async function deleteMarqueeItem(id: string): Promise<{ error?: string }> {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await tbl(supabase, 'marquee_items').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidate()
  return {}
}

export async function toggleMarqueeItemVisible(
  id: string,
  visible: boolean
): Promise<{ error?: string }> {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await tbl(supabase, 'marquee_items').update({ visible }).eq('id', id)
  if (error) return { error: error.message }
  revalidate()
  return {}
}

export async function reorderMarqueeItems(orderedIds: string[]): Promise<{ error?: string }> {
  await requireAdmin()
  const supabase = await createClient()
  const results = await Promise.all(
    orderedIds.map((id, i) =>
      tbl(supabase, 'marquee_items').update({ sort_order: i }).eq('id', id)
    )
  )
  const firstError = results.find((r: { error?: { message: string } | null }) => r.error)?.error
  if (firstError) return { error: firstError.message }
  revalidate()
  return {}
}

export async function toggleMarqueeEnabled(
  rawLocation: 'home' | 'nav_ticker',
  rawEnabled: boolean
): Promise<{ error?: string }> {
  await requireAdmin()
  let location: 'home' | 'nav_ticker'
  let enabled: boolean
  try {
    location = reqEnum('Konum', rawLocation, LOCATIONS)
    enabled = reqBool('enabled', rawEnabled)
  } catch (e) {
    if (e instanceof AdminValidationError) return { error: e.message }
    throw e
  }
  const supabase = await createClient()
  const { error } = await tbl(supabase, 'marquee_settings')
    .upsert({ location, enabled }, { onConflict: 'location' })
  if (error) return { error: error.message }
  revalidate()
  return {}
}
