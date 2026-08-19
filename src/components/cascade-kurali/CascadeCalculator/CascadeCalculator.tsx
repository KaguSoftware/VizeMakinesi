"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FadeIn } from "@/components/shared/motion";
import {
  MONTHS_TR,
  daysBetween,
  formatDisplay,
  toYMD,
} from "@/lib/dates/calendar";
import { calculateResult, type VisaType } from "./cascadeRules";
import NativeSelect from "./NativeSelect";
import CountryDropdown from "./CountryDropdown";
import CalendarPicker from "./CalendarPicker";
import ResultPanel from "./ResultPanel";

const CURRENT_YEAR = new Date().getFullYear();
const FUTURE_YEARS = Array.from({ length: 15 }, (_, i) => CURRENT_YEAR + i);

export default function CascadeCalculator({ compact }: { compact?: boolean }) {
  // Inputs
  const [country, setCountry] = useState("");
  const [visaType, setVisaType] = useState<VisaType | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [visaCount, setVisaCount] = useState<number>(0);
  const [lawfulUse, setLawfulUse] = useState<boolean | null>(null);
  const [passportExpiryYear, setPassportExpiryYear] = useState(CURRENT_YEAR + 5);
  const [passportExpiryMonth, setPassportExpiryMonth] = useState(0);
  const [passportSet, setPassportSet] = useState(false);

  // Display helpers
  const [todayYMD, setTodayYMD] = useState("");
  const [visaCountDirection, setVisaCountDirection] = useState<1 | -1>(1);

  useEffect(() => {
    // Compute "today" on the client to avoid SSR/CSR mismatch on timezone boundaries.
    const d = new Date(); d.setHours(0, 0, 0, 0);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTodayYMD(toYMD(d));
  }, []);

  const passportExpiry = passportSet
    ? `${passportExpiryYear}-${String(passportExpiryMonth + 1).padStart(2, "0")}`
    : "";
  const canCalculate = !!(country && visaType && startDate && endDate && lawfulUse !== null && passportSet);
  const result = canCalculate
    ? calculateResult({
        visaType: visaType!,
        startDate,
        endDate,
        visaCount,
        lawfulUse: lawfulUse!,
        passportExpiry,
      })
    : null;

  return (
    <section id="cascade-hesaplayici" className={`${compact ? 'py-8' : 'py-12'} bg-cream border-t border-border`}>
      <div className="container">
        <FadeIn>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-coral mb-3">
            — Hesaplayıcı
          </div>
        </FadeIn>
        {compact && (
          <FadeIn delay={0.04}>
            <Link
              href="/cascade-kurali"
              className="font-sans font-medium text-[12px] uppercase tracking-[0.14em] text-navy/70 hover:text-coral transition-colors duration-200 inline-flex items-center gap-1.5 mb-2"
            >
              Cascade Kuralı nedir? →
            </Link>
          </FadeIn>
        )}
        <FadeIn delay={0.08}>
          <h2 className="font-serif font-bold text-[clamp(28px,4vw,48px)] leading-none tracking-tight text-navy mb-2">
            Cascade Kuralı Hesaplayıcısı
          </h2>
        </FadeIn>
        <FadeIn delay={0.14}>
          <p className={`font-serif ${compact ? 'text-[14px] mb-5' : 'text-[16px] mb-8'} text-coral max-w-xl`}>
            Geçmiş vizenizin bilgilerini girin, bir sonraki adımınızı hesaplayalım.
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className={`grid grid-cols-1 lg:grid-cols-2 ${compact ? 'gap-6' : 'gap-10'}`}>
            {/* Left: inputs */}
            <div className={`flex flex-col ${compact ? 'gap-3' : 'gap-5'}`}>
              <CountryDropdown value={country} onChange={setCountry} />

              {/* Visa type */}
              <div>
                <label className="font-mono text-[11px] uppercase tracking-[0.18em] text-coral mb-2 block">Vize Türü</label>
                <div className="grid grid-cols-2 gap-3">
                  {(["C", "D"] as VisaType[]).map((t) => (
                    <motion.button
                      key={t}
                      type="button"
                      onClick={() => setVisaType(t)}
                      whileHover={{ scale: 1.025, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 400, damping: 22 }}
                      className={`relative px-4 py-3 border text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-1 ${visaType === t ? "border-coral bg-coral/10 shadow-sm" : "border-navy/20 bg-white hover:border-navy/40"}`}
                    >
                      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-coral mb-0.5">Tip {t}</div>
                      <div className="font-serif text-[14px] text-navy font-semibold">
                        {t === "C" ? "Kısa Süreli Schengen" : "Ulusal / Uzun Süreli"}
                      </div>
                      <div className="font-serif text-[13px] text-coral mt-0.5">
                        {t === "C" ? "90 güne kadar kalış" : "90 günden fazla kalış"}
                      </div>
                      {visaType === t && (
                        <motion.div
                          layoutId="visa-type-indicator"
                          className="absolute inset-0 border-2 border-coral pointer-events-none"
                          style={{ position: "absolute" }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Visa count */}
              <div>
                <label className="font-mono text-[11px] uppercase tracking-[0.18em] text-coral mb-1 block">
                  Toplam Schengen Vize Sayısı (Bilgi Amaçlı)
                </label>
                <p className="font-serif text-[13px] text-coral/70 mb-2 leading-snug">
                  Türkiye&apos;ye özgü Kademeli Vize Kuralı&apos;nda kademe ilerlemesi için vize sayısı yerine önceki vizenin türü ve doğru kullanımı esas alınır.
                </p>
                <div className="flex items-center gap-0 border border-navy/20 bg-white w-fit overflow-hidden">
                  <motion.button
                    type="button"
                    onClick={() => { setVisaCountDirection(-1); setVisaCount((v) => Math.max(0, v - 1)); }}
                    whileTap={{ scale: 0.88 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="w-10 h-11 flex items-center justify-center font-mono text-[16px] text-navy/40 hover:text-navy hover:bg-navy/5 transition-colors border-r border-navy/20 focus-visible:outline-none focus-visible:bg-coral/10 focus-visible:text-coral"
                  >−</motion.button>
                  <div className="w-14 h-11 flex items-center justify-center overflow-hidden relative">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={visaCount}
                        initial={{ y: visaCountDirection * -28, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: visaCountDirection * 28, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="absolute font-serif text-[20px] font-semibold text-navy"
                      >{visaCount}</motion.span>
                    </AnimatePresence>
                  </div>
                  <motion.button
                    type="button"
                    onClick={() => { setVisaCountDirection(1); setVisaCount((v) => Math.min(20, v + 1)); }}
                    whileTap={{ scale: 0.88 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="w-10 h-11 flex items-center justify-center font-mono text-[16px] text-navy/40 hover:text-navy hover:bg-navy/5 transition-colors border-l border-navy/20 focus-visible:outline-none focus-visible:bg-coral/10 focus-visible:text-coral"
                  >+</motion.button>
                </div>
              </div>

              {/* Lawful use */}
              <div>
                <label className="font-mono text-[11px] uppercase tracking-[0.18em] text-coral mb-1 block">
                  Önceki Vizelerin Doğru Kullanımı
                </label>
                <p className="font-serif text-[13px] text-coral/70 mb-2 leading-snug">
                  Vize ihlali (ilk giriş kuralını çiğnemek, kalış süresini aşmak) cascade zincirini sıfırlar.
                </p>
                <div className="flex flex-col gap-2">
                  {[
                    { value: true, label: "Evet, tüm vizelerimi kurallara uygun kullandım" },
                    { value: false, label: "Hayır, bir ihlal yaşandı" },
                  ].map((opt) => (
                    <motion.button
                      key={String(opt.value)}
                      type="button"
                      onClick={() => setLawfulUse(opt.value)}
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 22 }}
                      className={`relative flex items-center gap-3 px-4 py-2.5 border text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-1 ${lawfulUse === opt.value ? "border-coral bg-coral/10" : "border-navy/20 bg-white hover:border-navy/40"}`}
                    >
                      <span className={`relative w-4 h-4 rounded-full border-2 shrink-0 transition-colors duration-150 ${lawfulUse === opt.value ? "border-coral bg-coral" : "border-navy/30 bg-transparent"}`}>
                        <AnimatePresence>
                          {lawfulUse === opt.value && (
                            <motion.span
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ type: "spring", stiffness: 600, damping: 25 }}
                              className="absolute inset-0 flex items-center justify-center"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                      <span className="font-serif text-[14px] text-navy">{opt.label}</span>
                      {lawfulUse === opt.value && (
                        <motion.div
                          layoutId="lawful-indicator"
                          className="absolute inset-0 border-2 border-coral pointer-events-none"
                          style={{ position: "absolute" }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Passport expiry */}
              <div>
                <label className="font-mono text-[11px] uppercase tracking-[0.18em] text-coral mb-1 block">
                  Pasaport Bitiş Tarihi
                </label>
                <p className="font-serif text-[13px] text-coral/70 mb-2 leading-snug">
                  Schengen kuralı gereği vize, pasaport bitişinden en az 3 ay önce sona ermelidir.
                </p>
                <div className="flex items-stretch gap-0 border border-navy/20 bg-white">
                  <div className="flex items-center gap-2 px-4 py-3 flex-1">
                    <NativeSelect
                      value={passportExpiryMonth}
                      onChange={(v) => { setPassportExpiryMonth(parseInt(v)); setPassportSet(true); }}
                      options={MONTHS_TR.map((m, i) => ({ label: m, value: i }))}
                    />
                    <span className="text-navy/20 font-mono text-[12px]">/</span>
                    <NativeSelect
                      value={passportExpiryYear}
                      onChange={(v) => { setPassportExpiryYear(parseInt(v)); setPassportSet(true); }}
                      options={FUTURE_YEARS.map((y) => ({ label: String(y), value: y }))}
                    />
                  </div>
                  <AnimatePresence mode="wait">
                    {!passportSet ? (
                      <motion.button
                        key="onayla"
                        type="button"
                        onClick={() => setPassportSet(true)}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.94 }}
                        transition={{ type: "spring", stiffness: 400, damping: 22 }}
                        className="px-4 border-l border-navy/20 font-mono text-[9px] uppercase tracking-[0.14em] text-coral hover:bg-coral/8 transition-colors"
                      >
                        Onayla
                      </motion.button>
                    ) : (
                      <motion.button
                        key="degistir"
                        type="button"
                        onClick={() => setPassportSet(false)}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        whileTap={{ scale: 0.94 }}
                        transition={{ type: "spring", stiffness: 400, damping: 22 }}
                        className="px-4 border-l border-navy/20 font-mono text-[9px] uppercase tracking-[0.14em] text-navy/30 hover:text-coral transition-colors"
                      >
                        Değiştir
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
                <AnimatePresence>
                  {passportSet && (
                    <motion.p
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ type: "spring", stiffness: 400, damping: 26 }}
                      className="font-mono text-[11px] text-coral mt-2 tracking-[0.08em]"
                    >
                      {MONTHS_TR[passportExpiryMonth]} {passportExpiryYear} seçildi
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right: calendar + result */}
            <div className={`flex flex-col ${compact ? 'gap-3' : 'gap-5'}`}>
              {/* Date summary */}
              <div>
                <label className="font-mono text-[11px] uppercase tracking-[0.18em] text-coral mb-2 block">Seçilen Tarih Aralığı</label>
                <div className="flex items-center gap-3 px-4 py-2.5 border border-navy/20 bg-white">
                  <div className="flex-1">
                    <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-coral mb-0.5">Başlangıç</span>
                    <span className="font-serif text-[14px] text-navy">{startDate ? formatDisplay(startDate) : "—"}</span>
                  </div>
                  <span className="font-mono text-[10px] text-navy/30">→</span>
                  <div className="flex-1 text-right">
                    <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-coral mb-0.5">Bitiş</span>
                    <span className="font-serif text-[14px] text-navy">{endDate ? formatDisplay(endDate) : "—"}</span>
                  </div>
                </div>
                {startDate && endDate && (
                  <p className="font-mono text-[11px] text-coral mt-2 tracking-[0.08em]">
                    {daysBetween(startDate, endDate)} gün
                  </p>
                )}
              </div>

              <CalendarPicker
                startDate={startDate}
                endDate={endDate}
                todayYMD={todayYMD}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
              />

              <ResultPanel result={result} visible={canCalculate} />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
