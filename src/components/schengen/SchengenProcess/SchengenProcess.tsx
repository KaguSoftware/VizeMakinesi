import Link from 'next/link';
import { FadeIn } from '@/components/shared/motion';

interface Props {
  /** Başlığın ilk satırı — koyu (navy). İkinci satır ("nasıl yapılır?") sabittir. */
  title: string;
  /** Sol sütundaki italik giriş cümlesi. */
  lead?: string;
  /** Sağ sütundaki paragraf(lar); admin panelinde boş satırla ayrılır. */
  description?: string;
}

/**
 * "Schengen Vize İşlemleri nasıl yapılır?" — ülke sayfalarındaki
 * `BasvuruSureci` ile birebir aynı düzen: solda iki satırlık başlık ve italik
 * giriş cümlesi, sağda admin panelinden yönetilen paragraf ve altında süreç
 * sayfasına giden bağlantı.
 */
export default function SchengenProcess({ title, lead, description }: Props) {
  const body = description?.trim();

  return (
    <section className="container border-b border-border">
      <div className="pt-16 pb-20 grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-16 items-start">
        <FadeIn as="div">
          <h2 className="font-serif font-bold text-[clamp(28px,3.5vw,48px)] leading-none tracking-tight text-navy mb-6">
            {title}
            <br />
            <em className="font-normal italic text-coral">nasıl yapılır?</em>
          </h2>
          {lead?.trim() && (
            <p className="font-serif italic text-[18px] text-navy/70 leading-relaxed max-w-sm">
              {lead}
            </p>
          )}
        </FadeIn>

        <FadeIn as="div" delay={0.1}>
          {body && (
            <div className="flex flex-col gap-5">
              {body
                .split(/\n\s*\n/)
                .map((p) => p.trim())
                .filter(Boolean)
                .map((paragraph, i) => (
                  <p
                    key={i}
                    className="font-serif text-[17px] leading-relaxed text-navy/80 whitespace-pre-line"
                  >
                    {paragraph}
                  </p>
                ))}
            </div>
          )}

          <Link
            href="/nasil-calisiriz"
            className="mt-8 inline-flex items-center gap-2 font-sans font-medium text-[13px] uppercase tracking-[0.15em] text-navy hover:text-coral transition-colors duration-200"
          >
            Süreci Detaylı İnceleyin →
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
