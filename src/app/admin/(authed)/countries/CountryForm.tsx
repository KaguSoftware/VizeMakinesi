'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import FlagBG from '@/components/shared/FlagBG/FlagBG'
import { useDirtyFromSnapshot, useDirtyGuard, useUnsavedChanges } from '@/lib/hooks/useUnsavedChanges'
import {
  AdminButton,
  AdminInput,
  AdminTextarea,
  AdminSelect,
  AdminLabel,
  RepeatableList,
  ImageUploader,
  useToast,
  type RepeatableItem,
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

// ── Constants ─────────────────────────────────────────────────────────────────

const PRESET_KEYS = [
  { key: 'uk', label: 'İngiltere' },
  { key: 'germany', label: 'Almanya' },
  { key: 'france', label: 'Fransa' },
  { key: 'italy', label: 'İtalya' },
  { key: 'netherlands', label: 'Hollanda' },
  { key: 'usa', label: 'ABD' },
  { key: 'canada', label: 'Kanada' },
  { key: 'australia', label: 'Avustralya' },
  { key: 'uae', label: 'BAE' },
  { key: 'china', label: 'Çin' },
  { key: 'schengen', label: 'Schengen' },
  { key: 'ireland', label: 'İrlanda' },
]

const MOSAIC_SPANS = [
  { value: 'col-span-12 md:col-span-3', label: 'Dar (3)' },
  { value: 'col-span-12 md:col-span-4', label: 'Orta (4)' },
  { value: 'col-span-12 md:col-span-5', label: 'Geniş (5)' },
  { value: 'col-span-12 md:col-span-7', label: 'Tam (7)' },
]

// ── Item types for RepeatableList ────────────────────────────────────────────

interface TextItem extends RepeatableItem { text: string }
interface FaqItem extends RepeatableItem { question: string; answer: string }

function mkText(text = ''): TextItem { return { id: crypto.randomUUID(), text } }
function mkFaq(question = '', answer = ''): FaqItem { return { id: crypto.randomUUID(), question, answer } }

// ── Helpers ───────────────────────────────────────────────────────────────────

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    // U+0300..U+036F is the "Combining Diacritical Marks" Unicode block.
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

const FORM_SECTIONS = [
  { id: 'temel', label: 'Temel Bilgiler' },
  { id: 'bayrak', label: 'Bayrak' },
  { id: 'mozaik', label: 'Ana Sayfa Mozaik' },
  { id: 'belgeler', label: 'Gerekli Belgeler' },
  { id: 'ustlenilen', label: 'Ofisin Üstlendiği' },
  { id: 'sss', label: 'SSS' },
  { id: 'turizm', label: 'Turizm İçeriği' },
] as const

function Divider({ id, label }: { id?: string; label: string }) {
  return (
    <h2
      id={id}
      className="mt-12 mb-4 font-mono text-xs tracking-widest uppercase text-navy scroll-mt-24"
    >
      {label}
    </h2>
  )
}

function FieldError({ errors, field }: { errors: ValidationError[]; field: string }) {
  const e = errors.find((e) => e.field === field)
  if (!e) return null
  return <p className="font-mono text-[11px] text-red-500 mt-1">{e.message}</p>
}

// ── Main component ────────────────────────────────────────────────────────────

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

  // — 05 Handles
  const [handles, setHandles] = useState<TextItem[]>(
    country?.handles.map((h) => mkText(h.text)) ?? []
  )

  // — 06 FAQs
  const [faqs, setFaqs] = useState<FaqItem[]>(
    country?.faqs.map((f) => mkFaq(f.question, f.answer)) ?? []
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
  // Pure render-time computation, no effect needed.
  const dirty = useDirtyFromSnapshot({
    name, slug, flagEmoji, visaType, summary,
    flagType, flagPresetKey, flagImageUrl,
    mosaicVisible, mosaicSpan, danismaVisible,
    requirements: requirements.map((r) => r.text),
    handles: handles.map((h) => h.text),
    faqs: faqs.map((f) => ({ q: f.question, a: f.answer })),
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

  // ── Slug auto-generate ─────────────────────────────────────────────────────

  function handleNameChange(val: string) {
    setName(val)
    // Auto-sync slug only while the user hasn't manually edited it.
    if (!slugTouched) {
      setSlug(slugify(val))
    }
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

  // ── Submit ─────────────────────────────────────────────────────────────────

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
      requirements: requirements.map((r) => ({ text: r.text })),
      handles: handles.map((h) => ({ text: h.text })),
      faqs: faqs.map((f) => ({ question: f.question, answer: f.answer })),
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

  // ── Render ─────────────────────────────────────────────────────────────────

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

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex-1 min-w-0 max-w-3xl"
      >

      {/* ── 01 Temel Bilgiler ─────────────────────────────────────────────── */}
      <Divider id="temel" label="Temel Bilgiler" />

      <div className="flex flex-col gap-6">
        <div>
          <AdminInput
            label="Ad"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
          />
          <FieldError errors={errors} field="name" />
        </div>

        <div>
          <AdminInput
            label="Slug"
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            onBlur={handleSlugBlur}
          />
          {slugChecking && (
            <p className="font-mono text-[11px] text-navy/60 mt-1">Slug kontrol ediliyor…</p>
          )}
          {!slugChecking && (slugError
            ? <p className="font-mono text-[11px] text-red-500 mt-1">{slugError}</p>
            : <FieldError errors={errors} field="slug" />
          )}
        </div>

        <div>
          <AdminInput
            label="Bayrak Emoji"
            value={flagEmoji}
            onChange={(e) => setFlagEmoji(e.target.value)}
            placeholder="🇹🇷"
          />
          <FieldError errors={errors} field="flag_emoji" />
        </div>

        <div>
          <AdminInput
            label="Vize Türü"
            value={visaType}
            onChange={(e) => setVisaType(e.target.value)}
            placeholder="Örn: Schengen Vizesi"
          />
          <FieldError errors={errors} field="visa_type" />
        </div>

        <div>
          <AdminTextarea
            label="Özet"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={3}
          />
          <FieldError errors={errors} field="summary" />
        </div>

        <div>
          <AdminInput
            label="Tahmini Randevu Süresi"
            value={appointmentDays}
            onChange={(e) => setAppointmentDays(e.target.value)}
            placeholder="Örn: 2-3 hafta"
          />
          <p className="mt-1 font-mono text-[11px] text-navy/70">
            Boş bırakılırsa ilgili bölüm gösterilmez.
          </p>
        </div>
      </div>

      {/* ── 02 Bayrak ─────────────────────────────────────────────────────── */}
      <Divider id="bayrak" label="Bayrak" />

      <div className="flex flex-col gap-5">
        <div className="flex gap-6">
          {(['preset', 'image'] as const).map((t) => (
            <label key={t} className="flex items-center gap-2 cursor-pointer font-mono text-[11px] tracking-widest uppercase text-navy/85">
              <input
                type="radio"
                value={t}
                checked={flagType === t}
                onChange={() => setFlagType(t)}
                className="accent-coral"
              />
              {t === 'preset' ? 'Hazır SVG' : 'Görsel Yükle'}
            </label>
          ))}
        </div>

        {flagType === 'preset' && (
          <div>
            <AdminSelect
              label="Hazır Bayrak"
              value={flagPresetKey}
              onChange={(e) => setFlagPresetKey(e.target.value)}
            >
              <option value="">Seçin…</option>
              {PRESET_KEYS.map(({ key, label }) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </AdminSelect>
            {flagPresetKey && (
              <div className="mt-3 w-20 h-12 relative overflow-hidden rounded-sm border border-navy/40">
                <FlagBG presetKey={flagPresetKey} className="absolute inset-0 w-full h-full" />
              </div>
            )}
            <FieldError errors={errors} field="flag_preset_key" />
          </div>
        )}

        {flagType === 'image' && (
          <div className="flex flex-col gap-3">
            <AdminLabel>Bayrak Görseli</AdminLabel>
            <ImageUploader
              bucket="country-flags"
              value={flagImageUrl}
              onChange={setFlagImageUrl}
              label="Bayrak"
              previewClassName="w-20 h-12"
            />
            <FieldError errors={errors} field="flag_image_url" />
          </div>
        )}
      </div>

      {/* ── 03 Mozaik ─────────────────────────────────────────────────────── */}
      <Divider id="mozaik" label="Ana Sayfa Mozaik" />

      <div className="flex flex-col gap-5">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={mosaicVisible}
            onChange={(e) => setMosaicVisible(e.target.checked)}
            className="accent-coral w-4 h-4"
          />
          <span className="font-mono text-[11px] tracking-widest uppercase text-navy/85">
            Ana sayfada görünür
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={danismaVisible}
            onChange={(e) => setDanismaVisible(e.target.checked)}
            className="accent-coral w-4 h-4"
          />
          <span className="font-mono text-[11px] tracking-widest uppercase text-navy/85">
            Danışma formunda görünür
          </span>
        </label>

        <AdminSelect
          label="Genişlik"
          value={mosaicSpan}
          onChange={(e) => setMosaicSpan(e.target.value)}
        >
          {MOSAIC_SPANS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </AdminSelect>
      </div>

      {/* ── 04 Gerekli Belgeler ───────────────────────────────────────────── */}
      <Divider id="belgeler" label="Gerekli Belgeler" />

      <RepeatableList<TextItem>
        items={requirements}
        onChange={setRequirements}
        onAdd={() => setRequirements((prev) => [...prev, mkText()])}
        addLabel="Yeni Belge Ekle"
        emptyText="Henüz belge eklenmedi"
        renderItem={(item, index) => (
          <AdminInput
            label={`Belge ${index + 1}`}
            value={item.text}
            onChange={(e) => setRequirements((prev) =>
              prev.map((r) => r.id === item.id ? { ...r, text: e.target.value } : r)
            )}
          />
        )}
      />

      {/* ── 05 Ofisimizin Üstlendiği ─────────────────────────────────────── */}
      <Divider id="ustlenilen" label="Ofisimizin Üstlendiği" />

      <RepeatableList<TextItem>
        items={handles}
        onChange={setHandles}
        onAdd={() => setHandles((prev) => [...prev, mkText()])}
        addLabel="Yeni Madde Ekle"
        emptyText="Henüz madde eklenmedi"
        renderItem={(item, index) => (
          <AdminInput
            label={`Madde ${index + 1}`}
            value={item.text}
            onChange={(e) => setHandles((prev) =>
              prev.map((h) => h.id === item.id ? { ...h, text: e.target.value } : h)
            )}
          />
        )}
      />

      {/* ── 06 SSS ───────────────────────────────────────────────────────── */}
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

      {/* ── 07 Turizm ────────────────────────────────────────────────────── */}
      <Divider id="turizm" label="Turizm İçeriği" />

      <div className="flex flex-col gap-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={hasTourism}
            onChange={(e) => setHasTourism(e.target.checked)}
            className="accent-coral w-4 h-4"
          />
          <span className="font-mono text-[11px] tracking-widest uppercase text-navy/85">
            Blog / Turizm sayfası aktif
          </span>
        </label>

        {hasTourism && (
          <div className="flex flex-col gap-8">
            {/* Hero image */}
            <div className="flex flex-col gap-3">
              <AdminLabel>Kapak Görseli</AdminLabel>
              <ImageUploader
                bucket="country-tourism"
                value={tourismHeroUrl}
                onChange={setTourismHeroUrl}
                label="Kapak Görseli"
                previewClassName="w-48 h-28"
              />
            </div>

            {/* Intro paragraphs */}
            <div>
              <AdminLabel className="mb-3 block">Giriş Paragrafları</AdminLabel>
              <RepeatableList<TextItem>
                items={tourismIntro}
                onChange={setTourismIntro}
                onAdd={() => setTourismIntro((prev) => [...prev, mkText()])}
                addLabel="Paragraf Ekle"
                emptyText="Henüz paragraf eklenmedi"
                renderItem={(item, index) => (
                  <AdminTextarea
                    label={`Paragraf ${index + 1}`}
                    value={item.text}
                    onChange={(e) => setTourismIntro((prev) =>
                      prev.map((t) => t.id === item.id ? { ...t, text: e.target.value } : t)
                    )}
                    rows={2}
                  />
                )}
              />
              <FieldError errors={errors} field="tourism_intro" />
            </div>

            {/* Highlights */}
            <div>
              <AdminLabel className="mb-3 block">Öne Çıkanlar</AdminLabel>
              <RepeatableList<TextItem>
                items={tourismHighlights}
                onChange={setTourismHighlights}
                onAdd={() => setTourismHighlights((prev) => [...prev, mkText()])}
                addLabel="Öne Çıkan Ekle"
                emptyText="Henüz öğe eklenmedi"
                renderItem={(item, index) => (
                  <AdminInput
                    label={`Öne Çıkan ${index + 1}`}
                    value={item.text}
                    onChange={(e) => setTourismHighlights((prev) =>
                      prev.map((t) => t.id === item.id ? { ...t, text: e.target.value } : t)
                    )}
                  />
                )}
              />
              <FieldError errors={errors} field="tourism_highlights" />
            </div>

            {/* Tips */}
            <div>
              <AdminLabel className="mb-3 block">İpuçları</AdminLabel>
              <RepeatableList<TextItem>
                items={tourismTips}
                onChange={setTourismTips}
                onAdd={() => setTourismTips((prev) => [...prev, mkText()])}
                addLabel="İpucu Ekle"
                emptyText="Henüz ipucu eklenmedi"
                renderItem={(item, index) => (
                  <AdminInput
                    label={`İpucu ${index + 1}`}
                    value={item.text}
                    onChange={(e) => setTourismTips((prev) =>
                      prev.map((t) => t.id === item.id ? { ...t, text: e.target.value } : t)
                    )}
                  />
                )}
              />
              <FieldError errors={errors} field="tourism_tips" />
            </div>

            {/* Best time */}
            <AdminInput
              label="En İyi Ziyaret Zamanı"
              value={tourismBestTime}
              onChange={(e) => setTourismBestTime(e.target.value)}
              placeholder="Örn: Nisan – Ekim"
            />
          </div>
        )}
      </div>

      {/* ── Actions ───────────────────────────────────────────────────────── */}
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

      {/* Inline validation summary */}
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
