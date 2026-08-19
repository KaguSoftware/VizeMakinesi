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
import { updateBlogSchengenPage } from './actions'
import type { BlogSchengenContent } from '@/data/blogSchengen'

interface TextItem extends RepeatableItem { text: string }

interface SubsectionItem extends RepeatableItem {
  heading: string
  quote: string
  quote_en: string
  paragraphs: TextItem[]
  bullets: TextItem[]
}

interface SectionItem extends RepeatableItem {
  kicker: string
  title: string
  intro: TextItem[]
  subsections: SubsectionItem[]
}

const mkText = (text = ''): TextItem => ({ id: crypto.randomUUID(), text })

const mkSubsection = (): SubsectionItem => ({
  id: crypto.randomUUID(),
  heading: '',
  quote: '',
  quote_en: '',
  paragraphs: [],
  bullets: [],
})

const mkSection = (): SectionItem => ({
  id: crypto.randomUUID(),
  kicker: '',
  title: '',
  intro: [],
  subsections: [],
})

/** Tek satırlık / çok satırlık metin listesi. */
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

export default function BlogSchengenForm({ initial }: { initial: BlogSchengenContent }) {
  const { showToast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [savedAt, setSavedAt] = useState(0)

  const [heroKicker, setHeroKicker] = useState(initial.hero_kicker)
  const [heroTitle, setHeroTitle] = useState(initial.hero_title)
  const [heroTitleEm, setHeroTitleEm] = useState(initial.hero_title_em)
  const [heroExcerpt, setHeroExcerpt] = useState(initial.hero_excerpt)

  const [sections, setSections] = useState<SectionItem[]>(
    initial.sections.map((s) => ({
      id: crypto.randomUUID(),
      kicker: s.kicker,
      title: s.title,
      intro: s.intro.map((t) => mkText(t)),
      subsections: s.subsections.map((sub) => ({
        id: crypto.randomUUID(),
        heading: sub.heading,
        quote: sub.quote,
        quote_en: sub.quote_en,
        paragraphs: sub.paragraphs.map((t) => mkText(t)),
        bullets: sub.bullets.map((t) => mkText(t)),
      })),
    }))
  )

  /** Tek bir bölümün alanını günceller. */
  function patchSection(id: string, patch: Partial<SectionItem>) {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }

  /** Bir bölümün içindeki tek bir alt başlığı günceller. */
  function patchSubsection(sectionId: string, subId: string, patch: Partial<SubsectionItem>) {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              subsections: s.subsections.map((sub) =>
                sub.id === subId ? { ...sub, ...patch } : sub
              ),
            }
          : s
      )
    )
  }

  const dirty = useDirtyFromSnapshot(
    {
      heroKicker, heroTitle, heroTitleEm, heroExcerpt,
      sections: sections.map((s) => ({
        k: s.kicker,
        t: s.title,
        i: s.intro.map((p) => p.text),
        subs: s.subsections.map((sub) => ({
          h: sub.heading,
          q: sub.quote,
          qe: sub.quote_en,
          p: sub.paragraphs.map((p) => p.text),
          b: sub.bullets.map((b) => b.text),
        })),
      })),
    },
    savedAt
  )

  useUnsavedChanges(dirty && !isPending)

  function handleSave() {
    startTransition(async () => {
      const result = await updateBlogSchengenPage({
        hero_kicker: heroKicker,
        hero_title: heroTitle,
        hero_title_em: heroTitleEm,
        hero_excerpt: heroExcerpt,
        sections: sections.map((s) => ({
          kicker: s.kicker,
          title: s.title,
          intro: s.intro.map((p) => p.text).filter(Boolean),
          subsections: s.subsections.map((sub) => ({
            heading: sub.heading,
            quote: sub.quote,
            quote_en: sub.quote_en,
            paragraphs: sub.paragraphs.map((p) => p.text).filter(Boolean),
            bullets: sub.bullets.map((b) => b.text).filter(Boolean),
          })),
        })),
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
      <AdminCard>
        <EyebrowText className="mb-6">— Hero</EyebrowText>
        <div className="flex flex-col gap-6">
          <AdminInput
            label="Etiket"
            value={heroKicker}
            placeholder="Başvuru rehberi"
            onChange={(e) => setHeroKicker(e.target.value)}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminInput
              label="Başlık"
              value={heroTitle}
              placeholder="Schengen vizesi"
              onChange={(e) => setHeroTitle(e.target.value)}
            />
            <AdminInput
              label="Başlık — italik/coral kısım"
              value={heroTitleEm}
              placeholder=" rehberi"
              onChange={(e) => setHeroTitleEm(e.target.value)}
            />
          </div>
          <AdminTextarea
            label="Özet (hero'nun sağındaki italik metin)"
            rows={3}
            value={heroExcerpt}
            onChange={(e) => setHeroExcerpt(e.target.value)}
          />
          <p className="font-mono text-[11px] text-navy/70">
            İki başlık alanı yan yana yazılır; ikinci alan sitede italik ve coral görünür.
            Bayrak emojisi ve blog akışındaki kart metni koddan gelir.
          </p>
        </div>
      </AdminCard>

      <AdminCard>
        <EyebrowText className="mb-3">— Bölümler</EyebrowText>
        <p className="font-mono text-[11px] text-navy/70 mb-6">
          Her bölüm sayfada kendi başlığıyla (coral, büyük punto) yer alır; alt başlıklar bölümün
          içinde sırayla listelenir. “Ret kararında yer alan ifade” alanları yalnızca doldurulduğu
          alt başlıklarda gösterilir.
        </p>

        <RepeatableList<SectionItem>
          items={sections}
          onChange={setSections}
          addLabel="Bölüm Ekle"
          emptyText="Henüz bölüm eklenmedi"
          onAdd={() => setSections((prev) => [...prev, mkSection()])}
          hasContent={(s) => !!(s.title || s.subsections.length || s.intro.length)}
          renderItem={(section, index) => (
            <div className="flex flex-col gap-6">
              <EyebrowText>— Bölüm {index + 1}</EyebrowText>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4">
                <AdminInput
                  label="Etiket"
                  value={section.kicker}
                  placeholder="Ret gerekçeleri"
                  onChange={(e) => patchSection(section.id, { kicker: e.target.value })}
                />
                <AdminInput
                  label="Bölüm Başlığı"
                  value={section.title}
                  placeholder="Schengen Vize Reddi Nedenleri"
                  onChange={(e) => patchSection(section.id, { title: e.target.value })}
                />
              </div>

              <TextList
                label="Giriş Paragrafları"
                items={section.intro}
                onChange={(intro) => patchSection(section.id, { intro })}
                addLabel="Paragraf Ekle"
                placeholder="Bölümün giriş paragrafı..."
                rows={3}
              />

              <div className="border-t border-navy/10 pt-6">
                <AdminLabel>Alt Başlıklar</AdminLabel>
                <div className="mt-1.5">
                  <RepeatableList<SubsectionItem>
                    items={section.subsections}
                    onChange={(subsections) => patchSection(section.id, { subsections })}
                    addLabel="Alt Başlık Ekle"
                    emptyText="Henüz alt başlık eklenmedi"
                    onAdd={() =>
                      patchSection(section.id, {
                        subsections: [...section.subsections, mkSubsection()],
                      })
                    }
                    hasContent={(sub) => !!(sub.heading || sub.paragraphs.length)}
                    renderItem={(sub) => (
                      <div className="flex flex-col gap-4">
                        <AdminInput
                          label="Alt Başlık"
                          value={sub.heading}
                          placeholder="1. Seyahat Amacının Yeterince Açıklanamaması"
                          onChange={(e) =>
                            patchSubsection(section.id, sub.id, { heading: e.target.value })
                          }
                        />
                        <AdminTextarea
                          label="Ret kararında yer alan ifade (opsiyonel)"
                          rows={2}
                          value={sub.quote}
                          placeholder="Planlanan seyahatin amacı ve koşullarına ilişkin yeterli gerekçe sunulmadı."
                          onChange={(e) =>
                            patchSubsection(section.id, sub.id, { quote: e.target.value })
                          }
                        />
                        <AdminTextarea
                          label="İngilizce orijinali (opsiyonel)"
                          rows={2}
                          value={sub.quote_en}
                          placeholder="The justification for the purpose and conditions of the intended stay was not provided."
                          onChange={(e) =>
                            patchSubsection(section.id, sub.id, { quote_en: e.target.value })
                          }
                        />
                        <TextList
                          label="Paragraflar"
                          items={sub.paragraphs}
                          onChange={(paragraphs) =>
                            patchSubsection(section.id, sub.id, { paragraphs })
                          }
                          addLabel="Paragraf Ekle"
                          placeholder="Açıklama paragrafı..."
                          rows={3}
                        />
                        <TextList
                          label="Maddeler (opsiyonel)"
                          items={sub.bullets}
                          onChange={(bullets) => patchSubsection(section.id, sub.id, { bullets })}
                          addLabel="Madde Ekle"
                          placeholder="Turistik seyahat → Turistik amaçlı başvuru"
                        />
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
          )}
        />
      </AdminCard>

      <div className="sticky bottom-6 flex items-center gap-4">
        <AdminButton variant="primary" onClick={handleSave} disabled={isPending}>
          {isPending ? 'Kaydediliyor…' : 'Kaydet'}
        </AdminButton>
        {dirty && !isPending && (
          <span className="font-mono text-[11px] text-coral">Kaydedilmemiş değişiklikler var</span>
        )}
      </div>
    </div>
  )
}
