import type { Metadata } from 'next';
import PageHead from '@/components/PageHead/PageHead';
import SchengenMembers from '@/components/SchengenMembers/SchengenMembers';
import WarningList from '@/components/WarningList/WarningList';
import { SCHENGEN_REJECTION_REASONS } from '@/components/SchengenMembers/constants';
import FAQ from '@/components/FAQ/FAQ';
import type { FAQItem } from '@/data/countries.types';

export const metadata: Metadata = {
  title: 'Schengen Vizesi — Vize Makinesi',
  description: 'Tek vize, 29 ülke. Her Schengen konsolosluğunda başvuru yapıyoruz.',
};

const SCHENGEN_FAQS: FAQItem[] = [
  { q: 'Schengen vizesi 29 ülkenin tamamını kapsar mı?', a: 'Evet — bir kez verilen Type-C vize, ana varış ülkesi kuralına tabi olarak tüm Schengen alanında geçerlidir.' },
  { q: 'Hangi konsolosluğa başvurmalıyım?',              a: 'En uzun süre geçireceğiniz ülkeye; eşit süre geçirecekseniz ilk giriş ülkesine.' },
  { q: 'İşlem süresi ne kadar?',                         a: 'Biyometrikten sonra genellikle 15 iş günü; yoğun sezonda veya ek kontrollerde 45 güne kadar çıkabilir.' },
];

export default function SchengenPage() {
  return (
    <>
      <PageHead
        eyebrow="— Schengen vizesi"
        title={<>Tek vize.<br /><em className="font-normal italic text-coral">Yirmi dokuz ülke.</em></>}
        lede="Schengen vizesi, bir Avrupa devletleri gümrük birliğinde geçerli kısa süreli (Type C) bir izindir. Her konsolosluğa başvurusu yapıyoruz."
      />

      {/* Üye devletler */}
      <section className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-20 py-20 border-b border-border">
          <div>
            <div className="font-mono text-[10px] tracking-[0.2em] text-coral uppercase mb-4">— Üye devletler</div>
            <h2 className="font-serif font-bold text-[clamp(36px,4.5vw,56px)] leading-none tracking-[-0.025em]">
              Kapıları açan ülkeler.
            </h2>
            <p className="font-serif italic text-[18px] text-navy mt-6 leading-relaxed">
              29 Schengen devletinin tamamı tek vizeyle kapsanır; 180 günde 90 güne kadar kalış hakkıyla.
            </p>
          </div>
          <SchengenMembers />
        </div>
      </section>

      {/* Ret nedenleri */}
      <section className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-20 py-20 border-b border-border">
          <div>
            <div className="font-mono text-[10px] tracking-[0.2em] text-coral uppercase mb-4">— Yaygın ret nedenleri</div>
            <h2 className="font-serif font-bold text-[clamp(36px,4.5vw,56px)] leading-none tracking-[-0.025em]">
              Dosyalar neden reddedilir.
            </h2>
            <p className="font-serif italic text-[18px] text-navy mt-6 leading-relaxed">
              Konsoloslukların Schengen vizesini reddederken en sık öne sürdüğü nedenler.
            </p>
          </div>
          <WarningList items={SCHENGEN_REJECTION_REASONS} />
        </div>
      </section>

      <FAQ items={SCHENGEN_FAQS} title={<>Schengen — <em className="font-normal italic text-coral">sık sorulan sorular.</em></>} />
    </>
  );
}
