'use client'

import { useState, useTransition } from 'react'
import { AdminButton, AdminCard, EyebrowText, useToast } from '@/components/admin/ui'
import ArticlesEditor, {
  articlesSnapshot,
  fromArticleItems,
  toArticleItems,
  type ArticleItem,
} from '@/components/admin/blog/ArticlesEditor'
import { useDirtyFromSnapshot, useUnsavedChanges } from '@/lib/hooks/useUnsavedChanges'
import { updateBlogSchengenPage } from './actions'
import type { BlogSchengenContent } from '@/data/blogSchengen'

export default function BlogSchengenForm({ initial }: { initial: BlogSchengenContent }) {
  const { showToast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [savedAt, setSavedAt] = useState(0)

  const [articles, setArticles] = useState<ArticleItem[]>(toArticleItems(initial.articles))

  const dirty = useDirtyFromSnapshot(
    {
      articles: articlesSnapshot(articles),
    },
    savedAt
  )

  useUnsavedChanges(dirty && !isPending)

  function handleSave() {
    startTransition(async () => {
      const result = await updateBlogSchengenPage({
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
        <EyebrowText className="mb-3">— Makaleler</EyebrowText>
        <p className="font-mono text-[11px] text-navy/70 mb-6">
          Makaleler /blog akışında listelenir ve her biri kendi sayfasında açılır. Makale ekleyip
          çıkarabilir, sürükleyerek sıralarını değiştirebilirsiniz — akıştaki sıra
          ve makalelerin “önceki / sonraki” bağlantıları bu sırayı izler.
        </p>

        <ArticlesEditor
          slugPrefix="schengen"
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
