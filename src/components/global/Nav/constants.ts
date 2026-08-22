
import type { MegaMenuGroup, MobileNavEntry } from './types';

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
          { to: '/nasil-calisiriz', label: 'Nasıl Çalışırız', desc: 'Randevudan sonuca ofis metodumuz' },
          { to: '/ucrete-dahil-hizmetler', label: 'Ücrete Dahil Hizmetler', desc: 'Her başvuruda ne sunuyoruz' },
        ],
      },
    ],
  },
];

// Mirrors the desktop bar exactly: the same top-level entries in the same
// order, with 'group' rows expanding into the mega-menu columns beneath them.
export const MOBILE_NAV: MobileNavEntry[] = [
  { kind: 'link', to: '/', label: 'Ana Sayfa' },
  { kind: 'group', to: '/vizeler', label: 'Ülkeler' },
  { kind: 'link', to: '/vize-turleri', label: 'Vize Türleri' },
  { kind: 'group', to: '/ofis', label: 'Ofis' },
  { kind: 'link', to: '/blog', label: 'Blog' },
  { kind: 'link', to: '/danisma-al', label: 'Danışma Al' },
];
