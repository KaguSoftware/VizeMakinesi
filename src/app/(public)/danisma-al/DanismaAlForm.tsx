"use client";
import { useState } from "react";
import PageHead from "@/components/shared/PageHead/PageHead";
import DateRangePicker from "./DateRangePicker";
import FlagBG from "@/components/shared/FlagBG/FlagBG";
import type { DanismaCountry } from "@/lib/data/countries";

export default function DanismaAlForm({ countries }: { countries: DanismaCountry[] }) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [travelDate, setTravelDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 900);
  }

  if (sent) {
    return (
      <>
        <PageHead
          eyebrow="— Teşekkürler"
          title={<>Formunuz <em className="font-normal italic text-coral">alındı.</em></>}
          lede="En geç 2 iş günü içinde size dönüş yapacağız."
        />
        <section className="container pb-24">
          <div className="border border-border p-10 max-w-lg">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-coral mb-4">— Sonraki adım</div>
            <p className="text-[15px] leading-[1.85] text-muted">
              Danışmanlarımızdan biri talebinizi inceleyip sizinle iletişime geçecek.
              Acil durumlar için{" "}
              <a href="tel:+905307753131" className="text-coral hover:underline">
                +90 530 775 31 31
              </a>{" "}
              numaralı hattı arayabilirsiniz.
            </p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHead
        eyebrow="— Danışma formu"
        title={<>Bize anlatın, <em className="font-normal italic text-coral">biz halledelim.</em></>}
        titleClassName="font-serif font-bold text-[clamp(36px,4.2vw,72px)] leading-[0.95] tracking-[-0.02em] whitespace-nowrap"
        lede="Seyahat planınızı paylaşın — 2 iş günü içinde size dönelim."
        ledeClassName="font-serif text-[20px] text-navy mt-9 leading-[1.45] border-l border-coral pl-6 whitespace-nowrap"
      />

      <section className="container pb-16">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-px border border-border"
        >
          {/* Ad Soyad */}
          <div className="p-5 border-b border-border lg:border-r">
            <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-coral mb-2">
              Ad Soyad <span className="text-coral">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              required
              placeholder="Örn. Ayşe Kaya"
              className="w-full bg-transparent border-b border-border pb-1.5 font-serif text-[13px] text-navy placeholder:text-muted/40 focus:outline-none focus:border-coral transition-colors duration-150"
            />
          </div>

          {/* Telefon */}
          <div className="p-5 border-b border-border lg:border-r">
            <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-coral mb-2">
              Telefon <span className="text-coral">*</span>
            </label>
            <div className="flex items-end border-b border-border pb-1.5 focus-within:border-coral transition-colors duration-150">
              <span className="font-serif text-[13px] text-navy mr-2 shrink-0">+90</span>
              <input
                type="tel"
                name="phone"
                required
                placeholder="5__ ___ __ __"
                maxLength={10}
                onKeyDown={(e) => {
                  const allowed = ['Backspace','Delete','Tab','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'];
                  if (allowed.includes(e.key)) return;
                  if (!/^\d$/.test(e.key)) e.preventDefault();
                }}
                className="w-full bg-transparent font-serif text-[13px] text-navy placeholder:text-muted/40 focus:outline-none"
              />
            </div>
          </div>

          {/* E-posta */}
          <div className="p-5 border-b border-border">
            <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-coral mb-2">
              E-posta <span className="text-coral">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="ornek@mail.com"
              className="w-full bg-transparent border-b border-border pb-1.5 font-serif text-[13px] text-navy placeholder:text-muted/40 focus:outline-none focus:border-coral transition-colors duration-150"
            />
          </div>

          {/* Ülke */}
          <div className="p-5 border-b border-border lg:border-r flex flex-col">
            <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-coral mb-2">
              Gidilecek Ülke <span className="text-coral">*</span>
            </label>
            <select
              name="country"
              required
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full bg-transparent border-b border-border pb-1.5 font-serif text-[13px] text-navy focus:outline-none focus:border-coral transition-colors duration-150 cursor-pointer"
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
            {(() => {
              const selected = countries.find((c) => c.name === selectedCountry);
              const presetKey = selected?.flag_preset_key ?? undefined;
              const imageUrl = selected?.flag_image_url ?? undefined;
              return (
                <div className="relative flex-1 mt-4 overflow-hidden">
                  {selected && (presetKey || imageUrl) && (
                    <FlagBG
                      presetKey={presetKey}
                      imageUrl={imageUrl}
                      className="absolute inset-0 w-full h-full"
                      fit={presetKey === "switzerland" ? "meet" : "slice"}
                    />
                  )}
                </div>
              );
            })()}
          </div>

          {/* Not */}
          <div className="p-5 border-b border-border lg:border-r">
            <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-coral mb-2">
              Not / Ek Bilgi
            </label>
            <textarea
              name="note"
              rows={3}
              placeholder="Vize türü, özel durumlar, daha önce red aldıysanız belirtin…"
              className="w-full bg-transparent font-serif text-[13px] text-navy placeholder:text-muted/40 focus:outline-none resize-none"
            />
          </div>

          {/* Seyahat Tarihleri — custom range calendar */}
          <div className="p-5 border-b border-border flex flex-col">
            <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-coral mb-2">
              Seyahat Tarihleri <span className="text-coral">*</span>
            </label>
            <input type="hidden" name="travelDate" value={travelDate} required />
            <input type="hidden" name="returnDate" value={returnDate} />
            <DateRangePicker
              travelDate={travelDate}
              returnDate={returnDate}
              onTravelDate={setTravelDate}
              onReturnDate={setReturnDate}
            />
          </div>

          {/* Submit */}
          <div className="lg:col-span-3 border-t border-border p-5 flex items-center justify-between flex-wrap gap-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              * Zorunlu alanlar
            </p>
            <button
              type="submit"
              disabled={loading}
              className="font-sans font-bold text-[13px] uppercase tracking-widest px-8 py-3 bg-coral text-navy border border-coral hover:bg-navy hover:text-white hover:border-coral transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl"
            >
              {loading ? "Gönderiliyor…" : "Formu Gönder →"}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
