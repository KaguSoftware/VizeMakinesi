import type { TimelineStep } from './types';

export const TIMELINE_STEPS: TimelineStep[] = [
  {
    n: '01',
    title: 'Başvuru',
    body: 'Ücretsiz 30 dakikalık danışma, uygunluk notu, sabit fiyat.',
    detail:
      'İlk görüşmemizde seyahat planınızı, pasaport geçmişinizi ve hedef ülkenin güncel vize politikasını birlikte değerlendiririz. Size yazılı bir uygunluk notu ve her şey dahil sabit bir fiyat teklifi sunarız — gizli ücret yoktur, sürpriz fatura yoktur. Onay verdiğiniz andan itibaren süreç başlar.',
  },
  {
    n: '02',
    title: 'Belgeler',
    body: 'Tüm gerekli belgeleri toplar, çevirir ve noterden geçiririz.',
    detail:
      'Konsolosluk listesini baştan sona inceleyerek eksik ya da hatalı belge riskini sıfıra indiririz. Banka dekontlarından seyahat sigortasına, apostil işlemlerinden yeminli çeviriye kadar her adımı üstleniriz. Belgeleriniz hazırlanmadan önce uzman gözüyle çapraz kontrol edilir.',
  },
  {
    n: '03',
    title: 'Teslim',
    body: 'Konsolosluğa başvuru, biyometrik ve mülakat hazırlığı dahil.',
    detail:
      'Randevu alımından konsolosluğa fiziksel teslime kadar her şeyi yönetiriz. Biyometrik veri toplama gerektiren ülkeler için sizi en yakın merkeze yönlendirir, gerekirse eşlik ederiz. Mülakat zorunluysa sık sorulan sorular üzerinden kapsamlı bir hazırlık seansı yaparız.',
  },
  {
    n: '04',
    title: 'Takip',
    body: 'Günlük durum kontrolü; siz uğraşmadan konsoloslukla biz ilgileniriz.',
    detail:
      'Başvurunuz işlemdeyken konsolosluk sistemini her gün kontrol eder, güncel durumu size bildiririz. Ek belge talebi ya da mülakat çağrısı gibi ani gelişmelerde anında devreye girerek yanıt süresi kaybetmenizi önleriz. Tüm yazışmalar kayıt altında tutulur.',
  },
  {
    n: '05',
    title: 'Sonuç',
    body: 'Pasaport kapınıza teslim, sonraki adımlar için brifing dahil.',
    detail:
      'Vize onaylandığında pasaportunuz kargo güvencesiyle adresinize teslim edilir. Teslimat sırasında vizede belirtilen giriş koşulları, geçerlilik süresi ve varsa kısıtlamalar hakkında kısa bir brifing yapılır. Red durumunda itiraz seçeneklerini ve alternatif rotaları birlikte değerlendiririz.',
  },
];

export const TIMELINE_ACTIVE_INDEX = 1;
