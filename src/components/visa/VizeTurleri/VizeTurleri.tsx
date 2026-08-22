import { FadeIn, Stagger, StaggerItem } from '@/components/shared/motion';
import VisaTypeCard from '@/components/vizeTurleri/VisaTypeCard';
import { getVisaType, guessVisaTypeIcon, isShortStayType } from '@/data/visaTypes';

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

// Sitedeki diğer bölüm başlıklarıyla aynı iki tonlu görünüm: son iki kelime
// coral italik, geri kalanı navy. Kısa başlıklar tek renk kalır.
// Bkz. GenelBilgi / BasvuruSureci.
function splitHeading(title: string): [string, string] {
  const words = title.trim().split(/\s+/);
  if (words.length < 3) return [title.trim(), ''];
  return [words.slice(0, -2).join(' '), words.slice(-2).join(' ')];
}

/**
 * /vize/[slug] sayfasındaki vize türleri bölümü. Sayfanın diğer bölümleriyle
 * aynı iki sütunlu düzeni kullanır: solda başlık ve giriş cümlesi, sağda
 * kartlar. Ülkeye özel vize türleri /vize-turleri listesiyle aynı kart
 * tasarımında gösterilir; uzun süreli (Tip D) türler bu bölümde yer almaz.
 */
export default function VizeTurleri({ items, title, lead }: Props) {
  const cards = items.filter((i) => !i.visa_type_slug || isShortStayType(i.visa_type_slug));
  if (cards.length === 0) return null;

  const [head, tail] = splitHeading(title?.trim() || DEFAULT_VISA_TYPES_TITLE);

  return (
    <section id="vize-turleri" className="container border-b border-border scroll-mt-8">
      <div className="pt-16 pb-20 grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-16 items-start">
        {/* Giriş cümlesi opsiyoneldir: boşsa yalnızca başlık gösterilir. */}
        <FadeIn as="div">
          <h2 className="font-serif font-bold text-[clamp(28px,3.5vw,48px)] leading-none tracking-tight text-navy">
            {head}
            {tail && (
              <>
                {' '}
                <em className="font-normal italic text-coral">{tail}</em>
              </>
            )}
          </h2>
          {lead?.trim() && (
            <p className="mt-5 font-serif text-[17px] leading-relaxed text-navy/70">
              {lead.trim()}
            </p>
          )}
        </FadeIn>

        <Stagger as="div" className="flex flex-col gap-3" delayChildren={0.1}>
          {cards.map((item, i) => {
            const type = item.visa_type_slug ? getVisaType(item.visa_type_slug) : undefined;
            return (
              <StaggerItem as="div" key={`${item.title}-${i}`}>
                <VisaTypeCard
                  href={type ? `/vize-turleri/${type.slug}` : undefined}
                  icon={type?.icon ?? guessVisaTypeIcon(item.title)}
                  title={item.title}
                  tag={type?.tag}
                  duration={type ? 'Kısa' : undefined}
                  description={item.description}
                />
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
