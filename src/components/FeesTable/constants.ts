import type { FeeRow } from './types';

export const FEE_ROWS: FeeRow[] = [
  { svc: 'Turist Vize Başvurusu',  desc: 'Schengen, İngiltere, BAE, Asya destinasyonları', standard: '$185', express: '$285',   premium: '$420' },
  { svc: 'İş Vizesi',              desc: 'B1, iş Schengen ve muadilleri',                   standard: '$225', express: '$340',   premium: '$520' },
  { svc: 'ABD B1/B2 Vizesi',       desc: 'DS-160, MRV, sahte mülakat hazırlığı',           standard: '$320', express: '$480',   premium: '$720' },
  { svc: 'Öğrenci Vizesi',         desc: 'F-1, Tier 4, ulusal uzun süreli ikamet',         standard: '$395', express: '$590',   premium: '$890' },
  { svc: 'Çalışma Vizesi',         desc: 'İşveren sponsorluğu koordinasyonu',              standard: '$650', express: '$950',   premium: '$1,450' },
  { svc: 'Pasaport Yenileme',      desc: 'Tam belge yönetimi',                             standard: '$120', express: '$185',   premium: '$280' },
  { svc: 'Belge Tercümesi',        desc: 'Sayfa başı, onaylı',                             standard: '$25',  express: '$40',    premium: '$65' },
];

export const FEES_FOOTNOTE =
  '— Fiyatlar konsolosluk, yetki alanı ve belge karmaşıklığına göre değişebilir. Tüm ücretler USD cinsindendir; banka havalesi, kart ve kripto para kabul edilir.';
