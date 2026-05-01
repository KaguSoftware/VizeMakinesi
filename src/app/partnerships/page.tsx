import type { Metadata } from 'next';
import PageHead from '@/components/PageHead/PageHead';

export const metadata: Metadata = {
  title: 'Ortaklıklar — Vize Makinesi',
  description: 'Seyahat acenteleri, kurumsal firmalar ve sivil toplum kuruluşları için toplu vize çözümleri.',
};

const PARTNERS = [
  {
    name: 'Seyahat Acenteleri',
    eyebrow: '— 01',
    body:
      'Müşterilerinizin vize süreçlerini tamamen bizim üstlenmemize izin verin. Ajansınız için özel fiyatlandırma, öncelikli randevu ve ayrılmış danışman ataması sunuyoruz.',
  },
  {
    name: 'Kurumsal Firmalar',
    eyebrow: '— 02',
    body:
      'İş seyahati yoğun olan şirketler için yıllık anlaşmalı hizmet paketleri. Çalışan başına sabit maliyet, toplu başvuru takibi ve aylık raporlama dahildir.',
  },
  {
    name: 'Üniversiteler & Okullar',
    eyebrow: '— 03',
    body:
      'Yurt dışı eğitim programları, değişim öğrencileri ve akademik heyetler için öğrenci vize koordinasyonu. Oryantasyon süreçlerine entegre çalışıyoruz.',
  },
  {
    name: 'STK & Vakıflar',
    eyebrow: '— 04',
    body:
      'İnsani yardım, konferans ve uluslararası proje seyahatleri için özel kategoriler ve indirimli ücretler. Resmi davet mektubu hazırlığında da destek veriyoruz.',
  },
];

export default function PartnershipsPage() {
  return (
    <>
      <PageHead
        eyebrow="— Kurumsal ortaklıklar"
        title={<>Tek dosya değil, <em className="font-normal italic text-coral">tam bir program.</em></>}
        lede="Toplu vize ihtiyacı olan kurumlar için adanmış ekip, öncelikli işlem ve şeffaf fiyatlandırma."
      />

      {/* Partner types */}
      <section className="container pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px border border-border">
          {PARTNERS.map((p) => (
            <div key={p.name} className="p-10">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-coral mb-4">
                {p.eyebrow}
              </div>
              <h2 className="font-serif font-bold text-[clamp(22px,2.2vw,30px)] tracking-[-0.015em] mb-5">
                {p.name}
              </h2>
              <p className="text-[15px] leading-[1.85] text-muted">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-24">
        <div className="border border-border p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-center">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-coral mb-4">
              — Teklif alın
            </div>
            <h2 className="font-serif font-bold text-[clamp(28px,3vw,42px)] tracking-[-0.02em] leading-snug">
              Kurumunuz için bir görüşme ayarlayalım.
            </h2>
            <p className="text-[15px] leading-[1.85] text-muted mt-4 max-w-lg">
              İhtiyacınızı anlatın — hacim, sıklık, varış noktaları. Size 24 saat içinde yazılı bir teklif iletiyoruz.
            </p>
          </div>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.16em] border border-coral text-coral px-8 py-4 hover:bg-coral hover:text-white transition-colors duration-150 whitespace-nowrap rounded-2xl"
          >
            İletişime Geç →
          </a>
        </div>
      </section>
    </>
  );
}
