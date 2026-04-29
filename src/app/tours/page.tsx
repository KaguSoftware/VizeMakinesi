import type { Metadata } from 'next';
import PageHead from '@/components/PageHead/PageHead';
import TourFilters from '@/components/TourFilters/TourFilters';

export const metadata: Metadata = {
  title: 'Özel Turlar — Vize Makinesi',
  description: 'Sizin için hazırladığımız belgeler üzerine kurulu küçük gruplu güzergahlar.',
};

export default function ToursPage() {
  return (
    <>
      <PageHead
        eyebrow="— Düzenlediğimiz turlar"
        title={<>Küçük gruplar. <em className="font-normal italic text-coral">Düşünceli güzergahlar.</em></>}
        lede="Vize çalışmamızdan doğan bir yan pratik — sizin için hazırladığımız belgelerin üzerine kurulu, tam yönetimli güzergahlar."
      />
      <section className="container pb-16">
        <TourFilters />
      </section>
    </>
  );
}
