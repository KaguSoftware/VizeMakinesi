import type { FooterColumn } from './types';

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    eyebrow: '— 01 / Keşfet',
    links: [
      { label: 'Ülke Vizeleri', href: '/' },
      { label: 'Schengen',      href: '/vize/schengen' },
      { label: 'Pasaport',      href: '/pasaport' },
      { label: 'Blog',          href: '/blog' },
      { label: 'Ortaklıklar',   href: '/ortakliklar' },
    ],
  },
  {
    eyebrow: '— 02 / Ofis',
    links: [
      { label: 'Hakkımızda', href: '/hakkimizda' },
      { label: 'Hizmetler',  href: '/ucrete-dahil-hizmetler' },
      { label: 'Süreç',      href: '/nasil-calisiyoruz' },
      { label: 'İletişim',   href: '/iletisim' },
    ],
  },
  {
    eyebrow: '— 03 / Bize Ulaşın',
    links: [
      { label: '+90 530 775 31 31', href: 'tel:+905307753131' },
      { label: 'WhatsApp',         href: 'https://wa.me/905307753131' },
      { label: 'vizemakinesi@gezimakinesi.com', href: 'mailto:vizemakinesi@gezimakinesi.com' },
    ],
  },
];

export const FOOTER_TAGLINE = '— BÜYÜK YOLCULUKLAR İÇİN SAKIN BİR OFİS ——';
export const FOOTER_COPYRIGHT = '© 2008–2026 Vize Makinesi Danışmanlık. Tüm hakları saklıdır.';
export const FOOTER_REG = 'Lisanslı Göç Danışmanları · Kayıt No. 0987-MA';
