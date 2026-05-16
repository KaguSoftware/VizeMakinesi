import type { Metadata } from 'next';
import TeamGrid from '@/components/about/TeamGrid/TeamGrid';

export const metadata: Metadata = {
  title: 'Ekibimiz — Vize Makinesi',
  description: 'Dosyanızı okuyan danışmanlarımızla tanışın.',
};

export default function EkibimizPage() {
  return (
    <>
      <section className="container">
        <div className="py-24 border-b border-border">
          <h1 className="font-serif font-bold text-[clamp(36px,5vw,64px)] leading-none tracking-[-0.025em] text-navy mb-8">
            Ekibimiz
          </h1>
          <p className="font-serif italic text-[clamp(22px,2.5vw,36px)] leading-[1.4] tracking-[-0.015em] max-w-4xl">
            Kusursuz işleyen sistemimizin arkasında, konsoloslukların ne görmek istediğini çok iyi bilen uzman bir kadro var. Biz sadece evrak toplamıyor; onay almanızı sağlayacak o stratejik farkı yaratıyoruz.
          </p>
        </div>
      </section>

      <TeamGrid />
    </>
  );
}
