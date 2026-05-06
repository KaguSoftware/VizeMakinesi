import type { Metadata } from 'next';
import PageHead from '@/components/shared/PageHead/PageHead';
import Timeline from '@/components/shared/Timeline/Timeline';

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
        titleClassName="font-serif font-bold text-[clamp(48px,5.6vw,92px)] leading-[1.05] tracking-[-0.02em]"
      />
      <section className="container">
        <Timeline />
      </section>
    </>
  );
}
