import type { Metadata } from 'next';
import PageHead from '@/components/PageHead/PageHead';

export const metadata: Metadata = {
  title: 'Hangi Ülkede Ne Yapılır? — Vize Makinesi Blog',
  description: 'Ülkeye göre vize başvuru süreçleri, gerekli belgeler ve dikkat edilmesi gereken farklılıklar.',
};

const COUNTRIES = [
  {
    flag: '🇬🇧',
    country: 'Birleşik Krallık',
    what: 'Online başvuru zorunlu. Parmak izi ve biyometrik fotoğraf VAC merkezinde alınır. Banka ekstreleri son 6 aya ait olmalı.',
  },
  {
    flag: '🇩🇪',
    country: 'Almanya',
    what: 'Randevu konsolosluktan alınır. Seyahat sağlık sigortası minimum 30.000 € teminatlı olmalı. Konaklama rezervasyonu şart.',
  },
  {
    flag: '🇫🇷',
    country: 'Fransa',
    what: 'VFS Global üzerinden başvuru. Davetiye mektubu apostil ile onaylanmalı. İngilizce belgeler Fransızcaya çevrilmeli.',
  },
  {
    flag: '🇮🇹',
    country: 'İtalya',
    what: 'Konsolosluk randevusu oldukça kısıtlı. Başvuruyu en az 3 ay öncesinden planlamak gerekiyor. Otel rezervasyonu iade garantili olmalı.',
  },
  {
    flag: '🇺🇸',
    country: 'Amerika Birleşik Devletleri',
    what: 'DS-160 formu online doldurulur, ardından mülakat randevusu alınır. Mülakat hazırlığı kritik — seyahat amacı net anlatılmalı.',
  },
  {
    flag: '🇨🇦',
    country: 'Kanada',
    what: 'IRCC portalı üzerinden e-başvuru. Biyometrik randevusu ayrıca alınır. İş mektubu ve maaş belgesi İngilizce/Fransızca olmalı.',
  },
  {
    flag: '🇦🇺',
    country: 'Avustralya',
    what: 'ImmiAccount sistemi üzerinden tamamen online. Sağlık muayenesi çoğu başvuruda zorunlu. Karakter belgesi (adli sicil) istenir.',
  },
  {
    flag: '🇦🇪',
    country: 'Birleşik Arap Emirlikleri',
    what: 'Türk vatandaşları vizesiz giriş yapabilir (30 gün). Uzun süreli oturum için sponsor şart. İş vizesinde şirket tescil belgesi gerekli.',
  },
];

export default function HangiUlkedeNeYapilirPage() {
  return (
    <>
      <PageHead
        eyebrow="— Ülke rehberleri"
        title={<>Hangi ülkede <em className="font-normal italic text-coral">ne yapılır?</em></>}
        lede="Ülkeden ülkeye değişen vize süreçleri, gerekli belgeler ve dikkat edilmesi gereken kritik farklılıklar."
      />

      <section className="container pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px border border-border">
          {COUNTRIES.map((item) => (
            <article
              key={item.country}
              className="p-10 border-border hover:bg-[hsl(var(--color-navy)/0.03)] transition-colors duration-150"
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="text-[28px]">{item.flag}</span>
                <h2 className="font-serif font-bold text-[clamp(18px,2vw,24px)] leading-snug tracking-[-0.015em]">
                  {item.country}
                </h2>
              </div>
              <p className="text-[15px] leading-[1.75] text-muted">{item.what}</p>
            </article>
          ))}
        </div>

        <div className="mt-16 border-t border-border pt-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <p className="text-[15px] leading-relaxed text-muted max-w-xl">
            Başvurunuzu bizimle yapmak ister misiniz? Her ülke için doğru belge listesini ve randevu stratejisini sizinle birlikte hazırlıyoruz.
          </p>
          <a
            href="/danisma-al"
            className="font-sans font-bold text-[13px] uppercase tracking-widest px-7 py-4 bg-navy text-white hover:bg-coral transition-colors duration-200 rounded-xl whitespace-nowrap"
          >
            Danışma Al →
          </a>
        </div>
      </section>
    </>
  );
}
