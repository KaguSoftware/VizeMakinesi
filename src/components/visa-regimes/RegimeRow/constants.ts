import type { Regime } from './types';

export const REGIMES: Regime[] = [
  {
    n: '01', title: 'Turistik',
    desc: 'Gezi, tatil ve kısa süreli turizm seyahatleri için düzenlenen vize türüdür.',
    meta: ['Gezi, tatil', 'Çalışma izni yoktur'],
  },
  {
    n: '02', title: 'Aile ve Arkadaş Ziyareti',
    desc: 'Resmi davetiye şarttır. Sponsor kişi maddi sorumluluk üstlenebilir.',
    meta: ['Resmi davetiye şarttır', 'Sponsorluk mümkündür'],
  },
  {
    n: '03', title: 'Ticari (İş)',
    desc: 'Kurumsal seyahat, toplantı ve ticari görüşmeler için düzenlenir.',
    meta: ['Kurumsal seyahat', 'Yerel ücret alınamaz'],
  },
  {
    n: '04', title: 'Öğrenci ve Eğitim',
    desc: 'Resmi kabul belgesi zorunludur. Maddi yeterlilik şartı aranır.',
    meta: ['Resmi kabul belgesi', 'Maddi yeterlilik şartı'],
  },
  {
    n: '05', title: 'Çalışma',
    desc: 'Resmi iş teklifi ve işveren sponsorluğu gerektirir. Uzun süreli oturuma imkân tanır.',
    meta: ['Resmi iş teklifi', 'Uzun süreli oturum'],
  },
  {
    n: '06', title: 'Transit',
    desc: 'Havaalanı terk edilemez. Kısa süreli geçerlilik ile üçüncü ülkeye geçiş için düzenlenir.',
    meta: ['Havaalanı terk edilemez', 'Kısa süreli geçerlilik'],
  },
];
