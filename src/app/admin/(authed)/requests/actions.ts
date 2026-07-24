'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createClient } from '@/lib/supabase/server'
import { writer } from '@/lib/supabase/writer'

type ActionResult = { error?: string }

export async function setRequestRead(id: string, isRead: boolean): Promise<ActionResult> {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await writer(supabase, 'consultation_requests')
    .update({ is_read: isRead })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/requests')
  return {}
}

export async function deleteRequest(id: string): Promise<ActionResult> {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await writer(supabase, 'consultation_requests').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/requests')
  return {}
}
