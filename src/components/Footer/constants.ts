import type { FooterColumn } from './types';

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    eyebrow: '— 01 / Visit',
    links: [
      { label: 'Country Visas', href: '/' },
      { label: 'Schengen',      href: '/schengen' },
      { label: 'Passport',      href: '/passport' },
      { label: 'Tours',         href: '/tours' },
    ],
  },
  {
    eyebrow: '— 02 / Office',
    links: [
      { label: 'About',   href: '/about' },
      { label: 'Fees',    href: '/fees' },
      { label: 'Process', href: '/how-it-works' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    eyebrow: '— 03 / Reach Us',
    links: [
      { label: '+1 555 123 4567', href: 'tel:+15551234567' },
      { label: 'WhatsApp',        href: 'https://wa.me/15551234567' },
      { label: 'hello@visa.office', href: 'mailto:hello@visa.office' },
    ],
  },
];

export const FOOTER_TAGLINE = '— A QUIET PRACTICE FOR LOUD ITINERARIES ——';
export const FOOTER_COPYRIGHT = '© 2008–2026 Visa.Office Consultancy. All rights reserved.';
export const FOOTER_REG = 'Licensed Migration Advisors · Reg. 0987-MA';
