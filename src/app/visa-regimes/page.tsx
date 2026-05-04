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
        title={<>Beş kapı. <em className="font-normal italic text-coral">Bir ofis.</em></>}
        lede="Her vize bir rejime aittir. Rejim, ne yapabileceğinizi, ne kadar kalabileceğinizi ve konsolosluğun sizden ne tür kanıt beklediğini belirler."
      />
      <section className="container pt-6">
        {REGIMES.map((r) => (
          <RegimeRow key={r.n} regime={r} />
        ))}
      </section>
    </>
  );
}
