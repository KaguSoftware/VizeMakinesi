"use client";
import { useState, useEffect } from "react";

const MONTHS_TR = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];
const DAYS_TR = ["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"];

function toYMD(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

// Monday-first day offset
function firstDayOffset(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

interface Props {
  travelDate: string;
  returnDate: string;
  onTravelDate: (v: string) => void;
  onReturnDate: (v: string) => void;
}

export default function DateRangePicker({ travelDate, returnDate, onTravelDate, onReturnDate }: Props) {
  const [todayYMD, setTodayYMD] = useState("");
  useEffect(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
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

  const formatDisplay = (ymd: string) => {
    if (!ymd) return "—";
    const [y, m, d] = ymd.split("-");
    return `${d} ${MONTHS_TR[parseInt(m) - 1]} ${y}`;
  };

  return (
    <div className="select-none">
      {/* Calendar */}
      <div className="border border-border rounded-xl w-full max-w-sm">
        {/* Header: month nav */}
        <div className="flex items-center justify-between px-2.5 py-1.5">
          <button
            type="button"
            onClick={prevMonth}
            className="font-mono text-[10px] text-muted hover:text-navy transition-colors px-1"
            aria-label="Önceki ay"
          >
            ←
          </button>
          <span className="font-serif font-semibold text-[12px] text-navy tracking-[-0.01em]">
            {MONTHS_TR[viewMonth]} {viewYear}
          </span>
          <button
            type="button"
            onClick={nextMonth}
            className="font-mono text-[10px] text-muted hover:text-navy transition-colors px-1"
            aria-label="Sonraki ay"
          >
            →
          </button>
        </div>

        {/* Range display inside the box */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 border-b border-border">
          <div className={`flex-1 min-w-0 rounded-lg px-2 py-1 border transition-all duration-200 ${picking === null && !travelDate ? "border-coral shadow-[0_0_8px_2px_rgba(48,156,155,0.45)]" : "border-transparent"}`}>
            <span className={`block font-mono text-[8px] uppercase tracking-[0.12em] transition-colors duration-150 ${picking === null && !travelDate ? "text-coral" : "text-muted"}`}>Gidiş</span>
            <span className={`font-serif text-[11px] truncate ${travelDate ? "text-navy" : "text-muted/40"}`}>
              {travelDate ? formatDisplay(travelDate) : "—"}
            </span>
          </div>
          <span className="font-mono text-[8px] text-muted shrink-0">→</span>
          <div className={`flex-1 min-w-0 rounded-lg px-2 py-1 border transition-all duration-200 ${picking === "start" ? "border-coral shadow-[0_0_8px_2px_rgba(48,156,155,0.45)]" : "border-transparent"}`}>
            <span className={`block font-mono text-[8px] uppercase tracking-[0.12em] transition-colors duration-150 ${picking === "start" ? "text-coral" : "text-muted"}`}>Dönüş</span>
            <span className={`font-serif text-[11px] truncate ${returnDate ? "text-navy" : "text-muted/40"}`}>
              {returnDate ? formatDisplay(returnDate) : "—"}
            </span>
          </div>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 px-1">
          {DAYS_TR.map(d => (
            <div key={d} className="py-1 text-center font-mono text-[7px] uppercase tracking-[0.1em] text-muted">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 px-1 pb-1">
          {cells.map((ymd, i) => {
            if (!ymd) return <div key={`empty-${i}`} className="h-7" />;
            const { isPast, isStart, isEnd, inRange } = dayState(ymd);
            const isToday = ymd === todayYMD;
            const dayNum = parseInt(ymd.split("-")[2]);

            const wrapperCls = "relative flex items-center justify-center h-7 font-serif cursor-pointer transition-all duration-100 " +
              (isPast ? "cursor-default " : "");

            const showBand = isStart || isEnd || inRange;
            const bandCls = "absolute inset-y-[15%] " +
              (isStart ? "left-1/2 right-0 rounded-l-md " : isEnd ? "left-0 right-1/2 rounded-r-md " : "left-0 right-0 ") +
              "bg-coral/15 ";

            const circleCls = "relative z-10 flex items-center justify-center w-6 h-6 rounded-md text-[10px] " +
              (isStart || isEnd ? "bg-coral text-white font-semibold " : isPast ? "text-muted/30 " : "text-navy ");

            const hoverCls = (!isStart && !isEnd && !isPast) ? "hover:bg-navy/8 rounded-md " : "";

            return (
              <div
                key={ymd}
                onClick={() => !isPast && handleDayClick(ymd)}
                onMouseEnter={() => picking === "start" && setHovered(ymd)}
                onMouseLeave={() => setHovered(null)}
                className={wrapperCls}
              >
                {showBand && <span className={bandCls} />}
                <span className={`${circleCls} ${hoverCls}`}>
                  {isToday && !isStart && !isEnd && (
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-0.5 h-0.5 rounded-full bg-coral" />
                  )}
                  {dayNum}
                </span>
              </div>
            );
          })}
        </div>

        {/* Reset */}
        {(travelDate || returnDate) && (
          <div className="border-t border-border px-3 py-1.5 flex justify-end">
            <button
              type="button"
              onClick={() => { onTravelDate(""); onReturnDate(""); setPicking(null); }}
              className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted hover:text-coral transition-colors"
            >
              Temizle
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
