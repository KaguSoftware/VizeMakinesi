import { getBlogSchengenPage } from '@/lib/data/blogSchengenPage';
import { getPublishedCountryBlogs } from '@/lib/data/countryBlog';
import { SCHENGEN_GUIDE } from '@/data/schengenGuide';
import type { BlogArticle } from '@/lib/blog/articles';

/**
 * Blogun tek dizini.
 *
 * Makaleler artık kapak sayfalarının altında değil, doğrudan /blog/<slug>
 * adresinde yayınlanır. Slug'lar bloglar arasında da benzersiz olmak zorunda
 * (bkz. src/lib/admin/blogArticles.ts) — bu modül Schengen rehberi ile yayında
 * olan ülke bloglarını tek listede birleştirir.
 */

/** Makalenin ait olduğu blog. */
export interface BlogSource {
  /** Kaynağın kimliği: 'schengen' veya ülke slug'ı. */
  key: string;
  /** Listede ve künyede görünen ad. */
  name: string;
  emoji: string | null;
  flagPresetKey: string | null;
  flagImageUrl: string | null;
  /** Paylaşım (OG) görseli. */
  imageUrl: string | null;
}

export interface BlogArticleEntry {
  article: BlogArticle;
  source: BlogSource;
}

const SCHENGEN_SOURCE: BlogSource = {
  key: 'schengen',
  name: 'Schengen',
  emoji: SCHENGEN_GUIDE.flagEmoji,
  flagPresetKey: 'schengen',
  flagImageUrl: null,
  imageUrl: null,
};

/** Yayındaki bütün makaleler: önce Schengen rehberi, sonra ülke blogları. */
export async function getBlogArticleEntries(): Promise<BlogArticleEntry[]> {
  const [schengen, countryBlogs] = await Promise.all([
    getBlogSchengenPage(),
    getPublishedCountryBlogs(),
  ]);

  return [
    ...schengen.articles.map((article) => ({ article, source: SCHENGEN_SOURCE })),
    ...countryBlogs.flatMap((blog) =>
      blog.articles.map((article) => ({
        article,
        source: {
          key: blog.slug,
          name: blog.name,
          emoji: blog.flagEmoji,
          flagPresetKey: blog.flagPresetKey,
          flagImageUrl: blog.flagImageUrl,
          imageUrl: blog.heroImageUrl,
        },
      }))
    ),
  ];
}

export interface BlogArticleView extends BlogArticleEntry {
  /** Kaynağı içindeki sırası — künyedeki 01 / 02 numarası. */
  index: number;
  prev: BlogArticle | null;
  next: BlogArticle | null;
}

/** Tek bir makale, aynı blogdaki komşularıyla birlikte — yoksa null. */
export async function getBlogArticle(slug: string): Promise<BlogArticleView | null> {
  const entries = await getBlogArticleEntries();
  const entry = entries.find((e) => e.article.slug === slug);
  if (!entry) return null;

  // Önceki / sonraki bağlantıları aynı blogun içinde kalır.
  const siblings = entries.filter((e) => e.source.key === entry.source.key).map((e) => e.article);
  const index = siblings.findIndex((a) => a.slug === slug);

  return {
    ...entry,
    index,
    prev: index > 0 ? siblings[index - 1] : null,
    next: index < siblings.length - 1 ? siblings[index + 1] : null,
  };
}

/** Build sırasında üretilecek makale yolları. */
export async function getBlogArticleSlugs(): Promise<string[]> {
  const entries = await getBlogArticleEntries();
  return entries.map((e) => e.article.slug);
}

/**
 * Bir blogun dışındaki bütün makale slug'ları — admin tarafında benzersizlik
 * denetimi için. Kaynak anahtarı 'schengen' veya ülke slug'ıdır.
 */
export async function getBlogSlugsExcept(sourceKey: string): Promise<string[]> {
  const entries = await getBlogArticleEntries();
  return entries.filter((e) => e.source.key !== sourceKey).map((e) => e.article.slug);
}
