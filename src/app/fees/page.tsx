import type { Metadata } from 'next';
import PageHead from '@/components/PageHead/PageHead';
import FeesTable from '@/components/FeesTable/FeesTable';

export const metadata: Metadata = {
  title: 'Ücretler ve Fiyatlandırma — Vize Makinesi',
  description: 'Vize başvurusu, pasaport hizmetleri ve daha fazlası için şeffaf, sabit fiyat.',
};

export default function FeesPage() {
  return (
    <>
      <PageHead
        eyebrow="— Vize ücretleri"
        title={<>Şeffaf fiyatlandırma. <em className="font-normal italic text-coral">Sürpriz yok.</em></>}
        lede="Ücretlerimiz danışmanlık, belge hazırlama, başvuru ve takibi kapsar. Devlet ve konsolosluk harçları makbuzla faturalanır."
      />
      <section className="container">
        <FeesTable />
      </section>
    </>
  );
}
