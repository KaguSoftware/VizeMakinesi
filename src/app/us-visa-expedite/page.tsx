import type { Metadata } from 'next';
import Urgency from '@/components/Urgency/Urgency';
import NumberedList from '@/components/NumberedList/NumberedList';
import ChecklistList from '@/components/ChecklistList/ChecklistList';
import FAQ from '@/components/FAQ/FAQ';
import type { FAQItem } from '@/data/countries.types';
import type { NumberedListItem } from '@/components/NumberedList/types';
import { SITE } from '@/data/site';

export const metadata: Metadata = {
  title: 'ABD Vize Hızlandırma — Vize Makinesi',
  description: '5–10 günde ABD vize mülakatı ayarlayın. DS-160, hızlandırma talepleri ve slot rezervasyonu.',
};

const EXPEDITE_STEPS: NumberedListItem[] = [
  { title: 'Uygunluk kontrolü',  text: 'Gerekçenizin uygun olduğunu doğrularız — tıbbi, iş, acil seyahat, öğrenci vize randevusu.' },
  { title: 'Talep başvurusu',    text: 'Hızlandırma talebinizi tam gerekçe paketiyle 24 saat içinde göndeririz.' },
  { title: 'Slot rezervasyonu',  text: 'Konsolosluk takvimlerini 30 dakikada bir takip eder, en erken uygun slotu alırız.' },
];

const REQUIREMENTS = [
  'Onaylı DS-160 doğrulama sayfası',
  'MRV ücret makbuzu (ödenmiş)',
  'Belgelenmiş acil durum — tıbbi, iş veya akademik',
  'Orijinal mülakat randevu onayı',
  'Destek mektubu (tarafımızca hazırlanır)',
];

const FAQS: FAQItem[] = [
  { q: 'Gerçekten ne kadar hızlı mülakat ayarlayabilirsiniz?',  a: 'Uygun durumlarda sıklıkla 5–10 iş günü içinde mülakat sağlıyoruz; tıbbi acillerde ertesi gün bile mümkün olabilir.' },
  { q: 'Hızlandırma talebim reddedilirse ne olur?',             a: 'Ek ücret almadan bir kez itiraz ediyoruz. Yine reddedilirse slotunuzu tutup her gün iptal slotu takibi yapıyoruz.' },
  { q: 'Bu her konsoloslukta işe yarar mı?',                    a: 'Evet — tüm ABD konsolosluklarında çalışıyoruz. Bazı birimler daha hızlıdır; uygunluk notunda dürüst oluruz.' },
];

export default function USExpeditePage() {
  return (
    <>
      <Urgency
headline={
          <>
            Amerika Vizesi{' '}
            <em className="text-coral font-normal italic">Hızla Cebinizde!</em>
          </>
        }
        lede="Normal takvim seyahat planınıza uymadığında, hızlandırma pratiğimiz sizi günler içinde konsolosluk görevlisinin karşısına çıkarır."
        ctaPrimary={{ label: 'Hızlandırma Talebini Başlat →', href: `${SITE.whatsappHref}?text=Merhaba%2C%20ABD%20vize%20h%C4%B1zland%C4%B1rma%20istiyorum` }}
        ctaSecondary={{ label: `${SITE.phone} Ara`, href: SITE.phoneHref }}
        variant="cream"
      />

      <section className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-20 py-20 border-b border-border">
          <div>
            <div className="font-mono text-[10px] tracking-[0.2em] text-coral uppercase mb-4">— Nasıl çalışır</div>
            <h2 className="font-serif font-bold text-[clamp(36px,4.5vw,56px)] leading-none tracking-[-0.025em]">
              Üç adım.<br />Çoğunlukla üç gün.
            </h2>
          </div>
          <NumberedList items={EXPEDITE_STEPS} />
        </div>
      </section>

      <section className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-20 py-20 border-b border-border">
          <div>
            <div className="font-mono text-[10px] tracking-[0.2em] text-coral uppercase mb-4">— Gereksinimler</div>
            <h2 className="font-serif font-bold text-[clamp(36px,4.5vw,56px)] leading-none tracking-[-0.025em]">
              Bizden<br />isteyeceklerimiz.
            </h2>
          </div>
          <ChecklistList items={REQUIREMENTS} />
        </div>
      </section>

      <FAQ items={FAQS} title={<>Hızlandırma — <em className="font-normal italic text-coral">sık sorulan sorular.</em></>} />
    </>
  );
}
