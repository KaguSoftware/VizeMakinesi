import { cache } from 'react';
import { createPublicClient } from '@/lib/supabase/public';
import { normalizeArticles, type BlogArticle } from '@/lib/blog/articles';

/**
 * Ülke blog sayfalarının veri katmanı.
 *
 * Kapak sayfası yoktur: makaleler /blog akışında listelenir ve her biri
 * /blog/<ülke>/<slug> adresinde kendi sayfasında açılır. İçerik
 * `countries.blog_articles` jsonb sütununda tutulur; yayın bayrağı
 * `has_tourism`, paylaşım görseli `tourism_hero_image_url` sütunudur.
 */

const BLOG_COLUMNS =
  'id, name, slug, flag_emoji, flag_preset_key, flag_image_url, has_tourism, tourism_hero_image_url, blog_articles';

interface CountryBlogRow {
  id: string;
  name: string;
  slug: string;
  flag_emoji: string | null;
  flag_preset_key: string | null;
  flag_image_url: string | null;
  has_tourism: boolean;
  tourism_hero_image_url: string | null;
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
  articles: BlogArticle[];
}

function fromRow(row: CountryBlogRow): CountryBlog {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    flagEmoji: row.flag_emoji,
    flagPresetKey: row.flag_preset_key,
    flagImageUrl: row.flag_image_url,
    heroImageUrl: row.tourism_hero_image_url,
    articles: normalizeArticles(row.blog_articles),
  };
}

/** Yayındaki bir ülke blogu — yayında değilse veya yoksa null. */
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

/** Yayındaki tüm ülke blogları — /blog akışı için. */
export async function getPublishedCountryBlogs(): Promise<CountryBlog[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from('countries')
    .select(BLOG_COLUMNS)
    .eq('has_tourism', true)
    .order('name');

  return ((data ?? []) as CountryBlogRow[]).map(fromRow);
}
