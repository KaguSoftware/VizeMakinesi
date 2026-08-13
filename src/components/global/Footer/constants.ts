import type { FooterColumn } from './types';

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    eyebrow: '— 01 / Keşfet',
    links: [
      { label: 'Ülke Vizeleri', href: '/' },
      { label: 'Schengen',      href: '/vize/schengen' },
      { label: 'Blog',          href: '/blog' },
      { label: 'Ortaklıklar',   href: '/ortakliklar' },
    ],
  },
  {
    eyebrow: '— 02 / Ofis',
    links: [
      { label: 'Hakkımızda', href: '/hakkimizda' },
      { label: 'Hizmetler',  href: '/ucrete-dahil-hizmetler' },
      { label: 'Süreç',      href: '/#nasil-calisiyoruz' },
      { label: 'İletişim',   href: '/iletisim' },
    ],
  },
  {
    eyebrow: '— 03 / Bize Ulaşın',
    links: [
      { label: '+90 532 161 89 71', href: 'tel:+905321618971' },
      { label: 'Danışma Formu',    href: '/danisma-al' },
      { label: 'vizemakinesi@gezimakinesi.com', href: 'mailto:vizemakinesi@gezimakinesi.com' },
    ],
  },
];

export const FOOTER_TAGLINE = '— VİZE MAKİNESİ İLE DÜNYA CEBİNDE! ——';
