
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
          { to: '/visa-regimes', label: 'Vize Rejimleri', desc: 'Turist, iş, öğrenci, çalışma, transit' },
          { to: '/how-it-works', label: 'Nasıl Çalışırız', desc: 'Beş adımlı ofis metodumuz' },
          { to: '/fees', label: 'Ücrete Dahil Hizmetler', desc: 'Her başvuruda ne sunuyoruz' },
        ],
      },
      {
        title: 'Vize Ötesi',
        items: [
          { to: '/passport', label: 'Pasaport Hizmetleri', desc: 'Çıkarma, yenileme, kayıp' },
          { to: '/partnerships', label: 'Kurumsal Ortaklıklar', desc: 'Ortaklarımız' },
          { to: '/us-visa-expedite', label: 'ABD Hızlandırma', desc: '5–10 günde mülakat' },
        ],
      },
      {
        kind: 'feature',
        feature: {
          eyebrow: '',
          title: 'Hizmetlerimizle ilgili bilgi alın',
          body: 'Hizmetlerimiz, ofisimiz ve işleyişimizle ilgili bilgi alın',
          to: '/fees',
        },
      },
    ],
  },
  {
    label: 'Blog',
    columns: [
      {
        title: 'Rehberler',
        items: [
          { to: '/blog', label: 'Gezi Rehberi', desc: 'Ülke ülke turistik tavsiyeler' },
        ],
      },
      {
        kind: 'feature',
        feature: {
          eyebrow: '',
          title: 'Ülkelerle ilgili bilgi edinin',
          body: 'Gideceğiniz ülkenin turistik yerleri ile ilgili bilgi öğrenin',
          to: '/blog',
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
          { to: '/about', label: 'Ofisimiz', desc: 'Ekip ve danışmanlar' },
          { to: '/partnerships', label: 'Ortaklıklar', desc: 'Kurumsal çözümler' },
        ],
      },
      {
        title: 'Ziyaret',
        items: [
          { to: '/contact', label: '4.Levent Ofisi', desc: 'Selvili Sokağı · D:Kat:1 Daire:1' },
          { to: '/contact', label: 'Çalışma Saatleri', desc: 'Pts–Cts · Randevusuz kabul' },
        ],
      },
      {
        kind: 'feature',
        feature: {
          eyebrow: '',
          title: 'Ofisimizle İlgili bilgi alın',
          body: 'Çalışma Saatlerimizi, ortaklıklarımızı ve konumumuzu öğrenin',
          to: '/contact',
        },
      },
    ],
  },
];

export const MOBILE_LINKS: MobileLink[] = [
  { to: '/', label: 'Ana Sayfa', end: true },
  { to: '/visa-regimes', label: 'Vize Rejimleri' },
  { to: '/how-it-works', label: 'Nasıl Çalışırız' },
  { to: '/about', label: 'Hakkımızda' },
  { to: '/fees', label: 'Ücretler' },
  { to: '/schengen', label: 'Schengen' },
  { to: '/passport', label: 'Pasaport' },
  { to: '/blog', label: 'Blog' },
  { to: '/partnerships', label: 'Ortaklıklar' },
  { to: '/us-visa-expedite', label: 'ABD Hızlandırma' },
  { to: '/contact', label: 'İletişim' },
];
