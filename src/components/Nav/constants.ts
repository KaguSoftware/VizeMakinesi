import type { MegaMenuGroup, MobileLink } from './types';

export const TICKER_ITEMS = [
  '— Open today until 18:00',
  '· Schengen processing 12 working days',
  '· US expediting 91% approval',
  '· +1 555 123 4567',
  '— Open today until 18:00',
  '· Schengen processing 12 working days',
  '· US expediting 91% approval',
  '· +1 555 123 4567',
];

export const MEGA_MENU: MegaMenuGroup[] = [
  {
    label: 'Visas',
    columns: [
      {
        title: 'Europe',
        items: [
          { to: '/visa/uk',          label: 'United Kingdom', flag: '🇬🇧' },
          { to: '/visa/germany',     label: 'Germany',        flag: '🇩🇪' },
          { to: '/visa/france',      label: 'France',         flag: '🇫🇷' },
          { to: '/visa/italy',       label: 'Italy',          flag: '🇮🇹' },
          { to: '/visa/netherlands', label: 'Netherlands',    flag: '🇳🇱' },
          { to: '/schengen',         label: 'Schengen Area',  flag: '🇪🇺' },
        ],
      },
      {
        title: 'Americas',
        items: [
          { to: '/visa/usa',        label: 'United States', flag: '🇺🇸' },
          { to: '/visa/canada',     label: 'Canada',        flag: '🇨🇦' },
          { to: '/us-visa-expedite', label: 'US Expediting', flag: '⚡' },
        ],
      },
      {
        title: 'Asia & Pacific',
        items: [
          { to: '/visa/australia', label: 'Australia',          flag: '🇦🇺' },
          { to: '/visa/uae',       label: 'United Arab Emirates', flag: '🇦🇪' },
        ],
      },
      {
        kind: 'feature',
        feature: {
          eyebrow: 'This week',
          title: 'Schengen multi-entry, 5-year',
          body: 'Long-validity Schengen tourist visas are processing in 12 working days at our partner consulates.',
          to: '/schengen',
        },
      },
    ],
  },
  {
    label: 'Services',
    columns: [
      {
        title: 'Visa Services',
        items: [
          { to: '/visa-regimes',  label: 'Visa Regimes', desc: 'Tourist, business, student, work, transit' },
          { to: '/how-it-works',  label: 'How We Work',  desc: 'Our five-step practice method' },
          { to: '/fees',          label: 'Fees & Pricing', desc: 'Standard · Express · Premium tiers' },
        ],
      },
      {
        title: 'Beyond Visas',
        items: [
          { to: '/passport',         label: 'Passport Services', desc: 'Issue, renewal, replacement' },
          { to: '/tours',            label: 'Curated Tours',     desc: 'Small-group itineraries' },
          { to: '/us-visa-expedite', label: 'US Expediting',     desc: 'Interviews in 5–10 days' },
        ],
      },
      {
        kind: 'feature',
        feature: {
          eyebrow: 'Practice memo',
          title: 'Why fixed quotes?',
          body: 'We commit to a number on day one. No hourly billing, no creep, no surprises in week six.',
          to: '/fees',
        },
      },
    ],
  },
  {
    label: 'Office',
    columns: [
      {
        title: 'About Us',
        items: [
          { to: '/about', label: 'Our Practice', desc: 'Eighteen years, twelve consultants' },
          { to: '/about', label: 'The Team',     desc: 'Partners and consultants' },
        ],
      },
      {
        title: 'Visit',
        items: [
          { to: '/contact', label: 'Downtown Office',    desc: '142 Whitfield Lane · Suite 612' },
          { to: '/contact', label: 'Hours & Directions', desc: 'Mon–Sat · Walk-ins welcome' },
        ],
      },
      {
        kind: 'feature',
        feature: {
          eyebrow: 'Open today',
          title: 'Walk-ins until noon.',
          body: 'No appointment needed before midday Monday through Saturday. Afternoons by booking.',
          to: '/contact',
        },
      },
    ],
  },
];

export const MOBILE_LINKS: MobileLink[] = [
  { to: '/',                label: 'Home',        end: true },
  { to: '/visa-regimes',    label: 'Visa Regimes' },
  { to: '/how-it-works',    label: 'How It Works' },
  { to: '/about',           label: 'About' },
  { to: '/fees',            label: 'Fees' },
  { to: '/schengen',        label: 'Schengen' },
  { to: '/passport',        label: 'Passport' },
  { to: '/tours',           label: 'Tours' },
  { to: '/us-visa-expedite', label: 'US Expediting' },
  { to: '/contact',         label: 'Contact' },
];
