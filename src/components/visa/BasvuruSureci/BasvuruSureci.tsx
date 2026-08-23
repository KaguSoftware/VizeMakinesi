import Link from 'next/link';
import { FadeIn } from '@/components/shared/motion';
import { splitLabeledBlocks } from '@/lib/text/labeled';

/** `text` boşken gösterilen genel açıklama. */
export const DEFAULT_PROCESS_TEXT =
  'Başvuru dosyanızı sizin adınıza baştan sona biz hazırlıyoruz: evrak listesinin çıkarılması, ' +
  'formların doldurulması, konsolosluk randevusunun alınması ve dosyanın teslimi tek bir süreç ' +
  'olarak yürütülüyor. Her aşamada nerede olduğunuzu bilir, eksik evrakla randevuya gitmezsiniz.';

/** Bölüm başlığı boşken kullanılan varsayılan başlık. */
export function defaultProcessTitle(countryName?: string): string {
  return countryName
    ? `${countryName} Vize İşlemleri Nasıl Yapılır?`
    : 'Başvuru ve Rezervasyon Nasıl Yapılır?';
}

// Diğer bölümlerle aynı iki tonlu başlık: son iki kelime coral italik.
function splitHeading(title: string): [string, string] {
  const words = title.trim().split(/\s+/);
  if (words.length < 3) return [title.trim(), ''];
  return [words.slice(0, -2).join(' '), words.slice(-2).join(' ')];
}

interface Props {
  countryName?: string;
  /** Admin panelinden yazılan bölüm başlığı. Boşsa varsayılan başlık kullanılır. */
  title?: string | null;
  /** Admin panelinden yazılan bölüm açıklaması. Boşsa varsayılan metin kullanılır. */
  text?: string | null;
}

/**
 * /vize/[slug] sayfasındaki başvuru süreci bölümü: solda bölüm başlığı,
 * sağda mini başlıklı maddeler ve altında süreç sayfasına giden bağlantı.
 */
export default function BasvuruSureci({ countryName, title, text }: Props) {
  const blocks = splitLabeledBlocks(text?.trim() || DEFAULT_PROCESS_TEXT);
  const [head, tail] = splitHeading(title?.trim() || defaultProcessTitle(countryName));

  return (
    <section className="container border-b border-border">
      <div className="pt-16 pb-20 grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-16 items-start">
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
        </FadeIn>

        <FadeIn as="div" delay={0.1}>
          {/* Maddeler admin panelinde "Mini Başlık + Açıklama" olarak girilir ve
              DB'de boş satırla ayrılmış "Başlık: açıklama" blokları olarak tutulur.
              Başlıksız bloklar düz paragraf olarak gösterilir. */}
          <div className="flex flex-col gap-7">
            {blocks.map(({ label, body }, i) => (
              <div key={i}>
                {label && (
                  <h3 className="font-serif font-semibold text-[19px] leading-snug text-navy">
                    {label}
                  </h3>
                )}
                {body && (
                  <p
                    className={`font-serif text-[17px] leading-relaxed text-navy/80 whitespace-pre-line${
                      label ? ' mt-2' : ''
                    }`}
                  >
                    {body}
                  </p>
                )}
              </div>
            ))}
          </div>

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
