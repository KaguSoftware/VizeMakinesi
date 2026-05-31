"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  DAYS_TR,
  MONTHS_TR,
  daysInMonth,
  firstDayOffset,
  toYMD,
} from "@/lib/dates/calendar";
import NativeSelect from "./NativeSelect";

const CURRENT_YEAR = new Date().getFullYear();
const PAST_YEARS = Array.from({ length: 20 }, (_, i) => CURRENT_YEAR - i);

interface Props {
  startDate: string;
  endDate: string;
  todayYMD: string;
  onStartDateChange: (ymd: string) => void;
  onEndDateChange: (ymd: string) => void;
}

export default function CalendarPicker({
  startDate,
  endDate,
  todayYMD,
  onStartDateChange,
  onEndDateChange,
}: Props) {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [hovered, setHovered] = useState<string | null>(null);
  const [picking, setPicking] = useState<"start" | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);

  function handleDayClick(ymd: string) {
    if (picking === null) {
      onStartDateChange(ymd); onEndDateChange(""); setPicking("start");
    } else {
      if (ymd < startDate) { onStartDateChange(ymd); onEndDateChange(""); }
      else if (ymd === startDate) { onStartDateChange(""); onEndDateChange(""); setPicking(null); }
      else { onEndDateChange(ymd); setPicking(null); }
    }
  }

  function dayState(ymd: string) {
    const isFuture = todayYMD ? ymd > todayYMD : false;
    const isStart = ymd === startDate;
    const isEnd = ymd === endDate;
    const end = picking === "start" ? (hovered && hovered > startDate ? hovered : endDate) : endDate;
    const inRange = !!(startDate && end && ymd > startDate && ymd < end);
    return { isFuture, isStart, isEnd, inRange };
  }

  const offset = firstDayOffset(viewYear, viewMonth);
  const totalDays = daysInMonth(viewYear, viewMonth);
  const cells: (string | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => toYMD(new Date(viewYear, viewMonth, i + 1))),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="border border-navy/20 bg-white select-none">
      <div className="flex items-center justify-between px-4 py-3 border-b border-navy/10">
        <motion.button
          type="button"
          onClick={() => {
            setDirection(-1);
            if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); } else setViewMonth((m) => m - 1);
          }}
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.8 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="font-mono text-[12px] text-navy/40 hover:text-navy transition-colors px-1.5"
          aria-label="Önceki ay"
        >←</motion.button>
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="bg-cream rounded-xl px-3 py-1.5"
          >
            <NativeSelect
              coral
              value={viewMonth}
              onChange={(v) => {
                setDirection(parseInt(v) > viewMonth ? 1 : -1);
                setViewMonth(parseInt(v));
              }}
              options={MONTHS_TR.map((m, i) => ({ label: m, value: i }))}
            />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="bg-cream rounded-xl px-3 py-1.5"
          >
            <NativeSelect
              coral
              value={viewYear}
              onChange={(v) => {
                setDirection(parseInt(v) > viewYear ? 1 : -1);
                setViewYear(parseInt(v));
              }}
              options={PAST_YEARS.map((y) => ({ label: String(y), value: y }))}
            />
          </motion.div>
        </div>
        <motion.button
          type="button"
          onClick={() => {
            setDirection(1);
            if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); } else setViewMonth((m) => m + 1);
          }}
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.8 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="font-mono text-[12px] text-navy/40 hover:text-navy transition-colors px-1.5"
          aria-label="Sonraki ay"
        >→</motion.button>
      </div>

      <div className="grid grid-cols-7 px-2 pt-2">
        {DAYS_TR.map((d) => (
          <div key={d} className="py-1.5 text-center font-mono text-[9px] uppercase tracking-widest text-navy/30">{d}</div>
        ))}
      </div>
      <div className="overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.div
            key={`${viewYear}-${viewMonth}`}
            custom={direction}
            variants={{
              enter: (dir: number) => ({ x: dir * 40, opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (dir: number) => ({ x: dir * -40, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="grid grid-cols-7 px-2 pb-3"
          >
            {cells.map((ymd, i) => {
              if (!ymd) return <div key={`e-${i}`} className="h-10" />;
              const { isFuture, isStart, isEnd, inRange } = dayState(ymd);
              const isToday = ymd === todayYMD;
              const dayNum = parseInt(ymd.split("-")[2]);

              const bandCls = "absolute inset-y-[15%] " +
                (isStart ? "left-1/2 right-0 " : isEnd ? "left-0 right-1/2 " : "left-0 right-0 ") +
                "bg-coral/15 ";
              const circleCls = "relative z-10 flex items-center justify-center w-9 h-9 rounded-lg text-[12px] " +
                (isStart || isEnd ? "bg-coral text-white font-semibold " : isFuture ? "text-navy/20 " : "text-navy/80 ");
              const hoverCls = (!isStart && !isEnd && !isFuture) ? "hover:bg-navy/8 rounded-lg " : "";

              return (
                <div
                  key={ymd}
                  onClick={() => !isFuture && handleDayClick(ymd)}
                  onMouseEnter={() => picking === "start" && setHovered(ymd)}
                  onMouseLeave={() => setHovered(null)}
                  className={`relative flex items-center justify-center h-10 font-serif ${isFuture ? "cursor-default" : "cursor-pointer"}`}
                >
                  {(isStart || isEnd || inRange) && <span className={bandCls} />}
                  <span className={`${circleCls} ${hoverCls}`}>
                    {isToday && !isStart && !isEnd && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-coral" />
                    )}
                    {dayNum}
                  </span>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
      {(startDate || endDate) && (
        <div className="border-t border-navy/10 px-4 py-2 flex justify-end">
          <button
            type="button"
            onClick={() => { onStartDateChange(""); onEndDateChange(""); setPicking(null); }}
            className="font-mono text-[9px] uppercase tracking-[0.14em] text-navy/30 hover:text-coral transition-colors"
          >
            Temizle
          </button>
        </div>
      )}
    </div>
  );
}
