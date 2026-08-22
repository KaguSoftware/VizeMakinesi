import Link from 'next/link';
import { FadeIn } from '@/components/shared/motion';

/** `process_text` boşken gösterilen genel metin. */
export const DEFAULT_PROCESS_TEXT =
  'Başvuru dosyanızı sizin adınıza baştan sona biz hazırlıyoruz: evrak listesinin çıkarılması, ' +
  'formların doldurulması, konsolosluk randevusunun alınması ve dosyanın teslimi tek bir süreç ' +
  'olarak yürütülüyor. Her aşamada nerede olduğunuzu bilir, eksik evrakla randevuya gitmezsiniz.';

interface Props {
  countryName?: string;
  /** Admin panelinden yazılan süreç paragrafı. Boşsa varsayılan metin kullanılır. */
  text?: string | null;
}

/**
 * /vize/[slug] sayfasındaki "… Vize İşlemleri nasıl yapılır?" bölümü.
 * Solda başlık ve giriş cümlesi, sağda admin panelinden yönetilen paragraf ve
 * onun altında süreç sayfasına giden bağlantı yer alır.
 */
export default function BasvuruSureci({ countryName, text }: Props) {
  const body = text?.trim() || DEFAULT_PROCESS_TEXT;

  return (
    <section className="container border-b border-border">
      <div className="pt-16 pb-20 grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-16 items-start">
        <FadeIn as="div">
          <h2 className="font-serif font-bold text-[clamp(28px,3.5vw,48px)] leading-none tracking-tight text-navy mb-6">
            {countryName ? `${countryName} Vize İşlemleri` : 'Başvuru ve rezervasyon'}<br />
            <em className="font-normal italic text-coral">nasıl yapılır?</em>
          </h2>
          <p className="font-serif italic text-[18px] text-navy/70 leading-relaxed max-w-sm">
            İlk görüşmeden pasaport teslimine kadar her adımı biz yönetiyoruz. Hiçbir ayrıntı gözden kaçmaz.
          </p>
        </FadeIn>

        <FadeIn as="div" delay={0.1}>
          {/* Paragraflar admin panelinde boş satırla ayrılır. */}
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
