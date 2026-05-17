import Link from 'next/link';
import { TIMELINE_STEPS } from '@/components/shared/Timeline/constants';
import { FadeIn, Stagger, StaggerItem } from '@/components/shared/motion';

const REZERVASYON_KURUMLARI = ['VFS Global', 'iDATA', 'BLS'];

export default function BasvuruSureci() {
  const basvuru = TIMELINE_STEPS[0];

  return (
    <section className="container border-b border-border">
      <div className="pt-28 pb-12 grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-16 items-start">
        <FadeIn as="div">
          <h2 className="font-serif font-bold text-[clamp(36px,4.5vw,56px)] leading-none tracking-tight text-navy mb-6">
            Başvuru ve rezervasyon<br />
            <em className="font-normal italic text-coral">nasıl işliyor?</em>
          </h2>
          <p className="font-serif italic text-[18px] text-navy/70 leading-relaxed mb-8 max-w-sm">
            İlk görüşmeden pasaport teslimine kadar her adımı biz yönetiyoruz. Hiçbir ayrıntı gözden kaçmaz.
          </p>
          <Link
            href="/nasil-calisiyoruz"
            className="inline-flex items-center gap-2 font-sans font-medium text-[13px] uppercase tracking-[0.15em] text-navy hover:text-coral transition-colors duration-200"
          >
            Sürecin tamamını görün →
          </Link>
        </FadeIn>

        <Stagger as="div" className="flex flex-col gap-0">
          {/* Step 01 — Başvuru */}
          <StaggerItem className="flex gap-6 py-6 border-b border-navy/10 bg-navy/3 rounded-xl px-5 -mx-5">
            <div className="font-mono text-[11px] tracking-[0.15em] pt-1 shrink-0 w-7 text-coral font-bold">
              {basvuru.n}
            </div>
            <div>
              <div className="font-sans font-semibold text-[15px] mb-1 text-navy">
                {basvuru.title}
              </div>
              <div className="font-sans text-[14px] leading-relaxed text-navy/80">
                {basvuru.detail}
              </div>
            </div>
          </StaggerItem>

          {/* Rezervasyon */}
          <StaggerItem className="flex gap-6 py-6 border-b border-navy/10">
            <div className="font-mono text-[11px] tracking-[0.15em] pt-1 shrink-0 w-7 text-coral font-bold">
              02
            </div>
            <div>
              <div className="font-sans font-semibold text-[15px] mb-1 text-navy">
                Rezervasyon
              </div>
              <div className="font-sans text-[14px] leading-relaxed text-navy/80 mb-4">
                Konsolosluk randevunuzu sizin adınıza yetkili aracı kurumlar üzerinden alıyoruz. Hangi kurumun aktif randevu verdiğini takip eder, en uygun tarihi sizin için ayarlıyoruz.
              </div>
              <div className="flex flex-wrap gap-2">
                {REZERVASYON_KURUMLARI.map((kurum) => (
                  <span
                    key={kurum}
                    className="font-mono text-[10px] tracking-[0.12em] uppercase px-3 py-1.5 border border-navy/20 text-navy/60 rounded-md"
                  >
                    {kurum}
                  </span>
                ))}
              </div>
            </div>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}
