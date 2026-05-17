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
  revalidatePath('/admin/about')
}

export async function upsertPageSection(
  key: string,
  title: string,
  paragraphs: string[]
): Promise<{ error?: string }> {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await tbl(supabase, 'page_sections')
    .upsert({ key, title, paragraphs, updated_at: new Date().toISOString() }, { onConflict: 'key' })
  if (error) return { error: error.message }
  revalidate()
  return {}
}
