import Link from 'next/link';
import FlagBG from '@/components/shared/FlagBG/FlagBG';
import { FadeIn } from '@/components/shared/motion';

interface Props {
    name: string;
    /** Ülkeye özgü vize türleri hakkında kısa bilgi (admin panelinden). */
    description: string | null;
    flagEmoji: string | null;
    flagPresetKey: string | null;
    flagImageUrl: string | null;
    /** Ülke Schengen üyesiyse hero'da Schengen etiketi gösterilir. */
    isSchengen?: boolean;
}

export default function CountryVisaTypesHero({
    name,
    description,
    flagEmoji,
    flagPresetKey,
    flagImageUrl,
    isSchengen = false,
}: Props) {
    const words = name.split(' ');
    const first = words[0];
    const rest = words.slice(1).join(' ');

    // lg:min-h-160, /vize/[slug] hero'sunun doğal yüksekliğiyle eşleşir. Bayrak
    // arka planı section yüksekliğinin %110'u olduğu için, bu yükseklik olmadan
    // bayrak o sayfadakinden küçük görünüyordu.
    return (
        <section className="pt-16 pb-14 border-b border-border relative overflow-hidden lg:min-h-160">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-[110%] opacity-[0.12] pointer-events-none hidden lg:block">
                <FlagBG presetKey={flagPresetKey} imageUrl={flagImageUrl} className="w-full h-full" />
            </div>

            <div className="container relative z-10">
                <div className="lg:w-1/2 lg:pr-8">
                    <FadeIn as="div" className="flex items-center gap-10 mb-7" duration={0.5} priority>
                        <div className="text-[80px] leading-none">{flagEmoji}</div>
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="inline-block border border-navy px-4 py-2 font-mono font-medium text-[10px] uppercase tracking-[0.15em]">
                                — Vize türleri
                            </div>
                            {isSchengen && (
                                <Link
                                    href="/schengen"
                                    className="inline-flex items-center gap-2 border border-coral text-coral px-4 py-2 font-mono font-medium text-[10px] uppercase tracking-[0.15em] hover:bg-coral hover:text-cream transition-colors duration-200"
                                >
                                    <span aria-hidden>🇪🇺</span> Schengen ülkesi
                                </Link>
                            )}
                        </div>
                    </FadeIn>

                    <FadeIn as="div" delay={0.1} duration={0.55} priority>
                        <h1 className="font-serif font-bold text-[clamp(28px,6.6vw,106px)] leading-[0.95] tracking-[-0.04em] mb-10 whitespace-nowrap">
                            {first}
                            {rest && <em className="font-normal italic text-coral"> {rest}</em>}
                        </h1>
                    </FadeIn>

                    <FadeIn as="div" delay={0.2} priority>
                        <Link
                            href="/vize-turleri"
                            className="inline-block font-serif text-[16px] text-coral underline underline-offset-4 hover:text-navy transition-colors"
                        >
                            ← Tüm vize türleri
                        </Link>

                        {description && (
                            <p className="mt-6 font-serif text-[17px] leading-relaxed text-navy/80">
                                {description}
                            </p>
                        )}
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}
