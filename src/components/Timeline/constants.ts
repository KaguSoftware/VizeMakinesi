import type { TimelineStep } from './types';

export const TIMELINE_STEPS: TimelineStep[] = [
  { n: '01', title: 'Başvuru',  body: 'Ücretsiz 30 dakikalık danışma, uygunluk notu, sabit fiyat.' },
  { n: '02', title: 'Belgeler', body: 'Tüm gerekli belgeleri toplar, çevirir ve noterden geçiririz.' },
  { n: '03', title: 'Teslim',   body: 'Konsolosluğa başvuru, biyometrik ve mülakat hazırlığı dahil.' },
  { n: '04', title: 'Takip',    body: 'Günlük durum kontrolü; siz uğraşmadan konsoloslukla biz ilgileniriz.' },
  { n: '05', title: 'Sonuç',    body: 'Pasaport kapınıza teslim, sonraki adımlar için brifing dahil.' },
];

export const TIMELINE_ACTIVE_INDEX = 1;
