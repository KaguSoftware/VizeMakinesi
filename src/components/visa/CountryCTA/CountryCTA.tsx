import Link from 'next/link';
import { SITE } from '@/data/site';
import { FadeIn } from '@/components/shared/motion';

interface CountryCTAProps {
    countryName: string;
}

export default function CountryCTA({ countryName }: CountryCTAProps) {
    return (
        <section className="cta-block bg-cream">
            <div className="container">
                <div className="py-20 relative z-10">
                    <FadeIn as="div" className="font-mono text-[10px] tracking-[0.2em] uppercase text-coral mb-12 pb-4 border-b border-navy/20">
                        — Daha fazla bilgi alın
                    </FadeIn>
                    <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-20 items-end">
                        <FadeIn as="div" delay={0.05} duration={0.55}>
                            <h2 className="font-serif font-bold text-[clamp(48px,6vw,96px)] leading-[0.96] tracking-[-0.035em] text-navy">
                                {countryName}{' '}
                                <em className="text-coral font-normal italic">başvurunuzu</em><br />
                                başlatmaya hazır mısınız?
                            </h2>
                        </FadeIn>
                        <FadeIn as="div" delay={0.15}>
                            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-navy/50 mb-4">
                                — Hemen arayın
                            </div>
                            <a
                                href={SITE.phoneHref}
                                className="block font-serif font-bold text-[48px] tracking-tight text-navy mb-9 hover:text-coral transition-colors duration-200 leading-none rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2"
                            >
                                {SITE.phone}
                            </a>
                            <div className="flex flex-col gap-3 items-start w-full">
                                <Link
                                    href="/danisma-al"
                                    className="inline-flex items-center justify-center gap-3 font-sans font-medium text-[16px] uppercase tracking-[0.1em] px-10 py-7 bg-coral border border-coral text-white hover:bg-transparent hover:text-coral active:scale-[0.98] transition-all duration-200 rounded-2xl whitespace-nowrap w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2"
                                >
                                    Danışma Formunu Doldurun →
                                </Link>
                                <a
                                    href={SITE.phoneHref}
                                    className="inline-flex items-center justify-center gap-3 font-sans font-medium text-[16px] uppercase tracking-[0.1em] px-10 py-7 border border-navy text-navy hover:bg-navy hover:text-white active:scale-[0.98] transition-all duration-200 rounded-2xl w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2"
                                >
                                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                                    </svg>
                                    Ofisi Arayın
                                </a>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </div>
        </section>
    );
}
