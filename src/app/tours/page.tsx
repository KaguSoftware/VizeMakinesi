import type { Metadata } from 'next';
import PageHead from '@/components/PageHead/PageHead';
import TourFilters from '@/components/TourFilters/TourFilters';

export const metadata: Metadata = {
  title: 'Curated Tours — Vize Makinesi',
  description: 'Small-group itineraries built around the documents we already prepared for you.',
};

export default function ToursPage() {
  return (
    <>
      <PageHead
        eyebrow="— Tours we organise"
        title={<>Small groups. <em className="font-normal italic text-coral">Considered routes.</em></>}
        lede="A side practice that grew out of our visa work — fully-handled itineraries built around the documents we already prepared for you."
      />
      <section className="container pb-16">
        <TourFilters />
      </section>
    </>
  );
}
