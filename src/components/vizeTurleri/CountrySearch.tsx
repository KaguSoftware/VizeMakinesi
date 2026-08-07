'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import type { CountrySlim } from '@/lib/data/countries';

// Turkish-aware, accent-insensitive normalisation for matching.
function normalize(s: string) {
    return s
        .toLocaleLowerCase('tr-TR')
        .replace(/ı/g, 'i')
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '');
}

// Letters (incl. Turkish), spaces, hyphens and apostrophes only — no digits.
function sanitizeSearch(raw: string): string {
    return raw.replace(/[^\p{L}\s'-]/gu, '');
}

interface Props {
    countries: CountrySlim[];
}

export default function CountrySearch({ countries }: Props) {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(0);
    const rootRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    const filtered = useMemo(() => {
        const q = normalize(query.trim());
        if (!q) return countries;
        return countries.filter((c) => normalize(c.name).includes(q));
    }, [countries, query]);

    // Close on outside click.
    useEffect(() => {
        if (!open) return;
        function onDoc(e: MouseEvent) {
            if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener('mousedown', onDoc);
        return () => document.removeEventListener('mousedown', onDoc);
    }, [open]);

    // Keep the active row in view.
    useEffect(() => {
        if (!open) return;
        const el = listRef.current?.children[active] as HTMLElement | undefined;
        el?.scrollIntoView({ block: 'nearest' });
    }, [active, open]);

    function go(slug: string) {
        setOpen(false);
        router.push(`/vize-turleri/${slug}`);
    }

    function onKeyDown(e: React.KeyboardEvent) {
        if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) {
            e.preventDefault();
            setOpen(true);
            return;
        }
        if (!open) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActive((i) => Math.min(i + 1, filtered.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActive((i) => Math.max(i - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (filtered[active]) go(filtered[active].slug);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            setOpen(false);
        }
    }

    return (
        <div ref={rootRef} className="relative max-w-2xl" onKeyDown={onKeyDown}>
            <div className="relative">
                <span
                    aria-hidden="true"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-coral text-[15px] pointer-events-none"
                >
                    ⌕
                </span>
                <input
                    id="vize-turleri-ulke-ara"
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(sanitizeSearch(e.target.value));
                        setActive(0);
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    placeholder="Hangi ülkenin vize türlerini incelemek istiyorsun?"
                    aria-label="Hangi ülkenin vize türlerini incelemek istiyorsun?"
                    autoComplete="off"
                    role="combobox"
                    aria-expanded={open}
                    aria-controls="vize-turleri-ulke-listesi"
                    aria-autocomplete="list"
                    className="w-full rounded-xl border border-navy/15 bg-white pl-10 pr-4 py-3.5 font-serif text-[16px] text-navy placeholder:text-muted/40 focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral/20 transition-colors duration-150"
                />
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-30 mt-2 w-full rounded-xl border border-border bg-white shadow-[0_16px_40px_-16px_rgba(15,23,42,0.35)] overflow-hidden"
                    >
                        <ul
                            id="vize-turleri-ulke-listesi"
                            ref={listRef}
                            role="listbox"
                            className="max-h-72 overflow-y-auto py-1"
                        >
                            {filtered.length === 0 ? (
                                <li className="px-4 py-3 font-serif text-[14px] text-muted/60 text-center">
                                    Sonuç bulunamadı
                                </li>
                            ) : (
                                filtered.map((c, i) => (
                                    <li
                                        key={c.slug}
                                        role="option"
                                        aria-selected={i === active}
                                        onClick={() => go(c.slug)}
                                        onMouseEnter={() => setActive(i)}
                                        className={`px-4 py-2.5 cursor-pointer font-serif text-[15px] text-navy flex items-center gap-2.5 transition-colors duration-100 ${i === active ? 'bg-coral/10' : ''
                                            }`}
                                    >
                                        {c.flag_emoji && <span aria-hidden="true">{c.flag_emoji}</span>}
                                        <span className="truncate">{c.name}</span>
                                        <span className="ml-auto text-coral opacity-0 group-hover:opacity-100" aria-hidden="true">
                                            →
                                        </span>
                                    </li>
                                ))
                            )}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
