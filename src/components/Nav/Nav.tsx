"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MEGA_MENU, MOBILE_LINKS, TICKER_ITEMS } from "./constants";
import { SITE } from "@/data/site";

export default function Nav() {
    const [open, setOpen] = useState(false);
    const [activeMega, setActiveMega] = useState<number | null>(null);
    const pathname = usePathname();
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        setOpen(false);
        setActiveMega(null);
    }, [pathname]);

    const handleEnter = (idx: number) => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        setActiveMega(idx);
    };
    const handleLeave = () => {
        closeTimer.current = setTimeout(() => setActiveMega(null), 120);
    };

    return (
        <header className="sticky top-0 z-50 bg-navy border-b border-border">
            {/* Ticker */}
            <div className="overflow-hidden font-mono text-[11px] tracking-[0.08em] uppercase py-2 bg-navy text-white/65">
                <div className="nav-ticker-track">
                    {TICKER_ITEMS.map((t, i) => (
                        <span
                            key={i}
                            className={i === 0 || i === 4 ? "text-coral" : ""}
                        >
                            {t}
                        </span>
                    ))}
                </div>
            </div>

            {/* Main bar */}
            <div className="container flex items-center justify-between h-22 relative">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-3 font-serif text-coral"
                >
                    <span className="italic font-bold flex flex-col items-center text-[26px] tracking-[-0.02em]">
                        <span className="text-coral">
                            <Image
                                src="/logo.png"
                                alt="Vize Makinesi"
                                width={60}
                                height={30}
                                className="w-auto h-auto "
                            />
                        </span>
                    </span>
                    <span className="font-serif font-bold italic text-[26px] tracking-[-0.02em] text-white leading-none">
                        Vize Makinesi
                    </span>
                </Link>

                {/* Desktop nav */}
                <nav
                    className="hidden lg:flex gap-1 items-center"
                    onMouseLeave={handleLeave}
                >
                    {MEGA_MENU.map((group, i) => (
                        <div
                            key={group.label}
                            onMouseEnter={() => handleEnter(i)}
                        >
                            <button
                                className={`font-sans font-bold text-[13.8px] uppercase tracking-widest px-4.5 py-3 inline-flex items-center gap-1.5 transition-colors duration-200 ${activeMega === i
                                    ? "text-coral"
                                    : "text-white/70 hover:text-coral"
                                    }`}
                            >
                                {group.label}
                                <span
                                    className="text-sm opacity-50 transition-transform duration-200"
                                    style={{
                                        transform:
                                            activeMega === i
                                                ? "rotate(180deg)"
                                                : "none",
                                    }}
                                >
                                    ↓
                                </span>
                            </button>
                        </div>
                    ))}
                    <Link
                        href="/contact"
                        className="ml-4 font-sans font-bold text-[13.8px] uppercase tracking-widest px-5.5 py-3.5 bg-coral border border-coral text-navy hover:bg-transparent hover:text-coral transition-colors duration-200 inline-flex items-center"
                    >
                        Bize Ulaşın
                    </Link>
                    <Link
                        href="/danisma-al"
                        className="ml-2 font-sans font-bold text-[13.8px] uppercase tracking-widest px-5.5 py-3.5 bg-coral text-navy border border-coral hover:bg-transparent hover:text-coral hover:border-coral transition-colors duration-200 inline-flex items-center"
                    >
                        Danışma Al →
                    </Link>
                </nav>

                {/* Hamburger */}
                <button
                    className="lg:hidden font-sans font-medium text-[12px] uppercase tracking-widest text-white"
                    onClick={() => setOpen(true)}
                >
                    Menu ↗
                </button>
            </div>

            {/* Mega panel */}
            {activeMega !== null && (
                <div
                    className="mega-panel absolute left-0 right-0 top-full bg-[#E5E2DB] border-t border-b border-border text-navy"
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
                                    {String(MEGA_MENU.length).padStart(2, "0")}
                                </div>
                                <div className="font-serif italic font-bold text-[56px] leading-none tracking-tight">
                                    {MEGA_MENU[activeMega].label}
                                </div>
                                <div className="w-20 h-px bg-coral mt-8" />
                            </div>

                            {/* Columns */}
                            <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-12">
                                {MEGA_MENU[activeMega].columns.map((col, ci) =>
                                    col.kind === "feature" ? (
                                        <Link
                                            key={ci}
                                            href={col.feature!.to}
                                            className="mega-feature flex flex-col justify-between p-7 bg-navy text-white min-h-55 border border-coral/30 hover:border-coral transition-colors duration-200"
                                        >
                                            <div className="font-mono text-[10px] tracking-[0.2em] text-coral uppercase relative z-10">
                                                — {col.feature!.eyebrow}
                                            </div>
                                            <div className="font-serif font-semibold text-[22px] leading-tight tracking-[-0.015em] mt-3 mb-4 relative z-10 text-white">
                                                {col.feature!.title}
                                            </div>
                                            <div className="text-[13px] text-white/90 leading-relaxed flex-1 relative z-10">
                                                {col.feature!.body}
                                            </div>
                                            <div className="font-sans text-[11px] tracking-widest uppercase text-coral mt-4 relative z-10">
                                                Read more →
                                            </div>
                                        </Link>
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
                                                                        {
                                                                            it.desc
                                                                        }
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

            {/* Mobile overlay */}
            {open && (
                <div className="fixed inset-0 bg-paper z-100 px-7 py-8 flex flex-col overflow-y-auto">
                    <div className="flex justify-between items-center pb-6 border-b border-border">
                        <span className="font-serif italic font-bold text-[26px] tracking-[-0.02em] text-coral">
                            Visa<span className="text-coral">.</span>Office
                        </span>
                        <button
                            className="font-sans font-medium text-[12px] uppercase tracking-widest text-navy"
                            onClick={() => setOpen(false)}
                        >
                            Close ↗
                        </button>
                    </div>
                    <nav className="flex flex-col mt-7 flex-1">
                        {MOBILE_LINKS.map((l) => (
                            <Link
                                key={l.to}
                                href={l.to}
                                className={`font-serif text-[32px] font-semibold py-4 border-b border-border flex justify-between items-center ${pathname === l.to
                                    ? "text-coral"
                                    : "text-navy"
                                    }`}
                            >
                                {l.label}
                                <span className="text-[22px] text-muted/60">
                                    →
                                </span>
                            </Link>
                        ))}
                    </nav>
                    <div className="mt-8 flex gap-6 font-mono text-[12px] tracking-widest uppercase pt-6 border-t border-border">
                        <a href={SITE.phoneHref}>{SITE.phone}</a>
                        <a
                            href={SITE.whatsappHref}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            WhatsApp
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
}
