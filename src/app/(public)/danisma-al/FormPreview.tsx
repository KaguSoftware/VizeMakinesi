"use client";
import { motion } from "framer-motion";
import { CONTACT_OPTIONS, type ContactPref } from "./buildWhatsAppMessage";
import { formatDisplay } from "@/lib/dates/calendar";

interface Props {
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

function Row({
  icon,
  label,
  value,
  filled,
}: {
  icon: string;
  label: string;
  value: string;
  filled: boolean;
}) {
  return (
    <div className="flex items-start gap-3 py-3.5 border-b border-border/70 last:border-b-0">
      <span className="text-[16px] leading-none mt-0.5 select-none" aria-hidden="true">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-coral mb-1">
          {label}
        </span>
        <motion.span
          key={value}
          initial={{ opacity: 0.35 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.18 }}
          className={`block font-serif text-[15px] leading-snug break-words ${
            filled ? "text-navy" : "text-muted/40"
          }`}
        >
          {filled ? value : "—"}
        </motion.span>
      </div>
    </div>
  );
}

export default function FormPreview(props: Props) {
  const { ad, soyad, email, phone, country, countryEmoji, travelDate, returnDate, contactPref, note } = props;

  const adSoyad = [ad, soyad].map((p) => p.trim()).filter(Boolean).join(" ");
  const dates = travelDate
    ? returnDate
      ? `${formatDisplay(travelDate)} → ${formatDisplay(returnDate)}`
      : formatDisplay(travelDate)
    : "";
  const countryLabel = country ? `${countryEmoji ? `${countryEmoji} ` : ""}${country}` : "";

  return (
    <div className="lg:sticky lg:top-28 rounded-2xl overflow-hidden border border-border bg-white/70 backdrop-blur-sm shadow-[0_1px_0_rgba(0,0,0,0.04),0_24px_48px_-32px_rgba(15,23,42,0.18)]">
      {/* Header */}
      <div className="bg-navy text-white px-6 py-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/60 mb-1.5">
          — Önizleme
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-coral flex items-center justify-center text-[13px] font-bold shrink-0">
            VM
          </span>
          <div className="leading-tight">
            <span className="block font-serif font-semibold text-[16px]">Danışma Başvurusu</span>
            <span className="block font-sans text-[11px] text-white/60">Vize Makinesi</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-2 bg-cream/40">
        <Row icon="👤" label="Ad Soyad" value={adSoyad} filled={Boolean(adSoyad)} />
        <Row icon="📧" label="E-posta" value={email.trim()} filled={Boolean(email.trim())} />
        <Row icon="📱" label="Telefon" value={phone.trim()} filled={Boolean(phone.trim())} />
        <Row icon="🌍" label="Gidilecek Ülke" value={countryLabel} filled={Boolean(country)} />
        <Row icon="🗓️" label="Seyahat Tarihleri" value={dates} filled={Boolean(travelDate)} />

        {/* Contact preference */}
        <div className="flex items-start gap-3 py-3.5 border-b border-border/70">
          <span className="text-[16px] leading-none mt-0.5 select-none" aria-hidden="true">
            ↩️
          </span>
          <div className="min-w-0 flex-1">
            <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-coral mb-2">
              Dönüş Tercihi
            </span>
            <div className="flex flex-wrap gap-1.5">
              {CONTACT_OPTIONS.map((o) => {
                const active = o.value === contactPref;
                return (
                  <span
                    key={o.value}
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors duration-150 ${
                      active
                        ? "bg-coral text-white"
                        : "bg-transparent text-muted/40 border border-border"
                    }`}
                  >
                    <span aria-hidden="true">{o.emoji}</span>
                    {o.label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="flex items-start gap-3 py-3.5">
          <span className="text-[16px] leading-none mt-0.5 select-none" aria-hidden="true">
            📝
          </span>
          <div className="min-w-0 flex-1">
            <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-coral mb-1">
              Not
            </span>
            <motion.p
              key={note}
              initial={{ opacity: 0.35 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.18 }}
              className={`font-serif text-[15px] leading-snug break-words whitespace-pre-wrap ${
                note.trim() ? "text-navy" : "text-muted/40"
              }`}
            >
              {note.trim() ? note.trim() : "—"}
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}
