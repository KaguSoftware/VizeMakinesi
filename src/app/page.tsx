import Link from "next/link";
import Hero from "@/components/Hero/Hero";
import MosaicCard from "@/components/MosaicCard/MosaicCard";
import { MOSAIC_SPANS, MOSAIC_ROW_INDEX } from "@/components/MosaicCard/constants";
import MosaicRowObserver from "@/components/MosaicCard/MosaicRowObserver";
import Marquee from "@/components/Marquee/Marquee";
import EditorialQuote from "@/components/EditorialQuote/EditorialQuote";
import ProcessThreeUp from "@/components/ProcessThreeUp/ProcessThreeUp";
import BigCTA from "@/components/BigCTA/BigCTA";
import { COUNTRIES_DATA } from "@/data/countries";

export default function HomePage() {
    return (
        <>
            <Hero />

            {/* Mozaik dizini */}
            <section className="container">
                <div className="flex justify-between items-end flex-wrap gap-4 border-b border-border pb-7 mb-14 mt-30">
                    <div className="font-mono text-[11px] tracking-[0.18em] text-coral uppercase">
                        — 02 / Dizin
                    </div>
                    <h2 className="font-serif font-bold text-[clamp(36px,5.5vw,72px)] leading-none tracking-[-0.03em]">
                        Hizmet verdiğimiz ülkeler,{" "}
                        <em className="font-normal italic text-muted">
                            açıktan gizliye.
                        </em>
                    </h2>
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted whitespace-nowrap">
                        60+ yetki alanından 10'u —
                    </div>
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
            <EditorialQuote />

            {/* Süreç bölümü */}
            <section className="container">
                <div className="grid grid-cols-1 md:grid-cols-[80px_1fr_auto] gap-8 items-end border-b border-border pb-7 mb-0 mt-30">
                    <div className="font-mono text-[11px] tracking-[0.18em] text-coral uppercase">
                        — 03 / Yöntem
                    </div>
                    <h2 className="font-serif font-bold text-[clamp(36px,5.5vw,72px)] leading-none tracking-[-0.03em]">
                        Bir başvurunun nasıl ilerlediği{" "}
                        <em className="font-normal italic text-muted">
                            ofisimizde.
                        </em>
                    </h2>
                    <Link
                        href="/how-it-works"
                        className="font-mono text-[10px] uppercase tracking-[0.18em] text-coral whitespace-nowrap hover:underline"
                    >
                        Tam süreç →
                    </Link>
                </div>
                <ProcessThreeUp />
            </section>

            <BigCTA />
        </>
    );
}
