import type { Metadata } from 'next';
import PageHead from '@/components/PageHead/PageHead';
import Timeline from '@/components/Timeline/Timeline';

export const metadata: Metadata = {
  title: 'Nasıl Çalışırız — Vize Makinesi',
  description: 'Beş adımlı vize sürecimiz: başvuru, belgeler, teslim, takip ve sonuç.',
};

export default function HowItWorksPage() {
  return (
    <>
      <PageHead
        eyebrow="— Ajansımız nasıl çalışır"
        title={<>İlk başvuruda <em className="font-normal italic text-coral">vizeniz elinizde.</em></>}
        lede="Pasaportunuzu tüm dünya konsolosluklarından geçiren 5 adımlı süreç."
      />
      <section className="container">
        <Timeline />
      </section>
    </>
  );
}
