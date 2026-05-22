'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { AdminValidationError, reqString, optString, reqBool } from '@/lib/admin/validators'
import { removeStorageObjects } from '@/lib/images/serverDelete'

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

function validateTeam(data: TeamMemberFormData) {
  return {
    name: reqString('Ad', data.name, { max: 80 }),
    role: reqString('Rol', data.role, { max: 80 }),
    initials: reqString('Baş Harfler', data.initials, { max: 4 }).toUpperCase(),
    photo_url: optString('Fotoğraf', data.photo_url, { max: 2048 }),
    visible: reqBool('visible', data.visible),
  }
}

export async function createTeamMember(
  raw: TeamMemberFormData
): Promise<{ id: string } | { error: string }> {
  await requireAdmin()
  let data: ReturnType<typeof validateTeam>
  try { data = validateTeam(raw) } catch (e) {
    if (e instanceof AdminValidationError) return { error: e.message }
    throw e
  }
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
      photo_url: data.photo_url,
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
  raw: TeamMemberFormData
): Promise<{ error?: string }> {
  await requireAdmin()
  if (typeof id !== 'string' || !id) return { error: 'Geçersiz id' }
  let data: ReturnType<typeof validateTeam>
  try { data = validateTeam(raw) } catch (e) {
    if (e instanceof AdminValidationError) return { error: e.message }
    throw e
  }
  const supabase = await createClient()

  const { error } = await tbl(supabase, 'team_members').update({
    name: data.name,
    role: data.role,
    initials: data.initials,
    photo_url: data.photo_url,
    visible: data.visible,
  }).eq('id', id)

  if (error) return { error: error.message }
  revalidate()
  return {}
}

export async function deleteTeamMember(id: string): Promise<{ error?: string }> {
  await requireAdmin()
  if (typeof id !== 'string' || !id) return { error: 'Geçersiz id' }
  const supabase = await createClient()

  const { data: existing } = await supabase
    .from('team_members')
    .select('photo_url')
    .eq('id', id)
    .maybeSingle()

  const { error } = await tbl(supabase, 'team_members').delete().eq('id', id)
  if (error) return { error: error.message }

  const e = existing as { photo_url?: string | null } | null
  if (e) await removeStorageObjects([e.photo_url])

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
