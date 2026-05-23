"use client";
import { useState, useEffect } from "react";
import {
  DAYS_TR,
  MONTHS_TR,
  daysInMonth,
  firstDayOffset,
  formatDisplay,
  toYMD,
} from "@/lib/dates/calendar";

interface Props {
  travelDate: string;
  returnDate: string;
  onTravelDate: (v: string) => void;
  onReturnDate: (v: string) => void;
}

export default function DateRangePicker({ travelDate, returnDate, onTravelDate, onReturnDate }: Props) {
  const [todayYMD, setTodayYMD] = useState("");
  useEffect(() => {
    // Compute "today" on the client to avoid SSR/CSR mismatch on timezone boundaries.
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTodayYMD(toYMD(d));
  }, []);

  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [hovered, setHovered] = useState<string | null>(null);

  // selecting: null = picking start, "start" = picked start, waiting for end
  const [picking, setPicking] = useState<"start" | null>(null);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  function handleDayClick(ymd: string) {
    if (picking === null) {
      // first click — set start, clear end
      onTravelDate(ymd);
      onReturnDate("");
      setPicking("start");
    } else {
      // second click
      if (ymd < travelDate) {
        // clicked before start — restart
        onTravelDate(ymd);
        onReturnDate("");
      } else if (ymd === travelDate) {
        // same day — deselect
        onTravelDate("");
        onReturnDate("");
        setPicking(null);
      } else {
        onReturnDate(ymd);
        setPicking(null);
      }
    }
  }

  const offset = firstDayOffset(viewYear, viewMonth);
  const totalDays = daysInMonth(viewYear, viewMonth);

  const cells: (string | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => {
      const d = new Date(viewYear, viewMonth, i + 1);
      return toYMD(d);
    }),
  ];
  // pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null);

  function dayState(ymd: string) {
    const isPast = todayYMD ? ymd < todayYMD : false;
    const isStart = ymd === travelDate;
    const isEnd = ymd === returnDate;
    const start = travelDate;
    const end = picking === "start" ? (hovered && hovered > start ? hovered : returnDate) : returnDate;
    const inRange = start && end && ymd > start && ymd < end;
    return { isPast, isStart, isEnd, inRange };
  }


  return (
    <div className="select-none">
      {/* Calendar */}
      <div className="border border-border rounded-xl w-full max-w-full sm:max-w-md overflow-hidden">
        {/* Header: month nav */}
        <div className="flex items-center justify-between px-4 py-2.5">
          <button
            type="button"
            onClick={prevMonth}
            className="font-mono text-[14px] text-muted hover:text-navy transition-colors px-3 py-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
            aria-label="Önceki ay"
          >
            ←
          </button>
          <span className="font-serif font-semibold text-[14px] text-navy tracking-[-0.01em]">
            {MONTHS_TR[viewMonth]} {viewYear}
          </span>
          <button
            type="button"
            onClick={nextMonth}
            className="font-mono text-[14px] text-muted hover:text-navy transition-colors px-3 py-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
            aria-label="Sonraki ay"
          >
            →
          </button>
        </div>

        {/* Range display inside the box */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
          <div className={`flex-1 min-w-0 rounded-lg px-2.5 py-1.5 border transition-all duration-200 ${picking === null && !travelDate ? "border-coral shadow-[0_0_10px_3px_rgba(48,156,155,0.45)]" : "border-transparent"}`}>
            <span className={`block font-mono text-[9px] uppercase tracking-[0.14em] transition-colors duration-150 ${picking === null && !travelDate ? "text-coral" : "text-muted"}`}>Gidiş</span>
            <span className={`font-serif text-[13px] truncate ${travelDate ? "text-navy" : "text-muted/40"}`}>
              {travelDate ? formatDisplay(travelDate) : "—"}
            </span>
          </div>
          <span className="font-mono text-[9px] text-muted shrink-0">→</span>
          <div className={`flex-1 min-w-0 rounded-lg px-2.5 py-1.5 border transition-all duration-200 ${picking === "start" ? "border-coral shadow-[0_0_10px_3px_rgba(48,156,155,0.45)]" : "border-transparent"}`}>
            <span className={`block font-mono text-[9px] uppercase tracking-[0.14em] transition-colors duration-150 ${picking === "start" ? "text-coral" : "text-muted"}`}>Dönüş</span>
            <span className={`font-serif text-[13px] truncate ${returnDate ? "text-navy" : "text-muted/40"}`}>
              {returnDate ? formatDisplay(returnDate) : "—"}
            </span>
          </div>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 px-2 pt-1.5">
          {DAYS_TR.map(d => (
            <div key={d} className="py-1.5 text-center font-mono text-[9px] uppercase tracking-widest text-muted">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 px-2 pb-2">
          {cells.map((ymd, i) => {
            if (!ymd) return <div key={`empty-${i}`} className="h-11" />;
            const { isPast, isStart, isEnd, inRange } = dayState(ymd);
            const isToday = ymd === todayYMD;
            const dayNum = parseInt(ymd.split("-")[2]);

            const wrapperCls = "relative flex items-center justify-center h-11 font-serif cursor-pointer transition-all duration-100 " +
              (isPast ? "cursor-default " : "");

            const showBand = isStart || isEnd || inRange;
            const bandCls = "absolute inset-y-[15%] " +
              (isStart ? "left-1/2 right-0 rounded-l-lg " : isEnd ? "left-0 right-1/2 rounded-r-lg " : "left-0 right-0 ") +
              "bg-coral/15 ";

            const circleCls = "relative z-10 flex items-center justify-center w-10 h-10 rounded-lg text-[12px] " +
              (isStart || isEnd ? "bg-coral text-white font-semibold " : isPast ? "text-muted/30 " : "text-navy ");

            const hoverCls = (!isStart && !isEnd && !isPast) ? "hover:bg-navy/8 rounded-lg " : "";

            return (
              <div
                key={ymd}
                onClick={() => !isPast && handleDayClick(ymd)}
                onMouseEnter={() => picking === "start" && setHovered(ymd)}
                onMouseLeave={() => setHovered(null)}
                aria-disabled={isPast || undefined}
                className={wrapperCls}
              >
                {showBand && <span className={bandCls} />}
                <span className={`${circleCls} ${hoverCls}`}>
                  {isToday && !isStart && !isEnd && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-coral" />
                  )}
                  {dayNum}
                </span>
              </div>
            );
          })}
        </div>

        {/* Reset */}
        {(travelDate || returnDate) && (
          <div className="border-t border-border px-4 py-2 flex justify-end">
            <button
              type="button"
              onClick={() => { onTravelDate(""); onReturnDate(""); setPicking(null); }}
              className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted hover:text-coral transition-colors"
            >
              Temizle
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
