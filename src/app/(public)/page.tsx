import Link from "next/link";
import Hero from "@/components/home/Hero/Hero";
import Marquee from "@/components/home/Marquee/Marquee";
import Timeline from "@/components/shared/Timeline/Timeline";
import BigCTA from "@/components/home/BigCTA/BigCTA";
import CascadeCalculator from "@/components/cascade-kurali/CascadeCalculator/CascadeCalculator";
import SchengenCountryGrid, { type SchengenEntry } from "@/components/visa/SchengenCountryGrid/SchengenCountryGrid";
import { getHomeRegionsData } from "@/lib/data/homeRegions";

export const revalidate = 3600;

export default async function HomePage() {
    const { entries } = await getHomeRegionsData();

    const popularEntries = entries.avrupa.filter((e) => e.pinned) as SchengenEntry[];

    return (
        <>
            <Hero />

            {/* Ana başlık */}
            <div className="container mt-20">
                <div className="flex justify-between items-end flex-wrap gap-4 border-b border-border pb-7 mb-14">
                    <h2 className="font-serif font-bold text-[clamp(36px,5.5vw,72px)] leading-none tracking-[-0.03em]">
                        Popüler Vizeler
                    </h2>
                    <Link
                        href="/vizeler"
                        className="inline-flex items-center gap-2 font-sans font-medium text-[12px] uppercase tracking-widest px-7 py-4 border border-navy text-navy hover:bg-navy hover:text-white transition-all duration-200 rounded-2xl whitespace-nowrap"
                    >
                        Tüm ülkeler →
                    </Link>
                </div>
            </div>

            <SchengenCountryGrid entries={popularEntries} hideHeader limitCollapsed />

            <Marquee />

            {/* Süreç bölümü */}
            <section id="nasil-calisiyoruz" className="container">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-end pb-7 mb-0 mt-16">
                    <h2 className="font-serif font-bold text-[clamp(18px,4.2vw,56px)] leading-tight tracking-[-0.03em] text-center md:text-left">
                        Bir başvuru ofisimizde nasıl işliyor
                    </h2>
                </div>
                <Timeline />
            </section>

            <CascadeCalculator compact />

            <BigCTA />
        </>
    );
}
