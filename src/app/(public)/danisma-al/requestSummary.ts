export type ContactPref = "whatsapp" | "email" | "phone";

export const CONTACT_OPTIONS: { value: ContactPref; label: string; emoji: string }[] = [
  { value: "whatsapp", label: "WhatsApp", emoji: "💬" },
  { value: "email", label: "E-posta", emoji: "📧" },
  { value: "phone", label: "Telefon Görüşmesi", emoji: "📞" },
];

export interface RequestSummaryInput {
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

  return [
    "Yeni danışma talebi.",
    "",
    `👤 Ad Soyad: ${adSoyad}`,
    `📧 E-posta: ${placeholder(input.email)}`,
    `📱 Telefon: ${placeholder(input.phone)}`,
    `🌍 Gidilecek Ülke: ${input.countryEmoji ? `${input.countryEmoji} ` : ""}${placeholder(input.country)}`,
    `🗓️ Seyahat Tarihleri: ${dates}`,
    `↩️ Dönüş Tercihi: ${pref ? `${pref.emoji} ${pref.label}` : "—"}`,
    "",
    "📝 Not:",
    placeholder(input.note),
  ].join("\n");
}
