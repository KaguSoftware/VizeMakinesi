import Link from "next/link";
import Hero from "@/components/home/Hero/Hero";
import MosaicCard from "@/components/home/MosaicCard/MosaicCard";
import MosaicRowObserver from "@/components/home/MosaicCard/MosaicRowObserver";
import Marquee from "@/components/home/Marquee/Marquee";
import Timeline from "@/components/shared/Timeline/Timeline";
import BigCTA from "@/components/home/BigCTA/BigCTA";
import { getAllCountries } from "@/lib/data/countries";

export default async function HomePage() {
    const countries = await getAllCountries();

    return (
        <>
            <Hero />

            {/* Mozaik dizini */}
            <section className="container">
                <div className="flex justify-between items-end flex-wrap gap-4 border-b border-border pb-7 mb-14 mt-30">
                    <h2 className="font-serif font-bold text-[clamp(36px,5.5vw,72px)] leading-none tracking-[-0.03em]">
                        Hizmet verdiğimiz ülkeler
                    </h2>
                </div>

                {/* Mozaik grid */}
                {countries.length === 0 ? (
                    <div className="border-t border-border py-20 text-center">
                        <p className="font-serif italic text-[22px] text-navy/40">Yakında — ülkeler yükleniyor.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-12 border-t border-border">
                        {countries.map((country, i) => (
                            <MosaicCard
                                key={country.slug}
                                country={country}
                                index={i}
                                span={country.mosaic_span ?? 'col-span-12'}
                                rowIndex={Math.floor(i / 2)}
                            />
                        ))}
                        <MosaicRowObserver />
                    </div>
                )}
            </section>

            <Marquee />


            {/* Süreç bölümü */}
            <section className="container">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-end border-b border-border pb-7 mb-0 mt-30">
                    <h2 className="font-serif font-bold text-[clamp(24px,4.2vw,56px)] leading-none tracking-[-0.03em] whitespace-nowrap">
                        Bir başvuru ofisimizde nasıl işliyor
                    </h2>
                    <Link
                        href="/how-it-works"
                        className="inline-flex items-center gap-2 font-sans font-medium text-[12px] uppercase tracking-widest px-7 py-4 border border-navy text-navy hover:bg-navy hover:text-white transition-all duration-200 rounded-2xl whitespace-nowrap"
                    >
                        Tam süreç →
                    </Link>
                </div>
                <Timeline />
            </section>

            <BigCTA />
        </>
    );
}
