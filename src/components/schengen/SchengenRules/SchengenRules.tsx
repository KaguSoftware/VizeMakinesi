import { FadeIn } from '@/components/shared/motion';
import WarningList from '@/components/schengen/WarningList/WarningList';
import { splitHeading } from '@/lib/text/heading';
import type { SchengenListItem } from '@/data/schengenPage';

interface Props {
  title: string;
  description?: string;
  items: SchengenListItem[];
}

/**
 * "Schengen Vizesinin Temel Kuralları" — başlık/açıklama solda, kural
 * maddeleri sağda coral çizgili liste olarak.
 */
export default function SchengenRules({ title, description, items }: Props) {
  if (items.length === 0) return null;

  const [head, tail] = splitHeading(title);

  return (
    <section className="container border-b border-border">
      <div className="pt-16 pb-20 grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-16 items-start">
        <FadeIn as="div">
          <h2 className="font-serif font-bold text-[clamp(28px,3.5vw,48px)] leading-none tracking-tight text-navy">
            {head}
            {tail && (
              <>
                {' '}
                <em className="font-normal italic text-coral">{tail}</em>
              </>
            )}
          </h2>
          {description && (
            <p className="mt-5 font-serif text-[17px] leading-relaxed text-navy/70">
              {description}
            </p>
          )}
        </FadeIn>

        <WarningList items={items.map((r) => ({ title: r.title, desc: r.description }))} />
      </div>
    </section>
  );
}
