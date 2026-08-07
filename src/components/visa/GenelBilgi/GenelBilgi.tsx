import { FadeIn, Stagger, StaggerItem } from '@/components/shared/motion';
import { splitLabeled } from '@/lib/text/labeled';

export const DEFAULT_GENEL_BILGI_TITLE = 'Başvuru Öncesi Bilmeniz Gerekenler';

interface Props {
  items: string[];
  title?: string | null;
  description?: string | null;
}

// The section heading keeps the site's two-tone look: everything but the last
// two words in navy, the tail in coral italic. Short titles stay all-navy.
function splitHeading(title: string): [string, string] {
  const words = title.trim().split(/\s+/);
  if (words.length < 3) return [title.trim(), ''];
  return [words.slice(0, -2).join(' '), words.slice(-2).join(' ')];
}

export default function GenelBilgi({ items, title, description }: Props) {
  if (items.length === 0) return null;

  const [head, tail] = splitHeading(title?.trim() || DEFAULT_GENEL_BILGI_TITLE);

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

        <Stagger as="ul" className="flex flex-col gap-5" delayChildren={0.1}>
          {items.map((item, i) => {
            const { label, body } = splitLabeled(item);
            return (
              <StaggerItem
                as="li"
                key={i}
                className="flex items-start gap-4 font-serif text-[17px] leading-relaxed text-navy/80"
              >
                <span className="shrink-0 mt-1.5 w-5 h-5 rounded-full bg-coral/15 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-coral block" />
                </span>
                <div>
                  {label && (
                    <strong className="block font-semibold text-navy">{label}</strong>
                  )}
                  <p>{body}</p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
