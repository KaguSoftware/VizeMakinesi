"use client";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MOBILE_NAV } from "./constants";
import { SITE } from "@/data/site";
import type { MegaColumn, MegaMenuGroup } from "./types";

interface Props {
    open: boolean;
    pathname: string;
    navHeight: number;
    megaMenu: MegaMenuGroup[];
    onClose: () => void;
}

export default function MobileMenuOverlay({ open, pathname, navHeight, megaMenu, onClose }: Props) {
    const [expanded, setExpanded] = useState<Set<string>>(new Set());

    const toggle = (key: string) =>
        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key); else next.add(key);
            return next;
        });

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    key="mobile-overlay"
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "tween", duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                    // Covers the whole viewport and simply sits *behind* the opaque header
                    // (z-110 vs z-100) rather than starting below it — a measured `top`
                    // leaves a sliver of the page showing whenever the header shifts.
                    style={{
                        willChange: "transform",
                        paddingTop: navHeight + 32,
                        paddingBottom: "max(2rem, env(safe-area-inset-bottom))",
                    }}
                    className="fixed inset-0 bg-paper z-100 px-7 flex flex-col overflow-y-auto overscroll-contain"
                >
                    <nav aria-label="Mobil navigasyon" className="flex flex-col flex-1">
                        {MOBILE_NAV.map((entry, i) => {
                            const group =
                                entry.kind === "group"
                                    ? megaMenu.find((g) => g.label === entry.label)
                                    : undefined;

                            return (
                                <motion.div
                                    key={entry.to}
                                    initial={{ opacity: 0, x: 16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.08 + i * 0.03, duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                                >
                                    {group ? (
                                        <MegaGroupAccordion
                                            group={group}
                                            to={entry.to}
                                            pathname={pathname}
                                            isExpanded={expanded.has(entry.label)}
                                            expandedColumns={expanded}
                                            onToggle={() => toggle(entry.label)}
                                            onToggleColumn={toggle}
                                            onLinkClick={onClose}
                                        />
                                    ) : (
                                        <Link
                                            href={entry.to}
                                            onClick={onClose}
                                            className={`font-serif text-[32px] font-semibold py-4 border-b border-border flex justify-between items-center active:bg-coral/5 -mx-7 px-7 transition-colors focus-visible:outline-none focus-visible:bg-coral/10 ${pathname === entry.to ? "text-coral" : "text-navy"}`}
                                        >
                                            {entry.label}
                                            <span aria-hidden="true" className="text-[22px] text-muted/60">→</span>
                                        </Link>
                                    )}
                                </motion.div>
                            );
                        })}
                    </nav>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.22, duration: 0.2 }}
                        className="mt-8 flex gap-6 font-mono text-[12px] tracking-widest uppercase pt-6 border-t border-border"
                    >
                        <a href={SITE.phoneHref}>{SITE.phone}</a>
                        <a href="/danisma-al" onClick={onClose}>Danışma Formu</a>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

interface AccordionProps {
    group: MegaMenuGroup;
    to: string;
    pathname: string;
    isExpanded: boolean;
    /** Shared expansion set — column keys are `${group.label}:${columnIndex}`. */
    expandedColumns: Set<string>;
    onToggle: () => void;
    onToggleColumn: (key: string) => void;
    onLinkClick: () => void;
}

/** Top-level group row: the label links to the group's landing page, the
 *  chevron opens the desktop mega-panel's columns nested underneath. */
function MegaGroupAccordion({
    group,
    to,
    pathname,
    isExpanded,
    expandedColumns,
    onToggle,
    onToggleColumn,
    onLinkClick,
}: AccordionProps) {
    const columns = group.columns.filter(
        (c) => c.kind === "feature" || (c.regions?.length ?? 0) > 0 || (c.items?.length ?? 0) > 0
    );

    return (
        <div className="border-b border-border">
            <div className="flex items-center -mx-7 px-7">
                <Link
                    href={to}
                    onClick={onLinkClick}
                    className={`font-serif text-[32px] font-semibold py-4 flex-1 transition-colors focus-visible:outline-none focus-visible:bg-coral/10 ${pathname === to ? "text-coral" : "text-navy"}`}
                >
                    {group.label}
                </Link>
                <button
                    type="button"
                    aria-expanded={isExpanded}
                    aria-label={`${group.label} alt menüsünü ${isExpanded ? "kapat" : "aç"}`}
                    onClick={onToggle}
                    className="py-4 pl-6 text-navy active:opacity-60 transition-opacity focus-visible:outline-none focus-visible:bg-coral/10"
                >
                    <motion.span
                        aria-hidden="true"
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                        className="text-[22px] text-muted/60 inline-block"
                    >
                        ↓
                    </motion.span>
                </button>
            </div>

            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                        style={{ overflow: "hidden" }}
                    >
                        <div className="pb-3">
                            {columns.map((col, ci) => (
                                <MegaColumnAccordion
                                    key={ci}
                                    column={col}
                                    pathname={pathname}
                                    isExpanded={expandedColumns.has(`${group.label}:${ci}`)}
                                    onToggle={() => onToggleColumn(`${group.label}:${ci}`)}
                                    onLinkClick={onLinkClick}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

interface ColumnProps {
    column: MegaColumn;
    pathname: string;
    isExpanded: boolean;
    onToggle: () => void;
    onLinkClick: () => void;
}

/** One mega-panel column (Avrupa, Amerika, Hakkımızda …) as a nested accordion. */
function MegaColumnAccordion({ column, pathname, isExpanded, onToggle, onLinkClick }: ColumnProps) {
    if (column.kind === "feature") {
        return (
            <Link
                href={column.feature!.to}
                onClick={onLinkClick}
                className="block bg-navy text-white p-5 my-3 border border-coral/30 active:border-coral transition-colors"
            >
                <span className="block font-mono text-[10px] tracking-[0.2em] text-coral uppercase mb-2">
                    {column.feature!.eyebrow}
                </span>
                <span className="block font-serif font-semibold text-[20px] leading-tight mb-1.5">
                    {column.feature!.title}
                </span>
                <span className="block text-[13px] text-white/85 leading-relaxed">
                    {column.feature!.body}
                </span>
            </Link>
        );
    }

    const items =
        column.kind === "region-group"
            ? column.regions!.map((r) => ({ to: r.to, label: r.label, flag: r.flag, desc: undefined as string | undefined }))
            : column.items!.map((it) => ({ to: it.to, label: it.label, flag: it.flag, desc: it.desc }));

    return (
        <div className="border-t border-border/50 first:border-t-0">
            <button
                type="button"
                aria-expanded={isExpanded}
                onClick={onToggle}
                className="w-[calc(100%+3.5rem)] font-mono text-[11px] tracking-[0.2em] uppercase py-3.5 flex justify-between items-center text-muted active:bg-coral/5 -mx-7 px-7 transition-colors focus-visible:outline-none focus-visible:bg-coral/10"
            >
                {column.title}
                <motion.span
                    aria-hidden="true"
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    className="text-[14px] text-muted/60 inline-block"
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
                        className="list-none pb-2"
                    >
                        {items.map((it) => (
                            <li key={it.to}>
                                <Link
                                    href={it.to}
                                    onClick={onLinkClick}
                                    className={`grid grid-cols-[auto_1fr_auto] items-center gap-3 py-3 border-b border-border/40 last:border-b-0 active:bg-coral/5 -mx-7 pr-7 pl-11 transition-colors focus-visible:outline-none focus-visible:bg-coral/10 ${pathname === it.to ? "text-coral" : "text-navy/85"}`}
                                >
                                    <span aria-hidden="true" className="text-[18px] w-6 inline-flex justify-center shrink-0">
                                        {it.flag ?? ""}
                                    </span>
                                    <span>
                                        <span className="block font-serif font-semibold text-[19px] leading-tight tracking-[-0.01em]">
                                            {it.label}
                                        </span>
                                        {it.desc && (
                                            <span className="block text-[12px] text-muted mt-0.5 leading-snug">
                                                {it.desc}
                                            </span>
                                        )}
                                    </span>
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
