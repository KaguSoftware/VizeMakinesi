"use client";
import { AnimatePresence, motion } from "framer-motion";
import type { ResultInfo } from "./cascadeRules";

interface Props {
  result: ResultInfo | null;
  visible: boolean;
  /** Tighter padding for the embedded home page panel. */
  compact?: boolean;
}

export default function ResultPanel({ result, visible, compact }: Props) {
  return (
    <AnimatePresence mode="wait">
      {visible && result ? (
        <motion.div
          key="result"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ type: "spring", stiffness: 340, damping: 28 }}
          className={`border ${compact ? 'p-4' : 'p-6'} ${result.isBroken ? "border-red-300 bg-red-50" : result.isOutside ? "border-navy/20 bg-navy/5" : "border-coral/40 bg-coral/8"}`}
        >
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className={`font-mono text-[10px] uppercase tracking-[0.18em] text-coral ${compact ? "mb-1.5" : "mb-3"}`}
          >
            — Sonuç
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className={`font-serif font-bold leading-tight mb-1.5 ${compact ? "text-[18px]" : "text-[22px]"} ${result.isBroken ? "text-red-700" : "text-navy"}`}
          >
            {result.label}
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`font-serif text-[13px] text-coral ${compact ? "mb-2" : "mb-5"}`}
          >{result.current}</motion.p>

          {result.warnings.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={`flex flex-col gap-2 ${compact ? "mb-2" : "mb-5"}`}
            >
              {result.warnings.map((w, i) => (
                <div key={i} className="flex gap-2.5 px-3 py-2.5 bg-amber-50 border border-amber-200">
                  <span className="font-mono text-[11px] text-amber-600 mt-0.5 shrink-0">⚠</span>
                  <p className="font-serif text-[13px] text-amber-800 leading-snug">{w.text}</p>
                </div>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: result.warnings.length > 0 ? 0.22 : 0.18, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`border-t border-navy/10 ${compact ? "pt-3 mt-3" : "pt-5"}`}
          >
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-coral mb-1.5">Bir Sonraki Adım</div>
            <p className={`font-serif leading-relaxed ${compact ? "text-[13px]" : "text-[15px]"} ${result.isBroken ? "text-red-600" : "text-coral"}`}>{result.next}</p>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`border border-navy/10 flex items-center justify-center bg-white ${compact ? 'px-3 py-3' : 'p-6 min-h-32'}`}
        >
          <p className={`font-serif text-coral/70 text-center ${compact ? 'text-[14px] leading-snug' : 'text-[14px]'}`}>
            {compact
              ? "Alanları doldurun, sonuç burada görünsün."
              : "Tüm alanları doldurun ve tarih aralığı seçerek hesaplama yapın."}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
