"use client";
import { useState, useEffect, useRef } from "react";

const MONTHS_TR = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const DAYS_TR = ["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"];
const CURRENT_YEAR = new Date().getFullYear();
const PAST_YEARS = Array.from({ length: 20 }, (_, i) => CURRENT_YEAR - i);
const FUTURE_YEARS = Array.from({ length: 15 }, (_, i) => CURRENT_YEAR + i);

function toYMD(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function daysInMonth(year: number, month: number) { return new Date(year, month + 1, 0).getDate(); }
function firstDayOffset(year: number, month: number) { const d = new Date(year, month, 1).getDay(); return d === 0 ? 6 : d - 1; }
function daysBetween(a: string, b: string) { return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000); }
function formatDisplay(ymd: string) {
  if (!ymd) return "—";
  const [y, m, d] = ymd.split("-");
  return `${d} ${MONTHS_TR[parseInt(m) - 1]} ${y}`;
}
function monthsBetween(from: Date, to: Date) {
  return (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
}

type VisaType = "C" | "D";

interface Warning { text: string; }

interface ResultInfo {
  label: string;
  current: string;
  next: string;
  warnings: Warning[];
  isOutside?: boolean;
  isBroken?: boolean;
}

interface CalcInputs {
  visaType: VisaType;
  startDate: string;
  endDate: string;
  visaCount: number;
  lawfulUse: boolean;
  passportExpiry: string; // "YYYY-MM"
}

// Turkish adapted cascade tiers (EC Implementing Decision, 15 July 2025)
// 6-mo MEV → 1-yr MEV → 3-yr MEV → 5-yr MEV
// Each tier requires the immediately preceding tier's validity as predecessor.
// Recency: 6-mo entry requires application within 1 year of predecessor expiry;
// all upper tiers require application within 2 years of predecessor expiry.
function calculateResult(inputs: CalcInputs): ResultInfo | null {
  const { visaType, startDate, endDate, lawfulUse, passportExpiry } = inputs;
  if (!startDate || !endDate) return null;

  const warnings: Warning[] = [];

  if (visaType === "D") {
    return {
      label: "Ulusal Vize (Tip D)",
      current: "Tip D vizesi seçildi",
      next: "Tip D (ulusal uzun süreli) vizeler Cascade Kuralı kapsamı dışındadır. Kademeli sistem yalnızca Tip C (kısa süreli Schengen) vizeler için geçerlidir.",
      warnings: [],
      isOutside: true,
    };
  }

  if (!lawfulUse) {
    return {
      label: "Cascade Zinciri Kırıldı",
      current: "Vize ihlali tespit edildi",
      next: "Kalış süresini aşmak, kuralsız çalışmak veya 90/180 kuralını ihlal etmek cascade zincirini sıfırlar. Bir sonraki başvuruda yeniden kısa süreli tekli giriş vizesiyle başlamanız ve zinciri yeniden oluşturmanız gerekir.",
      warnings: [],
      isBroken: true,
    };
  }

  const prevDays = daysBetween(startDate, endDate);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todayYMD = toYMD(today);
  const daysSinceExpiry = daysBetween(endDate, todayYMD);

  // Predecessor tier detection (generous thresholds to accommodate real-world issuance variance)
  const prev5yr  = prevDays >= 1600; // ~4.4 years → was 5-year MEV
  const prev3yr  = prevDays >= 900;  // ~2.5 years → was 3-year MEV
  const prev1yr  = prevDays >= 300;  // ~10 months → was 1-year MEV
  const prev6mo  = prevDays >= 150;  // ~5 months  → was 6-month MEV

  let nextTierLabel: string;
  let nextTierMonths: number;
  let currentTierLabel: string;
  let nextText: string;

  if (prev5yr && daysSinceExpiry <= 730) {
    // Already at top tier; eligible to renew at 5 years
    currentTierLabel = "5 Yıllık MEV";
    nextTierLabel = "5 Yıllık Çok Girişli Vize";
    nextTierMonths = 60;
    nextText = "Cascade kuralının en üst kademesine ulaştınız. Pasaportunuz yeterince uzun geçerliyse yeniden 5 Yıllık MEV talep edebilirsiniz.";
  } else if (prev3yr && daysSinceExpiry <= 730) {
    currentTierLabel = "3 Yıllık MEV";
    nextTierLabel = "5 Yıllık Çok Girişli Vize";
    nextTierMonths = 60;
    nextText = "3 yıllık MEVinizi kurallara uygun kullandınız ve 2 yıllık süre içinde başvuruyorsunuz. Bir sonraki kademe: 5 Yıllık MEV.";
  } else if (prev1yr && daysSinceExpiry <= 730) {
    currentTierLabel = "1 Yıllık MEV";
    nextTierLabel = "3 Yıllık Çok Girişli Vize";
    nextTierMonths = 36;
    nextText = "1 yıllık MEVinizi kurallara uygun kullandınız ve 2 yıllık süre içinde başvuruyorsunuz. Bir sonraki kademe: 3 Yıllık MEV.";
  } else if (prev6mo && daysSinceExpiry <= 730) {
    currentTierLabel = "6 Aylık MEV";
    nextTierLabel = "1 Yıllık Çok Girişli Vize";
    nextTierMonths = 12;
    nextText = "6 aylık MEVinizi kurallara uygun kullandınız ve 2 yıllık süre içinde başvuruyorsunuz. Bir sonraki kademe: 1 Yıllık MEV.";
  } else if (daysSinceExpiry <= 365) {
    // First rung: any lawfully used Type C within 1 year → 6-month MEV
    currentTierLabel = "Kısa Süreli Tip C";
    nextTierLabel = "6 Aylık Çok Girişli Vize";
    nextTierMonths = 6;
    nextText = "Tip C vizenizi kurallara uygun kullandınız ve 1 yıllık süre içinde başvuruyorsunuz. Cascade zincirine hoş geldiniz: Bir sonraki başvuruda 6 Aylık MEV talep hakkınız doğar.";
  } else {
    // Recency window expired
    const years = Math.floor(daysSinceExpiry / 365);
    const months = Math.ceil((daysSinceExpiry % 365) / 30);
    const elapsed = years >= 1 ? `${years} yıl${months > 0 ? ` ${months} ay` : ""}` : `${Math.ceil(daysSinceExpiry / 30)} ay`;
    return {
      label: "Süre Aşımı — Zincir Kesildi",
      current: `Son vizeden bu yana ${elapsed} geçti`,
      next: "Cascade zincirinin devamı için başvuruyu bir önceki vizenin bitişinden itibaren belirli bir süre içinde yapmanız gerekmektedir. Bu süre dolduğundan zincir sıfırlandı. Yeni bir kısa süreli vize alarak süreci yeniden başlatabilirsiniz.",
      warnings: [],
      isBroken: true,
    };
  }

  // Passport cap: visa validity may not extend past passport expiry minus 3 months (hard rule)
  if (passportExpiry) {
    const [pyStr, pmStr] = passportExpiry.split("-");
    const expiryDate = new Date(parseInt(pyStr), parseInt(pmStr) - 1, 1);
    const passportMonthsLeft = monthsBetween(today, expiryDate);
    const usableMonths = passportMonthsLeft - 3;

    if (usableMonths <= 0) {
      warnings.push({ text: "Pasaportunuzun süresi dolmak üzere. Schengen vizesi başvurusu için pasaportunuzun, vizenin bitmesinden en az 3 ay daha uzun geçerli olması zorunludur." });
    } else if (usableMonths < nextTierMonths) {
      const capLabel = usableMonths >= 12
        ? `${Math.floor(usableMonths / 12)} yıl${usableMonths % 12 > 0 ? ` ${usableMonths % 12} ay` : ""}`
        : `${usableMonths} ay`;
      warnings.push({ text: `Pasaportunuzun kalan geçerliliği nedeniyle ${nextTierLabel} yerine yaklaşık ${capLabel} ile sınırlı bir vize düzenlenebilir (3 aylık tampon kuralı). Pasaportunuzu yenilemek tam süreye hak kazanmanızı sağlar.` });
    }
  }

  return {
    label: nextTierLabel,
    current: `Mevcut kademe: ${currentTierLabel} (${prevDays} günlük geçerlilik, bitiş: ${formatDisplay(endDate)})`,
    next: nextText,
    warnings,
  };
}

const SCHENGEN_COUNTRIES = [
  { name: "Almanya", flag_emoji: "🇩🇪" },
  { name: "Avusturya", flag_emoji: "🇦🇹" },
  { name: "Belçika", flag_emoji: "🇧🇪" },
  { name: "Bulgaristan", flag_emoji: "🇧🇬" },
  { name: "Çekya", flag_emoji: "🇨🇿" },
  { name: "Danimarka", flag_emoji: "🇩🇰" },
  { name: "Estonya", flag_emoji: "🇪🇪" },
  { name: "Finlandiya", flag_emoji: "🇫🇮" },
  { name: "Fransa", flag_emoji: "🇫🇷" },
  { name: "Hırvatistan", flag_emoji: "🇭🇷" },
  { name: "Hollanda", flag_emoji: "🇳🇱" },
  { name: "İspanya", flag_emoji: "🇪🇸" },
  { name: "İsveç", flag_emoji: "🇸🇪" },
  { name: "İsviçre (AB üyesi değil)", flag_emoji: "🇨🇭" },
  { name: "İtalya", flag_emoji: "🇮🇹" },
  { name: "İzlanda (AB üyesi değil)", flag_emoji: "🇮🇸" },
  { name: "Letonya", flag_emoji: "🇱🇻" },
  { name: "Lihtenştayn (AB üyesi değil)", flag_emoji: "🇱🇮" },
  { name: "Litvanya", flag_emoji: "🇱🇹" },
  { name: "Lüksemburg", flag_emoji: "🇱🇺" },
  { name: "Macaristan", flag_emoji: "🇭🇺" },
  { name: "Malta", flag_emoji: "🇲🇹" },
  { name: "Norveç (AB üyesi değil)", flag_emoji: "🇳🇴" },
  { name: "Polonya", flag_emoji: "🇵🇱" },
  { name: "Portekiz", flag_emoji: "🇵🇹" },
  { name: "Romanya", flag_emoji: "🇷🇴" },
  { name: "Slovenya", flag_emoji: "🇸🇮" },
  { name: "Slovakya", flag_emoji: "🇸🇰" },
  { name: "Yunanistan", flag_emoji: "🇬🇷" },
];

interface Props { countries?: unknown[]; }

function NativeSelect({ value, onChange, options, className, cream, coral }: {
  value: string | number;
  onChange: (v: string) => void;
  options: { label: string; value: string | number }[];
  className?: string;
  cream?: boolean;
  coral?: boolean;
}) {
  const textCls = cream ? "text-[#fdfbe5]" : coral ? "text-coral" : "text-navy";
  const arrowCls = cream ? "text-[#fdfbe5]/60" : coral ? "text-coral/50" : "text-navy/40";
  return (
    <div className={`relative ${className ?? ""}`}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`appearance-none bg-transparent font-serif text-[14px] ${textCls} font-semibold pr-5 pl-0 py-0.5 border-0 focus:outline-none cursor-pointer`}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <span className={`pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 font-mono text-[10px] ${arrowCls}`}>▾</span>
    </div>
  );
}

export default function CascadeCalculator({ countries }: Props) {
  const [country, setCountry] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);
  const [visaType, setVisaType] = useState<VisaType | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [visaCount, setVisaCount] = useState<number>(0);
  const [lawfulUse, setLawfulUse] = useState<boolean | null>(null);
  const [passportExpiryYear, setPassportExpiryYear] = useState(CURRENT_YEAR + 5);
  const [passportExpiryMonth, setPassportExpiryMonth] = useState(0);
  const [passportSet, setPassportSet] = useState(false);

  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [hovered, setHovered] = useState<string | null>(null);
  const [picking, setPicking] = useState<"start" | null>(null);
  const [todayYMD, setTodayYMD] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const d = new Date(); d.setHours(0, 0, 0, 0);
    setTodayYMD(toYMD(d));
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCountryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleDayClick(ymd: string) {
    if (picking === null) {
      setStartDate(ymd); setEndDate(""); setPicking("start");
    } else {
      if (ymd < startDate) { setStartDate(ymd); setEndDate(""); }
      else if (ymd === startDate) { setStartDate(""); setEndDate(""); setPicking(null); }
      else { setEndDate(ymd); setPicking(null); }
    }
  }

  const offset = firstDayOffset(viewYear, viewMonth);
  const totalDays = daysInMonth(viewYear, viewMonth);
  const cells: (string | null)[] = [...Array(offset).fill(null), ...Array.from({ length: totalDays }, (_, i) => toYMD(new Date(viewYear, viewMonth, i + 1)))];
  while (cells.length % 7 !== 0) cells.push(null);

  function dayState(ymd: string) {
    const isFuture = todayYMD ? ymd > todayYMD : false;
    const isStart = ymd === startDate;
    const isEnd = ymd === endDate;
    const end = picking === "start" ? (hovered && hovered > startDate ? hovered : endDate) : endDate;
    const inRange = !!(startDate && end && ymd > startDate && ymd < end);
    return { isFuture, isStart, isEnd, inRange };
  }

  const filteredCountries = SCHENGEN_COUNTRIES.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase()));
  const selectedCountry = SCHENGEN_COUNTRIES.find(c => c.name === country);

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
    <section className="py-12 bg-[#fdfbe5] border-t border-border">
      <div className="container">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-coral mb-3">
          — Hesaplayıcı
        </div>
        <h2 className="font-serif font-bold text-[clamp(28px,4vw,48px)] leading-none tracking-tight text-navy mb-2">
          Cascade Kuralı Hesaplayıcısı
        </h2>
        <p className="font-serif text-[16px] text-coral mb-8 max-w-xl">
          Geçmiş vizenizin bilgilerini girin, bir sonraki adımınızı hesaplayalım.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: inputs */}
          <div className="flex flex-col gap-5">

            {/* Country */}
            <div>
              <label className="font-mono text-[11px] uppercase tracking-[0.18em] text-coral mb-2 block">Ülke</label>
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setCountryOpen(v => !v)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-2.5 border border-navy/20 bg-white text-left hover:border-coral transition-colors"
                >
                  {selectedCountry ? (
                    <span className="font-serif text-[15px] text-navy flex items-center gap-2">
                      <span>{selectedCountry.flag_emoji ?? "🌍"}</span>
                      {selectedCountry.name}
                    </span>
                  ) : (
                    <span className="font-serif text-[15px] text-navy/30">Ülke seçin…</span>
                  )}
                  <span className="font-mono text-[11px] text-navy/30">{countryOpen ? "↑" : "↓"}</span>
                </button>
                {countryOpen && (
                  <div className="absolute left-0 right-0 top-full z-20 bg-white border border-navy/20 border-t-0 max-h-64 overflow-y-auto shadow-md">
                    <div className="p-2 border-b border-navy/10">
                      <input
                        autoFocus
                        value={countrySearch}
                        onChange={e => setCountrySearch(e.target.value)}
                        placeholder="Ara…"
                        className="w-full bg-transparent font-serif text-[14px] text-navy placeholder:text-navy/30 px-2 py-1.5 focus:outline-none"
                      />
                    </div>
                    {filteredCountries.map(c => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => { setCountry(c.name); setCountryOpen(false); setCountrySearch(""); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 font-serif text-[14px] text-navy/80 hover:text-coral hover:bg-navy/5 transition-colors text-left"
                      >
                        <span>{c.flag_emoji ?? "🌍"}</span>
                        {c.name}
                      </button>
                    ))}
                    {filteredCountries.length === 0 && (
                      <p className="px-4 py-3 font-serif text-[13px] text-navy/30">Sonuç bulunamadı.</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Visa type */}
            <div>
              <label className="font-mono text-[11px] uppercase tracking-[0.18em] text-coral mb-2 block">Vize Türü</label>
              <div className="grid grid-cols-2 gap-3">
                {(["C", "D"] as VisaType[]).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setVisaType(t)}
                    className={`px-4 py-3 border text-left transition-colors ${visaType === t ? "border-coral bg-coral/10" : "border-navy/20 bg-white hover:border-navy/40"}`}
                  >
                    <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-coral mb-0.5">Tip {t}</div>
                    <div className="font-serif text-[14px] text-navy font-semibold">
                      {t === "C" ? "Kısa Süreli Schengen" : "Ulusal / Uzun Süreli"}
                    </div>
                    <div className="font-serif text-[13px] text-coral mt-0.5">
                      {t === "C" ? "90 güne kadar kalış" : "90 günden fazla kalış"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Visa count */}
            <div>
              <label className="font-mono text-[11px] uppercase tracking-[0.18em] text-coral mb-1 block">
                Toplam Schengen Vize Sayısı (Bilgi Amaçlı)
              </label>
              <p className="font-serif text-[13px] text-coral/70 mb-2 leading-snug">
                Türkiye'ye özgü Kademeli Vize Kuralı'nda kademe ilerlemesi için vize sayısı yerine önceki vizenin türü ve doğru kullanımı esas alınır.
              </p>
              <div className="flex items-center gap-0 border border-navy/20 bg-white w-fit">
                <button
                  type="button"
                  onClick={() => setVisaCount(v => Math.max(0, v - 1))}
                  className="w-10 h-11 flex items-center justify-center font-mono text-[16px] text-navy/40 hover:text-navy hover:bg-navy/5 transition-colors border-r border-navy/20"
                >−</button>
                <span className="w-14 text-center font-serif text-[20px] font-semibold text-navy">{visaCount}</span>
                <button
                  type="button"
                  onClick={() => setVisaCount(v => Math.min(20, v + 1))}
                  className="w-10 h-11 flex items-center justify-center font-mono text-[16px] text-navy/40 hover:text-navy hover:bg-navy/5 transition-colors border-l border-navy/20"
                >+</button>
              </div>
            </div>

            {/* Lawful use checkbox */}
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
                ].map(opt => (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => setLawfulUse(opt.value)}
                    className={`flex items-center gap-3 px-4 py-2.5 border text-left transition-colors ${lawfulUse === opt.value ? "border-coral bg-coral/10" : "border-navy/20 bg-white hover:border-navy/40"}`}
                  >
                    <span className={`w-4 h-4 rounded-full border-2 shrink-0 transition-colors ${lawfulUse === opt.value ? "border-coral bg-coral" : "border-navy/30"}`} />
                    <span className="font-serif text-[14px] text-navy">{opt.label}</span>
                  </button>
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
                    onChange={v => { setPassportExpiryMonth(parseInt(v)); setPassportSet(true); }}
                    options={MONTHS_TR.map((m, i) => ({ label: m, value: i }))}
                  />
                  <span className="text-navy/20 font-mono text-[12px]">/</span>
                  <NativeSelect
                    value={passportExpiryYear}
                    onChange={v => { setPassportExpiryYear(parseInt(v)); setPassportSet(true); }}
                    options={FUTURE_YEARS.map(y => ({ label: String(y), value: y }))}
                  />
                </div>
                {!passportSet && (
                  <button
                    type="button"
                    onClick={() => setPassportSet(true)}
                    className="px-4 border-l border-navy/20 font-mono text-[9px] uppercase tracking-[0.14em] text-coral hover:bg-coral/5 transition-colors"
                  >
                    Onayla
                  </button>
                )}
                {passportSet && (
                  <button
                    type="button"
                    onClick={() => setPassportSet(false)}
                    className="px-4 border-l border-navy/20 font-mono text-[9px] uppercase tracking-[0.14em] text-navy/30 hover:text-coral transition-colors"
                  >
                    Değiştir
                  </button>
                )}
              </div>
              {passportSet && (
                <p className="font-mono text-[11px] text-coral mt-2 tracking-[0.08em]">
                  {MONTHS_TR[passportExpiryMonth]} {passportExpiryYear} seçildi
                </p>
              )}
            </div>

          </div>

          {/* Right: calendar + result */}
          <div className="flex flex-col gap-5">
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

            {/* Calendar */}
            <div className="border border-navy/20 bg-white select-none">
              <div className="flex items-center justify-between px-4 py-3 border-b border-navy/10">
                <button
                  type="button"
                  onClick={() => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); }}
                  className="font-mono text-[12px] text-navy/40 hover:text-navy transition-colors px-1.5"
                  aria-label="Önceki ay"
                >←</button>
                <div className="flex items-center gap-2">
                  <div className="bg-[#fdfbe5] rounded-xl px-3 py-1.5">
                    <NativeSelect
                      coral
                      value={viewMonth}
                      onChange={v => setViewMonth(parseInt(v))}
                      options={MONTHS_TR.map((m, i) => ({ label: m, value: i }))}
                    />
                  </div>
                  <div className="bg-[#fdfbe5] rounded-xl px-3 py-1.5">
                    <NativeSelect
                      coral
                      value={viewYear}
                      onChange={v => setViewYear(parseInt(v))}
                      options={PAST_YEARS.map(y => ({ label: String(y), value: y }))}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); }}
                  className="font-mono text-[12px] text-navy/40 hover:text-navy transition-colors px-1.5"
                  aria-label="Sonraki ay"
                >→</button>
              </div>

              <div className="grid grid-cols-7 px-2 pt-2">
                {DAYS_TR.map(d => (
                  <div key={d} className="py-1.5 text-center font-mono text-[9px] uppercase tracking-widest text-navy/30">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 px-2 pb-3">
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
              </div>
              {(startDate || endDate) && (
                <div className="border-t border-navy/10 px-4 py-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => { setStartDate(""); setEndDate(""); setPicking(null); }}
                    className="font-mono text-[9px] uppercase tracking-[0.14em] text-navy/30 hover:text-coral transition-colors"
                  >
                    Temizle
                  </button>
                </div>
              )}
            </div>

            {/* Result */}
            {canCalculate && result && (
              <div className={`border p-6 ${result.isBroken ? "border-red-300 bg-red-50" : result.isOutside ? "border-navy/20 bg-navy/5" : "border-coral/40 bg-coral/8"}`}>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-coral mb-3">
                  — Sonuç
                </div>
                <div className={`font-serif font-bold text-[22px] leading-tight mb-2 ${result.isBroken ? "text-red-700" : "text-navy"}`}>
                  {result.label}
                </div>
                <p className="font-serif text-[13px] text-coral mb-5">{result.current}</p>

                {result.warnings.length > 0 && (
                  <div className="mb-5 flex flex-col gap-2">
                    {result.warnings.map((w, i) => (
                      <div key={i} className="flex gap-2.5 px-3 py-2.5 bg-amber-50 border border-amber-200">
                        <span className="font-mono text-[11px] text-amber-600 mt-0.5 shrink-0">⚠</span>
                        <p className="font-serif text-[13px] text-amber-800 leading-snug">{w.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-t border-navy/10 pt-5">
                  <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-coral mb-2">Bir Sonraki Adım</div>
                  <p className={`font-serif text-[15px] leading-relaxed ${result.isBroken ? "text-red-600" : "text-coral"}`}>{result.next}</p>
                </div>
              </div>
            )}

            {!canCalculate && (
              <div className="border border-navy/10 p-6 flex items-center justify-center min-h-32 bg-white">
                <p className="font-serif text-[14px] text-coral/50 text-center">
                  Tüm alanları doldurun ve tarih aralığı seçerek hesaplama yapın.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
