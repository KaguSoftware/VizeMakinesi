import type { TimelineStep } from './types';

// Süreç adımları — "Nasıl Çalışıyoruz" dokümanındaki altı aşamalık akış.
// Ana sayfa ve /nasil-calisiriz aynı listeyi kullanır.
export const TIMELINE_STEPS: TimelineStep[] = [
  {
    n: '01',
    title: 'Bilgileriniz ve kişisel belgeleriniz',
    details: [
      'İlk iletişimimizden itibaren süreci devralıyoruz.',
      'Sizden yalnızca başvurunuz için gereken bilgileri ve kişisel belgelerinizi alıyoruz.',
      'Gerisini biz yürütüyoruz.',
    ],
  },
  {
    n: '02',
    title: 'Randevu',
    details: [
      'Pasaport ve başvuru bilgileriniz üzerinden randevu sürecini yürütüyoruz.',
      'Randevunuzu kendiniz almış olsanız bile süreci devralıyoruz.',
    ],
  },
  {
    n: '03',
    title: 'Dosyanın hazırlanması',
    details: [
      'Belgelerinizi inceliyor, başvurunuzda soru işareti yaratabilecek noktaları önceden tespit edip çözüyoruz.',
      'Gerektiğinde formlarınızı, seyahat planınızı ve dilekçelerinizi hazırlıyoruz.',
    ],
  },
  {
    n: '04',
    title: 'Başvuru ve başvuru günü',
    details: [
      'Başvuru sürecini baştan sona yürütüyoruz.',
      'Gerekli durumlarda mülakat hazırlığı sağlıyoruz.',
      'Başvuru günü size bizzat eşlik ediyoruz.',
    ],
  },
  {
    n: '05',
    title: 'Başvuru sonrası takip',
    details: [
      'Dosyanız teslim edildikten sonra süreci düzenli olarak takip ediyoruz.',
      'Ek belge veya mülakat talebi geldiğinde sürece yeniden dahil oluyoruz.',
    ],
  },
  {
    n: '06',
    title: 'Sonuç',
    details: [
      'Vize sonucunu size iletiyor, onay halinde vize üzerindeki kritik bilgileri kontrol ediyoruz.',
      'Ret halinde ret gerekçelerini değerlendiriyor ve yeniden başvuru sürecini planlıyoruz.',
    ],
  },
];

export const TIMELINE_ACTIVE_INDEX = 1;
