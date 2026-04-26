export const SITE = {
  phone: '+1 555 123 4567',
  phoneHref: 'tel:+15551234567',
  whatsappHref: 'https://wa.me/15551234567',
  whatsappText: 'Hello%2C%20I%20need%20visa%20help',
  email: 'hello@visa.office',
  address: {
    street: '142 Whitfield Lane',
    suite: 'Suite 612, Sixth Floor',
    city: 'Downtown · 10001',
  },
  hours: [
    { day: 'Mon – Thu', time: '09:00 – 18:00' },
    { day: 'Friday',    time: '09:00 – 17:00' },
    { day: 'Saturday',  time: '10:00 – 14:00' },
    { day: 'Sunday',    time: 'Closed' },
  ],
} as const;
