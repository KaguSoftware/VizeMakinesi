"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { STATIC_MEGA_MENU } from "./constants";
import { motion } from "framer-motion";
import type { MegaMenuGroup } from "./types";
import type { MegaMenuCategory } from "@/lib/data/megaMenu";
import NavSearch from "./NavSearch";
import MobileMenuOverlay from "./MobileMenuOverlay";

interface NavProps {
    dbCategories: MegaMenuCategory[];
    tickerItems: { text: string; url: string | null }[];
}

function buildVizelarGroup(dbCategories: MegaMenuCategory[]): MegaMenuGroup {
    return {
        label: 'Ülkeler',
        columns: [
            ...dbCategories.map((cat) => {
                const isEurope = /avrupa|europe/i.test(cat.name);
                if (isEurope) {
                    return {
                        kind: 'region-group' as const,
                        title: cat.name,
                        regions: [
                            { label: 'Schengen Bölgelesi', to: '/vize/schengen', flag: '🇪🇺' },
                            { label: 'İngiltere', to: '/vize/ingiltere', flag: '🇬🇧' },
                            { label: 'İrlanda', to: '/vize/irlanda', flag: '🇮🇪' },
                        ],
                    };
                }
                const isAmerica = /amerika|america/i.test(cat.name);
                const baseItems = cat.items.map((it) => ({
                    to: `/vize/${it.country.slug}`,
                    label: it.country.name,
                    flag: it.country.flag_emoji ?? undefined,
                }));
                return {
                    title: cat.name,
                    items: isAmerica
                        ? [...baseItems, { to: '/abd-hizlandirma', label: 'ABD Hızlandırma', flag: '⚡' }]
                        : baseItems,
                };
            }),
            {
                kind: 'feature' as const,
                feature: {
                    eyebrow: '',
                    title: 'Hangi Ülkeye Gitmek İstiyorsunuz?',
                    body: 'Sınırlarını aşmak istediğiniz ülkeyi seçin; size uygun vize türünü, güncel başvuru şartlarını ve gerekli evrak listesini anında görüntüleyin.',
                    to: '/vize/schengen',
                },
            },
        ],
    };
}

export default function Nav({ dbCategories, tickerItems }: NavProps) {
    const megaMenu: MegaMenuGroup[] = [
        buildVizelarGroup(dbCategories),
        ...STATIC_MEGA_MENU,
    ];

    const [openSince, setOpenSince] = useState<string | null>(null);
    const [activeMegaSince, setActiveMegaSince] = useState<[number, string] | null>(null);
    const [navHeight, setNavHeight] = useState(0);
    const pathname = usePathname();
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const headerRef = useRef<HTMLElement>(null);

    const open = openSince === pathname;
    const activeMega = activeMegaSince?.[1] === pathname ? activeMegaSince[0] : null;

    useEffect(() => {
        const el = headerRef.current;
        if (!el) return;
        const ro = new ResizeObserver(() => setNavHeight(el.offsetHeight));
        ro.observe(el);
        setNavHeight(el.offsetHeight);
        return () => ro.disconnect();
    }, []);

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        document.body.classList.toggle("nav-menu-open", open);
        return () => {
            document.body.style.overflow = "";
            document.body.classList.remove("nav-menu-open");
        };
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpenSince(null);
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open]);

    const handleEnter = (idx: number) => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        setActiveMegaSince([idx, pathname]);
    };
    const handleLeave = () => {
        closeTimer.current = setTimeout(() => setActiveMegaSince(null), 120);
    };

    return (
        <>
            <header ref={headerRef} className="nav-sticky sticky top-0 z-110 bg-navy border-b border-border">
                {/* Ticker */}
                <div className="overflow-hidden font-mono text-[11px] tracking-[0.08em] uppercase py-2 bg-navy text-white/65 group">
                    <div className="nav-ticker-track group-hover:[animation-play-state:paused]">
                        {[0, 1, 2, 3].map((set) => (
                            <span key={set} className="nav-ticker-set" aria-hidden={set > 0 ? "true" : undefined}>
                                {tickerItems.map((t, i) =>
                                    t.url ? (
                                        <a
                                            key={i}
                                            href={t.url}
                                            {...(t.url.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                            className={i === 0 ? "text-coral hover:text-coral/80 underline underline-offset-2" : "hover:text-white/90 underline underline-offset-2"}
                                        >
                                            {t.text}
                                        </a>
                                    ) : (
                                        <span
                                            key={i}
                                            className={i === 0 ? "text-coral" : ""}
                                        >
                                            {t.text}
                                        </span>
                                    )
                                )}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Main bar */}
                <div className="container flex items-center justify-between h-22 relative">
                    {/* Logo */}
                    <div className="relative flex items-center">
                        <Link href="/" className="absolute left-0 right-0 z-10" style={{top: '50%', transform: 'translateY(-50%)', height: 40}} aria-label="Vize Makinesi" />
                        <div className="overflow-hidden h-16">
                            <Image
                                src="/VizeMakinesiLogo.png"
                                alt="Vize Makinesi"
                                width={220}
                                height={50}
                                priority
                                sizes="220px"
                                className="w-auto h-80 -my-32"
                            />
                        </div>
                    </div>

                    {/* Desktop nav */}
                    <nav
                        aria-label="Ana navigasyon"
                        className="hidden lg:flex gap-1 items-center"
                        onMouseLeave={handleLeave}
                    >
                        {megaMenu.map((group, i) => (
                            <div
                                key={group.label}
                                onMouseEnter={() => handleEnter(i)}
                            >
                                {group.label === 'Ülkeler' ? (
                                    <Link
                                        href="/vizeler"
                                        aria-haspopup="true"
                                        aria-expanded={activeMega === i}
                                        className={`font-sans font-bold text-[13.8px] uppercase tracking-widest px-4.5 py-3 inline-flex items-center gap-1.5 transition-colors duration-200 ${activeMega === i || pathname.startsWith('/vizeler')
                                            ? "text-coral"
                                            : "text-white hover:text-coral"
                                            }`}
                                    >
                                        {group.label}
                                        <span
                                            aria-hidden="true"
                                            className={`text-sm opacity-50 transition-transform duration-200 ${activeMega === i ? "rotate-180" : ""}`}
                                        >
                                            ↓
                                        </span>
                                    </Link>
                                ) : group.label === 'Ofis' ? (
                                    <Link
                                        href="/ofis"
                                        aria-haspopup="true"
                                        aria-expanded={activeMega === i}
                                        className={`font-sans font-bold text-[13.8px] uppercase tracking-widest px-4.5 py-3 inline-flex items-center gap-1.5 transition-colors duration-200 ${activeMega === i || pathname.startsWith('/ofis')
                                            ? "text-coral"
                                            : "text-white hover:text-coral"
                                            }`}
                                    >
                                        {group.label}
                                        <span
                                            aria-hidden="true"
                                            className={`text-sm opacity-50 transition-transform duration-200 ${activeMega === i ? "rotate-180" : ""}`}
                                        >
                                            ↓
                                        </span>
                                    </Link>
                                ) : (
                                    <button
                                        aria-haspopup="true"
                                        aria-expanded={activeMega === i}
                                        className={`font-sans font-bold text-[13.8px] uppercase tracking-widest px-4.5 py-3 inline-flex items-center gap-1.5 transition-colors duration-200 ${activeMega === i
                                            ? "text-coral"
                                            : "text-white hover:text-coral"
                                            }`}
                                    >
                                        {group.label}
                                        <span
                                            aria-hidden="true"
                                            className={`text-sm opacity-50 transition-transform duration-200 ${activeMega === i ? "rotate-180" : ""}`}
                                        >
                                            ↓
                                        </span>
                                    </button>
                                )}
                            </div>
                        ))}
                        <Link
                            href="/blog"
                            className={`font-sans font-bold text-[13.8px] uppercase tracking-widest px-4.5 py-3 inline-flex items-center gap-1.5 transition-colors duration-200 ${pathname.startsWith('/blog') ? 'text-coral' : 'text-white hover:text-coral'}`}
                        >
                            Blog
                        </Link>
                        <Link
                            href="/cascade-kurali"
                            className={`font-sans font-bold text-[13.8px] uppercase tracking-widest px-4.5 py-3 inline-flex items-center gap-1.5 transition-colors duration-200 ${pathname.startsWith('/cascade-kurali') ? 'text-coral' : 'text-white hover:text-coral'}`}
                        >
                            Cascade Kuralı
                        </Link>
                        <NavSearch />
                        <Link href="/iletisim" className="ml-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-navy active:scale-[0.98] transition-transform">
                            <span className="font-sans font-bold text-[12px] uppercase tracking-widest px-4 py-2.5 bg-cream border border-cream text-coral hover:bg-transparent hover:text-white hover:border-white transition-colors duration-200 inline-flex items-center rounded-xl">
                                Bize Ulaşın
                            </span>
                        </Link>
                        <Link href="/danisma-al" className="ml-2 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-navy active:scale-[0.98] transition-transform">
                            <span className="font-sans font-bold text-[12px] uppercase tracking-widest px-4 py-2.5 bg-cream border border-cream text-coral hover:bg-transparent hover:text-white hover:border-white transition-colors duration-200 inline-flex items-center rounded-xl">
                                Danışma Al →
                            </span>
                        </Link>
                    </nav>

                    {/* Hamburger / X toggle */}
                    <button
                        aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
                        aria-expanded={open}
                        className="lg:hidden flex flex-col justify-center items-center w-10 h-10 relative rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
                        onClick={() => open ? setOpenSince(null) : setOpenSince(pathname)}
                    >
                        <motion.span
                            initial={{ y: -6, rotate: 0 }}
                            animate={{ rotate: open ? 45 : 0, y: open ? 0 : -6 }}
                            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                            className="block w-6 h-0.5 bg-white absolute"
                        />
                        <motion.span
                            initial={{ opacity: 1, scaleX: 1 }}
                            animate={{ opacity: open ? 0 : 1, scaleX: open ? 0 : 1 }}
                            transition={{ duration: 0.2 }}
                            className="block w-6 h-0.5 bg-white absolute"
                        />
                        <motion.span
                            initial={{ y: 6, rotate: 0 }}
                            animate={{ rotate: open ? -45 : 0, y: open ? 0 : 6 }}
                            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                            className="block w-6 h-0.5 bg-white absolute"
                        />
                    </button>
                </div>

                {/* Mega panel */}
                {activeMega !== null && (
                    <div
                        className="mega-panel absolute left-0 right-0 top-full bg-cream border-t-2 border-b-2 border-navy text-navy"
                        onMouseEnter={() => handleEnter(activeMega)}
                        onMouseLeave={handleLeave}
                    >
                        <div className="container">
                            <div className="grid grid-cols-[220px_1fr] gap-15 py-14">
                                {/* Side */}
                                <div className="border-r border-border pr-10">
                                    <div className="font-mono text-[10px] tracking-[0.2em] text-coral uppercase mb-4">
                                        — {String(activeMega + 1).padStart(2, "0")}{" "}
                                        /{" "}
                                        {String(megaMenu.length).padStart(2, "0")}
                                    </div>
                                    <div className="font-serif italic font-bold text-[40px] leading-none tracking-tight">
                                        {megaMenu[activeMega].label}
                                    </div>
                                    <div className="w-20 h-px bg-coral mt-8" />
                                </div>

                                {/* Columns */}
                                <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-12">
                                    {megaMenu[activeMega].columns.map((col, ci) =>
                                        col.kind === "feature" ? (
                                            <Link
                                                key={ci}
                                                href={col.feature!.to}
                                                className="mega-feature flex flex-col justify-between p-7 bg-navy text-white min-h-55 border border-coral/30 hover:border-coral transition-colors duration-200"
                                            >
                                                <div className="font-serif font-semibold text-[22px] leading-tight tracking-[-0.015em] mb-4 relative z-10 text-white">
                                                    {col.feature!.title}
                                                </div>
                                                <div className="text-[13px] text-white/90 leading-relaxed flex-1 relative z-10">
                                                    {col.feature!.body}
                                                </div>
                                            </Link>
                                        ) : col.kind === "region-group" ? (
                                            <div key={ci}>
                                                <div className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase mb-4.5 pb-3.5 border-b border-border">
                                                    {col.title}
                                                </div>
                                                <ul className="list-none">
                                                    {col.regions!.map((r, k) => (
                                                        <li key={k}>
                                                            <Link
                                                                href={r.to}
                                                                className="grid grid-cols-[auto_1fr_auto] items-center gap-3 py-2.5 border-b border-transparent hover:border-border hover:text-coral transition-all duration-150"
                                                            >
                                                                {r.flag && (
                                                                    <span className="text-[18px] w-6 inline-flex justify-center">
                                                                        {r.flag}
                                                                    </span>
                                                                )}
                                                                <span className="font-serif font-semibold text-[17px] leading-tight tracking-[-0.01em]">
                                                                    {r.label}
                                                                </span>
                                                                <span className="text-[12px] text-muted/60">→</span>
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ) : (
                                            <div key={ci}>
                                                <div className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase mb-4.5 pb-3.5 border-b border-border">
                                                    {col.title}
                                                </div>
                                                <ul className="list-none">
                                                    {col.items!.map((it, k) => (
                                                        <li key={k}>
                                                            <Link
                                                                href={it.to}
                                                                className="grid grid-cols-[auto_1fr_auto] items-center gap-3 py-2.5 border-b border-transparent hover:border-border hover:text-coral transition-all duration-150"
                                                            >
                                                                {it.flag && (
                                                                    <span className="text-[18px] w-6 inline-flex justify-center">
                                                                        {it.flag}
                                                                    </span>
                                                                )}
                                                                <span>
                                                                    <span className="block font-serif font-semibold text-[17px] leading-tight tracking-[-0.01em]">
                                                                        {it.label}
                                                                    </span>
                                                                    {it.desc && (
                                                                        <span className="block text-[12px] text-muted mt-0.5">
                                                                            {it.desc}
                                                                        </span>
                                                                    )}
                                                                </span>
                                                                <span className="text-[12px] text-muted/60 transition-transform duration-150 group-hover:translate-x-1">
                                                                    →
                                                                </span>
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </header>

            <MobileMenuOverlay
                open={open}
                pathname={pathname}
                navHeight={navHeight}
                megaMenu={megaMenu}
                onClose={() => setOpenSince(null)}
            />
        </>
    );
}
