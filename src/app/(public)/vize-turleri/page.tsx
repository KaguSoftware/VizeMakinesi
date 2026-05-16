import type { Metadata } from 'next';
import PageHead from '@/components/shared/PageHead/PageHead';
import RegimeRow from '@/components/visa-regimes/RegimeRow/RegimeRow';
import { REGIMES } from '@/components/visa-regimes/RegimeRow/constants';

export const metadata: Metadata = {
  title: 'Vize Rejimleri — Vize Makinesi',
  description: 'Turist, iş, öğrenci, çalışma ve transit vize rejimleri açıklandı.',
};

export default function VisaRegimesPage() {
  return (
    <>
      <PageHead
        eyebrow="— Vize rejimleri"
        title={<><span className="whitespace-nowrap">Farklı Amaçlar.</span><br /><em className="font-normal italic text-coral">Tek Merkez.</em></>}
        lede="Seyahat amacınız, başvuracağınız vize türünü belirler. Vize türünüz ise kalış sürenizi, yasal haklarınızı ve konsolosluğun sizden sunmanızı beklediği evrakları şekillendirir. İhtiyacınız olan kategoriyi seçin, süreci biz yönetelim."
        contentClassName="w-full"
        titleClassName="font-serif font-bold text-[clamp(48px,6.6vw,106px)] leading-[0.95] tracking-[-0.02em]"
        ledeClassName="font-serif text-[18px] text-navy mt-9 leading-[1.45] border-l border-coral pl-6"
      />
      <section className="container pt-6">
        {REGIMES.map((r) => (
          <RegimeRow key={r.n} regime={r} />
        ))}
      </section>
    </>
  );
}
