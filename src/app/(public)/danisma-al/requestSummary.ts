export type ContactPref = "whatsapp" | "email" | "phone";

/**
 * The /danisma-al form serves two flows. They share every contact field but
 * differ in what the two dates mean — and "hizlandirma" has no destination
 * country, since it is always a US appointment being moved earlier.
 */
export type RequestType = "vize" | "hizlandirma";

export const REQUEST_TYPES: {
  value: RequestType;
  label: string;
  emoji: string;
  /** Label for the whole date field. */
  datesLabel: string;
  /** Label for the first / second date slot. */
  startLabel: string;
  endLabel: string;
}[] = [
  {
    value: "vize",
    label: "Vize Başvurusu",
    emoji: "🛂",
    datesLabel: "Seyahat Tarihleri",
    startLabel: "Gidiş",
    endLabel: "Dönüş",
  },
  {
    value: "hizlandirma",
    label: "Amerika Hızlandırma",
    emoji: "⚡",
    datesLabel: "Randevu Tarihleri",
    startLabel: "Mevcut Randevu",
    endLabel: "İstenen Tarih",
  },
];

export function requestTypeMeta(type: string) {
  return REQUEST_TYPES.find((t) => t.value === type) ?? REQUEST_TYPES[0];
}

export function isRequestType(v: unknown): v is RequestType {
  return REQUEST_TYPES.some((t) => t.value === v);
}

export const CONTACT_OPTIONS: { value: ContactPref; label: string; emoji: string }[] = [
  { value: "whatsapp", label: "WhatsApp", emoji: "💬" },
  { value: "email", label: "E-posta", emoji: "📧" },
  { value: "phone", label: "Telefon Görüşmesi", emoji: "📞" },
];

export interface RequestSummaryInput {
  requestType: RequestType;
  ad: string;
  soyad: string;
  email: string;
  phone: string;
  country: string;
  countryEmoji: string | null;
  travelDate: string;
  returnDate: string;
  contactPref: ContactPref;
  note: string;
}

function placeholder(value: string, fallback = "—") {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : fallback;
}

/**
 * Plain-text summary of a consultation request. Used as the fallback text body
 * of the owner-notification email (the HTML body is built in the email module).
 */
export function buildRequestSummary(input: RequestSummaryInput): string {
  const adSoyad = [input.ad, input.soyad].map((p) => p.trim()).filter(Boolean).join(" ") || "—";
  const dates = input.travelDate
    ? input.returnDate
      ? `${input.travelDate} → ${input.returnDate}`
      : input.travelDate
    : "—";
  const pref = CONTACT_OPTIONS.find((o) => o.value === input.contactPref);
  const meta = requestTypeMeta(input.requestType);

  return [
    `Yeni talep — ${meta.label}.`,
    "",
    `👤 Ad Soyad: ${adSoyad}`,
    `📧 E-posta: ${placeholder(input.email)}`,
    `📱 Telefon: ${placeholder(input.phone)}`,
    // The expedite flow has no destination country — it is always the US.
    ...(input.requestType === "vize"
      ? [`🌍 Gidilecek Ülke: ${input.countryEmoji ? `${input.countryEmoji} ` : ""}${placeholder(input.country)}`]
      : []),
    `🗓️ ${meta.datesLabel}: ${dates}`,
    `↩️ Dönüş Tercihi: ${pref ? `${pref.emoji} ${pref.label}` : "—"}`,
    "",
    "📝 Not:",
    placeholder(input.note),
  ].join("\n");
}
