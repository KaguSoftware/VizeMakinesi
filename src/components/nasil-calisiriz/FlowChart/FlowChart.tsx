import { FadeIn } from '@/components/shared/motion';
import Timeline from '@/components/shared/Timeline/Timeline';

/**
 * Page-1 süreç akışı — ana sayfadaki "Bir başvuru ofisimizde nasıl işliyor"
 * bölümüyle aynı Timeline tasarımı, PDF'teki altı adım ve aşama metinleriyle.
 */
export default function FlowChart() {
  return (
    <section className="container border-b border-border">
      <div className="pt-16 pb-6">
        <FadeIn as="div">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-coral mb-4">
            — Süreç
          </div>
        </FadeIn>
        <FadeIn as="div" delay={0.06}>
          <h2 className="font-serif font-bold text-[clamp(28px,3.5vw,48px)] leading-[1.05] tracking-tight text-navy max-w-3xl">
            Sizden gerekenleri alıyoruz.{' '}
            <em className="font-normal italic text-coral">Gerisini biz yürütüyoruz.</em>
          </h2>
        </FadeIn>
        <Timeline id="nasil-calisiriz-timeline" />
      </div>
    </section>
  );
}
