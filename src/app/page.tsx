import Link from "next/link";
import Hero from "@/components/Hero/Hero";
import MosaicCard from "@/components/MosaicCard/MosaicCard";
import { MOSAIC_SPANS, MOSAIC_ROW_INDEX } from "@/components/MosaicCard/constants";
import MosaicRowObserver from "@/components/MosaicCard/MosaicRowObserver";
import Marquee from "@/components/Marquee/Marquee";
import Timeline from "@/components/Timeline/Timeline";
import BigCTA from "@/components/BigCTA/BigCTA";
import { COUNTRIES_DATA } from "@/data/countries";

export default function HomePage() {
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
                <div className="grid grid-cols-12 border-t border-border">
                    {COUNTRIES_DATA.map((country, i) => (
                        <MosaicCard
                            key={country.slug}
                            country={country}
                            index={i}
                            span={MOSAIC_SPANS[i]}
                            rowIndex={MOSAIC_ROW_INDEX[i]}
                        />
                    ))}
                    <MosaicRowObserver />
                </div>
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
