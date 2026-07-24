"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { DanismaCountry } from "@/lib/data/countries";

interface Props {
  countries: DanismaCountry[];
  value: string;
  onChange: (name: string) => void;
  invalid?: boolean;
  describedBy?: string;
}

// Turkish-aware, accent-insensitive normalisation for matching.
function normalize(s: string) {
  return s
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

// Letters (incl. Turkish), spaces, hyphens and apostrophes only — no digits.
function sanitizeSearch(raw: string): string {
  return raw.replace(/[^\p{L}\s'-]/gu, "");
}

export default function CountryPicker({ countries, value, onChange, invalid, describedBy }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = countries.find((c) => c.name === value);

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
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  // Focus the search field when opening, reset active row.
  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      setQuery("");
    }
  }, [open]);

  // Keep the active row in view.
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.children[active] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  function select(name: string) {
    onChange(name);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[active]) select(filtered[active].name);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className="relative" onKeyDown={onKeyDown}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        data-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className={`${inputCls} cursor-pointer flex items-center justify-between text-left`}
      >
        <span className={selected ? "text-navy" : "text-muted/40"}>
          {selected ? `${selected.flag_emoji ? `${selected.flag_emoji} ` : ""}${selected.name}` : "Ülke seçin…"}
        </span>
        <motion.span
          aria-hidden="true"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.18 }}
          className="ml-2 shrink-0 font-mono text-[11px] text-muted"
        >
          ▾
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-30 mt-2 w-full rounded-xl border border-border bg-white shadow-[0_16px_40px_-16px_rgba(15,23,42,0.35)] overflow-hidden"
          >
            <div className="p-2 border-b border-border">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(sanitizeSearch(e.target.value));
                  setActive(0);
                }}
                placeholder="Ülke ara…"
                className="w-full bg-cream/40 rounded-lg px-3 py-2 font-serif text-[15px] sm:text-[14px] text-navy placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-coral"
                aria-label="Ülke ara"
                aria-autocomplete="list"
              />
            </div>
            <ul
              ref={listRef}
              role="listbox"
              className="max-h-64 overflow-y-auto py-1"
            >
              {filtered.length === 0 ? (
                <li className="px-3 py-3 font-serif text-[14px] text-muted/60 text-center">
                  Sonuç bulunamadı
                </li>
              ) : (
                filtered.map((c, i) => {
                  const isSel = c.name === value;
                  const isActive = i === active;
                  return (
                    <li
                      key={`${c.name}-${i}`}
                      role="option"
                      aria-selected={isSel}
                      onClick={() => select(c.name)}
                      onMouseEnter={() => setActive(i)}
                      className={`px-3 py-2 cursor-pointer font-serif text-[15px] sm:text-[14px] flex items-center gap-2 transition-colors duration-100 ${
                        isActive ? "bg-coral/10" : ""
                      } ${isSel ? "text-coral font-semibold" : "text-navy"}`}
                    >
                      {c.flag_emoji && <span aria-hidden="true">{c.flag_emoji}</span>}
                      <span className="truncate">{c.name}</span>
                      {isSel && <span className="ml-auto text-coral" aria-hidden="true">✓</span>}
                    </li>
                  );
                })
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputCls =
  "w-full bg-transparent border-b border-border pb-1.5 font-serif text-[16px] sm:text-[14px] text-navy placeholder:text-muted/40 focus:outline-none focus:border-coral focus:border-b-2 focus:pb-[5px] transition-colors duration-150";
