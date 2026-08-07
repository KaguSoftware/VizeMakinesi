import Link from 'next/link';
import { FadeIn } from '@/components/shared/motion';

export const DEFAULT_VISA_TYPES_TITLE = 'Hangi Vize Türüne Başvurmalısınız?';
export const DEFAULT_VISA_TYPES_LEAD =
  'Doğru vize türüne başvurmak, başvuru sürecinin en önemli adımlarından biridir.';
// Sabit metin; hedef, aynı ülkenin vize türleri sayfasıdır. Admin panelinde
// düzenlenmez.
const LINK_LABEL = 'Vize türlerini detaylı inceleyin';

interface Props {
  /** /vize-turleri/[countrySlug] bağlantısı için ülke slug'ı. */
  countrySlug: string;
  /** Ülkenin vize türü var mı — yoksa bölüm hiç gösterilmez. */
  hasItems: boolean;
  title?: string | null;
  lead?: string | null;
}

/**
 * /vize/[slug] sayfasındaki kısa yönlendirme bölümü. Vize türlerinin adları ve
 * açıklamaları burada listelenmez; tamamı /vize-turleri/[slug] sayfasındadır.
 */
export default function VizeTurleri({ countrySlug, hasItems, title, lead }: Props) {
  if (!hasItems) return null;

  return (
    <section className="container border-b border-border">
      <div className="pt-16 pb-16 grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-16 items-start">
        <FadeIn as="div">
          <h2 className="font-serif font-bold text-[clamp(28px,3.5vw,48px)] leading-none tracking-tight text-navy">
            {title?.trim() || DEFAULT_VISA_TYPES_TITLE}
          </h2>
        </FadeIn>

        <FadeIn as="div" delay={0.1}>
          <p className="font-serif text-[17px] leading-relaxed text-navy/70">
            {lead?.trim() || DEFAULT_VISA_TYPES_LEAD}
          </p>

          <Link
            href={`/vize-turleri/${countrySlug}#ulke-vize-turleri`}
            className="mt-4 inline-block font-serif text-[17px] text-coral underline underline-offset-4 hover:text-navy transition-colors"
          >
            {LINK_LABEL} →
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
