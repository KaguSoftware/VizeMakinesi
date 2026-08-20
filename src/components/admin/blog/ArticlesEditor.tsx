'use client'

import {
  AdminInput,
  AdminLabel,
  AdminTextarea,
  EyebrowText,
  RepeatableList,
  type RepeatableItem,
} from '@/components/admin/ui'
import { slugifyTr } from '@/lib/text/slug'
import type { BlogArticle } from '@/lib/blog/articles'

/**
 * Blog makalelerinin ortak düzenleyicisi.
 *
 * Hem Schengen rehberi (/admin/blog/schengen) hem de ülke blogları
 * (/admin/blog/<ülke>) aynı bileşeni kullanır: makale ekle/çıkar, sürükleyerek
 * sırala, her makalenin URL adresini başlığından türet.
 */

export interface TextItem extends RepeatableItem {
  text: string
}

export interface SubsectionItem extends RepeatableItem {
  heading: string
  quote: string
  quote_en: string
  paragraphs: TextItem[]
  bullets: TextItem[]
}

export interface ArticleItem extends RepeatableItem {
  slug: string
  kicker: string
  title: string
  excerpt: string
  intro: TextItem[]
  subsections: SubsectionItem[]
  /** Slug elle düzenlendiyse başlıktan otomatik türetme durur. */
  slugTouched: boolean
}

export const mkText = (text = ''): TextItem => ({ id: crypto.randomUUID(), text })

export const mkSubsection = (): SubsectionItem => ({
  id: crypto.randomUUID(),
  heading: '',
  quote: '',
  quote_en: '',
  paragraphs: [],
  bullets: [],
})

export const mkArticle = (): ArticleItem => ({
  id: crypto.randomUUID(),
  slug: '',
  kicker: '',
  title: '',
  excerpt: '',
  intro: [],
  subsections: [],
  slugTouched: false,
})

/** Kayıtlı makaleleri form durumuna çevirir. */
export function toArticleItems(articles: BlogArticle[]): ArticleItem[] {
  return articles.map((a) => ({
    id: crypto.randomUUID(),
    slug: a.slug,
    kicker: a.kicker,
    title: a.title,
    excerpt: a.excerpt,
    intro: a.intro.map((t) => mkText(t)),
    subsections: a.subsections.map((sub) => ({
      id: crypto.randomUUID(),
      heading: sub.heading,
      quote: sub.quote,
      quote_en: sub.quote_en,
      paragraphs: sub.paragraphs.map((t) => mkText(t)),
      bullets: sub.bullets.map((t) => mkText(t)),
    })),
    // Kayıtlı makalelerin URL'si zaten yayında; başlık değişince kendiliğinden
    // değişmemeli, aksi hâlde mevcut bağlantılar kırılır.
    slugTouched: true,
  }))
}

/** Form durumunu kaydedilecek biçime çevirir. */
export function fromArticleItems(items: ArticleItem[]): BlogArticle[] {
  return items.map((a) => ({
    slug: a.slug,
    kicker: a.kicker,
    title: a.title,
    excerpt: a.excerpt,
    intro: a.intro.map((p) => p.text).filter(Boolean),
    subsections: a.subsections.map((sub) => ({
      heading: sub.heading,
      quote: sub.quote,
      quote_en: sub.quote_en,
      paragraphs: sub.paragraphs.map((p) => p.text).filter(Boolean),
      bullets: sub.bullets.map((b) => b.text).filter(Boolean),
    })),
  }))
}

/** Kirlilik (dirty) karşılaştırması için sade anlık görüntü. */
export function articlesSnapshot(items: ArticleItem[]) {
  return items.map((a) => ({
    s: a.slug,
    k: a.kicker,
    t: a.title,
    e: a.excerpt,
    i: a.intro.map((p) => p.text),
    subs: a.subsections.map((sub) => ({
      h: sub.heading,
      q: sub.quote,
      qe: sub.quote_en,
      p: sub.paragraphs.map((p) => p.text),
      b: sub.bullets.map((b) => b.text),
    })),
  }))
}

/** Tek satırlık / çok satırlık metin listesi. */
export function TextList({
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

interface Props {
  /**
   * Blogun kimliği — 'schengen' veya ülke slug'ı. Başlıktan üretilen slug bu
   * önekle başlamıyorsa öne eklenir: makalelerin adresleri bütün bloglarda
   * ortak /blog altında olduğu için "gezi-rehberi" gibi genel bir slug iki
   * ülkede çakışırdı.
   */
  slugPrefix: string
  articles: ArticleItem[]
  onChange: (articles: ArticleItem[]) => void
  /** Alt başlık alanlarında kullanılan örnek metinler. */
  placeholders?: {
    kicker?: string
    title?: string
    slug?: string
    heading?: string
  }
  /** Ret kararı alıntı alanlarını göster (Schengen ret maddeleri yazısı için). */
  showQuoteFields?: boolean
}

export default function ArticlesEditor({
  slugPrefix,
  articles,
  onChange,
  placeholders = {},
  showQuoteFields = false,
}: Props) {
  function patchArticle(id: string, patch: Partial<ArticleItem>) {
    onChange(articles.map((a) => (a.id === id ? { ...a, ...patch } : a)))
  }

  /** Başlıktan slug türetir; gerekiyorsa blog önekini ekler. */
  function derivedSlug(title: string) {
    const base = slugifyTr(title)
    if (!base) return ''
    const prefix = slugifyTr(slugPrefix)
    return !prefix || base === prefix || base.startsWith(`${prefix}-`) ? base : `${prefix}-${base}`
  }

  /** Başlık yazılırken slug'ı da türetir — slug elle değiştirilmediyse. */
  function handleTitleChange(article: ArticleItem, title: string) {
    patchArticle(article.id, {
      title,
      ...(article.slugTouched ? {} : { slug: derivedSlug(title) }),
    })
  }

  function patchSubsection(articleId: string, subId: string, patch: Partial<SubsectionItem>) {
    onChange(
      articles.map((a) =>
        a.id === articleId
          ? {
              ...a,
              subsections: a.subsections.map((sub) =>
                sub.id === subId ? { ...sub, ...patch } : sub
              ),
            }
          : a
      )
    )
  }

  return (
    <RepeatableList<ArticleItem>
      items={articles}
      onChange={onChange}
      addLabel="Makale Ekle"
      emptyText="Henüz makale eklenmedi"
      onAdd={() => onChange([...articles, mkArticle()])}
      hasContent={(a) => !!(a.title || a.subsections.length || a.intro.length)}
      renderItem={(article, index) => (
        <div className="flex flex-col gap-6">
          <EyebrowText>— Makale {index + 1}</EyebrowText>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4">
            <AdminInput
              label="Etiket"
              value={article.kicker}
              placeholder={placeholders.kicker ?? 'Gezi rehberi'}
              onChange={(e) => patchArticle(article.id, { kicker: e.target.value })}
            />
            <AdminInput
              label="Başlık"
              value={article.title}
              placeholder={placeholders.title ?? 'Makale başlığı'}
              onChange={(e) => handleTitleChange(article, e.target.value)}
            />
          </div>

          <div>
            <AdminInput
              label="URL Adresi (slug)"
              value={article.slug}
              placeholder={placeholders.slug ?? 'makale-basligi'}
              onChange={(e) => patchArticle(article.id, { slug: e.target.value, slugTouched: true })}
              onBlur={(e) =>
                patchArticle(article.id, {
                  slug: e.target.value ? slugifyTr(e.target.value) : derivedSlug(article.title),
                })
              }
            />
            <p className="font-mono text-[11px] text-navy/60 mt-2">
              /blog/
              <span className="text-coral">
                {(article.slug ? slugifyTr(article.slug) : derivedSlug(article.title)) ||
                  'makale-adresi'}
              </span>
              {' — '}
              başlıktan otomatik doldurulur ({slugPrefix} öneki eklenir); elle değiştirdiğinizde
              sabit kalır. Adres bütün bloglarda ortak olduğu için benzersiz olmalı ve yayındaki
              bir makalenin adresini değiştirmek eski bağlantıları kırar.
            </p>
          </div>

          <AdminTextarea
            label="Özet (kapak sayfasındaki kart)"
            rows={3}
            value={article.excerpt}
            placeholder="Kapak sayfasında ve arama sonuçlarında görünen kısa özet. Boş bırakılırsa ilk giriş paragrafı kullanılır."
            onChange={(e) => patchArticle(article.id, { excerpt: e.target.value })}
          />

          <TextList
            label="Giriş Paragrafları"
            items={article.intro}
            onChange={(intro) => patchArticle(article.id, { intro })}
            addLabel="Paragraf Ekle"
            placeholder="Makalenin giriş paragrafı..."
            rows={3}
          />

          <div className="border-t border-navy/10 pt-6">
            <AdminLabel>Alt Başlıklar</AdminLabel>
            <div className="mt-1.5">
              <RepeatableList<SubsectionItem>
                items={article.subsections}
                onChange={(subsections) => patchArticle(article.id, { subsections })}
                addLabel="Alt Başlık Ekle"
                emptyText="Henüz alt başlık eklenmedi"
                onAdd={() =>
                  patchArticle(article.id, {
                    subsections: [...article.subsections, mkSubsection()],
                  })
                }
                hasContent={(sub) => !!(sub.heading || sub.paragraphs.length)}
                renderItem={(sub) => (
                  <div className="flex flex-col gap-4">
                    <AdminInput
                      label="Alt Başlık"
                      value={sub.heading}
                      placeholder={placeholders.heading ?? 'Alt başlık'}
                      onChange={(e) =>
                        patchSubsection(article.id, sub.id, { heading: e.target.value })
                      }
                    />

                    {showQuoteFields && (
                      <>
                        <AdminTextarea
                          label="Ret kararında yer alan ifade (opsiyonel)"
                          rows={2}
                          value={sub.quote}
                          placeholder="Planlanan seyahatin amacı ve koşullarına ilişkin yeterli gerekçe sunulmadı."
                          onChange={(e) =>
                            patchSubsection(article.id, sub.id, { quote: e.target.value })
                          }
                        />
                        <AdminTextarea
                          label="İngilizce orijinali (opsiyonel)"
                          rows={2}
                          value={sub.quote_en}
                          placeholder="The justification for the purpose and conditions of the intended stay was not provided."
                          onChange={(e) =>
                            patchSubsection(article.id, sub.id, { quote_en: e.target.value })
                          }
                        />
                      </>
                    )}

                    <TextList
                      label="Paragraflar"
                      items={sub.paragraphs}
                      onChange={(paragraphs) => patchSubsection(article.id, sub.id, { paragraphs })}
                      addLabel="Paragraf Ekle"
                      placeholder="Açıklama paragrafı..."
                      rows={3}
                    />
                    <TextList
                      label="Maddeler (opsiyonel)"
                      items={sub.bullets}
                      onChange={(bullets) => patchSubsection(article.id, sub.id, { bullets })}
                      addLabel="Madde Ekle"
                      placeholder="Kısa madde"
                    />
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      )}
    />
  )
}
