'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { writer } from '@/lib/supabase/writer'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { AdminValidationError, reqString, reqEnum, optUrl } from '@/lib/admin/validators'
import { VISA_FAQ_PAGE_KEYS, VIZE_TURLERI_FAQ_KEY, VISA_TYPES } from '@/data/visaTypes'

export interface FaqInput {
  question: string
  answer: string
}

/**
 * Replaces every FAQ row for one page key.
 *
 * Delete-then-insert rather than a diff: the rows carry no identity the admin
 * form needs to preserve (no FKs point at them), and sort_order is positional,
 * so a full rewrite is both simpler and keeps the ordering authoritative.
 */
export async function saveVisaTypeFaqs(
  rawPageKey: string,
  rawItems: FaqInput[],
): Promise<{ error?: string }> {
  await requireAdmin()

  let pageKey: string
  let items: FaqInput[]
  try {
    pageKey = reqEnum('Sayfa', rawPageKey, VISA_FAQ_PAGE_KEYS)

    if (!Array.isArray(rawItems)) {
      throw new AdminValidationError('SSS', 'SSS listesi geçersiz')
    }
    if (rawItems.length > 60) {
      throw new AdminValidationError('SSS', 'En fazla 60 soru eklenebilir')
    }
    items = rawItems.map((item, i) => ({
      question: reqString(`Soru ${i + 1}`, item?.question, { max: 300 }),
      answer: reqString(`Cevap ${i + 1}`, item?.answer, { max: 4000 }),
    }))
  } catch (e) {
    if (e instanceof AdminValidationError) return { error: e.message }
    throw e
  }

  const supabase = await createClient()

  const { error: deleteError } = await writer(supabase, 'visa_type_faqs')
    .delete()
    .eq('page_key', pageKey)
  if (deleteError) return { error: deleteError.message }

  if (items.length > 0) {
    const { error: insertError } = await writer(supabase, 'visa_type_faqs').insert(
      items.map((item, i) => ({
        page_key: pageKey,
        question: item.question,
        answer: item.answer,
        sort_order: i,
      })),
    )
    if (insertError) return { error: insertError.message }
  }

  revalidate(pageKey)
  return {}
}

/** Page keys that own a documents section (the landing page has none). */
const DOCUMENT_PAGE_KEYS = VISA_TYPES.map((t) => t.slug)

export interface DocumentInput {
  label: string
  pdf_url: string
}

/**
 * Replaces every PDF row for one visa type. Delete-then-insert for the same
 * reasons as `saveVisaTypeFaqs`: no FKs point here and sort_order is positional.
 *
 * Note this only clears the DB rows — the uploaded files themselves are removed
 * by PdfUploader at the moment the admin replaces or clears a field.
 */
export async function saveVisaTypeDocuments(
  rawPageKey: string,
  rawItems: DocumentInput[],
): Promise<{ error?: string }> {
  await requireAdmin()

  let pageKey: string
  let items: { label: string; pdf_url: string }[]
  try {
    pageKey = reqEnum('Sayfa', rawPageKey, DOCUMENT_PAGE_KEYS)

    if (!Array.isArray(rawItems)) {
      throw new AdminValidationError('Belgeler', 'Belge listesi geçersiz')
    }
    if (rawItems.length > 40) {
      throw new AdminValidationError('Belgeler', 'En fazla 40 belge eklenebilir')
    }
    items = rawItems.map((item, i) => {
      const label = reqString(`Belge ${i + 1} başlığı`, item?.label, { max: 200 })
      const url = optUrl(`Belge ${i + 1} PDF`, item?.pdf_url)
      if (!url) {
        throw new AdminValidationError('Belgeler', `Belge ${i + 1} için PDF yükleyin`)
      }
      return { label, pdf_url: url }
    })
  } catch (e) {
    if (e instanceof AdminValidationError) return { error: e.message }
    throw e
  }

  const supabase = await createClient()

  const { error: deleteError } = await writer(supabase, 'visa_type_documents')
    .delete()
    .eq('page_key', pageKey)
  if (deleteError) return { error: deleteError.message }

  if (items.length > 0) {
    const { error: insertError } = await writer(supabase, 'visa_type_documents').insert(
      items.map((item, i) => ({
        page_key: pageKey,
        label: item.label,
        pdf_url: item.pdf_url,
        sort_order: i,
      })),
    )
    if (insertError) return { error: insertError.message }
  }

  revalidate(pageKey)
  return {}
}

function revalidate(pageKey: string) {
  revalidatePath('/admin/vize-turleri')
  revalidatePath('/vize-turleri')
  // The landing page key has no sub-route of its own.
  if (pageKey !== VIZE_TURLERI_FAQ_KEY) {
    revalidatePath(`/vize-turleri/${pageKey}`)
  }
}
