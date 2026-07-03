import type { Metadata } from 'next';
import FeesTable from '@/components/fees/FeesTable/FeesTable';

export const metadata: Metadata = {
  title: 'Ücrete Dahil Hizmetler — Vize Makinesi',
  description: 'Her başvuruda sunduğumuz hizmetlerin tam listesi.',
};

export default function FeesPage() {
  return (
    <section className="container">
      <FeesTable />
    </section>
  );
}
