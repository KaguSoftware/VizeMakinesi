import type { Metadata } from 'next';
import PageHead from '@/components/shared/PageHead/PageHead';
import FeesTable from '@/components/fees/FeesTable/FeesTable';

export const metadata: Metadata = {
  title: 'Ücrete Dahil Hizmetler — Vize Makinesi',
  description: 'Her başvuruda sunduğumuz hizmetlerin tam listesi.',
};

export default function FeesPage() {
  return (
    <>
      <PageHead
        eyebrow="— Ücrete dahil hizmetler"
        title={<>Tek Paket. Tam Hizmet. <em className="font-normal italic text-coral">Şeffaf Süreç.</em></>}
        lede="Vize Makinesi hizmet bedeline dahil olan tüm operasyonel süreçleri aşağıda inceleyebilirsiniz. Bizde sürpriz ek ücretler veya yarım kalan işlemler yok; başvurunuzun her detayı uzmanlığımızın kapsamındadır."
      />
      <section className="container">
        <FeesTable />
      </section>
    </>
  );
}
