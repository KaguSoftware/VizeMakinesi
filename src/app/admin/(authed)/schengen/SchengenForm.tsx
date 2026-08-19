'use client'

import { useState, useTransition } from 'react'
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminLabel,
  AdminTextarea,
  EyebrowText,
  RepeatableList,
  useToast,
  type RepeatableItem,
} from '@/components/admin/ui'
import { useDirtyFromSnapshot, useUnsavedChanges } from '@/lib/hooks/useUnsavedChanges'
import { updateSchengenPage } from './actions'
import type { SchengenPageContent } from '@/data/schengenPage'

interface TextItem extends RepeatableItem { text: string }
interface PairItem extends RepeatableItem { title: string; description: string }
interface FaqItem extends RepeatableItem { question: string; answer: string }

const mkText = (text = ''): TextItem => ({ id: crypto.randomUUID(), text })
const mkPair = (title = '', description = ''): PairItem => ({ id: crypto.randomUUID(), title, description })
const mkFaq = (question = '', answer = ''): FaqItem => ({ id: crypto.randomUUID(), question, answer })

/** Sağ üstteki bölüm bağlantıları — CountryForm'daki gezinme ile aynı mantık. */
const SECTIONS = [
  { id: 'hero', label: 'Hero' },
  { id: 'giris', label: 'Giriş' },
  { id: 'kurallar', label: 'Temel Kurallar' },
  { id: 'vize-turleri', label: 'Vize Türleri' },
  { id: 'basvuru', label: 'Başvuru Adımları' },
  { id: 'sss', label: 'SSS' },
] as const

function SectionCard({
  id,
  eyebrow,
  children,
}: {
  id: string
  eyebrow: string
  children: React.ReactNode
}) {
  return (
    <div id={id} className="scroll-mt-24">
      <AdminCard>
        <EyebrowText className="mb-6">— {eyebrow}</EyebrowText>
        <div className="flex flex-col gap-6">{children}</div>
      </AdminCard>
    </div>
  )
}

/** Başlık + açıklama ikilisinden oluşan madde listesi (kurallar, vize türleri). */
function PairList({
  label,
  items,
  onChange,
  addLabel,
  titlePlaceholder,
}: {
  label: string
  items: PairItem[]
  onChange: (items: PairItem[]) => void
  addLabel: string
  titlePlaceholder: string
}) {
  return (
    <div>
      <AdminLabel>{label}</AdminLabel>
      <div className="mt-1.5">
        <RepeatableList<PairItem>
          items={items}
          onChange={onChange}
          addLabel={addLabel}
          emptyText="Henüz madde eklenmedi"
          onAdd={() => onChange([...items, mkPair()])}
          hasContent={(i) => !!(i.title || i.description)}
          renderItem={(item) => (
            <div className="flex flex-col gap-3">
              <AdminInput
                label="Başlık"
                value={item.title}
                placeholder={titlePlaceholder}
                onChange={(e) =>
                  onChange(items.map((i) => (i.id === item.id ? { ...i, title: e.target.value } : i)))
                }
              />
              <AdminTextarea
                label="Açıklama"
                rows={4}
                value={item.description}
                placeholder="Açıklama metni..."
                onChange={(e) =>
                  onChange(
                    items.map((i) => (i.id === item.id ? { ...i, description: e.target.value } : i))
                  )
                }
              />
            </div>
          )}
        />
      </div>
    </div>
  )
}

/** Tek satırlık metin listesi (hero maddeleri, giriş paragrafları, adımlar). */
function TextList({
  label,
  items,
  onChange,
  addLabel,
  placeholder,
  rows,
}: {
  label: string
  items: TextItem[]
  onChange: (items: TextItem[]) => void
  addLabel: string
  placeholder: string
  rows?: number
}) {
  return (
    <div>
      <AdminLabel>{label}</AdminLabel>
      <div className="mt-1.5">
        <RepeatableList<TextItem>
          items={items}
          onChange={onChange}
          addLabel={addLabel}
          emptyText="Henüz öğe eklenmedi"
          onAdd={() => onChange([...items, mkText()])}
          hasContent={(i) => !!i.text}
          renderItem={(item) =>
            rows ? (
              <AdminTextarea
                label="Metin"
                rows={rows}
                value={item.text}
                placeholder={placeholder}
                onChange={(e) =>
                  onChange(items.map((i) => (i.id === item.id ? { ...i, text: e.target.value } : i)))
                }
              />
            ) : (
              <AdminInput
                label="Metin"
                value={item.text}
                placeholder={placeholder}
                onChange={(e) =>
                  onChange(items.map((i) => (i.id === item.id ? { ...i, text: e.target.value } : i)))
                }
              />
            )
          }
        />
      </div>
    </div>
  )
}

export default function SchengenForm({ initial }: { initial: SchengenPageContent }) {
  const { showToast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [savedAt, setSavedAt] = useState(0)

  // — Hero
  const [heroLead, setHeroLead] = useState(initial.hero_lead)
  const [heroNote, setHeroNote] = useState(initial.hero_note)
  const [heroBullets, setHeroBullets] = useState<TextItem[]>(initial.hero_bullets.map((t) => mkText(t)))

  // — Giriş ("Tek vize, 29 ülke")
  const [introTitle, setIntroTitle] = useState(initial.intro_title)

  // — Temel kurallar
  const [rulesTitle, setRulesTitle] = useState(initial.rules_title)
  const [rulesDescription, setRulesDescription] = useState(initial.rules_description)
  const [rules, setRules] = useState<PairItem[]>(initial.rules.map((r) => mkPair(r.title, r.description)))

  // — Vize türleri
  const [visaTypesTitle, setVisaTypesTitle] = useState(initial.visa_types_title)
  const [visaTypesDescription, setVisaTypesDescription] = useState(initial.visa_types_description)
  const [cTitle, setCTitle] = useState(initial.visa_types_c_title)
  const [cItems, setCItems] = useState<PairItem[]>(initial.visa_types_c.map((v) => mkPair(v.title, v.description)))
  const [dTitle, setDTitle] = useState(initial.visa_types_d_title)
  const [dDescription, setDDescription] = useState(initial.visa_types_d_description)
  const [dItems, setDItems] = useState<PairItem[]>(initial.visa_types_d.map((v) => mkPair(v.title, v.description)))

  // — Başvuru adımları
  const [processTitle, setProcessTitle] = useState(initial.process_title)
  const [processDescription, setProcessDescription] = useState(initial.process_description)
  const [processSteps, setProcessSteps] = useState<TextItem[]>(
    initial.process_steps.map((t) => mkText(t))
  )

  // — SSS
  const [faqTitle, setFaqTitle] = useState(initial.faq_title)
  const [faqs, setFaqs] = useState<FaqItem[]>(initial.faqs.map((f) => mkFaq(f.question, f.answer)))

  const dirty = useDirtyFromSnapshot(
    {
      heroLead, heroNote,
      heroBullets: heroBullets.map((b) => b.text),
      introTitle,
      rulesTitle, rulesDescription,
      rules: rules.map((r) => ({ t: r.title, d: r.description })),
      visaTypesTitle, visaTypesDescription,
      cTitle, cItems: cItems.map((r) => ({ t: r.title, d: r.description })),
      dTitle, dDescription, dItems: dItems.map((r) => ({ t: r.title, d: r.description })),
      processTitle, processDescription,
      processSteps: processSteps.map((s) => s.text),
      faqTitle, faqs: faqs.map((f) => ({ q: f.question, a: f.answer })),
    },
    savedAt
  )

  useUnsavedChanges(dirty && !isPending)

  function handleSave() {
    startTransition(async () => {
      const result = await updateSchengenPage({
        hero_lead: heroLead,
        hero_note: heroNote,
        hero_bullets: heroBullets.map((b) => b.text).filter(Boolean),

        intro_title: introTitle,

        rules_title: rulesTitle,
        rules_description: rulesDescription,
        rules: rules.map((r) => ({ title: r.title, description: r.description })),

        visa_types_title: visaTypesTitle,
        visa_types_description: visaTypesDescription,
        visa_types_c_title: cTitle,
        visa_types_c: cItems.map((r) => ({ title: r.title, description: r.description })),
        visa_types_d_title: dTitle,
        visa_types_d_description: dDescription,
        visa_types_d: dItems.map((r) => ({ title: r.title, description: r.description })),

        process_title: processTitle,
        process_description: processDescription,
        process_steps: processSteps.map((s) => s.text).filter(Boolean),

        faq_title: faqTitle,
        faqs: faqs.map((f) => ({ question: f.question, answer: f.answer })),
      })

      if (result.error) {
        showToast(result.error, 'error')
      } else {
        setSavedAt(Date.now())
        showToast('Kaydedildi', 'success')
      }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <nav className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] tracking-widest uppercase text-navy/70">
        {SECTIONS.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="hover:text-coral transition-colors">
            {s.label}
          </a>
        ))}
      </nav>

      <SectionCard id="hero" eyebrow="Hero">
        <AdminTextarea
          label="Açıklama (lead)"
          rows={2}
          value={heroLead}
          onChange={(e) => setHeroLead(e.target.value)}
        />
        <AdminInput label="Not" value={heroNote} onChange={(e) => setHeroNote(e.target.value)} />
        <TextList
          label="Maddeler (✓ listesi)"
          items={heroBullets}
          onChange={setHeroBullets}
          addLabel="Madde Ekle"
          placeholder="Randevu sürecinde hızlı ve doğru yönlendirme"
        />
        <p className="font-mono text-[11px] text-navy/70">
          Ülke adı, bayrak ve özet metni /admin/countries → Schengen kaydından yönetilir.
        </p>
      </SectionCard>

      <SectionCard id="giris" eyebrow="Giriş — “Tek vize, 29 ülke”">
        <AdminInput
          label="Başlık"
          value={introTitle}
          placeholder="Tek vize, 29 ülke."
          onChange={(e) => setIntroTitle(e.target.value)}
        />
        <p className="font-mono text-[11px] text-navy/70">
          Bu başlığın hemen altında Schengen ülkelerinin kartları listelenir; araya ayrı bir
          başlık girmez.
        </p>
      </SectionCard>

      <SectionCard id="kurallar" eyebrow="Schengen Vizesinin Temel Kuralları">
        <AdminInput label="Başlık" value={rulesTitle} onChange={(e) => setRulesTitle(e.target.value)} />
        <AdminTextarea
          label="Açıklama"
          rows={3}
          value={rulesDescription}
          onChange={(e) => setRulesDescription(e.target.value)}
        />
        <PairList
          label="Kurallar"
          items={rules}
          onChange={setRules}
          addLabel="Kural Ekle"
          titlePlaceholder="90/180 Kuralı"
        />
      </SectionCard>

      <SectionCard id="vize-turleri" eyebrow="Hangi Schengen Vize Türüne Başvurmalısınız?">
        <AdminInput
          label="Başlık"
          value={visaTypesTitle}
          onChange={(e) => setVisaTypesTitle(e.target.value)}
        />
        <AdminTextarea
          label="Açıklama"
          rows={3}
          value={visaTypesDescription}
          onChange={(e) => setVisaTypesDescription(e.target.value)}
        />

        <div className="border-t border-navy/10 pt-6 flex flex-col gap-6">
          <AdminInput
            label="C Tipi grup başlığı"
            value={cTitle}
            placeholder="C Tipi Schengen Vizeleri"
            onChange={(e) => setCTitle(e.target.value)}
          />
          <PairList
            label="C Tipi vizeler"
            items={cItems}
            onChange={setCItems}
            addLabel="Vize Türü Ekle"
            titlePlaceholder="Turistik Vize"
          />
        </div>

        <div className="border-t border-navy/10 pt-6 flex flex-col gap-6">
          <AdminInput
            label="D Tipi grup başlığı"
            value={dTitle}
            placeholder="D Tipi Ulusal Vizeler"
            onChange={(e) => setDTitle(e.target.value)}
          />
          <AdminTextarea
            label="D Tipi açıklaması"
            rows={3}
            value={dDescription}
            onChange={(e) => setDDescription(e.target.value)}
          />
          <PairList
            label="D Tipi vizeler"
            items={dItems}
            onChange={setDItems}
            addLabel="Vize Türü Ekle"
            titlePlaceholder="Öğrenci Vizesi"
          />
        </div>
      </SectionCard>

      <SectionCard id="basvuru" eyebrow="Schengen Vize Başvurusu Nasıl Yapılır?">
        <AdminInput
          label="Başlık"
          value={processTitle}
          onChange={(e) => setProcessTitle(e.target.value)}
        />
        <AdminTextarea
          label="Açıklama"
          rows={4}
          value={processDescription}
          onChange={(e) => setProcessDescription(e.target.value)}
        />
        <TextList
          label="Adımlar"
          items={processSteps}
          onChange={setProcessSteps}
          addLabel="Adım Ekle"
          placeholder="Vize türünü belirleyin"
        />
      </SectionCard>

      <SectionCard id="sss" eyebrow="Sıkça Sorulan Sorular">
        <AdminInput label="Başlık" value={faqTitle} onChange={(e) => setFaqTitle(e.target.value)} />
        <div>
          <AdminLabel>Sorular</AdminLabel>
          <div className="mt-1.5">
            <RepeatableList<FaqItem>
              items={faqs}
              onChange={setFaqs}
              addLabel="Soru Ekle"
              emptyText="Henüz soru eklenmedi"
              onAdd={() => setFaqs((prev) => [...prev, mkFaq()])}
              hasContent={(i) => !!(i.question || i.answer)}
              renderItem={(item) => (
                <div className="flex flex-col gap-3">
                  <AdminInput
                    label="Soru"
                    value={item.question}
                    placeholder="Schengen vizesi kaç günde sonuçlanır?"
                    onChange={(e) =>
                      setFaqs((prev) =>
                        prev.map((f) => (f.id === item.id ? { ...f, question: e.target.value } : f))
                      )
                    }
                  />
                  <AdminTextarea
                    label="Cevap"
                    rows={5}
                    value={item.answer}
                    placeholder="Cevap metni..."
                    onChange={(e) =>
                      setFaqs((prev) =>
                        prev.map((f) => (f.id === item.id ? { ...f, answer: e.target.value } : f))
                      )
                    }
                  />
                </div>
              )}
            />
          </div>
        </div>
        <p className="font-mono text-[11px] text-navy/70">
          /schengen sayfasının tek SSS kaynağı burasıdır — Vizeler bölümündeki Schengen kaydının SSS
          alanı bu sayfada kullanılmaz.
        </p>
      </SectionCard>

      <div className="flex justify-end">
        <AdminButton onClick={handleSave} disabled={isPending}>
          {isPending ? 'Kaydediliyor…' : 'Kaydet'}
        </AdminButton>
      </div>
    </div>
  )
}
