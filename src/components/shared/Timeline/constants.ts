import type { TimelineStep } from './types';

// Süreç adımları — "Nasıl Çalışıyoruz" dokümanındaki altı aşamalık akış.
// Ana sayfa ve /nasil-calisiriz aynı listeyi kullanır.
export const TIMELINE_STEPS: TimelineStep[] = [
  {
    n: '01',
    title: 'Bilgileriniz ve kişisel belgeleriniz',
    body: 'Başvurunuz için gereken bilgi ve belgeleri sizden alıyoruz.',
    detail:
      'İlk iletişimimizden itibaren süreci devralıyoruz. Sizden yalnızca başvurunuz için gereken bilgileri ve kişisel belgelerinizi alıyor, gerisini biz yürütüyoruz.',
  },
  {
    n: '02',
    title: 'Randevu',
    body: 'Randevu sürecini baştan sona biz yürütüyoruz.',
    detail:
      'Pasaport ve başvuru bilgileriniz üzerinden randevu sürecini yürütüyoruz. Randevunuzu kendiniz almış olsanız bile süreci devralıyoruz.',
  },
  {
    n: '03',
    title: 'Dosyanın hazırlanması ve kontrolü',
    body: 'Belgelerinizi inceliyor, riskli noktaları önceden çözüyoruz.',
    detail:
      'Belgelerinizi inceliyor, başvurunuzda soru işareti yaratabilecek noktaları önceden tespit edip çözüyoruz. Gerektiğinde formlarınızı, seyahat planınızı ve dilekçelerinizi hazırlıyoruz.',
  },
  {
    n: '04',
    title: 'Başvuru ve başvuru günü',
    body: 'Başvuru gününde size bizzat eşlik ediyoruz.',
    detail:
      'Başvuru sürecini yürütüyoruz; gerekli durumlarda mülakat hazırlığı sağlıyor ve başvuru günü size bizzat eşlik ediyoruz.',
  },
  {
    n: '05',
    title: 'Başvuru sonrası takip',
    body: 'Dosyanızı teslimden sonra düzenli olarak takip ediyoruz.',
    detail:
      'Dosyanız teslim edildikten sonra süreci düzenli olarak takip ediyoruz. Ek belge veya mülakat talebi geldiğinde sürece yeniden dahil oluyoruz.',
  },
  {
    n: '06',
    title: 'Sonuç',
    body: 'Sonucu iletiyor, gereken adımı birlikte planlıyoruz.',
    detail:
      'Vize sonucunu size iletiyor, onay halinde vize üzerindeki kritik bilgileri kontrol ediyoruz. Ret halinde ise ret gerekçelerini değerlendiriyor ve yeniden başvuru sürecini planlıyoruz.',
  },
];


export const TIMELINE_ACTIVE_INDEX = 1;
