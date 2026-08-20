'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  AdminButton,
  AdminCard,
  AdminLabel,
  AdminTextarea,
  EyebrowText,
  ImageUploader,
  useToast,
} from '@/components/admin/ui'
import ArticlesEditor, {
  articlesSnapshot,
  fromArticleItems,
  toArticleItems,
  type ArticleItem,
} from '@/components/admin/blog/ArticlesEditor'
import { useDirtyFromSnapshot, useDirtyGuard, useUnsavedChanges } from '@/lib/hooks/useUnsavedChanges'
import { updateCountryBlog } from '../actions'
import type { BlogArticle } from '@/lib/blog/articles'

export interface CountryBlogInitial {
  id: string
  name: string
  slug: string
  has_tourism: boolean
  hero_image_url: string | null
  excerpt: string
  articles: BlogArticle[]
}

/**
 * Ülke blogunun düzenleyicisi — Schengen rehberiyle birebir aynı yapı:
 * kapak (yayın durumu, görsel, özet) + makale listesi.
 */
export default function CountryBlogForm({ initial }: { initial: CountryBlogInitial }) {
  const router = useRouter()
  const { showToast } = useToast()
  const { confirmDiscard } = useDirtyGuard()
  const [isPending, startTransition] = useTransition()
  const [savedAt, setSavedAt] = useState(0)

  const [published, setPublished] = useState(initial.has_tourism)
  const [heroUrl, setHeroUrl] = useState(initial.hero_image_url ?? '')
  const [excerpt, setExcerpt] = useState(initial.excerpt)
  const [articles, setArticles] = useState<ArticleItem[]>(toArticleItems(initial.articles))

  const basePath = `/blog/${initial.slug}`

  const dirty = useDirtyFromSnapshot(
    { published, heroUrl, excerpt, articles: articlesSnapshot(articles) },
    savedAt
  )

  useUnsavedChanges(dirty && !isPending)

  function handleCancel() {
    if (confirmDiscard()) router.push('/admin/blog')
  }

  function handleSave() {
    startTransition(async () => {
      const result = await updateCountryBlog(initial.id, initial.slug, {
        has_tourism: published,
        hero_image_url: heroUrl || null,
        excerpt: excerpt || null,
        articles: fromArticleItems(articles),
      })

      if (result.error) {
        showToast(result.error, 'error')
      } else {
        setSavedAt(Date.now())
        showToast('Kaydedildi', 'success')
        router.refresh()
      }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminCard>
        <EyebrowText className="mb-6">— Kapak Sayfası</EyebrowText>
        <div className="flex flex-col gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="accent-coral w-4 h-4"
            />
            <span className="font-mono text-[11px] tracking-widest uppercase text-navy/85">
              Blog sayfası yayında
            </span>
          </label>
          <p className="font-mono text-[11px] text-navy/60 -mt-3">
            Kapatıldığında {basePath} ve altındaki makaleler yayından kalkar; içerik silinmez.
          </p>

          <div className="flex flex-col gap-3">
            <AdminLabel>Kapak Görseli</AdminLabel>
            <ImageUploader
              bucket="country-tourism"
              value={heroUrl}
              onChange={setHeroUrl}
              label="Kapak Görseli"
              previewClassName="w-48 h-28"
            />
          </div>

          <AdminTextarea
            label="Kapak Özeti (hero'nun sağındaki italik metin)"
            rows={3}
            value={excerpt}
            placeholder="Boş bırakılırsa ilk makalenin özeti, o da yoksa ülkenin genel özeti kullanılır."
            onChange={(e) => setExcerpt(e.target.value)}
          />

          <p className="font-mono text-[11px] text-navy/70">
            Ülke adı ve bayrağı /admin/countries kaydından gelir.
          </p>
        </div>
      </AdminCard>

      <AdminCard>
        <EyebrowText className="mb-3">— Makaleler</EyebrowText>
        <p className="font-mono text-[11px] text-navy/70 mb-6">
          Her makale kapak sayfasında listelenir ve kendi alt sayfasında açılır. Makale ekleyip
          çıkarabilir, sürükleyerek sıralarını değiştirebilirsiniz — kapak sayfasındaki sıra ile
          makalelerin “önceki / sonraki” bağlantıları bu sırayı izler.
        </p>

        <ArticlesEditor
          basePath={basePath}
          articles={articles}
          onChange={setArticles}
          placeholders={{
            kicker: 'Gezi rehberi',
            title: `${initial.name} Gezi Rehberi`,
            slug: 'gezi-rehberi',
            heading: 'Kaçırmamanız gereken yerler',
          }}
        />
      </AdminCard>

      <div className="sticky bottom-6 flex items-center gap-4">
        <AdminButton variant="primary" onClick={handleSave} disabled={isPending}>
          {isPending ? 'Kaydediliyor…' : 'Kaydet'}
        </AdminButton>
        <AdminButton variant="secondary" onClick={handleCancel} disabled={isPending}>
          İptal
        </AdminButton>
        {dirty && !isPending && (
          <span className="font-mono text-[11px] text-coral">Kaydedilmemiş değişiklikler var</span>
        )}
      </div>
    </div>
  )
}
