"use client";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import PageHead from "@/components/shared/PageHead/PageHead";
import DateRangePicker from "./DateRangePicker";
import WhatsAppPreview from "./WhatsAppPreview";
import { buildWhatsAppMessage } from "./buildWhatsAppMessage";
import { SITE } from "@/data/site";
import type { DanismaCountry } from "@/lib/data/countries";
import { EASE_OUT_EXPO } from "@/components/shared/motion/constants";

type Errors = Partial<Record<"ad" | "soyad" | "email" | "country" | "travelDate", string>>;

const fieldAnim = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: i * 0.04, ease: EASE_OUT_EXPO },
});

export default function DanismaAlForm({ countries }: { countries: DanismaCountry[] }) {
  const [ad, setAd] = useState("");
  const [soyad, setSoyad] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const selectedCountry = countries.find((c) => c.name === country);

  const message = useMemo(
    () => buildWhatsAppMessage({ ad, soyad, email, country, countryEmoji: selectedCountry?.flag_emoji ?? null, travelDate, returnDate, note }),
    [ad, soyad, email, country, selectedCountry?.flag_emoji, travelDate, returnDate, note]
  );

  function validate(): Errors {
    const errs: Errors = {};
    if (!ad.trim()) errs.ad = "Adınızı girin";
    if (!soyad.trim()) errs.soyad = "Soyadınızı girin";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) errs.email = "Geçerli bir e-posta girin";
    if (!country) errs.country = "Ülke seçin";
    if (!travelDate) errs.travelDate = "Gidiş tarihi seçin";
    return errs;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    const text = encodeURIComponent(message);
    window.open(`${SITE.whatsappHref}?text=${text}`, "_blank", "noopener,noreferrer");
    setTimeout(() => setSubmitting(false), 1200);
  }

  return (
    <>
      <PageHead
        eyebrow="— Danışma formu"
        title={<>Vize Sürecinizi <em className="font-normal italic text-coral">Bugün Başlatın.</em></>}
        titleClassName="font-serif font-bold text-[clamp(28px,4.2vw,72px)] leading-[1.05] tracking-[-0.02em]"
        lede="Formu doldurun; size özel WhatsApp mesajınız hazırlansın. Tek tıkla danışmanlarımıza ulaştırın — evrak karmaşasından randevu stresine kadar tüm süreci Vize Makinesi hızıyla biz yönetelim."
        ledeClassName="font-serif text-[16px] md:text-[20px] text-navy mt-6 md:mt-9 leading-[1.55] border-l border-coral pl-6"
      />

      <section className="container pt-20 pb-32">
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
                      onChange={(e) => setAd(e.target.value)}
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
                      onChange={(e) => setSoyad(e.target.value)}
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

              {/* Country */}
              <motion.div {...fieldAnim(2)}>
                <Field
                  id="country"
                  label="Gidilecek Ülke"
                  required
                  error={errors.country}
                  input={
                    <select
                      id="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className={`${inputCls} cursor-pointer`}
                      aria-invalid={Boolean(errors.country)}
                      aria-describedby={errors.country ? "country-error" : undefined}
                    >
                      <option value="" disabled>
                        Ülke seçin…
                      </option>
                      {countries.map((c, i) => (
                        <option key={`${c.name}-${i}`} value={c.name}>
                          {c.flag_emoji ? `${c.flag_emoji} ${c.name}` : c.name}
                        </option>
                      ))}
                    </select>
                  }
                />
              </motion.div>

              {/* Travel dates */}
              <motion.div {...fieldAnim(3)}>
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

              {/* Note */}
              <motion.div {...fieldAnim(4)}>
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
            <motion.div {...fieldAnim(5)} className="mt-10 border-t border-border pt-6 flex items-center justify-between flex-wrap gap-4">
              <div role="status" aria-live="assertive" className="min-h-[1em]">
                {Object.keys(errors).length > 0 ? (
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
                className="inline-flex items-center gap-3 font-sans font-semibold text-[14px] uppercase tracking-[0.12em] px-7 py-4 bg-whatsapp text-white border border-whatsapp hover:bg-transparent hover:text-whatsapp transition-colors duration-200 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 disabled:opacity-70 disabled:cursor-wait disabled:hover:bg-whatsapp disabled:hover:text-white"
              >
                {submitting ? (
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
                ) : (
                  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.114 1.522 5.847L.057 23.882a.5.5 0 0 0 .638.605l6.256-1.643A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.893a9.875 9.875 0 0 1-5.031-1.375l-.36-.214-3.733.979.997-3.639-.235-.374A9.855 9.855 0 0 1 2.107 12C2.107 6.58 6.58 2.107 12 2.107S21.893 6.58 21.893 12 17.42 21.893 12 21.893z" />
                  </svg>
                )}
                {submitting ? "WhatsApp açılıyor…" : "WhatsApp'tan Gönder →"}
              </motion.button>
            </motion.div>
          </form>

          <aside className="lg:col-span-5">
            <WhatsAppPreview message={message} />
          </aside>
        </div>
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
