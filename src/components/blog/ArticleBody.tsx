import type { BlogArticle } from '@/lib/blog/articles';

/**
 * Bir yazının gövdesi: giriş paragrafları + alt başlıklar. Ret kararı ifadesi
 * ve İngilizce orijinali yalnızca doldurulduğu alt başlıklarda görünür.
 */
export default function ArticleBody({ article }: { article: BlogArticle }) {
  return (
    <section className="container">
      <div className="py-16 md:py-20 border-b border-border max-w-[760px]">
        {article.intro.length > 0 && (
          <div className="space-y-5 text-[17px] leading-[1.85] text-navy">
            {article.intro.map((paragraph, j) => (
              <p key={j}>{paragraph}</p>
            ))}
          </div>
        )}

        {article.subsections.map((sub) => (
          <div key={sub.heading} className="mt-12 pt-8 border-t border-border">
            <h2 className="font-serif font-bold text-[22px] md:text-[26px] leading-snug tracking-[-0.01em] text-navy">
              {sub.heading}
            </h2>

            {sub.quote && (
              <figure className="mt-6 border-l-2 border-coral pl-5 py-1">
                <p className="font-mono text-[10px] tracking-[0.2em] text-coral uppercase mb-3">
                  — Ret kararında yer alan ifade
                </p>
                <blockquote className="font-serif italic text-[18px] leading-[1.7] text-navy">
                  “{sub.quote}”
                </blockquote>
                {sub.quote_en && (
                  <figcaption className="mt-3 font-mono text-[12px] leading-[1.7] text-muted">
                    İngilizce orijinali: “{sub.quote_en}”
                  </figcaption>
                )}
              </figure>
            )}

            <div className="mt-6 space-y-5 text-[16px] leading-[1.85] text-navy">
              {sub.paragraphs.map((paragraph, j) => (
                <p key={j}>{paragraph}</p>
              ))}
            </div>

            {sub.bullets.length > 0 && (
              <ul className="mt-6 space-y-3">
                {sub.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-4 border-t border-border pt-3">
                    <span className="font-mono text-[11px] text-coral leading-[1.9]">—</span>
                    <span className="text-[16px] leading-[1.85] text-navy">{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
