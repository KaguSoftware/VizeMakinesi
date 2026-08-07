import { FadeIn } from '@/components/shared/motion';

export interface CountryVisaType {
    title: string;
    description: string;
}

interface Props {
    countryName: string;
    items: CountryVisaType[];
    /** Ülkeye özel giriş paragrafı (admin: "Bölüm Açıklaması"). */
    description?: string | null;
}

export default function CountryVisaTypesList({ countryName, items, description }: Props) {
    return (
        // id: /vize/[slug] sayfasındaki "Vize türlerini detaylı inceleyin →"
        // bağlantısının hedefi.
        <section id="ulke-vize-turleri" className="container scroll-mt-8">
            <div className="pt-16 pb-24">
                <FadeIn as="div" className="border-b border-border pb-7 mb-10">
                    <h2 className="font-serif font-bold text-[clamp(24px,3.5vw,44px)] leading-none tracking-tight text-navy">
                        {countryName} için{' '}
                        <em className="font-normal italic text-coral">vize türleri</em>
                    </h2>
                    {description && (
                        <p className="mt-5 max-w-3xl font-serif text-[17px] leading-relaxed text-navy/70">
                            {description}
                        </p>
                    )}
                </FadeIn>

                {items.length === 0 ? (
                    <p className="font-serif text-[17px] leading-relaxed text-navy/70">
                        {countryName} vize türleri yakında burada listelenecek.
                    </p>
                ) : (
                    // Açılır-kapanır değil: bu sayfa vize türlerinin tamamını
                    // göstermek için var, açıklamalar hep görünür.
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {items.map((item, i) => (
                            <FadeIn
                                key={`${item.title}-${i}`}
                                as="div"
                                delay={i * 0.05}
                                className="flex flex-col gap-2 p-6 rounded-2xl border border-navy/10 bg-white hover:border-coral/30 hover:bg-coral/5 transition-colors duration-200"
                            >
                                <p className="font-sans font-semibold text-[15px] text-navy">
                                    {item.title}
                                </p>
                                <p className="font-sans text-[13px] leading-relaxed text-navy/55">
                                    {item.description}
                                </p>
                            </FadeIn>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
