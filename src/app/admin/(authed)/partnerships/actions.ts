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

export async function createPartnership(
  data: PartnershipFormData
): Promise<{ id: string } | { error: string }> {
  await requireAdmin()
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
      eyebrow: data.eyebrow || null,
      description: data.description || null,
      logo_url: data.logo_url || null,
      external_url: data.external_url || null,
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
  data: PartnershipFormData
): Promise<{ error?: string }> {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await tbl(supabase, 'partnerships').update({
    name: data.name,
    eyebrow: data.eyebrow || null,
    description: data.description || null,
    logo_url: data.logo_url || null,
    external_url: data.external_url || null,
    visible: data.visible,
  }).eq('id', id)

  if (error) return { error: error.message }
  revalidate()
  return {}
}

export async function deletePartnership(id: string): Promise<{ error?: string }> {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await tbl(supabase, 'partnerships').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidate()
  return {}
}

export async function reorderPartnerships(orderedIds: string[]): Promise<{ error?: string }> {
  await requireAdmin()
  const supabase = await createClient()
  await Promise.all(
    orderedIds.map((id, i) =>
      tbl(supabase, 'partnerships').update({ sort_order: i }).eq('id', id)
    )
  )
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
