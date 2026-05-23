// Turkish-adapted Schengen cascade rule policy
// (EC Implementing Decision, 15 July 2025):
//   6-mo MEV → 1-yr MEV → 3-yr MEV → 5-yr MEV.
// Each tier requires the immediately preceding tier's validity as
// predecessor. Recency: 6-mo entry requires application within 1 year of
// predecessor expiry; all upper tiers require application within 2 years
// of predecessor expiry.

import { daysBetween, formatDisplay, monthsBetween, toYMD } from "@/lib/dates/calendar";

export type VisaType = "C" | "D";

// Predecessor-tier detection: a previous visa's duration tells us which
// MEV tier the applicant came from. Thresholds use generous lower bounds
// to accommodate real-world issuance variance (e.g. a "1-year" MEV may
// have been issued for 10 months, hence 300 days for the 1-year tier).
export const CASCADE_PREV_DAYS = {
  TIER_5YR: 1600, // ~4.4 years → previous visa was a 5-year MEV
  TIER_3YR: 900,  // ~2.5 years → previous visa was a 3-year MEV
  TIER_1YR: 300,  // ~10 months → previous visa was a 1-year MEV
  TIER_6MO: 150,  // ~5 months  → previous visa was a 6-month MEV
} as const;

// Recency window: how soon after the previous visa expired the applicant
// must re-apply to keep their cascade tier alive.
export const RECENCY_WINDOW_DAYS = {
  TOP_TIERS: 730,  // 2 years for upper MEV tiers (6-mo and above)
  FIRST_RUNG: 365, // 1 year for the entry-level Type C → 6-mo MEV jump
} as const;

export interface Warning { text: string; }

export interface ResultInfo {
  label: string;
  current: string;
  next: string;
  warnings: Warning[];
  isOutside?: boolean;
  isBroken?: boolean;
}

export interface CalcInputs {
  visaType: VisaType;
  startDate: string;
  endDate: string;
  visaCount: number;
  lawfulUse: boolean;
  passportExpiry: string; // "YYYY-MM"
}

export function calculateResult(inputs: CalcInputs): ResultInfo | null {
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

  const prev5yr  = prevDays >= CASCADE_PREV_DAYS.TIER_5YR;
  const prev3yr  = prevDays >= CASCADE_PREV_DAYS.TIER_3YR;
  const prev1yr  = prevDays >= CASCADE_PREV_DAYS.TIER_1YR;
  const prev6mo  = prevDays >= CASCADE_PREV_DAYS.TIER_6MO;

  let nextTierLabel: string;
  let nextTierMonths: number;
  let currentTierLabel: string;
  let nextText: string;

  if (prev5yr && daysSinceExpiry <= RECENCY_WINDOW_DAYS.TOP_TIERS) {
    // Already at top tier; eligible to renew at 5 years
    currentTierLabel = "5 Yıllık MEV";
    nextTierLabel = "5 Yıllık Çok Girişli Vize";
    nextTierMonths = 60;
    nextText = "Cascade kuralının en üst kademesine ulaştınız. Pasaportunuz yeterince uzun geçerliyse yeniden 5 Yıllık MEV talep edebilirsiniz.";
  } else if (prev3yr && daysSinceExpiry <= RECENCY_WINDOW_DAYS.TOP_TIERS) {
    currentTierLabel = "3 Yıllık MEV";
    nextTierLabel = "5 Yıllık Çok Girişli Vize";
    nextTierMonths = 60;
    nextText = "3 yıllık MEVinizi kurallara uygun kullandınız ve 2 yıllık süre içinde başvuruyorsunuz. Bir sonraki kademe: 5 Yıllık MEV.";
  } else if (prev1yr && daysSinceExpiry <= RECENCY_WINDOW_DAYS.TOP_TIERS) {
    currentTierLabel = "1 Yıllık MEV";
    nextTierLabel = "3 Yıllık Çok Girişli Vize";
    nextTierMonths = 36;
    nextText = "1 yıllık MEVinizi kurallara uygun kullandınız ve 2 yıllık süre içinde başvuruyorsunuz. Bir sonraki kademe: 3 Yıllık MEV.";
  } else if (prev6mo && daysSinceExpiry <= RECENCY_WINDOW_DAYS.TOP_TIERS) {
    currentTierLabel = "6 Aylık MEV";
    nextTierLabel = "1 Yıllık Çok Girişli Vize";
    nextTierMonths = 12;
    nextText = "6 aylık MEVinizi kurallara uygun kullandınız ve 2 yıllık süre içinde başvuruyorsunuz. Bir sonraki kademe: 1 Yıllık MEV.";
  } else if (daysSinceExpiry <= RECENCY_WINDOW_DAYS.FIRST_RUNG) {
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

  // Passport cap: visa validity may not extend past passport expiry minus
  // 3 months (hard rule).
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

export const SCHENGEN_COUNTRIES = [
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

export interface SchengenCountry {
  name: string;
  flag_emoji: string;
}
