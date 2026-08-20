import { createPublicClient } from '@/lib/supabase/public';
import type { Database } from '@/lib/supabase/database.types';
import { BLOG_SCHENGEN_DEFAULTS, type BlogSchengenContent } from '@/data/blogSchengen';
import { normalizeArticles, type BlogArticle, type BlogSubsection } from '@/lib/blog/articles';

type BlogSchengenRow = Database['public']['Tables']['blog_schengen_page']['Row'];

/**
 * Schengen rehberinin makaleleri. Tablo henüz uygulanmadıysa, satır yoksa veya
 * makale listesi boşsa rehber dokümanının varsayılan metinleri döner.
 */
export async function getBlogSchengenPage(): Promise<BlogSchengenContent> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from('blog_schengen_page')
    .select('*')
    .eq('id', 1)
    .maybeSingle();

  const row = data as BlogSchengenRow | null;
  const articles = row ? normalizeArticles(row.articles) : [];

  return { articles: articles.length > 0 ? articles : BLOG_SCHENGEN_DEFAULTS.articles };
}

/** Tek bir yazı — bulunamazsa null. */
export async function getBlogSchengenArticle(
  slug: string
): Promise<{ article: BlogArticle; index: number; all: BlogArticle[] } | null> {
  const content = await getBlogSchengenPage();
  const index = content.articles.findIndex((a) => a.slug === slug);
  if (index === -1) return null;
  return { article: content.articles[index], index, all: content.articles };
}

export type { BlogSchengenContent, BlogArticle, BlogSubsection };
