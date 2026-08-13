import Link from 'next/link';
import type { Metadata } from 'next';
import { SCHENGEN_GUIDE, SCHENGEN_GUIDE_STEPS } from '@/data/schengenGuide';

export const revalidate = 3600;

const TITLE = 'Schengen Bölgesi Vize Alma Rehberi — Vize Makinesi Blog';
const DESCRIPTION =
  'İlk Schengen vize başvurunuzu adım adım: hangi ülkeye başvurulur, hangi kategori seçilir, evraklar nasıl hazırlanır ve süreç nasıl ilerler?';
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

export default function SchengenGuidePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Schengen Bölgesi Vize Alma Rehberi',
    description: DESCRIPTION,
    url: URL,
    inLanguage: 'tr',
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
                — Başvuru rehberi
              </div>
              <h1 className="font-serif font-bold text-[clamp(44px,7vw,110px)] leading-[0.92] tracking-[-0.04em]">
                Schengen bölgesi
                <em className="font-normal italic text-coral"> vize alma rehberi</em>
              </h1>
            </div>
            <div>
              <p className="font-serif italic text-[20px] leading-relaxed text-navy">
                {SCHENGEN_GUIDE.excerpt}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Adımlar */}
      {SCHENGEN_GUIDE_STEPS.map((step, i) => (
        <section className="container" key={step.title}>
          <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 lg:gap-20 py-16 md:py-20 border-b border-border">
            <div>
              <div className="font-mono text-[10px] tracking-[0.2em] text-coral uppercase mb-6">
                — {String(i + 1).padStart(2, '0')} / Adım
              </div>
              <h2 className="font-serif font-bold text-[clamp(32px,4.5vw,56px)] leading-none tracking-tight">
                {step.title}
              </h2>
            </div>
            <div className="space-y-6 text-[16px] leading-[1.85] text-navy">
              {step.paragraphs.map((paragraph, j) => (
                <p key={j}>{paragraph}</p>
              ))}
              {step.bullets && (
                <ul className="space-y-3 pt-2">
                  {step.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-4 border-t border-border pt-3">
                      <span className="font-mono text-[11px] text-coral leading-[1.9]">—</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      ))}

      {/* Kapanış */}
      <section className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 lg:gap-20 py-16 md:py-20 border-b border-border">
          <div>
            <div className="font-mono text-[10px] tracking-[0.2em] text-coral uppercase mb-6">
              — Kısaca
            </div>
            <h2 className="font-serif font-bold text-[clamp(32px,4.5vw,56px)] leading-none tracking-tight">
              İlk başvurunuz<br />için özet.
            </h2>
          </div>
          <div className="space-y-6 text-[16px] leading-[1.85] text-navy">
            <p>
              Önce seyahatinizi netleştirin. Ardından doğru vize kategorisini ve başvuru ülkesini
              belirleyin. Kendi durumunuza uygun belgeleri hazırlayın, seyahat planınızla uyumlu bir
              dosya oluşturun ve başvurunuzu zamanında tamamlayın.
            </p>
            <p>
              İlk başvurunuzda önemli olan yalnızca gerekli belgeleri toplamak değil; seyahatinizi,
              kişisel durumunuzu ve sunduğunuz belgeleri birbirini destekleyen tutarlı bir bütün
              haline getirmektir.
            </p>
          </div>
        </div>
      </section>

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
