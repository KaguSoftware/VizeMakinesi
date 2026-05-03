
import type { MegaMenuGroup, MobileLink } from './types';

export const TICKER_ITEMS = [
  '— Hafta içi 18:00\'a kadar açık',
  '· Schengen işlem süresi 12 iş günü',
  '· ABD hızlandırma ',
  '· Bu gün arayın ',
  '· +90 530 775 31 31',
  '· Sekreterımızle görüşün',

];

export const MEGA_MENU: MegaMenuGroup[] = [
  {
    label: 'Vizeler',
    columns: [
      {
        title: 'Avrupa',
        items: [
          { to: '/visa/uk', label: 'Birleşik Krallık', flag: '🇬🇧' },
          { to: '/visa/germany', label: 'Almanya', flag: '🇩🇪' },
          { to: '/visa/france', label: 'Fransa', flag: '🇫🇷' },
          { to: '/visa/italy', label: 'İtalya', flag: '🇮🇹' },
          { to: '/visa/netherlands', label: 'Hollanda', flag: '🇳🇱' },
          { to: '/schengen', label: 'Schengen Bölgesi', flag: '🇪🇺' },
        ],
      },
      {
        title: 'Amerika',
        items: [
          { to: '/visa/usa', label: 'Amerika Birleşik Devletleri', flag: '🇺🇸' },
          { to: '/visa/canada', label: 'Kanada', flag: '🇨🇦' },
          { to: '/us-visa-expedite', label: 'ABD Hızlandırma', flag: '⚡' },
        ],
      },
      {
        title: 'Asya ve Pasifik',
        items: [
          { to: '/visa/australia', label: 'Avustralya', flag: '🇦🇺' },
          { to: '/visa/uae', label: 'Birleşik Arap Emirlikleri', flag: '🇦🇪' },
        ],
      },
      {
        kind: 'feature',
        feature: {
          eyebrow: '',
          title: 'Hangi Vizeye ihtiyacınız var?',
          body: 'Hangi vizeye ihtiyacınız olduğunu seçin ve gerekli dokümanları görüntüleyin',
          to: '/schengen',
        },
      },
    ],
  },
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
