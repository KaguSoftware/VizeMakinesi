import type { FooterColumn } from './types';

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    eyebrow: '— 01 / Keşfet',
    links: [
      { label: 'Ülke Vizeleri', href: '/' },
      { label: 'Schengen',      href: '/schengen' },
      { label: 'Pasaport',      href: '/passport' },
      { label: 'Turlar',        href: '/tours' },
    ],
  },
  {
    eyebrow: '— 02 / Ofis',
    links: [
      { label: 'Hakkımızda', href: '/about' },
      { label: 'Ücretler',   href: '/fees' },
      { label: 'Süreç',      href: '/how-it-works' },
      { label: 'İletişim',   href: '/contact' },
    ],
  },
  {
    eyebrow: '— 03 / Bize Ulaşın',
    links: [
      { label: '+1 555 123 4567',   href: 'tel:+15551234567' },
      { label: 'WhatsApp',          href: 'https://wa.me/15551234567' },
      { label: 'hello@visa.office', href: 'mailto:hello@visa.office' },
    ],
  },
];

export const FOOTER_TAGLINE = '— BÜYÜK YOLCULUKLAR İÇİN SAKIN BİR OFİS ——';
export const FOOTER_COPYRIGHT = '© 2008–2026 Vize Makinesi Danışmanlık. Tüm hakları saklıdır.';
export const FOOTER_REG = 'Lisanslı Göç Danışmanları · Kayıt No. 0987-MA';
