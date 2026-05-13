
import type { MegaMenuGroup, MobileLink } from './types';

// The Hizmetler, Blog, and Ofis groups — static, DB-independent.
// Vizeler is built dynamically from DB in NavServer.tsx.
export const STATIC_MEGA_MENU: MegaMenuGroup[] = [
  {
    label: 'Hizmetler',
    columns: [
      {
        title: 'Vize Hizmetleri',
        items: [
          { to: '/vize-rejimleri', label: 'Vize Rejimleri', desc: 'Turist, iş, öğrenci, çalışma, transit' },
          { to: '/nasil-calisiyoruz', label: 'Nasıl Çalışırız', desc: 'Beş adımlı ofis metodumuz' },
          { to: '/ucrete-dahil-hizmetler', label: 'Ücrete Dahil Hizmetler', desc: 'Her başvuruda ne sunuyoruz' },
        ],
      },
      {
        title: 'Vize Ötesi',
        items: [
          { to: '/pasaport', label: 'Pasaport Hizmetleri', desc: 'Çıkarma, yenileme, kayıp' },
          { to: '/ortakliklar', label: 'Kurumsal Ortaklıklar', desc: 'Ortaklarımız' },
          { to: '/abd-hizlandirma', label: '⚡️ ABD Hızlandırma', desc: '5–10 günde mülakat' },
        ],
      },
      {
        kind: 'feature',
        feature: {
          eyebrow: '',
          title: 'Hizmetlerimizle ilgili bilgi alın',
          body: 'Hizmetlerimiz, ofisimiz ve işleyişimizle ilgili bilgi alın',
          to: '/ucrete-dahil-hizmetler',
        },
      },
    ],
  },
  {
    label: 'Ofis',
    columns: [
      {
        title: 'Hakkımızda',
        items: [
          { to: '/hakkimizda', label: 'Ofisimiz', desc: 'Ekip ve danışmanlar' },
          { to: '/ortakliklar', label: 'Ortaklıklar', desc: 'Kurumsal çözümler' },
        ],
      },
      {
        title: 'Ziyaret',
        items: [
          { to: '/iletisim', label: '4.Levent Ofisi', desc: 'Selvili Sokağı · D:Kat:1 Daire:1' },
          { to: '/iletisim', label: 'Çalışma Saatleri', desc: 'Pts–Cts · Randevusuz kabul' },
        ],
      },
      {
        kind: 'feature',
        feature: {
          eyebrow: '',
          title: 'Ofisimizle İlgili bilgi alın',
          body: 'Çalışma Saatlerimizi, ortaklıklarımızı ve konumumuzu öğrenin',
          to: '/iletisim',
        },
      },
    ],
  },
];

export const MOBILE_LINKS: MobileLink[] = [
  { to: '/', label: 'Ana Sayfa', end: true },
  { to: '/vize-rejimleri', label: 'Vize Rejimleri' },
  { to: '/nasil-calisiyoruz', label: 'Nasıl Çalışırız' },
  { to: '/hakkimizda', label: 'Hakkımızda' },
  { to: '/ucrete-dahil-hizmetler', label: 'Ücretler' },
  { to: '/vize/schengen', label: 'Schengen' },
  { to: '/pasaport', label: 'Pasaport' },
  { to: '/blog', label: 'Blog' },
  { to: '/ortakliklar', label: 'Ortaklıklar' },
  { to: '/abd-hizlandirma', label: 'ABD Hızlandırma' },
  { to: '/iletisim', label: 'İletişim' },
];
