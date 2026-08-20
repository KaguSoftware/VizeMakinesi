'use client'

import { useState, useTransition } from 'react'
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminTextarea,
  EyebrowText,
  useToast,
} from '@/components/admin/ui'
import ArticlesEditor, {
  articlesSnapshot,
  fromArticleItems,
  toArticleItems,
  type ArticleItem,
} from '@/components/admin/blog/ArticlesEditor'
import { useDirtyFromSnapshot, useUnsavedChanges } from '@/lib/hooks/useUnsavedChanges'
import { updateBlogSchengenPage } from './actions'
import type { BlogSchengenContent } from '@/data/blogSchengen'

/** Makalelerin yayınlandığı kök yol — slug bunun altına eklenir. */
const BASE_PATH = '/blog/schengen-vize-alma-rehberi'

export default function BlogSchengenForm({ initial }: { initial: BlogSchengenContent }) {
  const { showToast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [savedAt, setSavedAt] = useState(0)

  const [heroKicker, setHeroKicker] = useState(initial.hero_kicker)
  const [heroTitle, setHeroTitle] = useState(initial.hero_title)
  const [heroTitleEm, setHeroTitleEm] = useState(initial.hero_title_em)
  const [heroExcerpt, setHeroExcerpt] = useState(initial.hero_excerpt)
  const [articles, setArticles] = useState<ArticleItem[]>(toArticleItems(initial.articles))

  const dirty = useDirtyFromSnapshot(
    {
      heroKicker,
      heroTitle,
      heroTitleEm,
      heroExcerpt,
      articles: articlesSnapshot(articles),
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
        articles: fromArticleItems(articles),
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
        <EyebrowText className="mb-6">— Kapak Sayfası</EyebrowText>
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
        <EyebrowText className="mb-3">— Makaleler</EyebrowText>
        <p className="font-mono text-[11px] text-navy/70 mb-6">
          Her makale kapak sayfasında listelenir ve kendi alt sayfasında açılır. Makale ekleyip
          çıkarabilir, sürükleyerek sıralarını değiştirebilirsiniz — kapak sayfasındaki sıra ile
          makalelerin “önceki / sonraki” bağlantıları bu sırayı izler.
        </p>

        <ArticlesEditor
          basePath={BASE_PATH}
          articles={articles}
          onChange={setArticles}
          showQuoteFields
          placeholders={{
            kicker: 'Ret gerekçeleri',
            title: 'Schengen Vize Reddi Nedenleri',
            slug: 'schengen-vize-reddi-nedenleri',
            heading: '1. Seyahat Amacının Yeterince Açıklanamaması',
          }}
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
