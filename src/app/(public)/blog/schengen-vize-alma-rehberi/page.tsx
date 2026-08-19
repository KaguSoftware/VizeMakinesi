import Link from 'next/link';
import type { Metadata } from 'next';
import { SCHENGEN_GUIDE } from '@/data/schengenGuide';
import { getBlogSchengenPage } from '@/lib/data/blogSchengenPage';
import { readingMinutes } from '@/lib/text/readingTime';
import GuideSections, { type GuideSectionItem } from '@/components/blog/GuideSections';

export const revalidate = 3600;

const TITLE = 'Schengen Vizesi Rehberi — Ret Nedenleri, Ret Maddeleri ve İlk Başvuru';
const DESCRIPTION =
  'Schengen vize reddinin nedenleri, ret formundaki maddelerin ne anlama geldiği, ret sonrasında itiraz ve yeniden başvuru yolları ile ilk Schengen başvurusunun adımları.';
const URL = `https://vizemakinesi.com${SCHENGEN_GUIDE.href}`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: 'Vize Makinesi',
    locale: 'tr_TR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

/** Bölüm başlığından "#ret-maddeleri" gibi bir çapa üretir. */
function anchorOf(title: string, index: number): string {
  const slug = title
    .toLocaleLowerCase('tr')
    .replace(/[ıİ]/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug ? `${index + 1}-${slug}` : `bolum-${index + 1}`;
}

export default async function SchengenGuidePage() {
  const content = await getBlogSchengenPage();

  // Okuma süreleri sunucuda hesaplanır — istemciye yalnızca sonuç gider.
  const sections: GuideSectionItem[] = content.sections.map((section, i) => ({
    ...section,
    anchor: anchorOf(section.title, i),
    minutes: readingMinutes([
      section.title,
      ...section.intro,
      ...section.subsections.flatMap((sub) => [
        sub.heading,
        sub.quote,
        ...sub.paragraphs,
        ...sub.bullets,
      ]),
    ]),
  }));
  const totalMinutes = sections.reduce((sum, s) => sum + s.minutes, 0);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${content.hero_title}${content.hero_title_em}`.trim(),
    description: DESCRIPTION,
    url: URL,
    inLanguage: 'tr',
    articleSection: content.sections.map((s) => s.title),
    publisher: {
      '@type': 'Organization',
      name: 'Vize Makinesi',
      url: 'https://vizemakinesi.com',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="pt-16 pb-14 border-b border-border relative overflow-hidden">
        <div className="container relative z-10">
          <div className="font-mono text-[11px] tracking-[0.15em] text-muted uppercase mb-10">
            —{' '}
            <Link href="/blog" className="hover:text-coral transition-colors">
              Blog
            </Link>
            &nbsp;/&nbsp;Başvuru Rehberi&nbsp;/&nbsp;Schengen
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[8fr_4fr] gap-[60px] items-end">
            <div>
              <div className="text-[80px] leading-none mb-7">{SCHENGEN_GUIDE.flagEmoji}</div>
              <div className="inline-block border border-navy px-4 py-2 font-mono font-medium text-[10px] uppercase tracking-[0.15em] mb-7">
                — {content.hero_kicker}
              </div>
              {/* Başlık ölçüsü kasıtlı olarak sayfanın geri kalanından küçüktür. */}
              <h1 className="font-serif font-bold text-[clamp(33px,5.25vw,82px)] leading-[0.92] tracking-[-0.04em]">
                {content.hero_title}
                <em className="font-normal italic text-coral">{content.hero_title_em}</em>
              </h1>
            </div>
            <div>
              <p className="font-serif italic text-[20px] leading-relaxed text-navy">
                {content.hero_excerpt}
              </p>
            </div>
          </div>

          {/* Okuma süresi özeti — bölüm listesi aşağıdaki açılır başlıklardır. */}
          <div className="mt-12 pt-6 border-t border-border flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[10px] tracking-[0.2em] uppercase text-muted">
            <span>{sections.length} bölüm</span>
            <span aria-hidden className="text-border">/</span>
            <span>Toplam ~{totalMinutes} dk okuma</span>
          </div>
        </div>
      </section>

      {/* Bölümler — her kırmızı başlık kendi açılır bölümü */}
      <GuideSections sections={sections} />

      {/* CTA */}
      <section className="cta-block mt-30 bg-navy text-white">
        <div className="container">
          <div className="py-24 md:py-30 relative z-10">
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-coral mb-12 pb-4 border-b border-white/30">
              — Sıra sizde
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-12 lg:gap-20 items-end">
              <h2 className="font-serif font-bold text-[clamp(40px,6vw,88px)] leading-[0.96] tracking-[-0.035em] text-white">
                Size hangi belgelerin gerektiğini{' '}
                <em className="text-coral font-normal italic">birlikte belirleyelim.</em>
              </h2>
              <div>
                <Link
                  href="/danisma-al"
                  className="block w-full text-center font-sans font-medium text-[13px] uppercase tracking-widest px-8 py-5.5 bg-cream border border-cream text-coral hover:bg-navy hover:text-cream hover:border-cream transition-all duration-200 rounded-2xl"
                >
                  Ücretsiz danışma al →
                </Link>
                <Link
                  href="/blog"
                  className="block w-full text-center font-sans font-medium text-[13px] uppercase tracking-widest px-8 py-5.5 mt-3 border border-white/40 text-white hover:bg-cream hover:text-coral hover:border-cream transition-all duration-200 rounded-2xl"
                >
                  Diğer yazılar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
