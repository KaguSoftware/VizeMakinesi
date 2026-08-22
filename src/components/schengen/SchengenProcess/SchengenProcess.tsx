import Link from 'next/link';
import { FadeIn } from '@/components/shared/motion';

interface Props {
  /** Bölüm başlığı; son iki kelimesi coral italik gösterilir. */
  title: string;
  /** Bölüm açıklaması; admin panelinde boş satırla paragraflara ayrılır. */
  description?: string;
}

// Diğer bölümlerle aynı iki tonlu başlık: son iki kelime coral italik.
function splitHeading(title: string): [string, string] {
  const words = title.trim().split(/\s+/);
  if (words.length < 3) return [title.trim(), ''];
  return [words.slice(0, -2).join(' '), words.slice(-2).join(' ')];
}

/**
 * Schengen başvuru süreci bölümü — ülke sayfalarındaki `BasvuruSureci` ile
 * birebir aynı düzen: solda bölüm başlığı, sağda bölüm açıklaması ve altında
 * süreç sayfasına giden bağlantı.
 */
export default function SchengenProcess({ title, description }: Props) {
  const body = description?.trim();
  const [head, tail] = splitHeading(title);

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
