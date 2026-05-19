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
  revalidatePath('/hakkimizda')
}

export interface TeamMemberFormData {
  name: string
  role: string
  initials: string
  photo_url: string
  visible: boolean
}

export async function createTeamMember(
  data: TeamMemberFormData
): Promise<{ id: string } | { error: string }> {
  await requireAdmin()
  const supabase = await createClient()

  const { data: maxRaw } = await supabase
    .from('team_members')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .single()

  const nextOrder = ((maxRaw as { sort_order: number } | null)?.sort_order ?? 0) + 1

  const { data: row, error } = await tbl(supabase, 'team_members')
    .insert({
      name: data.name,
      role: data.role,
      initials: data.initials,
      photo_url: data.photo_url || null,
      visible: data.visible,
      sort_order: nextOrder,
    })
    .select('id')
    .single()

  if (error || !row) return { error: error?.message ?? 'Oluşturma başarısız' }
  revalidate()
  return { id: row.id }
}

export async function updateTeamMember(
  id: string,
  data: TeamMemberFormData
): Promise<{ error?: string }> {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await tbl(supabase, 'team_members').update({
    name: data.name,
    role: data.role,
    initials: data.initials,
    photo_url: data.photo_url || null,
    visible: data.visible,
  }).eq('id', id)

  if (error) return { error: error.message }
  revalidate()
  return {}
}

export async function deleteTeamMember(id: string): Promise<{ error?: string }> {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await tbl(supabase, 'team_members').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidate()
  return {}
}

export async function reorderTeamMembers(orderedIds: string[]): Promise<{ error?: string }> {
  await requireAdmin()
  const supabase = await createClient()
  const results = await Promise.all(
    orderedIds.map((id, i) =>
      tbl(supabase, 'team_members').update({ sort_order: i }).eq('id', id)
    )
  )
  const firstError = results.find((r: { error?: { message: string } | null }) => r.error)?.error
  if (firstError) return { error: firstError.message }
  revalidate()
  return {}
}

export async function toggleTeamMemberVisible(
  id: string,
  visible: boolean
): Promise<{ error?: string }> {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await tbl(supabase, 'team_members').update({ visible }).eq('id', id)
  if (error) return { error: error.message }
  revalidate()
  return {}
}
