"use client";
import { useState } from "react";
import PageHead from "@/components/PageHead/PageHead";

const COUNTRIES = [
  "Almanya", "Amerika Birleşik Devletleri", "Avustralya", "Avusturya",
  "Belçika", "Birleşik Arap Emirlikleri", "Birleşik Krallık", "Çek Cumhuriyeti",
  "Danimarka", "Fransa", "Hollanda", "İspanya", "İsveç", "İsviçre",
  "İtalya", "Japonya", "Kanada", "Norveç", "Portekiz", "Yunanistan",
  "Diğer",
];

export default function DanismaAlForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

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
          lede="En geç 1 iş günü içinde size dönüş yapacağız."
        />
        <section className="container pb-24">
          <div className="border border-border p-12 max-w-lg">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-coral mb-4">— Sonraki adım</div>
            <p className="text-[16px] leading-[1.85] text-muted">
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
        lede="Seyahat planınızı ve ihtiyacınızı kısaca paylaşın — 1 iş günü içinde size dönelim."
      />

      <section className="container pb-24">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-2 gap-px border border-border"
        >
          {/* Ad Soyad */}
          <div className="p-8 border-b border-border lg:border-r">
            <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-coral mb-3">
              Ad Soyad <span className="text-coral">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              required
              placeholder="Örn. Ayşe Kaya"
              className="w-full bg-transparent border-b border-border pb-2 font-serif text-[18px] text-navy placeholder:text-muted/40 focus:outline-none focus:border-coral transition-colors duration-150"
            />
          </div>

          {/* Telefon */}
          <div className="p-8 border-b border-border">
            <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-coral mb-3">
              Telefon <span className="text-coral">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              required
              placeholder="+90 5__ ___ __ __"
              className="w-full bg-transparent border-b border-border pb-2 font-serif text-[18px] text-navy placeholder:text-muted/40 focus:outline-none focus:border-coral transition-colors duration-150"
            />
          </div>

          {/* E-posta */}
          <div className="p-8 border-b border-border lg:border-r">
            <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-coral mb-3">
              E-posta <span className="text-coral">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="ornek@mail.com"
              className="w-full bg-transparent border-b border-border pb-2 font-serif text-[18px] text-navy placeholder:text-muted/40 focus:outline-none focus:border-coral transition-colors duration-150"
            />
          </div>

          {/* Seyahat Tarihi */}
          <div className="p-8 border-b border-border">
            <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-coral mb-3">
              Seyahat Tarihi <span className="text-coral">*</span>
            </label>
            <input
              type="date"
              name="travelDate"
              required
              className="w-full bg-transparent border-b border-border pb-2 font-serif text-[18px] text-navy focus:outline-none focus:border-coral transition-colors duration-150"
            />
          </div>

          {/* Ülke */}
          <div className="p-8 border-b border-border lg:col-span-2">
            <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-coral mb-3">
              Gidilecek Ülke <span className="text-coral">*</span>
            </label>
            <select
              name="country"
              required
              defaultValue=""
              className="w-full bg-transparent border-b border-border pb-2 font-serif text-[18px] text-navy focus:outline-none focus:border-coral transition-colors duration-150 cursor-pointer"
            >
              <option value="" disabled>
                Ülke seçin…
              </option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Not */}
          <div className="p-8 lg:col-span-2">
            <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-coral mb-3">
              Not / Ek Bilgi
            </label>
            <textarea
              name="note"
              rows={4}
              placeholder="Vize türü, özel durumlar, daha önce red aldıysanız belirtin…"
              className="w-full bg-transparent border-b border-border pb-2 font-serif text-[18px] text-navy placeholder:text-muted/40 focus:outline-none focus:border-coral transition-colors duration-150 resize-none"
            />
          </div>

          {/* Submit */}
          <div className="lg:col-span-2 border-t border-border p-8 flex items-center justify-between flex-wrap gap-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              * Zorunlu alanlar
            </p>
            <button
              type="submit"
              disabled={loading}
              className="font-sans font-bold text-[13.8px] uppercase tracking-widest px-10 py-4 bg-coral text-navy border border-coral hover:bg-navy hover:text-white hover:border-coral transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Gönderiliyor…" : "Formu Gönder →"}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
