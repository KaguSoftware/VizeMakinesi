"use client";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import PageHead from "@/components/shared/PageHead/PageHead";
import DateRangePicker from "./DateRangePicker";
import CountryPicker from "./CountryPicker";
import FormPreview from "./FormPreview";
import {
  CONTACT_OPTIONS,
  REQUEST_TYPES,
  requestTypeMeta,
  type ContactPref,
  type RequestType,
} from "./requestSummary";
import { submitConsultationRequest } from "./actions";
import type { DanismaCountry } from "@/lib/data/countries";
import { EASE_OUT_EXPO } from "@/components/shared/motion/constants";

type Errors = Partial<Record<"ad" | "soyad" | "email" | "phone" | "country" | "travelDate", string>>;

// Always keeps a leading "+" and at most 12 digits after it.
function sanitizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 12);
  return `+${digits}`;
}

// Letters (incl. Turkish), spaces, hyphens and apostrophes only — no digits.
function sanitizeName(raw: string): string {
  return raw.replace(/[^\p{L}\s'-]/gu, "");
}

const fieldAnim = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: i * 0.04, ease: EASE_OUT_EXPO },
});

export default function DanismaAlForm({
  countries,
  initialType = "vize",
}: {
  countries: DanismaCountry[];
  initialType?: RequestType;
}) {
  const reduced = useReducedMotion();
  const [requestType, setRequestType] = useState<RequestType>(initialType);
  const [ad, setAd] = useState("");
  const [soyad, setSoyad] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+90");
  const [country, setCountry] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [contactPref, setContactPref] = useState<ContactPref>("whatsapp");
  const [note, setNote] = useState("");
  // Honeypot — hidden from real users; only bots that fill every input touch it.
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [sent, setSent] = useState(false);
  // İlk açılışta başlık hemen boyanır (LCP). Kullanıcı form türünü değiştirince
  // başlığın yeniden animasyonla girmesi için o davranış geri açılır.
  const [typeSwitched, setTypeSwitched] = useState(false);

  const isExpedite = requestType === "hizlandirma";
  const typeMeta = requestTypeMeta(requestType);
  const selectedCountry = countries.find((c) => c.name === country);

  // Switching flows resets what the other flow's fields meant.
  function switchType(next: RequestType) {
    if (next === requestType) return;
    setTypeSwitched(true);
    setRequestType(next);
    setCountry("");
    setTravelDate("");
    setReturnDate("");
    setErrors({});
    setSubmitError("");
  }

  function validate(): Errors {
    const errs: Errors = {};
    if (!ad.trim()) errs.ad = "Adınızı girin";
    if (!soyad.trim()) errs.soyad = "Soyadınızı girin";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) errs.email = "Geçerli bir e-posta girin";
    if (!/^\+\d{12}$/.test(phone)) errs.phone = "Telefon numarası + işaretinden sonra tam 12 rakam olmalı";
    if (!isExpedite && !country) errs.country = "Ülke seçin";
    if (!travelDate) {
      errs.travelDate = isExpedite ? "Mevcut randevu tarihinizi seçin" : "Gidiş tarihi seçin";
    }
    return errs;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitError("");
    setSubmitting(true);
    try {
      const res = await submitConsultationRequest({
        requestType,
        ad,
        soyad,
        email,
        phone,
        country: isExpedite ? "" : country,
        countryEmoji: isExpedite ? null : selectedCountry?.flag_emoji ?? null,
        travelDate,
        returnDate,
        contactPref,
        note,
        website,
      });
      if (res.ok) {
        setSent(true);
      } else {
        setSubmitError(res.error);
      }
    } catch {
      setSubmitError("Bir sorun oluştu. Lütfen tekrar deneyin.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Keyed by type so PageHead's FadeIn replays and the new headline and
          lede fade in rather than snapping. */}
      <PageHead
        key={requestType}
        priority={!typeSwitched}
        eyebrow={isExpedite ? "— Hızlandırma formu" : "— Danışma formu"}
        title={
          isExpedite ? (
            <>ABD Randevunuzu <em className="font-normal italic text-coral">Öne Çekelim.</em></>
          ) : (
            <>Vize Sürecinizi <em className="font-normal italic text-coral">Bugün Başlatın.</em></>
          )
        }
        titleClassName="font-serif font-bold text-[clamp(28px,4.2vw,72px)] leading-[1.05] tracking-[-0.02em]"
        lede={
          isExpedite
            ? "Mevcut mülakat tarihinizi ve istediğiniz tarihi paylaşın — konsolosluk takvimini sizin için 7/24 izleyip en erken uygun slotu yakalayalım."
            : "Formu doldurun, Tek tıkla danışmanlarımıza ulaştırın — evrak karmaşasından randevu stresine kadar tüm süreci Vize Makinesi hızıyla biz yönetelim."
        }
        ledeClassName="font-serif text-[16px] md:text-[20px] text-navy mt-6 md:mt-9 leading-[1.55] border-l border-coral pl-6"
      />

      {/* Flow toggle — swaps the whole form between the two request types.
          The coral pill is a single element shared across the two buttons via
          layoutId, so it slides between them instead of blinking. */}
      {!sent && (
        // Spacing lives on this wrapper, not on .container — the global
        // .container rule is unlayered and uses the `padding` shorthand, so it
        // overrides any pt-*/pb-* utility applied to the same element.
        <div className="pt-10 pb-7">
          <div className="container">
          <div
            role="radiogroup"
            aria-label="Talep türü"
            className="inline-flex flex-wrap gap-1.5 p-1.5 rounded-2xl border border-border bg-white/70 backdrop-blur-sm"
          >
            {REQUEST_TYPES.map((t) => {
              const active = t.value === requestType;
              return (
                <button
                  key={t.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => switchType(t.value)}
                  className={`relative isolate inline-flex items-center gap-2 rounded-xl px-5 py-3 font-sans text-[13px] font-semibold uppercase tracking-[0.08em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 ${
                    active ? "text-white" : "text-navy hover:text-coral"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="danisma-type-pill"
                      aria-hidden="true"
                      className="absolute inset-0 -z-10 rounded-xl bg-coral"
                      transition={
                        reduced
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 420, damping: 34, mass: 0.7 }
                      }
                    />
                  )}
                  <motion.span
                    aria-hidden="true"
                    animate={reduced ? undefined : { scale: active ? 1.2 : 1, rotate: active ? -8 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 18 }}
                    className="inline-block"
                  >
                    {t.emoji}
                  </motion.span>
                  {t.label}
                </button>
              );
            })}
          </div>
          </div>
        </div>
      )}

      <section className="container pb-32">
        {sent ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
            // mt, not the section's pt — see the .container note above.
            className="mt-20 max-w-2xl mx-auto rounded-2xl border border-border bg-white/70 backdrop-blur-sm shadow-[0_1px_0_rgba(0,0,0,0.04),0_24px_48px_-32px_rgba(15,23,42,0.18)] p-10 md:p-14 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-coral/10 flex items-center justify-center mx-auto mb-6">
              <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#309c9b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-coral mb-3">
              — Talebiniz Alındı
            </div>
            <h2 className="font-serif font-bold text-[clamp(24px,3.5vw,40px)] leading-[1.1] tracking-[-0.02em] text-navy">
              Teşekkürler, talebiniz bize ulaştı.
            </h2>
            <p className="font-serif text-[16px] md:text-[18px] text-navy/80 mt-5 leading-[1.55]">
              Danışmanlarımız en kısa sürede, seçtiğiniz iletişim tercihiyle sizinle iletişime
              geçecek. E-posta kutunuza bir onay mesajı gönderdik.
            </p>
          </motion.div>
        ) : (
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-7 rounded-2xl border border-border bg-white/70 backdrop-blur-sm shadow-[0_1px_0_rgba(0,0,0,0.04),0_24px_48px_-32px_rgba(15,23,42,0.18)] p-8 md:p-12"
            noValidate
          >
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-coral mb-6 overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={requestType}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: reduced ? 0 : 0.2, ease: EASE_OUT_EXPO }}
                  className="inline-block"
                >
                  — {isExpedite ? "Hızlandırma Formu" : "Danışma Formu"}
                </motion.span>
              </AnimatePresence>
            </div>

            {/*
              Honeypot. Positioned off-screen rather than display:none —
              some bots skip hidden inputs but do fill positioned ones.
              aria-hidden + tabIndex=-1 keep it away from real users and
              assistive tech; a filled value is dropped server-side.
            */}
            <div aria-hidden="true" className="absolute -left-[9999px] top-auto w-px h-px overflow-hidden">
              <label htmlFor="website">Web sitesi (doldurmayın)</label>
              <input
                id="website"
                name="website"
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="space-y-7">
              {/* Ad + Soyad */}
              <motion.div {...fieldAnim(0)} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field
                  id="ad"
                  label="Ad"
                  required
                  error={errors.ad}
                  input={
                    <input
                      id="ad"
                      type="text"
                      value={ad}
                      onChange={(e) => setAd(sanitizeName(e.target.value))}
                      placeholder="Ayşe"
                      className={inputCls}
                      autoComplete="given-name"
                      aria-invalid={Boolean(errors.ad)}
                      aria-describedby={errors.ad ? "ad-error" : undefined}
                    />
                  }
                />
                <Field
                  id="soyad"
                  label="Soyad"
                  required
                  error={errors.soyad}
                  input={
                    <input
                      id="soyad"
                      type="text"
                      value={soyad}
                      onChange={(e) => setSoyad(sanitizeName(e.target.value))}
                      placeholder="Kaya"
                      className={inputCls}
                      autoComplete="family-name"
                      aria-invalid={Boolean(errors.soyad)}
                      aria-describedby={errors.soyad ? "soyad-error" : undefined}
                    />
                  }
                />
              </motion.div>

              {/* Email */}
              <motion.div {...fieldAnim(1)}>
                <Field
                  id="email"
                  label="E-posta"
                  required
                  error={errors.email}
                  input={
                    <input
                      id="email"
                      type="email"
                      inputMode="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ornek@mail.com"
                      className={inputCls}
                      autoComplete="email"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? "email-error" : undefined}
                    />
                  }
                />
              </motion.div>

              {/* Phone */}
              <motion.div {...fieldAnim(2)}>
                <Field
                  id="phone"
                  label="Telefon"
                  required
                  error={errors.phone}
                  input={
                    <input
                      id="phone"
                      type="tel"
                      inputMode="tel"
                      value={phone}
                      onChange={(e) => setPhone(sanitizePhone(e.target.value))}
                      placeholder="+90XXXXXXXXXX"
                      className={inputCls}
                      autoComplete="tel"
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={errors.phone ? "phone-error" : undefined}
                    />
                  }
                />
              </motion.div>

              {/* Country — the expedite flow is always the US, so it is dropped
                  there. popLayout takes the exiting field out of flow right away
                  so the calendar below slides up while it fades out. */}
              <AnimatePresence initial={false} mode="popLayout">
                {!isExpedite && (
                  <motion.div
                    key="country"
                    layout={!reduced}
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: reduced ? 0 : 0.28, ease: EASE_OUT_EXPO }}
                  >
                    <Field
                      id="country"
                      label="Gidilecek Ülke"
                      required
                      error={errors.country}
                      input={
                        <CountryPicker
                          countries={countries}
                          value={country}
                          onChange={setCountry}
                          invalid={Boolean(errors.country)}
                          describedBy={errors.country ? "country-error" : undefined}
                        />
                      }
                      bare
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dates — travel range for "vize", current → wanted appointment for
                  "hizlandirma". The picker is keyed by type so its captions and
                  selection mode crossfade rather than swapping mid-render. */}
              <motion.div {...fieldAnim(4)} layout={!reduced}>
                <Field
                  id="travelDate"
                  label={typeMeta.datesLabel}
                  labelKey={requestType}
                  required
                  error={errors.travelDate}
                  input={
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={requestType}
                        initial={{ opacity: 0, x: isExpedite ? 16 : -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: isExpedite ? -16 : 16 }}
                        transition={{ duration: reduced ? 0 : 0.22, ease: EASE_OUT_EXPO }}
                      >
                        <DateRangePicker
                          travelDate={travelDate}
                          returnDate={returnDate}
                          onTravelDate={setTravelDate}
                          onReturnDate={setReturnDate}
                          startLabel={typeMeta.startLabel}
                          endLabel={typeMeta.endLabel}
                          independent={isExpedite}
                        />
                      </motion.div>
                    </AnimatePresence>
                  }
                  bare
                />
              </motion.div>

              {/* Contact preference */}
              <motion.div {...fieldAnim(5)}>
                <Field
                  id="contactPref"
                  label="Yanıtı nereden almak istersiniz?"
                  input={
                    <div className="flex flex-wrap gap-2.5" role="radiogroup" aria-label="Yanıtı nereden almak istersiniz?">
                      {CONTACT_OPTIONS.map((o) => {
                        const active = o.value === contactPref;
                        return (
                          <button
                            key={o.value}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            onClick={() => setContactPref(o.value)}
                            className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-sans text-[13px] font-medium border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 ${
                              active
                                ? "bg-coral text-white border-coral"
                                : "bg-transparent text-navy border-border hover:border-coral"
                            }`}
                          >
                            <span aria-hidden="true">{o.emoji}</span>
                            {o.label}
                          </button>
                        );
                      })}
                    </div>
                  }
                  bare
                />
              </motion.div>

              {/* Note */}
              <motion.div {...fieldAnim(6)}>
                <Field
                  id="note"
                  label="Not / Ek Bilgi"
                  input={
                    <textarea
                      id="note"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={3}
                      placeholder={
                        isExpedite
                          ? "Hızlandırma gerekçeniz (tıbbi, iş, öğrenci, acil seyahat), DS-160 durumunuz…"
                          : "Vize türü, özel durumlar, daha önce red aldıysanız belirtin…"
                      }
                      className="w-full bg-transparent border-b border-border pb-1.5 font-serif text-[16px] sm:text-[14px] text-navy placeholder:text-muted/40 focus:outline-none focus:border-coral focus:border-b-2 focus:pb-[5px] transition-colors duration-150 resize-none"
                    />
                  }
                  bare
                />
              </motion.div>
            </div>

            {/* Submit */}
            <motion.div {...fieldAnim(7)} className="mt-10 border-t border-border pt-6 flex items-center justify-between flex-wrap gap-4">
              <div role="status" aria-live="assertive" className="min-h-[1em]">
                {submitError ? (
                  <motion.p
                    initial={{ opacity: 0, y: -2 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-mono text-[10px] uppercase tracking-[0.14em] text-coral"
                  >
                    {submitError}
                  </motion.p>
                ) : Object.keys(errors).length > 0 ? (
                  <motion.p
                    initial={{ opacity: 0, y: -2 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-mono text-[10px] uppercase tracking-[0.14em] text-coral"
                  >
                    Lütfen zorunlu alanları doldurun.
                  </motion.p>
                ) : (
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    * Zorunlu alanlar
                  </p>
                )}
              </div>
              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={submitting ? undefined : { scale: 1.03, y: -1 }}
                whileTap={submitting ? undefined : { scale: 0.98 }}
                transition={{ duration: 0.18, ease: EASE_OUT_EXPO }}
                className="inline-flex items-center gap-3 font-sans font-semibold text-[14px] uppercase tracking-[0.12em] px-7 py-4 bg-coral text-white border border-coral hover:bg-transparent hover:text-coral transition-colors duration-200 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 disabled:opacity-70 disabled:cursor-wait disabled:hover:bg-coral disabled:hover:text-white"
              >
                {submitting && (
                  <motion.svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.9, ease: "linear", repeat: Infinity }}
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </motion.svg>
                )}
                {submitting ? "Gönderiliyor…" : "Talebi Gönder →"}
              </motion.button>
            </motion.div>
          </form>

          <aside className="lg:col-span-5">
            <FormPreview
              requestType={requestType}
              ad={ad}
              soyad={soyad}
              email={email}
              phone={phone}
              country={country}
              countryEmoji={selectedCountry?.flag_emoji ?? null}
              travelDate={travelDate}
              returnDate={returnDate}
              contactPref={contactPref}
              note={note}
            />
          </aside>
        </div>
        )}
      </section>
    </>
  );
}

const inputCls =
  "w-full bg-transparent border-b border-border pb-1.5 font-serif text-[16px] sm:text-[14px] text-navy placeholder:text-muted/40 focus:outline-none focus:border-coral focus:border-b-2 focus:pb-[5px] transition-colors duration-150";

function Field({
  id,
  label,
  labelKey,
  required,
  error,
  input,
  bare,
}: {
  id?: string;
  label: string;
  /** Set when the label text itself can change, so the swap crossfades. */
  labelKey?: string;
  required?: boolean;
  error?: string;
  input: React.ReactNode;
  bare?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block font-mono text-[10px] uppercase tracking-[0.18em] text-coral mb-2"
      >
        <motion.span
          key={labelKey ?? label}
          initial={labelKey ? { opacity: 0, y: -4 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          className="inline-block"
        >
          {label}
        </motion.span>{" "}
        {required && <span className="text-coral" aria-hidden="true">*</span>}
        {required && <span className="sr-only"> (zorunlu)</span>}
      </label>
      {bare ? input : input}
      {error && (
        <motion.p
          id={id ? `${id}-error` : undefined}
          role="alert"
          initial={{ opacity: 0, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-coral"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
