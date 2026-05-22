'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import {
  AdminValidationError,
  reqString,
  optString,
  optUrl,
  reqBool,
} from '@/lib/admin/validators'
import { removeStorageObjects } from '@/lib/images/serverDelete'

type SB = Awaited<ReturnType<typeof createClient>>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function tbl(supabase: SB, table: string): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any).from(table)
}

function revalidate() {
  revalidatePath('/ortakliklar')
}

export interface PartnershipFormData {
  name: string
  eyebrow: string
  description: string
  logo_url: string
  external_url: string
  visible: boolean
}

function validatePartnership(data: PartnershipFormData) {
  return {
    name: reqString('Ad', data.name, { max: 100 }),
    eyebrow: optString('Eyebrow', data.eyebrow, { max: 60 }),
    description: optString('Açıklama', data.description, { max: 600 }),
    logo_url: optString('Logo', data.logo_url, { max: 2048 }),
    external_url: optUrl('Bağlantı', data.external_url),
    visible: reqBool('visible', data.visible),
  }
}

export async function createPartnership(
  raw: PartnershipFormData
): Promise<{ id: string } | { error: string }> {
  await requireAdmin()
  let data: ReturnType<typeof validatePartnership>
  try { data = validatePartnership(raw) } catch (e) {
    if (e instanceof AdminValidationError) return { error: e.message }
    throw e
  }
  const supabase = await createClient()

  const { data: maxRaw } = await supabase
    .from('partnerships')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .single()

  const nextOrder = ((maxRaw as { sort_order: number } | null)?.sort_order ?? 0) + 1

  const { data: row, error } = await tbl(supabase, 'partnerships')
    .insert({
      name: data.name,
      eyebrow: data.eyebrow,
      description: data.description,
      logo_url: data.logo_url,
      external_url: data.external_url,
      visible: data.visible,
      sort_order: nextOrder,
    })
    .select('id')
    .single()

  if (error || !row) return { error: error?.message ?? 'Oluşturma başarısız' }
  revalidate()
  return { id: row.id }
}

export async function updatePartnership(
  id: string,
  raw: PartnershipFormData
): Promise<{ error?: string }> {
  await requireAdmin()
  if (typeof id !== 'string' || !id) return { error: 'Geçersiz id' }
  let data: ReturnType<typeof validatePartnership>
  try { data = validatePartnership(raw) } catch (e) {
    if (e instanceof AdminValidationError) return { error: e.message }
    throw e
  }
  const supabase = await createClient()

  const { error } = await tbl(supabase, 'partnerships').update({
    name: data.name,
    eyebrow: data.eyebrow,
    description: data.description,
    logo_url: data.logo_url,
    external_url: data.external_url,
    visible: data.visible,
  }).eq('id', id)

  if (error) return { error: error.message }
  revalidate()
  return {}
}

export async function deletePartnership(id: string): Promise<{ error?: string }> {
  await requireAdmin()
  if (typeof id !== 'string' || !id) return { error: 'Geçersiz id' }
  const supabase = await createClient()

  const { data: existing } = await supabase
    .from('partnerships')
    .select('logo_url')
    .eq('id', id)
    .maybeSingle()

  const { error } = await tbl(supabase, 'partnerships').delete().eq('id', id)
  if (error) return { error: error.message }

  const e = existing as { logo_url?: string | null } | null
  if (e) await removeStorageObjects([e.logo_url])

  revalidate()
  return {}
}

export async function reorderPartnerships(orderedIds: string[]): Promise<{ error?: string }> {
  await requireAdmin()
  const supabase = await createClient()
  const results = await Promise.all(
    orderedIds.map((id, i) =>
      tbl(supabase, 'partnerships').update({ sort_order: i }).eq('id', id)
    )
  )
  const firstError = results.find((r: { error?: { message: string } | null }) => r.error)?.error
  if (firstError) return { error: firstError.message }
  revalidate()
  return {}
}

export async function togglePartnershipVisible(
  id: string,
  visible: boolean
): Promise<{ error?: string }> {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await tbl(supabase, 'partnerships').update({ visible }).eq('id', id)
  if (error) return { error: error.message }
  revalidate()
  return {}
}
