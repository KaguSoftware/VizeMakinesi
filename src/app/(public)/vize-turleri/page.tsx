import type { Metadata } from 'next';
import Link from 'next/link';
import { getVisaTypeFaqs } from '@/lib/data/visaTypeFaqs';
import { VisaTypeCta } from '@/components/vizeTurleri/VisaTypeArticle';
import FAQ from '@/components/shared/FAQ/FAQ';
import {
    SHORT_STAY_TYPES,
    LONG_STAY_TYPES,
    VIZE_TURLERI_FAQ_KEY,
    VIZE_TURLERI_HIGHLIGHTS,
    type VisaTypeContent,
} from '@/data/visaTypes';

export const revalidate = 60;

export const metadata: Metadata = {
    title: 'Vize Türleri — Vize Makinesi',
    description:
        'Turistik, ticari, aile ziyareti, aile birleşimi, öğrenci, çalışma, transit ve etkinlik vizeleri: seyahat amacınıza uygun vize türünü bulun.',
};

function VisaTypeGroup({
    eyebrow,
    title,
    description,
    types,
}: {
    eyebrow: string;
    title: string;
    description: string;
    types: VisaTypeContent[];
}) {
    return (
        <div className="py-16 border-b border-border grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">
            {/* Left: heading */}
            <div>
                <div className="font-mono text-[10px] tracking-[0.2em] text-coral uppercase mb-4">
                    {eyebrow}
                </div>
                <h2 className="font-serif font-bold text-[clamp(28px,3.5vw,48px)] leading-[1.1] tracking-[-0.025em] text-navy">
                    {title}
                </h2>
                <p className="text-muted text-base leading-relaxed mt-5">{description}</p>
            </div>

            {/* Right: visa type cards, one per row across the full column */}
            {/* Horizontal rows: at full column width a stacked card wasted
                vertical space, so icon / text / arrow sit on one line. */}
            <div className="grid grid-cols-1 gap-3">
                {types.map((type) => (
                    <Link
                        key={type.slug}
                        href={`/vize-turleri/${type.slug}`}
                        className="group flex items-center gap-4 px-5 py-4 rounded-xl border border-navy/10 bg-white hover:border-coral/30 hover:bg-coral/5 transition-colors duration-200"
                    >
                        <div className="shrink-0 w-9 h-9 rounded-lg bg-coral/10 flex items-center justify-center text-base">
                            {type.icon}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <p className="font-sans font-semibold text-[15px] text-navy group-hover:text-coral transition-colors">
                                    {type.title}
                                </p>
                                <span className="shrink-0 font-mono text-[9px] tracking-widest uppercase text-coral border border-coral/30 bg-coral/8 rounded px-1.5 py-0.5">
                                    {type.tag}
                                </span>
                            </div>
                            <p className="font-sans text-[13px] text-navy/55 leading-snug mt-1">
                                {type.cardDesc}
                            </p>
                        </div>

                        <span className="shrink-0 text-coral text-[13px] transition-transform duration-200 group-hover:translate-x-1">
                            →
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default async function VizeTurleriPage() {
    const faqs = await getVisaTypeFaqs(VIZE_TURLERI_FAQ_KEY);

    return (
        <>
            {/* Hero */}
            <section className="bg-cream py-[100px]">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                        {/* Left: title */}
                        <h1 className="font-serif font-bold text-[clamp(40px,5vw,72px)] leading-none tracking-[-0.02em] text-navy">
                            Seyahat amacınıza uygun{' '}
                            <em className="font-normal italic text-coral">vizeyi bulun.</em>
                        </h1>

                        {/* Right: intro + highlights */}
                        <div>
                            <p className="font-serif text-[20px] leading-[1.45] border-l border-coral pl-6 text-navy">
                                Doğru vize türü, güçlü bir başvurunun ilk adımıdır.
                                VizeMakinesi, başvurunuzun her aşamasında uzman desteği sunar.
                            </p>

                            <ul className="list-none mt-10">
                                {VIZE_TURLERI_HIGHLIGHTS.map((item) => (
                                    <li
                                        key={item}
                                        className="grid grid-cols-[26px_1fr] gap-2 py-3.5 border-t border-navy/10 text-[15px] leading-relaxed text-navy"
                                    >
                                        <span className="text-coral pt-px" aria-hidden>
                                            ✓
                                        </span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Visa type groups */}
            <section className="container">
                <VisaTypeGroup
                    eyebrow="— Kısa süreli vizeler"
                    title="Kısa Süreli Vizeler"
                    description="Belirli bir seyahat, ziyaret, etkinlik veya geçici faaliyet amacıyla yapılan başvurular."
                    types={SHORT_STAY_TYPES}
                />

                <VisaTypeGroup
                    eyebrow="— Uzun süreli vizeler"
                    title="Uzun Süreli Vizeler"
                    description="Eğitim, çalışma veya aile yanında uzun süreli yaşam gibi amaçlarla yapılan başvurular."
                    types={LONG_STAY_TYPES}
                />
            </section>

            {faqs.length > 0 && (
                <FAQ
                    items={faqs}
                    title={
                        <>
                            Vize hakkında{' '}
                            <em className="font-normal italic text-coral">
                                sık sorulan sorular.
                            </em>
                        </>
                    }
                />
            )}

            <VisaTypeCta
                title="Vize başvurunuzu doğru adımlarla planlayın"
                text="Vize türünüzü belirledikten sonra, başvurunuzun gerektirdiği belgeleri ve süreci kişisel durumunuza göre değerlendirelim."
                label="Vize Başvurunuzu Planlayın"
                href="/danisma-al"
            />
        </>
    );
}
