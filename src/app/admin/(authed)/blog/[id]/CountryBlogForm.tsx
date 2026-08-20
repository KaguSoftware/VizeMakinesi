'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  AdminButton,
  AdminCard,
  AdminLabel,
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
  articles: BlogArticle[]
}

/**
 * Ülke blogunun düzenleyicisi — Schengen rehberiyle aynı yapı: yayın durumu,
 * paylaşım görseli ve makale listesi.
 */
export default function CountryBlogForm({ initial }: { initial: CountryBlogInitial }) {
  const router = useRouter()
  const { showToast } = useToast()
  const { confirmDiscard } = useDirtyGuard()
  const [isPending, startTransition] = useTransition()
  const [savedAt, setSavedAt] = useState(0)

  const [published, setPublished] = useState(initial.has_tourism)
  const [heroUrl, setHeroUrl] = useState(initial.hero_image_url ?? '')
  const [articles, setArticles] = useState<ArticleItem[]>(toArticleItems(initial.articles))

  const dirty = useDirtyFromSnapshot(
    { published, heroUrl, articles: articlesSnapshot(articles) },
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
        <EyebrowText className="mb-6">— Yayın</EyebrowText>
        <div className="flex flex-col gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="accent-coral w-4 h-4"
            />
            <span className="font-mono text-[11px] tracking-widest uppercase text-navy/85">
              Makaleler yayında
            </span>
          </label>
          <p className="font-mono text-[11px] text-navy/60 -mt-3">
            Kapatıldığında bu ülkenin makaleleri /blog akışından ve kendi sayfalarından kalkar;
            içerik silinmez.
          </p>

          <div className="flex flex-col gap-3">
            <AdminLabel>Paylaşım Görseli</AdminLabel>
            <ImageUploader
              bucket="country-tourism"
              value={heroUrl}
              onChange={setHeroUrl}
              label="Paylaşım Görseli"
              previewClassName="w-48 h-28"
            />
            <p className="font-mono text-[11px] text-navy/60">
              Makale bağlantısı sosyal medyada paylaşıldığında görünen görsel.
            </p>
          </div>
        </div>
      </AdminCard>

      <AdminCard>
        <EyebrowText className="mb-3">— Makaleler</EyebrowText>
        <p className="font-mono text-[11px] text-navy/70 mb-6">
          Makaleler /blog akışında listelenir ve her biri kendi sayfasında açılır. Makale ekleyip
          çıkarabilir, sürükleyerek sıralarını değiştirebilirsiniz — akıştaki sıra ve makalelerin
          “önceki / sonraki” bağlantıları bu sırayı izler.
        </p>

        <ArticlesEditor
          slugPrefix={initial.slug}
          articles={articles}
          onChange={setArticles}
          placeholders={{
            kicker: 'Gezi rehberi',
            title: `${initial.name} Gezi Rehberi`,
            slug: `${initial.slug}-gezi-rehberi`,
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
