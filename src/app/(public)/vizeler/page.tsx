import type { Metadata } from "next";
import { getHomeRegionsData } from "@/lib/data/homeRegions";
import VizelerPageClient from "@/components/vizeler/VizelerPageClient";

// Bölge/ülke verisi DB'den gelir; ISR ile en fazla 60 sn eskiyebilir.
export const revalidate = 60;

export const metadata: Metadata = {
    title: "Hizmet Verdiğimiz Ülkeler",
    description: "Avrupa ve Schengen'den Amerika Kıtası'na, Asya ve Pasifik'e — 60+ ülke için vize danışmanlığı.",
};

export default async function VizelerPage() {
    const { entries, settings } = await getHomeRegionsData();

    return (
        <>
            {/* Ana başlık */}
            <div className="container mt-20">
                <div className="flex justify-between items-end flex-wrap gap-4 border-b border-border pb-7 mb-6">
                    <h2 className="font-serif font-bold text-[clamp(22px,3.8vw,56px)] leading-none tracking-[-0.03em] whitespace-nowrap">
                        Hangi bölgeye gitmek istiyorsunuz?
                    </h2>
                </div>
            </div>

            <VizelerPageClient entries={entries} settings={settings} />
        </>
    );
}
