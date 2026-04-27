import type { Metadata } from 'next';
import PageHead from '@/components/PageHead/PageHead';
import RegimeRow from '@/components/RegimeRow/RegimeRow';
import { REGIMES } from '@/components/RegimeRow/constants';

export const metadata: Metadata = {
  title: 'Visa Regimes — Vize Makinesi',
  description: 'Tourist, business, student, work, and transit visa regimes explained.',
};

export default function VisaRegimesPage() {
  return (
    <>
      <PageHead
        eyebrow="— Visa regimes"
        title={<>Five doors. <em className="font-normal italic text-coral">One office.</em></>}
        lede="Every visa belongs to a regime. The regime decides what you can do, how long you can stay, and what evidence the consulate expects from you."
      />
      <section className="container pt-6">
        {REGIMES.map((r) => (
          <RegimeRow key={r.n} regime={r} />
        ))}
      </section>
    </>
  );
}
