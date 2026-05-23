'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { AdminValidationError, reqString } from '@/lib/admin/validators'

function reqUuid(field: string, value: unknown): string {
  if (typeof value !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
    throw new AdminValidationError(field, `${field} geçersiz`)
  }
  return value
}

type SB = Awaited<ReturnType<typeof createClient>>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function tbl(supabase: SB, table: string): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any).from(table)
}

function revalidate() {
  revalidatePath('/', 'layout')
}

export async function createCategory(rawName: string): Promise<{ id: string } | { error: string }> {
  await requireAdmin()
  let name: string
  try { name = reqString('Kategori adı', rawName, { max: 60 }) }
  catch (e) {
    if (e instanceof AdminValidationError) return { error: e.message }
    throw e
  }
  const supabase = await createClient()

  const { data: maxRaw } = await supabase
    .from('mega_menu_categories')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .single()

  const nextOrder = ((maxRaw as { sort_order: number } | null)?.sort_order ?? 0) + 1
  const { data, error } = await tbl(supabase, 'mega_menu_categories')
    .insert({ name, sort_order: nextOrder, visible: true })
    .select('id')
    .single()

  if (error || !data) return { error: error?.message ?? 'Oluşturma başarısız' }
  revalidate()
  return { id: data.id }
}

export async function updateCategory(rawId: string, rawName: string): Promise<{ error?: string }> {
  await requireAdmin()
  let id: string
  let name: string
  try {
    id = reqUuid('id', rawId)
    name = reqString('Kategori adı', rawName, { max: 60 })
  } catch (e) {
    if (e instanceof AdminValidationError) return { error: e.message }
    throw e
  }
  const supabase = await createClient()
  const { error } = await tbl(supabase, 'mega_menu_categories').update({ name }).eq('id', id)
  if (error) return { error: error.message }
  revalidate()
  return {}
}

export async function deleteCategory(id: string): Promise<{ error?: string }> {
  await requireAdmin()
  const supabase = await createClient()
  await tbl(supabase, 'mega_menu_items').delete().eq('category_id', id)
  const { error } = await tbl(supabase, 'mega_menu_categories').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidate()
  return {}
}

export async function reorderCategories(orderedIds: string[]): Promise<{ error?: string }> {
  await requireAdmin()
  const supabase = await createClient()
  const results = await Promise.all(
    orderedIds.map((id, i) =>
      tbl(supabase, 'mega_menu_categories').update({ sort_order: i }).eq('id', id)
    )
  )
  const firstError = results.find((r: { error?: { message: string } | null }) => r.error)?.error
  if (firstError) return { error: firstError.message }
  revalidate()
  return {}
}

export async function toggleCategoryVisible(id: string, visible: boolean): Promise<{ error?: string }> {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await tbl(supabase, 'mega_menu_categories').update({ visible }).eq('id', id)
  if (error) return { error: error.message }
  revalidate()
  return {}
}

export async function createItem(rawCategoryId: string, rawCountryId: string): Promise<{ id: string } | { error: string }> {
  await requireAdmin()
  let categoryId: string
  let countryId: string
  try {
    categoryId = reqUuid('category_id', rawCategoryId)
    countryId = reqUuid('country_id', rawCountryId)
  } catch (e) {
    if (e instanceof AdminValidationError) return { error: e.message }
    throw e
  }
  const supabase = await createClient()

  const { data: maxRaw } = await supabase
    .from('mega_menu_items')
    .select('sort_order')
    .eq('category_id', categoryId)
    .order('sort_order', { ascending: false })
    .limit(1)
    .single()

  const nextOrder = ((maxRaw as { sort_order: number } | null)?.sort_order ?? 0) + 1
  const { data, error } = await tbl(supabase, 'mega_menu_items')
    .insert({ category_id: categoryId, country_id: countryId, sort_order: nextOrder, visible: true })
    .select('id')
    .single()

  if (error || !data) return { error: error?.message ?? 'Oluşturma başarısız' }
  revalidate()
  return { id: data.id }
}

export async function updateItem(rawId: string, rawCountryId: string): Promise<{ error?: string }> {
  await requireAdmin()
  let id: string
  let countryId: string
  try {
    id = reqUuid('id', rawId)
    countryId = reqUuid('country_id', rawCountryId)
  } catch (e) {
    if (e instanceof AdminValidationError) return { error: e.message }
    throw e
  }
  const supabase = await createClient()
  const { error } = await tbl(supabase, 'mega_menu_items').update({ country_id: countryId }).eq('id', id)
  if (error) return { error: error.message }
  revalidate()
  return {}
}

export async function deleteItem(id: string): Promise<{ error?: string }> {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await tbl(supabase, 'mega_menu_items').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidate()
  return {}
}

export async function toggleItemVisible(id: string, visible: boolean): Promise<{ error?: string }> {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await tbl(supabase, 'mega_menu_items').update({ visible }).eq('id', id)
  if (error) return { error: error.message }
  revalidate()
  return {}
}

// Receives the full structure after a cross-category move
export async function reorderItems(
  items: { id: string; category_id: string; sort_order: number }[]
): Promise<{ error?: string }> {
  await requireAdmin()
  const supabase = await createClient()
  const results = await Promise.all(
    items.map(({ id, category_id, sort_order }) =>
      tbl(supabase, 'mega_menu_items').update({ category_id, sort_order }).eq('id', id)
    )
  )
  const firstError = results.find((r: { error?: { message: string } | null }) => r.error)?.error
  if (firstError) return { error: firstError.message }
  revalidate()
  return {}
}
