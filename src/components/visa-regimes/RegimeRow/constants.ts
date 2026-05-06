import type { Regime } from './types';

export const REGIMES: Regime[] = [
  {
    n: '01', title: 'Turist',
    desc: '90 güne kadar kısa süreli turizm seyahati. Gezme, aile ziyareti ve dinlenme amaçlı konaklamalar için verilir. En yaygın vize türü — ve yetersiz güzergah nedeniyle en çok ret alan türdür.',
    meta: ['90 güne kadar', 'Tek veya çoklu giriş', 'Çalışma izni yoktur'],
  },
  {
    n: '02', title: 'İş',
    desc: 'Toplantılar, konferanslar, sözleşme müzakereleri ve ticaret fuarları için. Çalışma vizesinden farklıdır: yerel bir kuruluştan ücret alamazsınız.',
    meta: ['Yılda 180 güne kadar', 'Davet mektubu', 'Kurumsal sponsorluk'],
  },
  {
    n: '03', title: 'Öğrenci',
    desc: 'Tanınan bir kuruma kabul şartına bağlı uzun süreli ulusal vize. Maddi güç, konaklama ve genellikle sağlık sigortası kanıtı gerektirir.',
    meta: ['Program süresi boyunca', 'CAS / I-20 / Kabul Mektubu', 'Mali kefil'],
  },
  {
    n: '04', title: 'Çalışma',
    desc: 'Yurt dışında yasal istihdama işveren destekli erişim. Her yargı bölgesinin kendi işgücü piyasası testi ve beceri eşikleri vardır.',
    meta: ['İş teklifi şart', 'Sponsorluk lisansı', 'Beceri / maaş eşikleri'],
  },
  {
    n: '05', title: 'Transit',
    desc: 'Üçüncü bir varış noktasına giderken bir ülkeden geçen yolcular için. Bazı pasaportlar, hava tarafında kalsalar dahi Havalimanı Transit Vizesi (HTV) gerektirmektedir.',
    meta: ['Hava tarafı veya kara tarafı', 'Aynı gün geçiş', 'Tek giriş tipik'],
  },
];
