'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import SchengenCountryGrid, { type SchengenEntry } from '@/components/visa/SchengenCountryGrid/SchengenCountryGrid';
import type { HomeRegionEntry } from '@/lib/data/homeRegions';

const VIZE_TURLERI = [
    {
        icon: '🏖️',
        tag: 'Tip C',
        title: 'Turistik Vize',
        desc: 'Gezi, tatil ve bireysel seyahatler için 180 gün içinde en fazla 90 güne kadar kalış hakkı sağlayan kısa süreli C tipi Schengen vizesidir.',
    },
    {
        icon: '💼',
        tag: 'Tip C',
        title: 'Ticari Vize',
        desc: 'İş görüşmesi, toplantı ve fuar gibi ticari organizasyonlara katılmak için başvurulan kısa süreli C tipi Schengen vizesidir.',
    },
    {
        icon: '👨‍👩‍👧',
        tag: 'Tip C',
        title: 'Aile Ziyareti Vizesi',
        desc: 'Yakınlarını veya aile bireylerini ziyaret etmek amacıyla davetiye ile başvurulan kısa süreli C tipi Schengen vizesidir.',
    },
    {
        icon: '🏠',
        tag: 'Tip D',
        title: 'Aile Birleşimi Vizesi',
        desc: 'Yasal olarak ikamet eden aile bireylerinin yanına kalıcı olarak yerleşmek amacıyla başvurulan uzun süreli D tipi ulusal vizedir.',
    },
    {
        icon: '🎓',
        tag: 'Tip D',
        title: 'Öğrenci Vizesi',
        desc: 'Üniversite veya dil kursu gibi uzun süreli eğitim programlarına katılacak kişilerin aldığı uzun süreli D tipi ulusal vizedir.',
    },
    {
        icon: '🛠️',
        tag: 'Tip D',
        title: 'Çalışma Vizesi',
        desc: 'Bir ülkede yasal olarak istihdam edilmek ve çalışmak üzere resmi belgelerle başvurulan uzun süreli D tipi ulusal vizedir.',
    },
    {
        icon: '🔄',
        tag: 'Tip C',
        title: 'Transit Vizesi',
        desc: 'Bir ülkenin topraklarından geçerek başka bir ülkeye seyahat edecek yolcuların ihtiyaç duyduğu kısa süreli C tipi Schengen vizesidir.',
    },
    {
        icon: '🎤',
        tag: 'Tip C',
        title: 'Fuar, Kültürel Etkinlik ve Konferans Vizesi',
        desc: 'Uluslararası kongre, konferans, bilimsel veya kültürel etkinliklere katılacak kişilerin aldığı kısa süreli C tipi Schengen vizesidir.',
    },
];

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
        populer: HomeRegionEntry[];
        asya: HomeRegionEntry[];
        amerika: HomeRegionEntry[];
        diger: HomeRegionEntry[];
    };
    settings: {
        avrupa: boolean;
        populer: boolean;
        asya: boolean;
        amerika: boolean;
        diger: boolean;
    };
}


export default function VizelerPageClient({ entries, settings }: Props) {
    const [active, setActive] = useState<FilterKey | null>(null);

    useEffect(() => {
        if (window.location.hash === '#genel-vize-turleri') {
            const el = document.getElementById('genel-vize-turleri');
            if (el) {
                const navHeight = 88;
                const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        }
    }, []);

    const populerEntries = entries.populer;

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
                                className={`font-sans font-medium text-[11px] uppercase tracking-widest px-5 py-2.5 rounded-xl border transition-colors duration-200 cursor-pointer ${isActive
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
                        className="container my-16 flex items-center justify-center"
                    >
                        <p className="font-serif text-[clamp(20px,3vw,36px)] text-navy/40 leading-snug tracking-[-0.02em] text-center">
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
                                {active === 'schengen'
                                    ? <SchengenCountryGrid hideHeader limitCollapsed />
                                    : <SchengenCountryGrid entries={populerEntries as SchengenEntry[]} hideHeader limitCollapsed />
                                }
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
                                <SchengenCountryGrid entries={entries.amerika as SchengenEntry[]} hideHeader limitCollapsed />
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
                                <SchengenCountryGrid entries={entries.asya as SchengenEntry[]} hideHeader limitCollapsed />
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
                                <SchengenCountryGrid entries={entries.diger as SchengenEntry[]} hideHeader limitCollapsed />
                            </div>
                        )}

                        <div className="mb-8" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Genel Vize Türleri — always visible */}
            <div className="h-8" />
            <section id="genel-vize-turleri" className="mb-20 mt-6 scroll-mt-22">
                <div className="container pt-14 pb-4">
                    <h2 className="font-serif font-bold text-[clamp(24px,3.5vw,48px)] leading-none tracking-tight text-navy mb-10">
                        Genel Vize <em className="font-normal italic text-coral">Türleri</em>
                    </h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {VIZE_TURLERI.map((tur) => (
                            <div
                                key={tur.title}
                                className="flex flex-col gap-4 p-6 rounded-2xl border border-navy/10 bg-white hover:border-coral/30 hover:bg-coral/5 transition-colors duration-200"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="shrink-0 w-10 h-10 rounded-xl bg-coral/10 flex items-center justify-center text-lg">
                                        {tur.icon}
                                    </div>
                                    <span className="font-mono text-[10px] tracking-widest uppercase text-coral border border-coral/30 bg-coral/8 rounded-md px-2 py-0.5">
                                        {tur.tag}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-sans font-semibold text-[14px] text-navy mb-2">{tur.title}</p>
                                    <p className="font-sans text-[13px] text-navy/55 leading-relaxed">{tur.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
