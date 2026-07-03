'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDirtyFromSnapshot, useDirtyGuard, useUnsavedChanges } from '@/lib/hooks/useUnsavedChanges'
import {
  AdminButton,
  AdminInput,
  AdminTextarea,
  PdfUploader,
  RepeatableList,
  useToast,
} from '@/components/admin/ui'
import {
  createCountry,
  updateCountry,
  checkSlugUnique,
} from './actions'
import {
  validateCountry,
  type CountryFormData,
  type ValidationError,
} from './validation'
import type { CountryWithRelations } from '@/lib/data/countries'
import {
  Divider,
  FORM_SECTIONS,
  MOSAIC_SPANS,
  mkDoc,
  mkFaq,
  mkText,
  slugify,
  type DocumentItem,
  type FaqItem,
  type TextItem,
} from './sections/shared'
import TemelSection from './sections/TemelSection'
import FlagSection from './sections/FlagSection'
import MosaicSection from './sections/MosaicSection'
import TourismSection from './sections/TourismSection'

interface CountryFormProps {
  country?: CountryWithRelations
}

export default function CountryForm({ country }: CountryFormProps) {
  const router = useRouter()
  const { showToast } = useToast()
  const { confirmDiscard } = useDirtyGuard()
  const formRef = useRef<HTMLFormElement>(null)
  const isEdit = !!country

  // — 01 Temel
  const [name, setName] = useState(country?.name ?? '')
  const [slug, setSlug] = useState(country?.slug ?? '')
  const [flagEmoji, setFlagEmoji] = useState(country?.flag_emoji ?? '')
  const [visaType, setVisaType] = useState(country?.visa_type ?? '')
  const [summary, setSummary] = useState(country?.summary ?? '')
  const [slugError, setSlugError] = useState<string | null>(null)
  // Once the user types in the slug field, stop syncing it from name. In edit
  // mode the slug starts pre-populated, so we treat it as already-touched.
  const [slugTouched, setSlugTouched] = useState(isEdit)
  const [slugChecking, setSlugChecking] = useState(false)

  // — 02 Flag
  const [flagType, setFlagType] = useState<'preset' | 'image'>(country?.flag_type ?? 'preset')
  const [flagPresetKey, setFlagPresetKey] = useState(country?.flag_preset_key ?? '')
  const [flagImageUrl, setFlagImageUrl] = useState(country?.flag_image_url ?? '')

  // — 03 Mozaik
  const [mosaicVisible, setMosaicVisible] = useState(country?.mosaic_visible ?? true)
  const [mosaicSpan, setMosaicSpan] = useState(country?.mosaic_span ?? MOSAIC_SPANS[0].value)

  // — 04 Requirements
  const [requirements, setRequirements] = useState<TextItem[]>(
    country?.requirements.map((r) => mkText(r.text)) ?? []
  )

  // — 05 General Info
  const [generalInfo, setGeneralInfo] = useState<TextItem[]>(
    (country?.general_info ?? []).map((t) => mkText(t))
  )

  // — 06 FAQs
  const [faqs, setFaqs] = useState<FaqItem[]>(
    country?.faqs.map((f) => mkFaq(f.question, f.answer)) ?? []
  )

  // — 07 Documents (PDF)
  const [documents, setDocuments] = useState<DocumentItem[]>(
    country?.documents.map((d) => mkDoc(d.label, d.pdf_url)) ?? []
  )

  // — 07 Tourism
  const [danismaVisible, setDanismaVisible] = useState(country?.danisma_visible ?? false)
  const [hasTourism, setHasTourism] = useState(country?.has_tourism ?? false)
  const [tourismHeroUrl, setTourismHeroUrl] = useState(country?.tourism_hero_image_url ?? '')
  const [tourismIntro, setTourismIntro] = useState<TextItem[]>(
    (country?.tourism_intro ?? []).map((t) => mkText(t))
  )
  const [tourismHighlights, setTourismHighlights] = useState<TextItem[]>(
    (country?.tourism_highlights ?? []).map((t) => mkText(t))
  )
  const [tourismTips, setTourismTips] = useState<TextItem[]>(
    (country?.tourism_tips ?? []).map((t) => mkText(t))
  )
  const [tourismBestTime, setTourismBestTime] = useState(country?.tourism_best_time ?? '')

  // — 08 Appointment days
  const [appointmentDays, setAppointmentDays] = useState(country?.appointment_days ?? '')

  const [errors, setErrors] = useState<ValidationError[]>([])
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  // Derive dirty from a snapshot of the tracked data fields at mount.
  const dirty = useDirtyFromSnapshot({
    name, slug, flagEmoji, visaType, summary,
    flagType, flagPresetKey, flagImageUrl,
    mosaicVisible, mosaicSpan, danismaVisible,
    generalInfo: generalInfo.map((t) => t.text),
    requirements: requirements.map((r) => r.text),
    faqs: faqs.map((f) => ({ q: f.question, a: f.answer })),
    documents: documents.map((d) => ({ label: d.label, pdf_url: d.pdf_url })),
    hasTourism, tourismHeroUrl,
    tourismIntro: tourismIntro.map((t) => t.text),
    tourismHighlights: tourismHighlights.map((t) => t.text),
    tourismTips: tourismTips.map((t) => t.text),
    tourismBestTime, appointmentDays,
  })

  useUnsavedChanges(dirty && !saving && !submitted)

  // ⌘/Ctrl-S submits the visible form.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        if (!saving) formRef.current?.requestSubmit()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [saving])

  function handleCancel() {
    if (confirmDiscard()) router.push('/admin/countries')
  }

  function handleNameChange(val: string) {
    setName(val)
    // Auto-sync slug only while the user hasn't manually edited it.
    if (!slugTouched) setSlug(slugify(val))
  }

  function handleSlugChange(val: string) {
    setSlugTouched(true)
    setSlug(val)
  }

  async function handleSlugBlur() {
    if (!slug) return
    setSlugChecking(true)
    try {
      const unique = await checkSlugUnique(slug, country?.id)
      setSlugError(unique ? null : 'Bu slug zaten kullanılıyor')
    } finally {
      setSlugChecking(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaveError(null)

    const data: CountryFormData = {
      name,
      slug,
      flag_emoji: flagEmoji || null,
      flag_type: flagType,
      flag_preset_key: flagType === 'preset' ? (flagPresetKey || null) : null,
      flag_image_url: flagType === 'image' ? (flagImageUrl || null) : null,
      visa_type: visaType || null,
      summary: summary || null,
      mosaic_visible: mosaicVisible,
      mosaic_span: mosaicSpan || null,
      has_tourism: hasTourism,
      danisma_visible: danismaVisible,
      tourism_hero_image_url: hasTourism ? (tourismHeroUrl || null) : null,
      tourism_intro: hasTourism ? tourismIntro.map((i) => i.text).filter(Boolean) : [],
      tourism_highlights: hasTourism ? tourismHighlights.map((i) => i.text).filter(Boolean) : [],
      tourism_tips: hasTourism ? tourismTips.map((i) => i.text).filter(Boolean) : [],
      tourism_best_time: hasTourism ? (tourismBestTime || null) : null,
      appointment_days: appointmentDays || null,
      general_info: generalInfo.map((t) => t.text).filter(Boolean),
      requirements: requirements.map((r) => ({ text: r.text })),
      handles: [],
      faqs: faqs.map((f) => ({ question: f.question, answer: f.answer })),
      documents: documents.map((d) => ({ label: d.label, pdf_url: d.pdf_url })),
    }

    const errs = validateCountry(data)
    // Always re-check slug uniqueness on submit — the blur-only check is racy
    // and the user can submit before blur fires.
    if (data.slug && /^[a-z0-9-]+$/.test(data.slug)) {
      setSlugChecking(true)
      try {
        const unique = await checkSlugUnique(data.slug, country?.id)
        if (!unique) {
          setSlugError('Bu slug zaten kullanılıyor')
          errs.push({ field: 'slug', message: 'Bu slug zaten kullanılıyor' })
        } else {
          setSlugError(null)
        }
      } finally {
        setSlugChecking(false)
      }
    } else if (slugError) {
      errs.push({ field: 'slug', message: slugError })
    }
    setErrors(errs)
    if (errs.length > 0) return

    setSaving(true)
    try {
      if (isEdit) {
        const result = await updateCountry(country.id, data)
        if (result.error) { setSaveError(result.error); showToast(result.error, 'error'); return }
      } else {
        const result = await createCountry(data)
        if ('error' in result) { setSaveError(result.error); showToast(result.error, 'error'); return }
      }
      showToast(isEdit ? 'Ülke güncellendi' : 'Ülke oluşturuldu')
      setSubmitted(true)
      router.push('/admin/countries')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="lg:flex lg:gap-12 lg:items-start">
      {/* Section jump-nav (desktop only). Sticky so it follows the user. */}
      <nav
        aria-label="Form bölümleri"
        className="hidden lg:flex flex-col gap-1 sticky top-12 w-44 shrink-0 pt-4"
      >
        <p className="font-mono text-[11px] tracking-widest uppercase text-navy/55 mb-2">
          — Bölümler
        </p>
        {FORM_SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="font-mono text-[11px] tracking-wide uppercase text-navy/70 hover:text-coral transition-colors py-1"
          >
            {s.label}
          </a>
        ))}
      </nav>

      <form ref={formRef} onSubmit={handleSubmit} className="flex-1 min-w-0 max-w-3xl">
        <TemelSection
          name={name}
          slug={slug}
          flagEmoji={flagEmoji}
          visaType={visaType}
          summary={summary}
          appointmentDays={appointmentDays}
          slugError={slugError}
          slugChecking={slugChecking}
          errors={errors}
          onNameChange={handleNameChange}
          onSlugChange={handleSlugChange}
          onSlugBlur={handleSlugBlur}
          onFlagEmojiChange={setFlagEmoji}
          onVisaTypeChange={setVisaType}
          onSummaryChange={setSummary}
          onAppointmentDaysChange={setAppointmentDays}
        />

        <FlagSection
          flagType={flagType}
          flagPresetKey={flagPresetKey}
          flagImageUrl={flagImageUrl}
          errors={errors}
          onFlagTypeChange={setFlagType}
          onFlagPresetKeyChange={setFlagPresetKey}
          onFlagImageUrlChange={setFlagImageUrl}
        />

        <MosaicSection
          mosaicVisible={mosaicVisible}
          danismaVisible={danismaVisible}
          mosaicSpan={mosaicSpan}
          onMosaicVisibleChange={setMosaicVisible}
          onDanismaVisibleChange={setDanismaVisible}
          onMosaicSpanChange={setMosaicSpan}
        />

        <Divider id="genel-bilgi" label="Genel Bilgi Maddeleri" />
        <RepeatableList<TextItem>
          items={generalInfo}
          onChange={setGeneralInfo}
          onAdd={() => setGeneralInfo((prev) => [...prev, mkText()])}
          addLabel="Yeni Madde Ekle"
          emptyText="Henüz genel bilgi maddesi eklenmedi"
          renderItem={(item) => (
            <AdminInput
              label="Madde"
              value={item.text}
              onChange={(e) => setGeneralInfo((prev) =>
                prev.map((t) => t.id === item.id ? { ...t, text: e.target.value } : t)
              )}
              placeholder="Örn: Vize başvurusu en az 15 iş günü öncesinde yapılmalıdır."
            />
          )}
        />

        <Divider id="pdf-belgeler" label="PDF Belgeler" />
        <RepeatableList<DocumentItem>
          items={documents}
          onChange={setDocuments}
          onAdd={() => setDocuments((prev) => [...prev, mkDoc()])}
          addLabel="Yeni PDF Ekle"
          emptyText="Henüz PDF belgesi eklenmedi"
          renderItem={(item) => (
            <div className="flex flex-col gap-3">
              <AdminInput
                label="Belge Adı"
                value={item.label}
                onChange={(e) => setDocuments((prev) =>
                  prev.map((d) => d.id === item.id ? { ...d, label: e.target.value } : d)
                )}
                placeholder="Örn: Almanya Vize Başvuru Formu"
              />
              <PdfUploader
                value={item.pdf_url}
                onChange={(url) => setDocuments((prev) =>
                  prev.map((d) => d.id === item.id ? { ...d, pdf_url: url } : d)
                )}
              />
            </div>
          )}
        />

        <Divider id="sss" label="Sık Sorulan Sorular" />
        <RepeatableList<FaqItem>
          items={faqs}
          onChange={setFaqs}
          onAdd={() => setFaqs((prev) => [...prev, mkFaq()])}
          addLabel="Yeni Soru Ekle"
          emptyText="Henüz soru eklenmedi"
          renderItem={(item) => (
            <div className="flex flex-col gap-3">
              <AdminInput
                label="Soru"
                value={item.question}
                onChange={(e) => setFaqs((prev) =>
                  prev.map((f) => f.id === item.id ? { ...f, question: e.target.value } : f)
                )}
              />
              <AdminTextarea
                label="Cevap"
                value={item.answer}
                onChange={(e) => setFaqs((prev) =>
                  prev.map((f) => f.id === item.id ? { ...f, answer: e.target.value } : f)
                )}
                rows={2}
              />
            </div>
          )}
        />

        <TourismSection
          hasTourism={hasTourism}
          tourismHeroUrl={tourismHeroUrl}
          tourismIntro={tourismIntro}
          tourismHighlights={tourismHighlights}
          tourismTips={tourismTips}
          tourismBestTime={tourismBestTime}
          errors={errors}
          onHasTourismChange={setHasTourism}
          onTourismHeroUrlChange={setTourismHeroUrl}
          onTourismIntroChange={setTourismIntro}
          onTourismHighlightsChange={setTourismHighlights}
          onTourismTipsChange={setTourismTips}
          onTourismBestTimeChange={setTourismBestTime}
        />

        {/* Actions */}
        <div className="mt-12 pt-8 border-t border-navy/30 flex items-center gap-4">
          <AdminButton type="submit" variant="primary" disabled={saving}>
            {saving ? 'Kaydediliyor…' : isEdit ? 'Kaydet' : 'Oluştur'}
          </AdminButton>
          <AdminButton
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={saving}
          >
            İptal
          </AdminButton>
          {saveError && (
            <p className="font-mono text-[11px] text-red-500">{saveError}</p>
          )}
        </div>

        {errors.length > 0 && (
          <div className="mt-4 p-4 border border-red-400/40 bg-red-50 flex flex-col gap-1">
            <p className="font-mono text-[11px] text-red-600 font-semibold mb-1">
              {errors.length} hata düzeltilmeli:
            </p>
            {errors.map((e, i) => (
              <p key={i} className="font-mono text-[11px] text-red-600">• {e.message}</p>
            ))}
          </div>
        )}
      </form>
    </div>
  )
}
