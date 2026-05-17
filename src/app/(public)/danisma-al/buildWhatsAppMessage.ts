export interface WhatsAppFormInput {
  ad: string;
  soyad: string;
  email: string;
  phone: string;
  country: string;
  travelDate: string;
  returnDate: string;
  note: string;
}

function placeholder(value: string, fallback = "—") {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : fallback;
}

export function buildWhatsAppMessage(input: WhatsAppFormInput): string {
  const adSoyad = [input.ad, input.soyad].map((p) => p.trim()).filter(Boolean).join(" ") || "—";
  const phone = input.phone.trim();
  const phoneLine = phone ? `+90 ${phone}` : "—";
  const dates = input.travelDate
    ? input.returnDate
      ? `${input.travelDate} → ${input.returnDate}`
      : input.travelDate
    : "—";

  return [
    "Merhaba, vize danışmanlığı talebim var.",
    "",
    `👤 Ad Soyad: ${adSoyad}`,
    `📧 E-posta: ${placeholder(input.email)}`,
    `📱 Telefon: ${phoneLine}`,
    `🌍 Gidilecek Ülke: ${placeholder(input.country)}`,
    `🗓️ Seyahat Tarihleri: ${dates}`,
    "",
    "📝 Not:",
    placeholder(input.note),
  ].join("\n");
}
