import { slugifyTr } from '@/lib/text/slug';
import { readingMinutes } from '@/lib/text/readingTime';

/**
 * Blog yazılarının ortak biçimi.
 *
 * Hem Schengen rehberi (`blog_schengen_page.articles`) hem de ülke blogları
 * (`countries.blog_articles`) aynı yapıyı kullanır: bir kapak sayfası yazıları
 * listeler, her yazı kendi alt sayfasında açılır. Bu dosya iki tarafın da
 * paylaştığı tipleri, jsonb normalizasyonunu ve okuma süresi hesabını tutar.
 */

/** Yazı içindeki alt başlık. */
export interface BlogSubsection {
  heading: string;
  /** Ret kararında yer alan Türkçe ifade (yalnızca ret maddeleri yazısında). */
  quote: string;
  /** Aynı ifadenin İngilizce orijinali. */
  quote_en: string;
  paragraphs: string[];
  bullets: string[];
}

/** Kapak sayfasında listelenen, kendi alt sayfası olan bir yazı. */
export interface BlogArticle {
  /** URL parçası — <kapak yolu>/<slug>. */
  slug: string;
  /** Yazının üstündeki küçük etiket, örn. "Ret gerekçeleri". */
  kicker: string;
  title: string;
  /** Kapak kartında görünen özet. Boşsa ilk giriş paragrafı kullanılır. */
  excerpt: string;
  /** Alt başlıklardan önce gelen giriş paragrafları. */
  intro: string[];
  subsections: BlogSubsection[];
}

function str(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function strList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(str).map((s) => s.trim()).filter(Boolean);
}

/**
 * jsonb serbest biçimlidir; yalnızca dolu ve doğru şekilli yazılar alınır.
 * Slug'ı olmayan kayıtlar başlıktan türetilir, çakışanlara sıra eki verilir —
 * böylece iki yazı asla aynı URL'ye düşmez.
 */
export function normalizeArticles(value: unknown): BlogArticle[] {
  if (!Array.isArray(value)) return [];

  const seen = new Set<string>();

  return value
    .map((raw) => (raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : null))
    .map((a): BlogArticle => {
      const title = str(a?.title);
      let slug = slugifyTr(str(a?.slug) || title) || 'yazi';
      while (seen.has(slug)) slug = `${slug}-2`;
      seen.add(slug);

      return {
        slug,
        kicker: str(a?.kicker),
        title,
        excerpt: str(a?.excerpt),
        intro: strList(a?.intro),
        subsections: (Array.isArray(a?.subsections) ? a.subsections : [])
          .map((raw) => (raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : null))
          .map((sub): BlogSubsection => ({
            heading: str(sub?.heading),
            quote: str(sub?.quote),
            quote_en: str(sub?.quote_en),
            paragraphs: strList(sub?.paragraphs),
            bullets: strList(sub?.bullets),
          }))
          .filter((sub) => sub.heading || sub.paragraphs.length > 0),
      };
    })
    .filter((a) => a.title || a.subsections.length > 0);
}

/** Bir yazının tüm metnine göre tahmini okuma süresi (dakika). */
export function articleMinutes(article: BlogArticle): number {
  return readingMinutes([
    article.title,
    ...article.intro,
    ...article.subsections.flatMap((sub) => [
      sub.heading,
      sub.quote,
      ...sub.paragraphs,
      ...sub.bullets,
    ]),
  ]);
}

/** Kapak kartında gösterilecek özet — boşsa ilk giriş paragrafına düşer. */
export function articleSummary(article: BlogArticle): string {
  return article.excerpt || article.intro[0] || '';
}

/** Blog akışındaki kart listesi için sadeleştirilmiş makale satırları. */
export function articleTeasers(articles: BlogArticle[]) {
  return articles.map((article) => ({
    slug: article.slug,
    title: article.title,
    kicker: article.kicker,
    minutes: articleMinutes(article),
  }));
}
