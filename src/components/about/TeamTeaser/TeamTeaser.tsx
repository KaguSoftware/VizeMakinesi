import Link from 'next/link';
import { FadeIn } from '@/components/shared/motion';

export default function TeamTeaser() {
  return (
    <section className="pt-20 pb-24">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start mb-14">
          <FadeIn as="div">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-coral mb-4">
              — Ekibimiz
            </div>
            <h2 className="font-serif font-bold text-[clamp(32px,4.5vw,48px)] leading-[1.05] tracking-[-0.025em]">
              Uzman bir kadroyla çalışıyoruz.
            </h2>
          </FadeIn>
          <FadeIn as="p" className="text-[16px] leading-[1.85] text-muted">
            Kusursuz işleyen sistemimizin arkasında, konsoloslukların ne görmek istediğini çok iyi bilen uzman bir kadro var. Genç, dinamik ve seyahat dünyasının içinden gelen bir ekiple çalışıyoruz.
          </FadeIn>
        </div>

        <Link
          href="/ekibimiz"
          className="group inline-flex items-center gap-3 transition-opacity duration-200"
        >
          <h2 className="font-serif font-bold text-[22px] leading-none tracking-[-0.025em] text-navy group-hover:text-coral transition-colors duration-300">
            Ekip arkadaşlarımızla tanışın.
          </h2>
          <span className="font-serif text-[19px] text-coral shrink-0 group-hover:translate-x-2 transition-transform duration-200">
            &rarr;
          </span>
        </Link>
      </div>
    </section>
  );
}
