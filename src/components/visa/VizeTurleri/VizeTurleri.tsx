import { FadeIn } from '@/components/shared/motion';
import VisaTypeCard from '@/components/vizeTurleri/VisaTypeCard';
import { getVisaType, isShortStayType } from '@/data/visaTypes';

export const DEFAULT_VISA_TYPES_TITLE = 'Hangi Vize Türüne Başvurmalısınız?';

export interface CountryVisaTypeItem {
  title: string;
  description: string;
  /** /vize-turleri kataloğu eşlemesi (ikon, rozet ve link kaynağı). */
  visa_type_slug: string | null;
}

interface Props {
  items: CountryVisaTypeItem[];
  title?: string | null;
  lead?: string | null;
}

/**
 * /vize/[slug] sayfasındaki vize türleri bölümü. Ülkeye özel vize türleri
 * /vize-turleri listesiyle aynı kart tasarımında gösterilir; uzun süreli
 * (Tip D) türler bu bölümde yer almaz.
 */
export default function VizeTurleri({ items, title, lead }: Props) {
  const cards = items.filter((i) => !i.visa_type_slug || isShortStayType(i.visa_type_slug));
  if (cards.length === 0) return null;

  return (
    <section id="vize-turleri" className="container border-b border-border scroll-mt-8">
      <div className="pt-16 pb-16">
        {/* Giriş cümlesi opsiyoneldir: boşsa yalnızca başlık gösterilir. */}
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-16 items-start">
          <FadeIn as="div">
            <h2 className="font-serif font-bold text-[clamp(28px,3.5vw,48px)] leading-none tracking-tight text-navy">
              {title?.trim() || DEFAULT_VISA_TYPES_TITLE}
            </h2>
          </FadeIn>

          {lead?.trim() && (
            <FadeIn as="div" delay={0.1}>
              <p className="font-serif text-[17px] leading-relaxed text-navy/70">
                {lead.trim()}
              </p>
            </FadeIn>
          )}
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-3">
          {cards.map((item, i) => {
            const type = item.visa_type_slug ? getVisaType(item.visa_type_slug) : undefined;
            return (
              <FadeIn key={`${item.title}-${i}`} as="div" delay={i * 0.05}>
                <VisaTypeCard
                  href={type ? `/vize-turleri/${type.slug}` : undefined}
                  icon={type?.icon}
                  title={item.title}
                  tag={type?.tag}
                  duration={type ? 'Kısa' : undefined}
                  description={item.description}
                />
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
