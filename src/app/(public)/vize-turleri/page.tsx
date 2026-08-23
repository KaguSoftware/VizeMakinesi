import type { Metadata } from 'next';
import { VisaTypeCta } from '@/components/vizeTurleri/VisaTypeArticle';
import VisaTypeCard from '@/components/vizeTurleri/VisaTypeCard';
import {
    SHORT_STAY_TYPES,
    LONG_STAY_TYPES,
    type VisaTypeContent,
} from '@/data/visaTypes';

export const revalidate = 60;

export const metadata: Metadata = {
    title: 'Vize Türleri — Vize Makinesi',
    description:
        'Turistik, ticari, aile ziyareti, aile birleşimi, öğrenci, çalışma, transit ve etkinlik vizeleri: seyahat amacınıza uygun vize türünü bulun.',
};

function VisaTypeGroup({ types }: { types: (VisaTypeContent & { duration: string })[] }) {
    return (
        <div className="pt-8 pb-16 border-b border-border">
            {/* Visa type cards, two per row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {types.map((type) => (
                    <VisaTypeCard
                        key={type.slug}
                        href={`/vize-turleri/${type.slug}`}
                        icon={type.icon}
                        title={type.title}
                        tag={type.tag}
                        duration={type.duration}
                        description={type.cardDesc}
                    />
                ))}
            </div>
        </div>
    );
}

export default function VizeTurleriPage() {
    return (
        <>
            {/* Hero */}
            <section className="bg-cream pt-[100px] pb-[50px]">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                        {/* Left: title */}
                        <h1 className="font-serif font-bold text-[clamp(32px,3.6vw,52px)] leading-[1.1] tracking-[-0.02em] text-navy">
                            Seyahat amacınıza uygun{' '}
                            <em className="font-normal italic text-coral">vizeyi keşfedin.</em>
                        </h1>

                        {/* Right: intro */}
                        <p className="font-serif text-[24px] leading-[1.5] border-l border-coral pl-6 text-navy">
                            Doğru vize türü, güçlü bir başvurunun ilk adımıdır.
                            VizeMakinesi, başvurunuzun her aşamasında uzman desteği sunar.
                        </p>
                    </div>
                </div>
            </section>

            {/* Visa type groups */}
            <section className="container">
                <VisaTypeGroup
                    types={[
                        ...SHORT_STAY_TYPES.map((t) => ({ ...t, duration: 'Kısa' })),
                        ...LONG_STAY_TYPES.map((t) => ({ ...t, duration: 'Uzun' })),
                    ]}
                />
            </section>

            <VisaTypeCta
                title="Vize başvurunuzu doğru adımlarla planlayın"
                text="Vize türünüzü belirledikten sonra, başvurunuzun gerektirdiği belgeleri ve süreci kişisel durumunuza göre değerlendirelim."
                label="Vize Başvurunuzu Planlayın"
                href="/danisma-al"
            />
        </>
    );
}
