import Link from 'next/link';

export interface ArticleRow {
  /** Makalenin kendi sayfası. */
  href: string;
  title: string;
  kicker: string;
  minutes: number;
  headingCount: number;
  /** Makalenin ait olduğu blog — "Schengen", "Almanya" gibi. */
  source: string;
  sourceEmoji: string | null;
}

/**
 * Blog akışı: bütün makaleler tek sütunda, satır satır.
 *
 * Kapak sayfaları kaldırıldığı için makalelerin tek giriş noktası burasıdır;
 * her satır doğrudan makalenin sayfasına gider. Liste yirmiyi aşan makalede de
 * taranabilir kalsın diye satırlar başlık + künye ile sınırlıdır; özet
 * makalenin kendi sayfasında yer alır.
 */
export default function ArticleList({ rows }: { rows: ArticleRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="py-20 border-t border-border">
        <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-muted">
          — Henüz makale yayınlanmadı.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1">
      {rows.map((row, i) => (
        <Link
          key={row.href}
          href={row.href}
          className="group block border-t border-border last:border-b py-5 md:py-6 -mx-2 px-2 rounded transition-colors duration-200 hover:bg-coral/[0.03]"
        >
          <div className="grid grid-cols-[40px_1fr] md:grid-cols-[40px_1fr_auto] gap-3 md:gap-6 items-start">
            <span className="font-mono font-medium text-[11px] tracking-[0.18em] text-coral uppercase pt-1">
              — {String(i + 1).padStart(2, '0')}
            </span>

            <div className="min-w-0">
              <h2 className="font-serif font-bold text-coral text-[clamp(19px,1.9vw,26px)] leading-[1.2] tracking-[-0.02em] group-hover:text-navy transition-colors duration-200">
                {row.title}
              </h2>

              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] tracking-[0.18em] uppercase text-muted">
                {row.sourceEmoji && (
                  <span aria-hidden className="text-[13px] leading-none">
                    {row.sourceEmoji}
                  </span>
                )}
                <span className="text-navy">{row.source}</span>
                {row.kicker && (
                  <>
                    <span aria-hidden className="text-border">/</span>
                    <span>{row.kicker}</span>
                  </>
                )}
                <span aria-hidden className="text-border">/</span>
                <span>{row.minutes} dk okuma</span>
                <span aria-hidden className="text-border">/</span>
                <span>{row.headingCount} başlık</span>
              </div>

            </div>

            <span className="hidden md:block font-mono text-[10px] tracking-[0.18em] uppercase text-navy/70 group-hover:text-coral transition-colors duration-200 pt-1 whitespace-nowrap">
              Oku →
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
