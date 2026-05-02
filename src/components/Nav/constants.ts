import type { MegaMenuGroup, MobileLink } from './types';

export const TICKER_ITEMS = [
  '— Bugün 18:00\'a kadar açık',
  '· Schengen işlem süresi 12 iş günü',
  '· ABD hızlandırma %91 onay',
  '· +90 530 775 31 31',
];

export const MEGA_MENU: MegaMenuGroup[] = [
  {
    label: 'Vizeler',
    columns: [
      {
        title: 'Avrupa',
        items: [
          { to: '/visa/uk',          label: 'Birleşik Krallık', flag: '🇬🇧' },
          { to: '/visa/germany',     label: 'Almanya',          flag: '🇩🇪' },
          { to: '/visa/france',      label: 'Fransa',           flag: '🇫🇷' },
          { to: '/visa/italy',       label: 'İtalya',           flag: '🇮🇹' },
          { to: '/visa/netherlands', label: 'Hollanda',         flag: '🇳🇱' },
          { to: '/schengen',         label: 'Schengen Bölgesi', flag: '🇪🇺' },
        ],
      },
      {
        title: 'Amerika',
        items: [
          { to: '/visa/usa',         label: 'Amerika Birleşik Devletleri', flag: '🇺🇸' },
          { to: '/visa/canada',      label: 'Kanada',                      flag: '🇨🇦' },
          { to: '/us-visa-expedite', label: 'ABD Hızlandırma',             flag: '⚡' },
        ],
      },
      {
        title: 'Asya ve Pasifik',
        items: [
          { to: '/visa/australia', label: 'Avustralya',              flag: '🇦🇺' },
          { to: '/visa/uae',       label: 'Birleşik Arap Emirlikleri', flag: '🇦🇪' },
        ],
      },
      {
        kind: 'feature',
        feature: {
          eyebrow: 'Bu hafta',
          title: 'Schengen çoklu giriş, 5 yıl',
          body: 'Uzun geçerlilik süreli Schengen turist vizeleri, ortak konsolosluklarımızda 12 iş günü içinde işleme alınmaktadır.',
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
          { to: '/visa-regimes',  label: 'Vize Rejimleri',         desc: 'Turist, iş, öğrenci, çalışma, transit' },
          { to: '/how-it-works',  label: 'Nasıl Çalışırız',        desc: 'Beş adımlı ofis metodumuz' },
          { to: '/fees',          label: 'Ücretler ve Fiyatlandırma', desc: 'Standart · Ekspres · Premium kademeler' },
        ],
      },
      {
        title: 'Vize Ötesi',
        items: [
          { to: '/passport',         label: 'Pasaport Hizmetleri', desc: 'Çıkarma, yenileme, kayıp' },
          { to: '/tours',            label: 'Özel Turlar',         desc: 'Küçük gruplu güzergahlar' },
          { to: '/us-visa-expedite', label: 'ABD Hızlandırma',     desc: '5–10 günde mülakat' },
        ],
      },
      {
        kind: 'feature',
        feature: {
          eyebrow: 'Ofis notu',
          title: 'Neden sabit fiyat?',
          body: 'İlk günden rakam veririz. Saatlik faturalama yok, sürpriz yok, altıncı haftada şok yok.',
          to: '/fees',
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
          { to: '/about', label: 'Ofisimiz', desc: 'On sekiz yıl, on iki danışman' },
          { to: '/about', label: 'Ekip',     desc: 'Ortaklar ve danışmanlar' },
        ],
      },
      {
        title: 'Ziyaret',
        items: [
          { to: '/contact', label: 'Levent Ofisi', desc: 'Selvili Sokağı · D:Kat:1 Daire:1' },
          { to: '/contact', label: 'Çalışma Saatleri',    desc: 'Pts–Cts · Randevusuz kabul' },
        ],
      },
      {
        kind: 'feature',
        feature: {
          eyebrow: 'Bugün açık',
          title: 'Öğlene kadar randevusuz.',
          body: 'Pazartesiden Cumartesiye öğlene kadar randevu gerekmez. Öğleden sonra için rezervasyon alınır.',
          to: '/contact',
        },
      },
    ],
  },
];

export const MOBILE_LINKS: MobileLink[] = [
  { to: '/',                label: 'Ana Sayfa',      end: true },
  { to: '/visa-regimes',    label: 'Vize Rejimleri' },
  { to: '/how-it-works',    label: 'Nasıl Çalışırız' },
  { to: '/about',           label: 'Hakkımızda' },
  { to: '/fees',            label: 'Ücretler' },
  { to: '/schengen',        label: 'Schengen' },
  { to: '/passport',        label: 'Pasaport' },
  { to: '/tours',           label: 'Turlar' },
  { to: '/us-visa-expedite', label: 'ABD Hızlandırma' },
  { to: '/contact',         label: 'İletişim' },
];
