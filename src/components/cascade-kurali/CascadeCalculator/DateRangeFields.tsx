"use client";
import { useState } from "react";
import { daysBetween } from "@/lib/dates/calendar";

interface Props {
  startDate: string;
  endDate: string;
  todayYMD: string;
  onStartDateChange: (ymd: string) => void;
  onEndDateChange: (ymd: string) => void;
}

/**
 * Plain GG.AA.YYYY inputs — the compact alternative to <CalendarPicker>.
 * People read these two dates straight off their previous visa sticker, so
 * typing beats paginating a calendar back through years. The mask is fixed
 * to the Turkish order rather than following the browser locale the way a
 * native date input does; values are still handed upward as ISO YYYY-MM-DD.
 */

/** Digits only, dotted as the user types: "10012024" → "10.01.2024". */
function mask(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 8);
  return [d.slice(0, 2), d.slice(2, 4), d.slice(4, 8)].filter(Boolean).join(".");
}

/** "10.01.2024" → "2024-01-10"; "" when incomplete or not a real date. */
function toISO(text: string) {
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(text);
  if (!m) return "";
  const [, dd, mm, yyyy] = m;
  const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  const real =
    d.getFullYear() === Number(yyyy) &&
    d.getMonth() === Number(mm) - 1 &&
    d.getDate() === Number(dd);
  return real ? `${yyyy}-${mm}-${dd}` : "";
}

function fromISO(ymd: string) {
  if (!ymd) return "";
  const [y, m, d] = ymd.split("-");
  return `${d}.${m}.${y}`;
}

/** Today as ISO, for the brief moment before the parent computes it client-side. */
function toTodayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function DateRangeFields({
  startDate,
  endDate,
  todayYMD,
  onStartDateChange,
  onEndDateChange,
}: Props) {
  const [startText, setStartText] = useState(fromISO(startDate));
  const [endText, setEndText] = useState(fromISO(endDate));

  const startISO = toISO(startText);
  const endISO = toISO(endText);
  const complete = (t: string) => t.length === 10;

  // Plausibility bounds: a real-date check alone still accepts typos like
  // 1824 or 3099.
  const today = todayYMD || toTodayISO();
  const [ty, tm, td] = today.split("-").map(Number);
  // 70 years back — generous, but rules out a mistyped century.
  const minISO = `${ty - 70}-${String(tm).padStart(2, "0")}-${String(td).padStart(2, "0")}`;
  // A visa is not issued with a validity window opening more than ~6 months
  // out, so anything further ahead is a typo.
  const startMaxISO = `${tm > 6 ? ty + 1 : ty}-${String(((tm + 5) % 12) + 1).padStart(2, "0")}-${String(td).padStart(2, "0")}`;
  // Bitiş gets a far looser ceiling: a 5-year MEV held today legitimately
  // expires years from now, and that is the top cascade tier.
  const endMaxISO = `${ty + 10}-12-31`;

  const tooOld = (iso: string) => !!iso && iso < minISO;
  const startTooFar = (iso: string) => !!iso && iso > startMaxISO;
  const endTooFar = (iso: string) => !!iso && iso > endMaxISO;
  const startAllowed = (iso: string) => !!iso && !tooOld(iso) && !startTooFar(iso);
  const endAllowed = (iso: string) => !!iso && !tooOld(iso) && !endTooFar(iso);

  // Errors surface only once a field is fully typed, so the message does not
  // flicker while the user is still entering digits.
  let startError = "";
  if (complete(startText) && !startISO) startError = "Geçersiz tarih.";
  else if (startTooFar(startISO)) startError = "Tarih çok ileri.";
  else if (tooOld(startISO)) startError = "Tarih çok eski.";

  let endError = "";
  if (complete(endText) && !endISO) endError = "Geçersiz tarih.";
  else if (endTooFar(endISO)) endError = "Tarih çok ileri.";
  else if (tooOld(endISO)) endError = "Tarih çok eski.";
  else if (endISO && startISO && endISO <= startISO) endError = "Bitiş, başlangıçtan sonra olmalı.";

  function handleStart(raw: string) {
    const text = mask(raw);
    setStartText(text);
    const iso = toISO(text);
    const valid = startAllowed(iso) ? iso : "";
    onStartDateChange(valid);
    // An end date that no longer follows the start is not a usable range.
    if (endISO && valid && endISO <= valid) onEndDateChange("");
  }

  function handleEnd(raw: string) {
    const text = mask(raw);
    setEndText(text);
    const iso = toISO(text);
    onEndDateChange(endAllowed(iso) && (!startISO || iso > startISO) ? iso : "");
  }

  function clear() {
    setStartText("");
    setEndText("");
    onStartDateChange("");
    onEndDateChange("");
  }

  const fieldCls =
    "w-full px-3 py-2 border bg-white font-serif text-[14px] text-navy tracking-[0.04em] " +
    "placeholder:text-navy/25 focus:outline-none transition-colors";

  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { id: "cascade-start", label: "Başlangıç", value: startText, onChange: handleStart, error: startError },
          { id: "cascade-end", label: "Bitiş", value: endText, onChange: handleEnd, error: endError },
        ].map((f) => (
          <div key={f.id}>
            <label
              htmlFor={f.id}
              className="font-mono text-[10px] uppercase tracking-[0.14em] text-coral mb-1 block"
            >
              {f.label}
            </label>
            <input
              id={f.id}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="GG.AA.YYYY"
              maxLength={10}
              value={f.value}
              onChange={(e) => f.onChange(e.target.value)}
              aria-invalid={!!f.error}
              className={`${fieldCls} ${f.error ? "border-red-400 focus:border-red-500" : "border-navy/20 focus:border-coral"}`}
            />
            {f.error && (
              <p className="font-mono text-[10px] text-red-500 mt-1 leading-snug">{f.error}</p>
            )}
          </div>
        ))}
      </div>

      {startDate && endDate && (
        <div className="flex items-center justify-between mt-1.5">
          <span className="font-mono text-[11px] text-coral tracking-[0.08em]">
            {daysBetween(startDate, endDate)} gün geçerlilik
          </span>
          <button
            type="button"
            onClick={clear}
            className="font-mono text-[9px] uppercase tracking-[0.14em] text-navy/30 hover:text-coral transition-colors"
          >
            Temizle
          </button>
        </div>
      )}
    </div>
  );
}
