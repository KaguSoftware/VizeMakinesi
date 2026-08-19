'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
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
import { joinLabeled, splitLabeled } from '@/lib/text/labeled'
import {
  Divider,
  FORM_SECTIONS,
  MOSAIC_SPANS,
  mkDoc,
  mkFaq,
  mkProcessStep,
  mkText,
  slugify,
  type DocumentItem,
  type FaqItem,
  type ProcessStepItem,
  type TextItem,
} from './sections/shared'
import TemelSection from './sections/TemelSection'
import FlagSection from './sections/FlagSection'
import MosaicSection from './sections/MosaicSection'
import TourismSection from './sections/TourismSection'

/** Schengen kaydında gizlenen bölümler — içerikleri /admin/schengen'den yönetilir. */
const SCHENGEN_HIDDEN_SECTIONS: string[] = ['genel-bilgi', 'basvuru-sureci', 'pdf-belgeler', 'sss']

interface CountryFormProps {
  country?: CountryWithRelations
}

export default function CountryForm({ country }: CountryFormProps) {
  const router = useRouter()
  const { showToast } = useToast()
  const { confirmDiscard } = useDirtyGuard()
  const formRef = useRef<HTMLFormElement>(null)
  const isEdit = !!country
  // /schengen sayfası kendi içerik tablosundan beslenir (bkz. /admin/schengen).
  // Bu alanlar Schengen kaydında hiçbir sayfada görünmediği için gizlenir.
  const isSchengen = country?.slug === 'schengen'
  const visibleSections = isSchengen
    ? FORM_SECTIONS.filter((s) => !SCHENGEN_HIDDEN_SECTIONS.includes(s.id))
    : FORM_SECTIONS

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

  // — 05 General Info ("Başvuru Öncesi Bilmeniz Gerekenler" bölümü)
  const [generalInfoTitle, setGeneralInfoTitle] = useState(country?.general_info_title ?? '')
  const [generalInfoDescription, setGeneralInfoDescription] = useState(
    country?.general_info_description ?? ''
  )
  // Maddeler DB'de tek metin olarak tutulur, formda başlık/açıklama ikilisine
  // ayrılır. Bkz. src/lib/text/labeled.ts
  const [generalInfo, setGeneralInfo] = useState<ProcessStepItem[]>(
    (country?.general_info ?? []).map((t) => {
      const { label, body } = splitLabeled(t)
      return mkProcessStep(label, body)
    })
  )

  // — 05a Vize türleri ("Hangi Vize Türüne Başvurmalısınız?" bölümü)
  const [visaTypesTitle, setVisaTypesTitle] = useState(country?.visa_types_title ?? '')
  const [visaTypesLead, setVisaTypesLead] = useState(country?.visa_types_lead ?? '')
  const [visaTypesDescription, setVisaTypesDescription] = useState(
    country?.visa_types_description ?? ''
  )
  const [visaTypesHeroDescription, setVisaTypesHeroDescription] = useState(
    country?.visa_types_hero_description ?? ''
  )
  const [visaTypes, setVisaTypes] = useState<ProcessStepItem[]>(
    country?.visa_types.map((v) => mkProcessStep(v.title, v.description)) ?? []
  )

  // — 05b Başvuru süreci adımları (numaralı adımlar, /vize/[slug])
  const [processSteps, setProcessSteps] = useState<ProcessStepItem[]>(
    country?.process_steps.map((s) => mkProcessStep(s.title, s.description)) ?? []
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
  // Bumped after every successful save so the dirty baseline re-captures the
  // just-saved values — the form stays on the page, so it must stop reading
  // as dirty.
  const [savedAt, setSavedAt] = useState(0)

  // Derive dirty from a snapshot of the tracked data fields at mount.
  const dirty = useDirtyFromSnapshot({
    name, slug, flagEmoji, visaType, summary,
    flagType, flagPresetKey, flagImageUrl,
    mosaicVisible, mosaicSpan, danismaVisible,
    generalInfoTitle, generalInfoDescription,
    generalInfo: generalInfo.map((t) => ({ title: t.title, description: t.description })),
    visaTypesTitle, visaTypesLead, visaTypesDescription, visaTypesHeroDescription,
    visaTypes: visaTypes.map((v) => ({ title: v.title, description: v.description })),
    processSteps: processSteps.map((s) => ({ title: s.title, description: s.description })),
    requirements: requirements.map((r) => r.text),
    faqs: faqs.map((f) => ({ q: f.question, a: f.answer })),
    documents: documents.map((d) => ({ label: d.label, pdf_url: d.pdf_url })),
    hasTourism, tourismHeroUrl,
    tourismIntro: tourismIntro.map((t) => t.text),
    tourismHighlights: tourismHighlights.map((t) => t.text),
    tourismTips: tourismTips.map((t) => t.text),
    tourismBestTime, appointmentDays,
  }, savedAt)

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
      general_info: generalInfo
        .map((t) => joinLabeled(t.title, t.description))
        .filter(Boolean),
      general_info_title: generalInfoTitle || null,
      general_info_description: generalInfoDescription || null,
      requirements: requirements.map((r) => ({ text: r.text })),
      handles: [],
      faqs: faqs.map((f) => ({ question: f.question, answer: f.answer })),
      documents: documents.map((d) => ({ label: d.label, pdf_url: d.pdf_url })),
      process_steps: processSteps.map((s) => ({ title: s.title, description: s.description })),
      visa_types_title: visaTypesTitle || null,
      visa_types_lead: visaTypesLead || null,
      visa_types_description: visaTypesDescription || null,
      visa_types_hero_description: visaTypesHeroDescription || null,
      visa_types: visaTypes.map((v) => ({ title: v.title, description: v.description })),
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
        showToast('Ülke güncellendi')
        // Stay on the form. Re-baseline the dirty check and pull the fresh
        // server data so a later reload doesn't show stale content.
        setSavedAt((n) => n + 1)
        router.refresh()
      } else {
        const result = await createCountry(data)
        if ('error' in result) { setSaveError(result.error); showToast(result.error, 'error'); return }
        showToast('Ülke oluşturuldu')
        // A new record has no edit route yet — move onto its own edit page so
        // the next save updates instead of trying to create a duplicate.
        setSubmitted(true)
        router.push(`/admin/countries/${result.id}/edit`)
      }
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
        {visibleSections.map((s) => (
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
        {isSchengen && (
          <div className="mb-8 border border-coral/40 bg-coral/5 rounded-lg p-5">
            <p className="font-mono text-[11px] tracking-widest uppercase text-coral mb-2">
              — Schengen kaydı
            </p>
            <p className="font-sans text-[13px] leading-relaxed text-navy/80">
              Bu kayıt <strong>/schengen</strong> sayfasının hero bölümünü (ad, bayrak, özet) ve ana
              sayfa mozaiğini besler. Sayfanın diğer bölümleri — giriş metni, ülke başlığı, temel
              kurallar, C/D Tipi vize türleri, başvuru adımları ve SSS —{' '}
              <Link href="/admin/schengen" className="text-coral underline hover:text-navy transition-colors">
                Schengen Sayfası
              </Link>{' '}
              ekranından yönetilir. Bu nedenle Başvuru Öncesi, Başvuru Süreci, PDF Belgeler ve SSS
              alanları burada gösterilmez. Vize Türleri alanı ise{' '}
              <strong>/vize-turleri/schengen</strong> sayfasında kullanılmaya devam eder.
            </p>
          </div>
        )}

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
          showAppointmentDays={!isSchengen}
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

        {!isSchengen && (<>
        <Divider id="genel-bilgi" label="Başvuru Öncesi Bilmeniz Gerekenler" />
        <p className="-mt-2 mb-4 font-mono text-[11px] text-navy/55">
          Ülke sayfasındaki maddeli bölüm. Bölüm başlığı boş bırakılırsa
          “Başvuru Öncesi Bilmeniz Gerekenler” kullanılır; bölüm açıklaması boşsa gösterilmez.
          Bölüm başlığının son iki kelimesi sitede italik/coral görünür. Her maddenin mini
          başlığı sitede kalın yazılır, ardından açıklaması gelir.
        </p>
        <div className="flex flex-col gap-3 mb-6">
          <AdminInput
            label="Bölüm Başlığı"
            value={generalInfoTitle}
            onChange={(e) => setGeneralInfoTitle(e.target.value)}
            placeholder="Başvuru Öncesi Bilmeniz Gerekenler"
          />
          <AdminTextarea
            label="Bölüm Açıklaması"
            value={generalInfoDescription}
            onChange={(e) => setGeneralInfoDescription(e.target.value)}
            rows={3}
            placeholder="Örn: Başvurunuza başlamadan önce sürecin işleyişine dair bilmeniz gereken temel noktalar."
          />
        </div>
        <RepeatableList<ProcessStepItem>
          items={generalInfo}
          onChange={setGeneralInfo}
          onAdd={() => setGeneralInfo((prev) => [...prev, mkProcessStep()])}
          addLabel="Yeni Madde Ekle"
          emptyText="Henüz madde eklenmedi"
          renderItem={(item) => (
            <div className="flex flex-col gap-3">
              <AdminInput
                label="Mini Başlık"
                value={item.title}
                onChange={(e) => setGeneralInfo((prev) =>
                  prev.map((t) => t.id === item.id ? { ...t, title: e.target.value } : t)
                )}
                placeholder="Örn: Vize Zorunluluğu"
              />
              <AdminTextarea
                label="Açıklama"
                value={item.description}
                onChange={(e) => setGeneralInfo((prev) =>
                  prev.map((t) => t.id === item.id ? { ...t, description: e.target.value } : t)
                )}
                rows={3}
                placeholder="Örn: Türkiye Cumhuriyeti umuma mahsus (bordo) pasaport sahipleri, Almanya'ya seyahat etmeden önce vize almak zorundadır."
              />
            </div>
          )}
        />

        </>)}

        <Divider id="vize-turleri" label="Hangi Vize Türüne Başvurmalısınız?" />
        <p className="-mt-2 mb-4 font-mono text-[11px] text-navy/55">
          Ülke sayfasındaki açılır-kapanır vize türü listesi. Vize türü adı kalın başlık olarak
          görünür, tıklandığında açıklaması açılır. Hiç vize türü eklenmezse bölüm gösterilmez.
          Başlık ve giriş cümlesi boş bırakılırsa varsayılan metinler kullanılır. Giriş
          cümlesinin sonundaki “Vize türlerini detaylı inceleyin →” bağlantısı sabittir ve
          ülkenin vize türleri sayfasına gider. Bölüm açıklaması ile vize türü adları ve
          açıklamaları yalnızca o sayfada görünür; hero açıklaması ise o sayfanın üst
          bölümünde yer alır.
        </p>
        <div className="flex flex-col gap-3 mb-6">
          <AdminInput
            label="Bölüm Başlığı"
            value={visaTypesTitle}
            onChange={(e) => setVisaTypesTitle(e.target.value)}
            placeholder="Hangi Vize Türüne Başvurmalısınız?"
          />
          <AdminTextarea
            label="Giriş Cümlesi"
            value={visaTypesLead}
            onChange={(e) => setVisaTypesLead(e.target.value)}
            rows={2}
            placeholder="Doğru vize türüne başvurmak, başvuru sürecinin en önemli adımlarından biridir."
          />
          <AdminTextarea
            label="Bölüm Açıklaması"
            value={visaTypesDescription}
            onChange={(e) => setVisaTypesDescription(e.target.value)}
            rows={3}
            placeholder="Örn: Almanya'ya yapacağınız seyahatin amacı, başvurmanız gereken vize türünü belirler."
          />
          <AdminTextarea
            label="Vize Türleri Sayfası Hero Açıklaması"
            value={visaTypesHeroDescription}
            onChange={(e) => setVisaTypesHeroDescription(e.target.value)}
            rows={3}
            placeholder="Örn: Almanya, kısa süreli Schengen vizelerinin yanı sıra eğitim ve çalışma için Ulusal (D Tipi) vize seçenekleri de sunar."
          />
        </div>
        <RepeatableList<ProcessStepItem>
          items={visaTypes}
          onChange={setVisaTypes}
          onAdd={() => setVisaTypes((prev) => [...prev, mkProcessStep()])}
          addLabel="Yeni Vize Türü Ekle"
          emptyText="Henüz vize türü eklenmedi — bölüm gösterilmeyecek"
          renderItem={(item) => (
            <div className="flex flex-col gap-3">
              <AdminInput
                label="Vize Türü Adı"
                value={item.title}
                onChange={(e) => setVisaTypes((prev) =>
                  prev.map((v) => v.id === item.id ? { ...v, title: e.target.value } : v)
                )}
                placeholder="Örn: Almanya Turistik Vizesi"
              />
              <AdminTextarea
                label="Açıklama"
                value={item.description}
                onChange={(e) => setVisaTypes((prev) =>
                  prev.map((v) => v.id === item.id ? { ...v, description: e.target.value } : v)
                )}
                rows={3}
                placeholder="Örn: Tatil, gezi, kültürel etkinlikler ve bireysel seyahatler amacıyla Almanya'ya gitmek isteyen kişilerin başvurabileceği Schengen (C Tipi) vizedir."
              />
            </div>
          )}
        />

        {!isSchengen && (<>
        {/* "{Ülke} Vize İşlemleri nasıl yapılır?" bölümünün sağındaki
            numaralı adımlar. Boş bırakılırsa sitedeki varsayılan adımlar
            gösterilir. */}
        <Divider id="basvuru-sureci" label="Başvuru Süreci Adımları" />
        <p className="-mt-2 mb-4 font-mono text-[11px] text-navy/55">
          Ülke sayfasındaki “Vize İşlemleri nasıl yapılır?” bölümünün sağındaki numaralı adımlar.
          Boş bırakılırsa varsayılan adımlar gösterilir. Numaralar sıraya göre otomatik verilir.
        </p>
        <RepeatableList<ProcessStepItem>
          items={processSteps}
          onChange={setProcessSteps}
          onAdd={() => setProcessSteps((prev) => [...prev, mkProcessStep()])}
          addLabel="Yeni Adım Ekle"
          emptyText="Henüz adım eklenmedi — varsayılan adımlar gösterilecek"
          renderItem={(item) => (
            <div className="flex flex-col gap-3">
              <AdminInput
                label="Başlık"
                value={item.title}
                onChange={(e) => setProcessSteps((prev) =>
                  prev.map((s) => s.id === item.id ? { ...s, title: e.target.value } : s)
                )}
                placeholder="Örn: İlk Görüşme ve Stratejik Planlama"
              />
              <AdminTextarea
                label="Açıklama"
                value={item.description}
                onChange={(e) => setProcessSteps((prev) =>
                  prev.map((s) => s.id === item.id ? { ...s, description: e.target.value } : s)
                )}
                rows={3}
                placeholder="Örn: Uzman danışmanlarımızla yapacağınız ilk görüşmede profilinizi, seyahat amacınızı ve tarihlerinizi analiz ediyoruz."
              />
            </div>
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

        </>)}

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
