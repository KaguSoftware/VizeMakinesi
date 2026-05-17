"use client";
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface CountryResult {
  name: string;
  slug: string;
  flag_emoji: string | null;
  matchedCity?: string;
}

export default function Hero() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CountryResult[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const q = query.trim();
    if (!q) { setResults([]); setOpen(false); return; }

    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetch(`/api/countries/search?q=${encodeURIComponent(q)}`, { signal: controller.signal })
        .then((r) => r.json())
        .then((data) => { setResults(data); setOpen(data.length > 0); setActiveIndex(-1); })
        .catch((err) => { if (err.name !== 'AbortError') console.error(err); });
    }, 200);

    return () => { clearTimeout(timer); controller.abort(); };
  }, [query]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, -1)); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      const target = activeIndex >= 0 ? results[activeIndex] : results[0];
      if (target) { router.push(`/vize/${target.slug}`); setOpen(false); }
    }
    else if (e.key === 'Escape') setOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const target = activeIndex >= 0 ? results[activeIndex] : results[0];
    if (target) { router.push(`/vize/${target.slug}`); setOpen(false); }
  };

  return (
    <section className="pt-20 pb-10 relative border-b border-border overflow-hidden">
<div className="container relative z-10">
        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-15 items-end relative">
          {/* Left: headline */}
          <div className="relative">
            <h1 className="font-serif font-bold text-[clamp(38px,5.5vw,88px)] leading-none tracking-[-0.02em]">
              Vize Almanın<br />En Hızlı, En Güvenilir ve<br /><span className="text-coral">Garantili</span> Yolu.
            </h1>
          </div>

          {/* Right: editorial note */}
          <div className="border-l border-border pl-9 pb-3 relative">
            <div className="absolute -top-6 -left-px w-7 h-7 bg-coral flex items-center justify-center font-mono text-[11px] font-medium text-white">
              ¶
            </div>

            {/* Search bar */}
            <div ref={containerRef} className="relative w-full max-w-sm mb-8">
              <form
                onSubmit={handleSearch}
                className="flex items-center bg-white/80 backdrop-blur-sm border border-coral/40 rounded-2xl overflow-hidden focus-within:border-coral transition-colors"
              >
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => results.length > 0 && setOpen(true)}
                  placeholder="✈️ Yolculuk Nereye !?"
                  autoComplete="off"
                  className="flex-1 bg-transparent px-4 py-3 font-sans text-[14px] text-navy placeholder:text-navy/50 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-transparent border-l border-coral/40 text-coral font-sans font-medium text-[13px] px-4 py-3 hover:bg-coral/10 transition-colors duration-200 whitespace-nowrap"
                >
                  Ara →
                </button>
              </form>

              {open && (
                <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-coral/20 rounded-2xl shadow-lg overflow-hidden z-50">
                  {results.map((country, i) => (
                    <li key={country.slug}>
                      <Link
                        href={`/vize/${country.slug}`}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 font-sans text-[14px] text-navy hover:bg-coral/10 transition-colors ${i === activeIndex ? 'bg-coral/10' : ''}`}
                      >
                        <span className="text-[18px]">{country.flag_emoji ?? '🌍'}</span>
                        <span className="flex-1">
                          {country.name}
                          {country.matchedCity && (
                            <span className="ml-2 text-navy/40 text-[12px]">({country.matchedCity})</span>
                          )}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <p className="font-serif text-[clamp(14px,1.4vw,19px)] leading-[1.55] text-coral max-w-95 mb-8">
              Turistikten ticari ve aile ziyaretlerine kadar tüm vize ihtiyaçlarınızda profesyonel çözüm ortağınız. 60+ ülke için hatasız evrak hazırlığı ve hızlı randevu garantisiyle sürecinizi güvence altına alıyoruz.
            </p>
            <Link
              href="/danisma-al"
              className="inline-flex items-center gap-2 font-sans font-medium text-[12px] uppercase tracking-widest px-7 py-4 border border-coral text-coral hover:bg-navy hover:text-white hover:border-cream transition-all duration-200 rounded-2xl"
            >
              Danışma Al →
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
