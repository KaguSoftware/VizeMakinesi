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

    const popularEntries = entries.populer as SchengenEntry[];

    return (
        <>
            {/* Üst bölüm: solda hero + popüler vizeler, sağda cascade hesaplayıcı */}
            <section className="container border-b border-border pt-10 pb-14">
                <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-10 lg:gap-14 items-start lg:items-stretch">
                    {/* Sol sütun */}
                    <div className="flex flex-col">
                        <Hero compact hideCta />

                        <div>
                            <div className="flex justify-between items-end flex-wrap gap-4 border-b border-border pb-4 mb-6">
                                <h2 className="font-serif font-bold text-[clamp(22px,2.4vw,32px)] leading-none tracking-[-0.03em]">
                                    Popüler Vizeler
                                </h2>
                                <div className="flex items-center gap-3">
                                    <Link
                                        href="/danisma-al"
                                        className="inline-flex items-center gap-2 font-sans font-medium text-[11px] uppercase tracking-widest px-4 py-2.5 border border-coral text-coral hover:bg-navy hover:text-white hover:border-navy transition-all duration-200 rounded-xl whitespace-nowrap"
                                    >
                                        Danışma Al →
                                    </Link>
                                    <Link
                                        href="/vizeler"
                                        className="inline-flex items-center gap-2 font-sans font-medium text-[11px] uppercase tracking-widest px-4 py-2.5 border border-navy text-navy hover:bg-navy hover:text-white transition-all duration-200 rounded-xl whitespace-nowrap"
                                    >
                                        Tüm ülkeler →
                                    </Link>
                                </div>
                            </div>

                            <SchengenCountryGrid
                                entries={popularEntries}
                                hideHeader
                                compact
                                paginate
                                pageSize={6}
                            />
                        </div>
                    </div>

                    {/* Sağ sütun: hesaplayıcı paneli */}
                    <aside className="bg-cream border border-border rounded-2xl p-6 lg:p-4 lg:[zoom:0.9] flex flex-col justify-center">
                        <CascadeCalculator embedded />
                    </aside>
                </div>
            </section>

            <Marquee />

            {/* Süreç bölümü */}
            <section id="nasil-calisiyoruz" className="container">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-end pb-7 mb-0 mt-16">
                    <h2 className="font-serif font-bold text-[clamp(28px,4vw,48px)] leading-tight tracking-[-0.03em] text-center md:text-left">
                        Bir başvuru ofisimizde nasıl işliyor
                    </h2>
                </div>
                <Timeline />
            </section>

            <BigCTA />
        </>
    );
}
