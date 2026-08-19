import { FadeIn } from '@/components/shared/motion';
import { splitHeading } from '@/lib/text/heading';

interface Props {
  title: string;
  /** Başlığın hemen altında yer alan içerik — ülke kartları ızgarası. */
  children?: React.ReactNode;
}

/**
 * "Tek vize, 29 ülke." — hero'nun ardından gelen bölüm. Başlığın altında
 * doğrudan Schengen ülkelerinin kartları listelenir; araya ayrı bir
 * "Schengen Ülkeleri" başlığı girmez.
 */
export default function SchengenIntro({ title, children }: Props) {
  if (!title) return null;

  const [head, tail] = splitHeading(title);

  return (
    <section className="border-b border-border">
      <div className="container pt-20 pb-12">
        <FadeIn as="div">
          <h2 className="font-serif font-bold text-[clamp(32px,4vw,56px)] leading-none tracking-[-0.03em] text-navy">
            {head}
            {tail && (
              <>
                {' '}
                <em className="font-normal italic text-coral">{tail}</em>
              </>
            )}
          </h2>
        </FadeIn>
      </div>

      {children}
    </section>
  );
}
