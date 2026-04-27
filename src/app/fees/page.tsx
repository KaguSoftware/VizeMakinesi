import type { Metadata } from 'next';
import PageHead from '@/components/PageHead/PageHead';
import FeesTable from '@/components/FeesTable/FeesTable';

export const metadata: Metadata = {
  title: 'Fees & Pricing — Vize Makinesi',
  description: 'Transparent, fixed-quote pricing for visa filing, passport services, and more.',
};

export default function FeesPage() {
  return (
    <>
      <PageHead
        eyebrow="— Visa fees"
        title={<>Transparent pricing. <em className="font-normal italic text-coral">No surprises.</em></>}
        lede="Our fees cover consultation, document preparation, filing, and tracking. Government and consulate fees are billed at cost with receipts."
      />
      <section className="container">
        <FeesTable />
      </section>
    </>
  );
}
