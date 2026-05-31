"use client";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MOBILE_LINKS } from "./constants";
import { SITE } from "@/data/site";
import type { MegaMenuGroup } from "./types";

interface Props {
    open: boolean;
    pathname: string;
    navHeight: number;
    megaMenu: MegaMenuGroup[];
    onClose: () => void;
}

export default function MobileMenuOverlay({ open, pathname, navHeight, megaMenu, onClose }: Props) {
    const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set());

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    key="mobile-overlay"
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "tween", duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                    style={{ top: navHeight, willChange: "transform", paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}
                    className="fixed inset-x-0 bottom-0 bg-paper z-100 px-7 pt-8 flex flex-col overflow-y-auto"
                >
                    <nav aria-label="Mobil navigasyon" className="flex flex-col flex-1">
                        {MOBILE_LINKS.map((l, i) => (
                            <motion.div
                                key={l.to}
                                initial={{ opacity: 0, x: 16 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.08 + i * 0.025, duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                            >
                                <Link
                                    href={l.to}
                                    onClick={onClose}
                                    className={`font-serif text-[32px] font-semibold py-4 border-b border-border flex justify-between items-center active:bg-coral/5 -mx-7 px-7 transition-colors focus-visible:outline-none focus-visible:bg-coral/10 ${pathname === l.to ? "text-coral" : "text-navy"}`}
                                >
                                    {l.label}
                                    <span aria-hidden="true" className="text-[22px] text-muted/60">→</span>
                                </Link>
                            </motion.div>
                        ))}

                        {/* Collapsible mega-menu groups — exposes country & sub-pages
                            that the desktop hover-menu shows, unreachable on mobile otherwise. */}
                        {megaMenu.map((group, gi) => (
                            <MegaGroupAccordion
                                key={`mega-${gi}`}
                                group={group}
                                isExpanded={expandedGroups.has(gi)}
                                pathname={pathname}
                                onToggle={() => setExpandedGroups((prev) => {
                                    const next = new Set(prev);
                                    if (next.has(gi)) next.delete(gi); else next.add(gi);
                                    return next;
                                })}
                                onLinkClick={onClose}
                            />
                        ))}
                    </nav>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.22, duration: 0.2 }}
                        className="mt-8 flex gap-6 font-mono text-[12px] tracking-widest uppercase pt-6 border-t border-border"
                    >
                        <a href={SITE.phoneHref}>{SITE.phone}</a>
                        <a href={SITE.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

interface AccordionProps {
    group: MegaMenuGroup;
    isExpanded: boolean;
    pathname: string;
    onToggle: () => void;
    onLinkClick: () => void;
}

function MegaGroupAccordion({ group, isExpanded, pathname, onToggle, onLinkClick }: AccordionProps) {
    const subLinks: { to: string; label: string; flag?: string }[] = [];
    for (const col of group.columns) {
        if (col.kind === "feature") continue;
        if (col.kind === "region-group") {
            col.regions!.forEach((r) => subLinks.push({ to: r.to, label: r.label, flag: r.flag }));
        } else {
            col.items!.forEach((it) => subLinks.push({ to: it.to, label: it.label, flag: it.flag }));
        }
    }
    if (subLinks.length === 0) return null;

    return (
        <div className="border-b border-border">
            <button
                type="button"
                aria-expanded={isExpanded}
                onClick={onToggle}
                className="w-full font-serif text-[32px] font-semibold py-4 flex justify-between items-center text-navy active:bg-coral/5 -mx-7 px-7 transition-colors focus-visible:outline-none focus-visible:bg-coral/10"
            >
                {group.label}
                <motion.span
                    aria-hidden="true"
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    className="text-[22px] text-muted/60 inline-block"
                >
                    ↓
                </motion.span>
            </button>
            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                        style={{ overflow: "hidden" }}
                        className="list-none pl-2"
                    >
                        {subLinks.map((sl) => (
                            <li key={sl.to}>
                                <Link
                                    href={sl.to}
                                    onClick={onLinkClick}
                                    className={`font-serif text-[20px] py-3 flex items-center gap-3 border-b border-border/60 last:border-b-0 active:bg-coral/5 -mx-7 px-7 transition-colors focus-visible:outline-none focus-visible:bg-coral/10 ${pathname === sl.to ? "text-coral" : "text-navy/85"}`}
                                >
                                    {sl.flag && <span className="text-[18px] w-6 inline-flex justify-center shrink-0">{sl.flag}</span>}
                                    <span className="flex-1">{sl.label}</span>
                                    <span aria-hidden="true" className="text-[14px] text-muted/50">→</span>
                                </Link>
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
}
