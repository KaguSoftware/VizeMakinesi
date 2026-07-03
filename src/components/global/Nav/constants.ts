
import type { MegaMenuGroup, MobileLink } from './types';

// The Blog and Ofis groups — static, DB-independent.
// Vizeler is built dynamically from DB in NavServer.tsx.
export const STATIC_MEGA_MENU: MegaMenuGroup[] = [
  {
    label: 'Ofis',
    columns: [
      {
        title: 'Hakkımızda',
        items: [
          { to: '/hakkimizda', label: 'Hakkımızda', desc: 'Ekip ve danışmanlar' },
          { to: '/ekibimiz', label: 'Ekibimiz', desc: 'Dosyanızı okuyan danışmanlarımız' },
          { to: '/ortakliklar', label: 'Ortaklıklar', desc: 'Kurumsal çözümler' },
        ],
      },
      {
        title: 'Ziyaret',
        items: [
          { to: '/iletisim', label: '4.Levent Ofisi', desc: 'Selvili Sokağı · D:Kat:1 Daire:1' },
        ],
      },
      {
        title: 'Vize Hizmetleri',
        items: [
          { to: '/vizeler#genel-vize-turleri', label: 'Vize Türleri', desc: 'Turist, iş, öğrenci, çalışma, transit' },
          { to: '/#nasil-calisiyoruz', label: 'Nasıl Çalışırız', desc: '6 adımlı ofis metodumuz' },
          { to: '/ucrete-dahil-hizmetler', label: 'Ücrete Dahil Hizmetler', desc: 'Her başvuruda ne sunuyoruz' },
        ],
      },
    ],
  },
];

export const MOBILE_LINKS: MobileLink[] = [
  { to: '/', label: 'Ana Sayfa', end: true },
  { to: '/vizeler', label: 'Vizeler' },
  { to: '/ofis', label: 'Ofis' },
  { to: '/vizeler#genel-vize-turleri', label: 'Vize Türleri' },
  { to: '/#nasil-calisiyoruz', label: 'Nasıl Çalışırız' },
  { to: '/hakkimizda', label: 'Hakkımızda' },
  { to: '/ekibimiz', label: 'Ekibimiz' },
  { to: '/ucrete-dahil-hizmetler', label: 'Ücrete Dahil Hizmetler' },
  { to: '/vize/schengen', label: 'Schengen' },
  { to: '/blog', label: 'Blog' },
  { to: '/ortakliklar', label: 'Ortaklıklar' },
  { to: '/abd-hizlandirma', label: 'ABD Hızlandırma' },
  { to: '/cascade-kurali', label: 'Cascade Kuralı' },
  { to: '/iletisim', label: 'İletişim' },
  { to: '/danisma-al', label: 'Danışma Al' },
];
