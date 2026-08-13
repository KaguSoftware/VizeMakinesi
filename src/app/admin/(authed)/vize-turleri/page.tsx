import { createClient } from '@/lib/supabase/server'
import { EyebrowText } from '@/components/admin/ui'
import { Breadcrumbs } from '@/components/admin/Breadcrumbs'
import { VISA_TYPES, VIZE_TURLERI_FAQ_KEY } from '@/data/visaTypes'
import type { VisaTypeFaqRow } from '@/lib/data/visaTypeFaqs'
import type { VisaTypeDocumentRow } from '@/lib/data/visaTypeDocuments'
import VisaTypesEditor, { type VisaTypeSectionData } from './VisaTypesEditor'

/** Landing page first, then each visa type in the order shown on the site. */
const SECTION_META = [
  {
    pageKey: VIZE_TURLERI_FAQ_KEY,
    label: 'Vize Türleri (Ana Sayfa)',
    path: '/vize-turleri',
    // The landing page has an SSS block but no "Gerekli Belgeler" section.
    hasDocuments: false,
  },
  ...VISA_TYPES.map((t) => ({
    pageKey: t.slug,
    label: t.title,
    path: `/vize-turleri/${t.slug}`,
    hasDocuments: true,
  })),
]

export default async function VizeTurleriAdminPage() {
  // Server client (not the public one) so this page always renders fresh —
  // an admin editing content must never be served a cached list.
  const supabase = await createClient()

  const [faqResult, docResult] = await Promise.all([
    supabase.from('visa_type_faqs').select('*').order('sort_order', { ascending: true }),
    supabase.from('visa_type_documents').select('*').order('sort_order', { ascending: true }),
  ])

  const faqsByPage: Record<string, { q: string; a: string }[]> = {}
  for (const row of (faqResult.data ?? []) as VisaTypeFaqRow[]) {
    ;(faqsByPage[row.page_key] ??= []).push({ q: row.question, a: row.answer })
  }

  const docsByPage: Record<string, { label: string; pdf_url: string }[]> = {}
  for (const row of (docResult.data ?? []) as VisaTypeDocumentRow[]) {
    ;(docsByPage[row.page_key] ??= []).push({ label: row.label, pdf_url: row.pdf_url })
  }

  const sections: VisaTypeSectionData[] = SECTION_META.map((meta) => ({
    ...meta,
    faqs: faqsByPage[meta.pageKey] ?? [],
    documents: docsByPage[meta.pageKey] ?? [],
  }))

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Vize Türleri' }]} />

      <div className="mb-8">
        <EyebrowText>— Vize Türleri</EyebrowText>
        <h1 className="font-serif text-[36px] font-bold tracking-[-0.02em] text-navy mt-1">
          Vize Türleri
        </h1>
        <p className="font-sans text-[14px] text-navy/60 mt-3 max-w-160">
          Soldaki listeden bir vize türü seçin. Her sayfanın &quot;Sıkça Sorulan
          Sorular&quot; bölümünü ve indirilebilir PDF belgelerini buradan yönetin. Sayfa
          metinlerinin geri kalanı kod tarafında sabittir.
        </p>
      </div>

      <VisaTypesEditor sections={sections} />
    </div>
  )
}
