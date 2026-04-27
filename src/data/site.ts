export const SITE = {
  phone: '+1 555 123 4567',
  phoneHref: 'tel:+15551234567',
  whatsappHref: 'https://wa.me/15551234567',
  whatsappText: 'Merhaba%2C%20vize%20ba%C5%9Fvurusu%20konusunda%20yard%C4%B1m%20istiyorum',
  email: 'hello@visa.office',
  address: {
    street: '142 Whitfield Lane',
    suite: 'Suite 612, Altıncı Kat',
    city: 'Şehir Merkezi · 10001',
  },
  hours: [
    { day: 'Pzt – Per',   time: '09:00 – 18:00' },
    { day: 'Cuma',        time: '09:00 – 17:00' },
    { day: 'Cumartesi',   time: '10:00 – 14:00' },
    { day: 'Pazar',       time: 'Kapalı' },
  ],
} as const;
