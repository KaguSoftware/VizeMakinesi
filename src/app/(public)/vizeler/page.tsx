import type { Metadata } from "next";
import Link from "next/link";
import SchengenCountryGrid from "@/components/visa/SchengenCountryGrid/SchengenCountryGrid";
import RegionGrid from "@/components/home/RegionGrid/RegionGrid";
import { getHomeRegionsData } from "@/lib/data/homeRegions";

export const metadata: Metadata = {
    title: "Hizmet Verdiğimiz Ülkeler",
    description: "Avrupa ve Schengen'den Amerika Kıtası'na, Asya ve Pasifik'e — 60+ ülke için vize danışmanlığı.",
};

export default async function VizelerPage() {
    const { entries, settings } = await getHomeRegionsData();

    const toRegionEntry = (e: { name: string; href: string; preset_key: string; subtitle: string }) => ({
        name: e.name,
        href: e.href,
        presetKey: e.preset_key,
        subtitle: e.subtitle,
    });

    return (
        <>
            {/* Ana başlık */}
            <div className="container mt-20">
                <div className="flex justify-between items-end flex-wrap gap-4 border-b border-border pb-7 mb-14">
                    <h2 className="font-serif font-bold text-[clamp(36px,5.5vw,72px)] leading-none tracking-[-0.03em]">
                        Hizmet verdiğimiz ülkeler
                    </h2>
                </div>
            </div>

            {/* ── 1. Schengen ── */}
            <div className="container mt-0">
                <div className="flex justify-between items-end flex-wrap gap-4 border-b border-border pb-7">
                    <h2 className="font-serif font-bold text-[clamp(28px,4vw,56px)] leading-none tracking-[-0.03em]">
                        Avrupa ve Schengen
                    </h2>
                    <Link
                        href="/vize/schengen"
                        className="inline-flex items-center gap-2 font-sans font-medium text-[12px] uppercase tracking-widest px-7 py-4 border border-navy text-navy hover:bg-navy hover:text-white transition-all duration-200 rounded-2xl whitespace-nowrap"
                    >
                        Schengen hakkında →
                    </Link>
                </div>
            </div>

            <SchengenCountryGrid entries={entries.avrupa} hideHeader />

            {/* ── 2. Amerika Kıtası ── */}
            <div className="container mt-20">
                <div className="flex justify-between items-end flex-wrap gap-4 border-b border-border pb-7">
                    <h2 className="font-serif font-bold text-[clamp(28px,4vw,56px)] leading-none tracking-[-0.03em]">
                        Amerika Kıtası
                    </h2>
                </div>
                <RegionGrid entries={entries.amerika.map(toRegionEntry)} />
            </div>

            {/* ── 3. Asya ve Pasifik ── */}
            <div className="container mt-20 mb-20">
                <div className="flex justify-between items-end flex-wrap gap-4 border-b border-border pb-7">
                    <h2 className="font-serif font-bold text-[clamp(28px,4vw,56px)] leading-none tracking-[-0.03em]">
                        Asya ve Pasifik
                    </h2>
                </div>
                <RegionGrid entries={entries.asya.map(toRegionEntry)} />
            </div>

            {/* ── 4. Diğer Ülkeler (hideable) ── */}
            {settings.diger && entries.diger.length > 0 && (
                <div className="container mt-20 mb-20">
                    <div className="flex justify-between items-end flex-wrap gap-4 border-b border-border pb-7">
                        <h2 className="font-serif font-bold text-[clamp(28px,4vw,56px)] leading-none tracking-[-0.03em]">
                            Diğer Ülkeler
                        </h2>
                    </div>
                    <RegionGrid entries={entries.diger.map(toRegionEntry)} />
                </div>
            )}
        </>
    );
}
