"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { countryHref } from '@/lib/routes';

interface CountryResult {
    name: string;
    slug: string;
    flag_emoji: string | null;
}

export default function NavSearch() {
    const [expanded, setExpanded] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<CountryResult[]>([]);
    const [activeIndex, setActiveIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (expanded) inputRef.current?.focus();
    }, [expanded]);

    const collapse = useCallback(() => {
        setExpanded(false);
        setQuery('');
        setResults([]);
        setActiveIndex(-1);
    }, []);

    useEffect(() => {
        const q = query.trim();
        if (!q) return;
        const controller = new AbortController();
        const debounceTimer = setTimeout(() => {
            // Abort the request itself if it hangs past 8s (slow 3G safety net).
            const requestTimeout = setTimeout(() => controller.abort(), 8000);
            fetch(`/api/countries/search?q=${encodeURIComponent(q)}`, { signal: controller.signal })
                .then((r) => r.json())
                .then((data) => { setResults(data); setActiveIndex(-1); })
                .catch((e) => { if (e.name !== 'AbortError') console.error(e); })
                .finally(() => clearTimeout(requestTimeout));
        }, 200);
        return () => { clearTimeout(debounceTimer); controller.abort(); };
    }, [query]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                collapse();
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [collapse]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, results.length - 1)); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, -1)); }
        else if (e.key === 'Enter') {
            const target = activeIndex >= 0 ? results[activeIndex] : results[0];
            if (target) { router.push(countryHref(target.slug)); collapse(); }
        }
        else if (e.key === 'Escape') collapse();
    };

    return (
        <div ref={containerRef} className="relative flex items-center">
            <button
                onClick={() => setExpanded((v) => !v)}
                aria-label="Ülke ara"
                className={`p-2 rounded transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral ${expanded ? 'text-coral' : 'text-white/70 hover:text-white'}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                </svg>
            </button>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                        className="absolute right-0 top-[calc(100%+16px)] w-[min(20rem,calc(100vw-2rem))] z-50"
                    >
                        <div className="flex items-center bg-white border border-coral/40 rounded-2xl overflow-hidden focus-within:border-coral transition-colors">
                            <svg className="ml-3 shrink-0 text-navy/40" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                            </svg>
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    setQuery(v);
                                    if (!v.trim()) setResults([]);
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder="✈️ Yolculuk Nereye !?"
                                autoComplete="off"
                                className="flex-1 bg-transparent px-3 py-3 font-sans text-[16px] sm:text-[14px] text-navy placeholder:text-navy/50 focus:outline-none"
                            />
                        </div>

                        {results.length > 0 && (
                            <ul className="mt-1 bg-white border border-coral/40 rounded-2xl overflow-hidden">
                                {results.map((c, i) => (
                                    <li key={c.slug}>
                                        <Link
                                            href={countryHref(c.slug)}
                                            onClick={() => collapse()}
                                            className={`flex items-center gap-3 px-4 py-2.5 font-sans text-[13px] text-navy border-b border-coral/10 last:border-0 hover:text-coral transition-colors ${i === activeIndex ? 'text-coral' : ''}`}
                                        >
                                            <span className="text-[16px]">{c.flag_emoji ?? '🌍'}</span>
                                            {c.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
