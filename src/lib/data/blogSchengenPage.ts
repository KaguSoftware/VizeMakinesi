import { createPublicClient } from '@/lib/supabase/public';
import type { Database } from '@/lib/supabase/database.types';
import { BLOG_SCHENGEN_DEFAULTS, type BlogSchengenContent } from '@/data/blogSchengen';
import { normalizeArticles, type BlogArticle, type BlogSubsection } from '@/lib/blog/articles';

type BlogSchengenRow = Database['public']['Tables']['blog_schengen_page']['Row'];

function pick(value: string | null | undefined, fallback: string): string {
  return value && value.trim() ? value : fallback;
}

/**
 * Schengen rehberinin içeriği. Tablo henüz uygulanmadıysa, satır yoksa veya
 * alan boşsa rehber dokümanının varsayılan metinleri döner.
 */
export async function getBlogSchengenPage(): Promise<BlogSchengenContent> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from('blog_schengen_page')
    .select('*')
    .eq('id', 1)
    .maybeSingle();

  const row = data as BlogSchengenRow | null;
  if (!row) return BLOG_SCHENGEN_DEFAULTS;

  const d = BLOG_SCHENGEN_DEFAULTS;
  const articles = normalizeArticles(row.articles);

  return {
    hero_kicker: pick(row.hero_kicker, d.hero_kicker),
    hero_title: pick(row.hero_title, d.hero_title),
    hero_title_em: pick(row.hero_title_em, d.hero_title_em),
    hero_excerpt: pick(row.hero_excerpt, d.hero_excerpt),
    articles: articles.length > 0 ? articles : d.articles,
  };
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
