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
  /** Slot captions. Default to the travel wording. */
  startLabel?: string;
  endLabel?: string;
  /**
   * Two unrelated dates rather than a range. Used by the ABD hızlandırma
   * flow, where the wanted date is normally *earlier* than the current
   * appointment — so no ordering constraint and no range band.
   */
  independent?: boolean;
}

export default function DateRangePicker({
  travelDate,
  returnDate,
  onTravelDate,
  onReturnDate,
  startLabel = "Gidiş",
  endLabel = "Dönüş",
  independent = false,
}: Props) {
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

  // Range mode: null = picking start, "start" = picked start, waiting for end.
  const [picking, setPicking] = useState<"start" | null>(null);
  // Independent mode: which of the two slots the next click fills.
  const [slot, setSlot] = useState<"start" | "end">("start");

  const startActive = independent ? slot === "start" : picking === null && !travelDate;
  const endActive = independent ? slot === "end" : picking === "start";

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  function handleDayClick(ymd: string) {
    if (independent) {
      if (slot === "start") {
        // Clicking the already-picked date clears it.
        onTravelDate(ymd === travelDate ? "" : ymd);
        if (ymd !== travelDate) setSlot("end");
      } else {
        onReturnDate(ymd === returnDate ? "" : ymd);
      }
      return;
    }

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
    if (independent) return { isPast, isStart, isEnd, inRange: false };
    const start = travelDate;
    const end = picking === "start" ? (hovered && hovered > start ? hovered : returnDate) : returnDate;
    const inRange = start && end && ymd > start && ymd < end;
    return { isPast, isStart, isEnd, inRange };
  }

  const slotBoxCls = (active: boolean) =>
    `flex-1 min-w-0 text-left rounded-lg px-2.5 py-1.5 border transition-all duration-200 ${
      active ? "border-coral shadow-[0_0_10px_3px_rgba(48,156,155,0.45)]" : "border-transparent"
    }`;

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

        {/* Slot display inside the box. In independent mode the slots are
            buttons, so either date can be re-picked without clearing the other. */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
          {independent ? (
            <button
              type="button"
              onClick={() => setSlot("start")}
              className={slotBoxCls(startActive)}
              aria-pressed={startActive}
            >
              <SlotBody label={startLabel} value={travelDate} active={startActive} />
            </button>
          ) : (
            <div className={slotBoxCls(startActive)}>
              <SlotBody label={startLabel} value={travelDate} active={startActive} />
            </div>
          )}
          <span className="font-mono text-[9px] text-muted shrink-0">→</span>
          {independent ? (
            <button
              type="button"
              onClick={() => setSlot("end")}
              className={slotBoxCls(endActive)}
              aria-pressed={endActive}
            >
              <SlotBody label={endLabel} value={returnDate} active={endActive} />
            </button>
          ) : (
            <div className={slotBoxCls(endActive)}>
              <SlotBody label={endLabel} value={returnDate} active={endActive} />
            </div>
          )}
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
                {showBand && !independent && <span className={bandCls} />}
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
              onClick={() => {
                onTravelDate("");
                onReturnDate("");
                setPicking(null);
                setSlot("start");
              }}
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

function SlotBody({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <>
      <span className={`block font-mono text-[9px] uppercase tracking-[0.14em] transition-colors duration-150 ${active ? "text-coral" : "text-muted"}`}>
        {label}
      </span>
      <span className={`block font-serif text-[13px] truncate ${value ? "text-navy" : "text-muted/40"}`}>
        {value ? formatDisplay(value) : "—"}
      </span>
    </>
  );
}
