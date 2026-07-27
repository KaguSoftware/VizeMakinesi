import type { Metadata } from 'next';
import Image from 'next/image';
import NumberedList from '@/components/shared/NumberedList/NumberedList';
import ChecklistList from '@/components/shared/ChecklistList/ChecklistList';
import FAQ from '@/components/shared/FAQ/FAQ';
import type { FAQItem } from '@/data/countries.types';
import type { NumberedListItem } from '@/components/shared/NumberedList/types';
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
      <section className="bg-cream py-[120px] overflow-hidden">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h1 className="font-serif font-bold text-[clamp(36px,5.25vw,84px)] leading-none tracking-[-0.02em] text-navy">
                Amerika Vizesine{' '}
                <em className="text-coral font-normal italic">Hızlı ve Garantili Adım.</em>
              </h1>
              <p className="font-serif text-[22px] max-w-[520px] mt-9 leading-[1.45] border-l border-coral pl-6 text-navy">
                Standart başvuru süreleri seyahatinizi riske mi atıyor? Konsolosluk randevu sistemini 7/24 izleyen operasyon ağımızla, iptal edilen erken tarihleri sizin adınıza yakalıyor ve mülakat sürecinizi hızlandırıyoruz.
              </p>
              <div className="mt-10 flex flex-col gap-3 max-w-[520px]">
                <a
                  className="inline-flex items-center justify-center w-full font-sans font-medium text-[13px] uppercase tracking-[0.1em] px-8 py-[22px] bg-coral border border-coral text-white hover:bg-navy hover:text-white hover:border-navy transition-all duration-200 rounded-2xl"
                  href="/danisma-al"
                >
                  <span className="text-lg">⚡</span> Hızlandırma Talebini Başlat →
                </a>
                <a
                  className="inline-flex items-center justify-center w-full font-sans font-medium text-[13px] uppercase tracking-[0.1em] px-8 py-[22px] border border-navy/40 text-navy hover:bg-navy hover:text-white hover:border-navy transition-all duration-200 rounded-2xl"
                  href={SITE.phoneHref}
                >
                  {SITE.phone} Ara
                </a>
              </div>
            </div>
            <div className="relative h-[420px] lg:h-[520px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/american_vize.jpg"
                alt="Amerika Birleşik Devletleri vizesi"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-20 py-20 border-b border-border">
          <div>
            <div className="font-mono text-[10px] tracking-[0.2em] text-coral uppercase mb-4">— Nasıl çalışır</div>
            <h2 className="font-serif font-bold text-[clamp(36px,6vw,80px)] leading-none tracking-[-0.025em]">
              Hızlandırma sürecinde<br />üç adım.
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
              Başvuru için<br />gerekenler.
            </h2>
          </div>
          <ChecklistList items={REQUIREMENTS} />
        </div>
      </section>

      <FAQ items={FAQS} title={<>Hızlandırma — <em className="font-normal italic text-coral">sık sorulan sorular.</em></>} />
    </>
  );
}
