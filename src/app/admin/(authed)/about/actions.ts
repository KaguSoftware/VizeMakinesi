'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { writer } from '@/lib/supabase/writer'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { AdminValidationError, reqString, reqArrayOfStrings } from '@/lib/admin/validators'

function revalidate() {
  revalidatePath('/hakkimizda')
  revalidatePath('/admin/about')
}

const ALLOWED_KEYS = ['about_tarihce'] as const

export async function upsertPageSection(
  rawKey: string,
  rawTitle: string,
  rawParagraphs: string[]
): Promise<{ error?: string }> {
  await requireAdmin()
  let key: string
  let title: string
  let paragraphs: string[]
  try {
    key = reqString('key', rawKey, { max: 60 })
    if (!(ALLOWED_KEYS as readonly string[]).includes(key)) {
      throw new AdminValidationError('key', 'Geçersiz sayfa anahtarı')
    }
    title = reqString('Başlık', rawTitle, { max: 200 })
    paragraphs = reqArrayOfStrings('Paragraflar', rawParagraphs, { minItems: 1, maxItems: 50, maxLen: 4000 })
  } catch (e) {
    if (e instanceof AdminValidationError) return { error: e.message }
    throw e
  }
  const supabase = await createClient()
  const { error } = await writer(supabase, 'page_sections').upsert(
    { key, title, paragraphs, updated_at: new Date().toISOString() },
    { onConflict: 'key' },
  )
  if (error) return { error: error.message }
  revalidate()
  return {}
}
