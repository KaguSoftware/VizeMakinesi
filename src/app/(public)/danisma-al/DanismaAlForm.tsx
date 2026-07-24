"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import PageHead from "@/components/shared/PageHead/PageHead";
import DateRangePicker from "./DateRangePicker";
import CountryPicker from "./CountryPicker";
import FormPreview from "./FormPreview";
import { CONTACT_OPTIONS, type ContactPref } from "./requestSummary";
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

export default function DanismaAlForm({ countries }: { countries: DanismaCountry[] }) {
  const [ad, setAd] = useState("");
  const [soyad, setSoyad] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+90");
  const [country, setCountry] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [contactPref, setContactPref] = useState<ContactPref>("whatsapp");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [sent, setSent] = useState(false);

  const selectedCountry = countries.find((c) => c.name === country);

  function validate(): Errors {
    const errs: Errors = {};
    if (!ad.trim()) errs.ad = "Adınızı girin";
    if (!soyad.trim()) errs.soyad = "Soyadınızı girin";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) errs.email = "Geçerli bir e-posta girin";
    if (!/^\+\d{12}$/.test(phone)) errs.phone = "Telefon numarası + işaretinden sonra tam 12 rakam olmalı";
    if (!country) errs.country = "Ülke seçin";
    if (!travelDate) errs.travelDate = "Gidiş tarihi seçin";
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
        ad,
        soyad,
        email,
        phone,
        country,
        countryEmoji: selectedCountry?.flag_emoji ?? null,
        travelDate,
        returnDate,
        contactPref,
        note,
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
      <PageHead
        eyebrow="— Danışma formu"
        title={<>Vize Sürecinizi <em className="font-normal italic text-coral">Bugün Başlatın.</em></>}
        titleClassName="font-serif font-bold text-[clamp(28px,4.2vw,72px)] leading-[1.05] tracking-[-0.02em]"
        lede="Formu doldurun, Tek tıkla danışmanlarımıza ulaştırın — evrak karmaşasından randevu stresine kadar tüm süreci Vize Makinesi hızıyla biz yönetelim."
        ledeClassName="font-serif text-[16px] md:text-[20px] text-navy mt-6 md:mt-9 leading-[1.55] border-l border-coral pl-6"
      />

      <section className="container pt-20 pb-32">
        {sent ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
            className="max-w-2xl mx-auto rounded-2xl border border-border bg-white/70 backdrop-blur-sm shadow-[0_1px_0_rgba(0,0,0,0.04),0_24px_48px_-32px_rgba(15,23,42,0.18)] p-10 md:p-14 text-center"
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
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-coral mb-6">
              — Danışma Formu
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

              {/* Country */}
              <motion.div {...fieldAnim(3)}>
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

              {/* Travel dates */}
              <motion.div {...fieldAnim(4)}>
                <Field
                  id="travelDate"
                  label="Seyahat Tarihleri"
                  required
                  error={errors.travelDate}
                  input={
                    <DateRangePicker
                      travelDate={travelDate}
                      returnDate={returnDate}
                      onTravelDate={setTravelDate}
                      onReturnDate={setReturnDate}
                    />
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
                      placeholder="Vize türü, özel durumlar, daha önce red aldıysanız belirtin…"
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
  required,
  error,
  input,
  bare,
}: {
  id?: string;
  label: string;
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
        {label} {required && <span className="text-coral" aria-hidden="true">*</span>}
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
