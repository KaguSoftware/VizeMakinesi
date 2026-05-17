"use client";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import PageHead from "@/components/shared/PageHead/PageHead";
import DateRangePicker from "./DateRangePicker";
import FlagBG from "@/components/shared/FlagBG/FlagBG";
import WhatsAppPreview from "./WhatsAppPreview";
import { buildWhatsAppMessage } from "./buildWhatsAppMessage";
import { SITE } from "@/data/site";
import type { DanismaCountry } from "@/lib/data/countries";
import { EASE_OUT_EXPO } from "@/components/shared/motion/constants";

type Errors = Partial<Record<"ad" | "soyad" | "email" | "phone" | "country" | "travelDate", string>>;

const fieldAnim = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: i * 0.04, ease: EASE_OUT_EXPO },
});

export default function DanismaAlForm({ countries }: { countries: DanismaCountry[] }) {
  const [ad, setAd] = useState("");
  const [soyad, setSoyad] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  const message = useMemo(
    () => buildWhatsAppMessage({ ad, soyad, email, phone, country, travelDate, returnDate, note }),
    [ad, soyad, email, phone, country, travelDate, returnDate, note]
  );

  const selectedCountry = countries.find((c) => c.name === country);

  function validate(): Errors {
    const errs: Errors = {};
    if (!ad.trim()) errs.ad = "Adınızı girin";
    if (!soyad.trim()) errs.soyad = "Soyadınızı girin";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) errs.email = "Geçerli bir e-posta girin";
    if (!/^\d{10}$/.test(phone.trim())) errs.phone = "10 haneli telefon numaranızı girin";
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
    const text = encodeURIComponent(message);
    window.open(`${SITE.whatsappHref}?text=${text}`, "_blank", "noopener,noreferrer");
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

      <section className="container pt-14 pb-24">
        <div className="grid lg:grid-cols-12 gap-10">
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-7 rounded-2xl border border-border bg-white/70 backdrop-blur-sm shadow-[0_1px_0_rgba(0,0,0,0.04),0_24px_48px_-32px_rgba(15,23,42,0.18)] p-6 md:p-10"
            noValidate
          >
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-coral mb-6">
              — Danışma Formu
            </div>

            <div className="space-y-7">
              {/* Ad + Soyad */}
              <motion.div {...fieldAnim(0)} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field
                  label="Ad"
                  required
                  error={errors.ad}
                  input={
                    <input
                      type="text"
                      value={ad}
                      onChange={(e) => setAd(e.target.value)}
                      placeholder="Ayşe"
                      className={inputCls}
                      autoComplete="given-name"
                    />
                  }
                />
                <Field
                  label="Soyad"
                  required
                  error={errors.soyad}
                  input={
                    <input
                      type="text"
                      value={soyad}
                      onChange={(e) => setSoyad(e.target.value)}
                      placeholder="Kaya"
                      className={inputCls}
                      autoComplete="family-name"
                    />
                  }
                />
              </motion.div>

              {/* Email */}
              <motion.div {...fieldAnim(1)}>
                <Field
                  label="E-posta"
                  required
                  error={errors.email}
                  input={
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ornek@mail.com"
                      className={inputCls}
                      autoComplete="email"
                    />
                  }
                />
              </motion.div>

              {/* Phone */}
              <motion.div {...fieldAnim(2)}>
                <Field
                  label="Telefon"
                  required
                  error={errors.phone}
                  input={
                    <div className="flex items-end border-b border-border pb-1.5 focus-within:border-coral transition-colors duration-150">
                      <span className="font-serif text-[14px] text-navy mr-2 shrink-0">+90</span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          const next = e.target.value.replace(/\D/g, "").slice(0, 10);
                          setPhone(next);
                        }}
                        placeholder="5__ ___ __ __"
                        className="w-full bg-transparent font-serif text-[14px] text-navy placeholder:text-muted/40 focus:outline-none"
                        autoComplete="tel-national"
                      />
                    </div>
                  }
                  bare
                />
              </motion.div>

              {/* Country */}
              <motion.div {...fieldAnim(3)}>
                <Field
                  label="Gidilecek Ülke"
                  required
                  error={errors.country}
                  input={
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className={`${inputCls} cursor-pointer`}
                    >
                      <option value="" disabled>
                        Ülke seçin…
                      </option>
                      {countries.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  }
                />
                {selectedCountry && (selectedCountry.flag_preset_key || selectedCountry.flag_image_url) && (
                  <div className="relative mt-4 overflow-hidden h-48 rounded-xl border border-border">
                    <FlagBG
                      presetKey={selectedCountry.flag_preset_key ?? undefined}
                      imageUrl={selectedCountry.flag_image_url ?? undefined}
                      className="absolute inset-0 w-full h-full"
                      fit={selectedCountry.flag_preset_key === "switzerland" ? "meet" : "slice"}
                    />
                  </div>
                )}
              </motion.div>

              {/* Travel dates */}
              <motion.div {...fieldAnim(4)}>
                <Field
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
              <motion.div {...fieldAnim(5)}>
                <Field
                  label="Not / Ek Bilgi"
                  input={
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={3}
                      placeholder="Vize türü, özel durumlar, daha önce red aldıysanız belirtin…"
                      className="w-full bg-transparent border-b border-border pb-1.5 font-serif text-[14px] text-navy placeholder:text-muted/40 focus:outline-none focus:border-coral transition-colors duration-150 resize-none"
                    />
                  }
                  bare
                />
              </motion.div>
            </div>

            {/* Submit */}
            <motion.div {...fieldAnim(6)} className="mt-10 border-t border-border pt-6 flex items-center justify-between flex-wrap gap-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                * Zorunlu alanlar
              </p>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.18, ease: EASE_OUT_EXPO }}
                className="inline-flex items-center gap-3 font-sans font-semibold text-[14px] uppercase tracking-[0.12em] px-7 py-4 bg-[#25D366] text-white border border-[#25D366] hover:bg-transparent hover:text-[#25D366] transition-colors duration-200 rounded-2xl"
              >
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.114 1.522 5.847L.057 23.882a.5.5 0 0 0 .638.605l6.256-1.643A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.893a9.875 9.875 0 0 1-5.031-1.375l-.36-.214-3.733.979.997-3.639-.235-.374A9.855 9.855 0 0 1 2.107 12C2.107 6.58 6.58 2.107 12 2.107S21.893 6.58 21.893 12 17.42 21.893 12 21.893z" />
                </svg>
                WhatsApp&apos;tan Gönder →
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
  "w-full bg-transparent border-b border-border pb-1.5 font-serif text-[14px] text-navy placeholder:text-muted/40 focus:outline-none focus:border-coral transition-colors duration-150";

function Field({
  label,
  required,
  error,
  input,
  bare,
}: {
  label: string;
  required?: boolean;
  error?: string;
  input: React.ReactNode;
  bare?: boolean;
}) {
  return (
    <div>
      <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-coral mb-2">
        {label} {required && <span className="text-coral">*</span>}
      </label>
      {bare ? input : input}
      {error && (
        <motion.p
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
