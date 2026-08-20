import { cache } from 'react';
import { createPublicClient } from '@/lib/supabase/public';
import { createStaticClient } from '@/lib/supabase/static';
import { normalizeArticles, type BlogArticle } from '@/lib/blog/articles';

/**
 * Ülke blog sayfalarının veri katmanı.
 *
 * Schengen rehberiyle aynı yapı: /blog/<ülke> kapak sayfası makaleleri
 * listeler, her makale /blog/<ülke>/<slug> adresinde kendi sayfasında açılır.
 * İçerik `countries.blog_articles` jsonb sütununda tutulur, yayın bayrağı
 * `has_tourism`, kapak görseli `tourism_hero_image_url` sütunudur.
 */

const BLOG_COLUMNS =
  'id, name, slug, summary, flag_emoji, flag_preset_key, flag_image_url, has_tourism, tourism_hero_image_url, blog_excerpt, blog_articles';

interface CountryBlogRow {
  id: string;
  name: string;
  slug: string;
  summary: string | null;
  flag_emoji: string | null;
  flag_preset_key: string | null;
  flag_image_url: string | null;
  has_tourism: boolean;
  tourism_hero_image_url: string | null;
  blog_excerpt: string | null;
  blog_articles: unknown;
}

export interface CountryBlog {
  id: string;
  name: string;
  slug: string;
  flagEmoji: string | null;
  flagPresetKey: string | null;
  flagImageUrl: string | null;
  heroImageUrl: string | null;
  excerpt: string;
  articles: BlogArticle[];
}

function fromRow(row: CountryBlogRow): CountryBlog {
  const articles = normalizeArticles(row.blog_articles);
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    flagEmoji: row.flag_emoji,
    flagPresetKey: row.flag_preset_key,
    flagImageUrl: row.flag_image_url,
    heroImageUrl: row.tourism_hero_image_url,
    // Hero özeti boşsa ilk makalenin özetine, o da yoksa ülke özetine düşer.
    excerpt:
      row.blog_excerpt?.trim() ||
      articles[0]?.excerpt ||
      articles[0]?.intro[0] ||
      row.summary ||
      '',
    articles,
  };
}

/** Yayındaki bir ülke blogu — kapalıysa veya yoksa null. */
export const getCountryBlog = cache(async (slug: string): Promise<CountryBlog | null> => {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from('countries')
    .select(BLOG_COLUMNS)
    .eq('slug', slug)
    .eq('has_tourism', true)
    .maybeSingle();

  const row = data as CountryBlogRow | null;
  return row ? fromRow(row) : null;
});

/** Tek bir makale ve akıştaki komşuları — bulunamazsa null. */
export async function getCountryBlogArticle(
  countrySlug: string,
  articleSlug: string
): Promise<{ country: CountryBlog; article: BlogArticle; index: number } | null> {
  const country = await getCountryBlog(countrySlug);
  if (!country) return null;

  const index = country.articles.findIndex((a) => a.slug === articleSlug);
  if (index === -1) return null;

  return { country, article: country.articles[index], index };
}

/** Yayındaki tüm ülke blogları — blog akışı için. */
export async function getPublishedCountryBlogs(): Promise<CountryBlog[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from('countries')
    .select(BLOG_COLUMNS)
    .eq('has_tourism', true)
    .order('name');

  return ((data ?? []) as CountryBlogRow[]).map(fromRow);
}

/**
 * Build sırasında üretilecek makale yolları. Cookie okumayan static client
 * kullanır — generateStaticParams içinden çağrılır.
 */
export async function getCountryBlogParamsStatic(): Promise<
  { countrySlug: string; articleSlug: string }[]
> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from('countries')
    .select('slug, blog_articles')
    .eq('has_tourism', true);
  if (error) throw error;

  return ((data ?? []) as { slug: string; blog_articles: unknown }[]).flatMap((row) =>
    normalizeArticles(row.blog_articles).map((article) => ({
      countrySlug: row.slug,
      articleSlug: article.slug,
    }))
  );
}
