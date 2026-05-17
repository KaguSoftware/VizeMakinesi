import ChecklistList from '@/components/shared/ChecklistList/ChecklistList';
import { FadeIn } from '@/components/shared/motion';

interface Props {
  items: string[];
}

export default function MasayaGetirdikleriniz({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <section className="container border-b border-border">
      <div className="pt-12 pb-20 grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-20">
        <FadeIn as="div">
          <h2 className="font-serif font-bold text-[clamp(36px,4.5vw,56px)] leading-none tracking-tight text-navy">
            Masaya<br />getirdikleriniz.
          </h2>
          <p className="font-serif italic text-[18px] text-navy/70 mt-6 max-w-sm leading-relaxed">
            Eksiksiz bir dosya, vize kararının en önemli belirleyicisidir. Sizinkini satır satır inceliyoruz.
          </p>
        </FadeIn>
        <FadeIn as="div" delay={0.1}>
          <ChecklistList items={items} />
        </FadeIn>
      </div>
    </section>
  );
}
