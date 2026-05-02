import type { Metadata } from 'next';
import PageHead from '@/components/PageHead/PageHead';
import FeesTable from '@/components/FeesTable/FeesTable';

export const metadata: Metadata = {
  title: 'Ücrete Dahil Hizmetler — Vize Makinesi',
  description: 'Her başvuruda sunduğumuz hizmetlerin tam listesi.',
};

export default function FeesPage() {
  return (
    <>
      <PageHead
        eyebrow="— Ücrete dahil hizmetler"
        title={<>Her başvuruda <em className="font-normal italic text-coral">ne sunuyoruz.</em></>}
        lede="Danışmanlık, belge hazırlama, başvuru takibi ve daha fazlası — tüm süreç boyunca yanınızdayız."
      />
      <section className="container">
        <FeesTable />
      </section>
    </>
  );
}
