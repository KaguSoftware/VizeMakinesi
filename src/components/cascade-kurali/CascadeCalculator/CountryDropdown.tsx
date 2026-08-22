"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SCHENGEN_COUNTRIES, type SchengenCountry } from "./cascadeRules";

interface Props {
  value: string;
  onChange: (name: string) => void;
}

export default function CountryDropdown({ value, onChange, compact }: Props & { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = SCHENGEN_COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );
  const selected: SchengenCountry | undefined = SCHENGEN_COUNTRIES.find((c) => c.name === value);

  return (
    <div>
      <label className={`font-mono text-[11px] uppercase tracking-[0.18em] text-coral block ${compact ? "mb-1" : "mb-2"}`}>Ülke</label>
      <div className="relative" ref={dropdownRef}>
        <motion.button
          type="button"
          onClick={() => setOpen((v) => !v)}
          whileTap={{ scale: 0.99 }}
          className={`w-full flex items-center justify-between gap-3 px-4 border border-navy/20 bg-white text-left hover:border-coral ${compact ? "py-2" : "py-2.5"} transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-1`}
        >
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.span
                key={selected.name}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.18 }}
                className="font-serif text-[15px] text-navy flex items-center gap-2"
              >
                <motion.span
                  initial={{ scale: 0.5, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                >{selected.flag_emoji ?? "🌍"}</motion.span>
                {selected.name}
              </motion.span>
            ) : (
              <motion.span
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-serif text-[15px] text-navy/30"
              >Ülke seçin…</motion.span>
            )}
          </AnimatePresence>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="font-mono text-[11px] text-navy/30 inline-block"
          >↓</motion.span>
        </motion.button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8, scaleY: 0.92 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -8, scaleY: 0.92 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              style={{ originY: 0 }}
              className="absolute left-0 right-0 top-full z-20 bg-white border border-navy/20 border-t-0 max-h-64 overflow-y-auto shadow-md"
            >
              <div className="p-2 border-b border-navy/10">
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Ara…"
                  className="w-full bg-transparent font-serif text-[16px] sm:text-[14px] text-navy placeholder:text-navy/30 px-2 py-1.5 focus:outline-none"
                />
              </div>
              {filtered.map((c, idx) => (
                <motion.button
                  key={c.name}
                  type="button"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.018, duration: 0.16 }}
                  onClick={() => { onChange(c.name); setOpen(false); setSearch(""); }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 font-serif text-[14px] text-navy/80 hover:text-coral hover:bg-navy/5 transition-colors text-left"
                >
                  <span>{c.flag_emoji ?? "🌍"}</span>
                  {c.name}
                </motion.button>
              ))}
              {filtered.length === 0 && (
                <p className="px-4 py-3 font-serif text-[13px] text-navy/30">Sonuç bulunamadı.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
