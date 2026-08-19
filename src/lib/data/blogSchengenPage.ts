import { createPublicClient } from '@/lib/supabase/public';
import type { Database } from '@/lib/supabase/database.types';
import {
  BLOG_SCHENGEN_DEFAULTS,
  type BlogSchengenContent,
  type BlogSection,
  type BlogSubsection,
} from '@/data/blogSchengen';

type BlogSchengenRow = Database['public']['Tables']['blog_schengen_page']['Row'];

function str(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function strList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(str).map((s) => s.trim()).filter(Boolean);
}

/** jsonb serbest biçimlidir; yalnızca dolu ve doğru şekilli bölümler alınır. */
function toSections(value: unknown): BlogSection[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((raw) => (raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : null))
    .map((s): BlogSection => ({
      kicker: str(s?.kicker),
      title: str(s?.title),
      intro: strList(s?.intro),
      subsections: (Array.isArray(s?.subsections) ? s.subsections : [])
        .map((raw) => (raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : null))
        .map((sub): BlogSubsection => ({
          heading: str(sub?.heading),
          quote: str(sub?.quote),
          quote_en: str(sub?.quote_en),
          paragraphs: strList(sub?.paragraphs),
          bullets: strList(sub?.bullets),
        }))
        .filter((sub) => sub.heading || sub.paragraphs.length > 0),
    }))
    .filter((s) => s.title || s.subsections.length > 0);
}

function pick(value: string | null | undefined, fallback: string): string {
  return value && value.trim() ? value : fallback;
}

/**
 * /blog/schengen-vize-alma-rehberi sayfasının içeriği. Tablo henüz uygulanmadıysa,
 * satır yoksa veya alan boşsa rehber dokümanının varsayılan metinleri döner.
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
  const sections = toSections(row.sections);

  return {
    hero_kicker: pick(row.hero_kicker, d.hero_kicker),
    hero_title: pick(row.hero_title, d.hero_title),
    hero_title_em: pick(row.hero_title_em, d.hero_title_em),
    hero_excerpt: pick(row.hero_excerpt, d.hero_excerpt),
    sections: sections.length > 0 ? sections : d.sections,
  };
}

export type { BlogSchengenContent, BlogSection, BlogSubsection };
