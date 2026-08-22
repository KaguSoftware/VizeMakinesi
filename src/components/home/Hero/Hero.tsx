"use client";
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE_OUT_EXPO } from '@/components/shared/motion/constants';
import { countryHref } from '@/lib/routes';

const MotionLink = motion.create(Link);

interface CountryResult {
  name: string;
  slug: string;
  flag_emoji: string | null;
  matchedCity?: string;
}

export default function Hero({ compact, hideCta }: { compact?: boolean; hideCta?: boolean } = {}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CountryResult[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const q = query.trim();
    if (!q) return;

    const controller = new AbortController();
    const requestTimeout = setTimeout(() => controller.abort(), 8000);
    fetch(`/api/countries/search?q=${encodeURIComponent(q)}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => { setResults(data); setOpen(data.length > 0); setActiveIndex(-1); })
      .catch((err) => { if (err.name !== 'AbortError') console.error(err); })
      .finally(() => clearTimeout(requestTimeout));

    return () => { clearTimeout(requestTimeout); controller.abort(); };
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
      if (target) { router.push(countryHref(target.slug)); setOpen(false); }
    }
    else if (e.key === 'Escape') setOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const target = activeIndex >= 0 ? results[activeIndex] : results[0];
    if (target) { router.push(countryHref(target.slug)); setOpen(false); }
  };

  return (
    <section className={compact ? "pt-0 pb-8 relative overflow-visible" : "pt-20 pb-10 relative border-b border-border overflow-hidden"}>
<div className={compact ? "relative z-10" : "container relative z-10"}>
        {/* Main grid */}
        <div className={compact ? "flex flex-col gap-6 relative" : "grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-15 items-end relative"}>
          {/* Left: headline */}
          <motion.div
            className="relative"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } }}
          >
            <h1 className={`font-serif font-bold leading-[1.05] tracking-[-0.02em] ${compact ? "text-[clamp(30px,3.6vw,54px)]" : "text-[clamp(32px,5.5vw,88px)]"}`}>
              <motion.span
                className="block"
                variants={{ hidden: { opacity: 1, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT_EXPO } } }}
              >
                Vize Almanın
              </motion.span>
              <motion.span
                className="block"
                variants={{ hidden: { opacity: 1, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT_EXPO } } }}
              >
                En Hızlı, En Güvenilir ve
              </motion.span>
              <motion.span
                className="block"
                variants={{ hidden: { opacity: 1, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT_EXPO } } }}
              >
                <span className="text-coral">Garantili</span> Yolu.
              </motion.span>
            </h1>
          </motion.div>

          {/* Right: editorial note */}
          <motion.div
            className={compact ? "relative" : "border-l border-border pl-9 pb-3 relative"}
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } }}
          >
            {!compact && <motion.div
              className="absolute -top-6 -left-px w-7 h-7 bg-coral flex items-center justify-center font-mono text-[11px] font-medium text-white"
              initial={{ opacity: 0, scale: 0.4, rotate: -45 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, delay: 0.25, ease: EASE_OUT_EXPO }}
            >
              ¶
            </motion.div>}

            {/* Search bar */}
            <motion.div
              ref={containerRef}
              className={`relative w-full ${compact ? "max-w-none mb-5" : "max-w-sm mb-8"}`}
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT_EXPO } } }}
            >
              <form
                onSubmit={handleSearch}
                className="flex items-center bg-white/80 backdrop-blur-sm border border-coral/40 rounded-2xl overflow-hidden focus-within:border-coral transition-colors"
              >
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    const v = e.target.value;
                    setQuery(v);
                    if (!v.trim()) { setResults([]); setOpen(false); }
                  }}
                  onKeyDown={handleKeyDown}
                  onFocus={() => results.length > 0 && setOpen(true)}
                  placeholder="✈️ Yolculuk Nereye !?"
                  autoComplete="off"
                  className="flex-1 bg-transparent px-4 py-3 font-sans text-[16px] sm:text-[14px] text-navy placeholder:text-navy/50 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-transparent border-l border-coral/40 text-coral font-sans font-medium text-[13px] px-4 py-3 hover:bg-coral/10 active:bg-coral/20 transition-colors duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-inset"
                >
                  Ara →
                </button>
              </form>

              <AnimatePresence>
                {open && (
                  <motion.ul
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute top-full left-0 right-0 mt-1 bg-white border border-coral/20 rounded-2xl shadow-lg overflow-y-auto max-h-[60vh] z-50"
                  >
                    {results.map((country, i) => (
                      <motion.li
                        key={country.slug}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.12, delay: i * 0.04, ease: 'easeOut' }}
                      >
                        <Link
                          href={countryHref(country.slug)}
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
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.p
              className={`font-serif leading-[1.55] text-coral mb-6 ${compact ? "text-[14px] max-w-2xl" : "text-[clamp(14px,1.4vw,19px)] max-w-95 mb-8"}`}
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT_EXPO } } }}
            >
              {compact
                ? "60+ ülke için hatasız evrak hazırlığı ve hızlı randevu garantisiyle tüm vize sürecinizi güvence altına alıyoruz."
                : "Turistikten ticari ve aile ziyaretlerine kadar tüm vize ihtiyaçlarınızda profesyonel çözüm ortağınız. 60+ ülke için hatasız evrak hazırlığı ve hızlı randevu garantisiyle sürecinizi güvence altına alıyoruz."}
            </motion.p>
            {!hideCta && (
            <MotionLink
              href="/danisma-al"
              className={`inline-flex items-center gap-2 font-sans font-medium uppercase tracking-widest border border-coral text-coral hover:bg-navy hover:text-white hover:border-cream transition-all duration-200 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 ${compact ? "text-[11px] px-5 py-3" : "text-[12px] px-7 py-4"}`}
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT_EXPO } } }}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              Danışma Al →
            </MotionLink>
            )}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
