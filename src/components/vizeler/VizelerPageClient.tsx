'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import SchengenCountryGrid, { type SchengenEntry } from '@/components/visa/SchengenCountryGrid/SchengenCountryGrid';
import RegionGrid from '@/components/home/RegionGrid/RegionGrid';
import type { HomeRegionEntry } from '@/lib/data/homeRegions';

type FilterKey = 'schengen' | 'populer' | 'asya' | 'amerika' | 'diger';

const FILTERS: { key: FilterKey; label: string }[] = [
    { key: 'schengen', label: 'Schengen Vizeleri' },
    { key: 'populer', label: 'Popüler Vizeler' },
    { key: 'asya', label: 'Asya ve Pasifik Vizeleri' },
    { key: 'amerika', label: 'Amerika Kıtası' },
    { key: 'diger', label: 'Diğer Vizeler' },
];

interface Props {
    entries: {
        avrupa: HomeRegionEntry[];
        amerika: HomeRegionEntry[];
        asya: HomeRegionEntry[];
        diger: HomeRegionEntry[];
    };
    settings: {
        avrupa: boolean;
        amerika: boolean;
        asya: boolean;
        diger: boolean;
    };
}

const toRegionEntry = (e: HomeRegionEntry) => ({
    name: e.name,
    href: e.href,
    presetKey: e.preset_key,
    subtitle: e.subtitle,
});

export default function VizelerPageClient({ entries, settings }: Props) {
    const [active, setActive] = useState<FilterKey | null>(null);

    const avrupaEntries =
        active === 'populer'
            ? entries.avrupa.filter((e) => e.pinned)
            : entries.avrupa;

    return (
        <>
            {/* Filter bar */}
            <div className="container mt-8 mb-4">
                <div className="flex flex-wrap gap-2">
                    {FILTERS.map((f) => {
                        const isActive = active === f.key;
                        return (
                            <motion.button
                                key={f.key}
                                onClick={() => setActive(isActive ? null : f.key)}
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ duration: 0.15 }}
                                className={`font-sans font-medium text-[11px] uppercase tracking-widest px-5 py-2.5 rounded-xl border transition-colors duration-200 cursor-pointer ${
                                    isActive
                                        ? 'bg-coral text-white border-coral shadow-sm'
                                        : 'border-navy/30 text-navy hover:border-coral hover:text-coral hover:bg-coral/5'
                                }`}
                            >
                                {f.label}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {active === null ? (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                        className="container my-24 flex flex-col items-center justify-center text-center gap-4"
                    >
                        <p className="font-serif text-[clamp(20px,3vw,36px)] text-navy/40 leading-snug tracking-[-0.02em]">
                            Bir bölge seçin ve ülkeleri keşfedin.
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        key={active}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* ── Schengen / Popüler ── */}
                        {(active === 'schengen' || active === 'populer') && (
                            <>
                                <div className="container mt-10">
                                    <div className="flex justify-between items-end flex-wrap gap-4 border-b border-border pb-7">
                                        <h2 className="font-serif font-bold text-[clamp(28px,4vw,56px)] leading-none tracking-[-0.03em]">
                                            {active === 'populer' ? 'Popüler Ülkeler' : 'Avrupa ve Schengen'}
                                        </h2>
                                        {active === 'schengen' && (
                                            <Link
                                                href="/vize/schengen"
                                                className="inline-flex items-center gap-2 font-sans font-medium text-[12px] uppercase tracking-widest px-7 py-4 border border-navy text-navy hover:bg-navy hover:text-white transition-all duration-200 rounded-2xl whitespace-nowrap"
                                            >
                                                Schengen hakkında →
                                            </Link>
                                        )}
                                    </div>
                                </div>
                                <SchengenCountryGrid entries={avrupaEntries as SchengenEntry[]} hideHeader limitCollapsed />
                            </>
                        )}

                        {/* ── Amerika Kıtası ── */}
                        {active === 'amerika' && (
                            <div className="container mt-10 mb-20">
                                <div className="flex justify-between items-end flex-wrap gap-4 border-b border-border pb-7">
                                    <h2 className="font-serif font-bold text-[clamp(28px,4vw,56px)] leading-none tracking-[-0.03em]">
                                        Amerika Kıtası
                                    </h2>
                                </div>
                                <RegionGrid entries={entries.amerika.map(toRegionEntry)} />
                            </div>
                        )}

                        {/* ── Asya ve Pasifik ── */}
                        {active === 'asya' && (
                            <div className="container mt-10 mb-20">
                                <div className="flex justify-between items-end flex-wrap gap-4 border-b border-border pb-7">
                                    <h2 className="font-serif font-bold text-[clamp(28px,4vw,56px)] leading-none tracking-[-0.03em]">
                                        Asya ve Pasifik Vizeleri
                                    </h2>
                                </div>
                                <RegionGrid entries={entries.asya.map(toRegionEntry)} />
                            </div>
                        )}

                        {/* ── Diğer Vizeler ── */}
                        {active === 'diger' && (
                            <div className="container mt-10 mb-20">
                                <div className="flex justify-between items-end flex-wrap gap-4 border-b border-border pb-7">
                                    <h2 className="font-serif font-bold text-[clamp(28px,4vw,56px)] leading-none tracking-[-0.03em]">
                                        Diğer Vizeler
                                    </h2>
                                </div>
                                <RegionGrid entries={entries.diger.map(toRegionEntry)} />
                            </div>
                        )}

                        <div className="mb-20" />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
