import { FadeIn, Stagger, StaggerItem } from '@/components/shared/motion';

interface Props {
  countryName: string;
  items: string[];
}

export default function GenelBilgi({ countryName, items }: Props) {
  if (items.length === 0) return null;

  return (
    <section className="container border-b border-border">
      <div className="pt-16 pb-20">
        <FadeIn as="div" className="mb-10">
          <h2 className="font-serif font-bold text-[clamp(28px,3.5vw,48px)] leading-none tracking-tight text-navy">
            {countryName} Hakkında{' '}
            <em className="font-normal italic text-coral">Genel Bilgiler</em>
          </h2>
        </FadeIn>

        <Stagger as="ul" className="flex flex-col gap-4" delayChildren={0.1}>
          {items.map((item, i) => (
            <StaggerItem
              as="li"
              key={i}
              className="flex items-start gap-4 font-serif text-[17px] leading-relaxed text-navy/80"
            >
              <span className="shrink-0 mt-1.5 w-5 h-5 rounded-full bg-coral/15 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-coral block" />
              </span>
              {item}
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
