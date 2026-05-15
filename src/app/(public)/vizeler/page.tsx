import Link from "next/link";
import SchengenCountryGrid from "@/components/visa/SchengenCountryGrid/SchengenCountryGrid";
import RegionGrid from "@/components/home/RegionGrid/RegionGrid";

const AMERICA_ENTRIES = [
    { name: 'Amerika', href: '/vize/abd', presetKey: 'usa', subtitle: 'Vize Bilgisi' },
    { name: 'Kanada', href: '/vize/kanada', presetKey: 'canada', subtitle: 'Vize Bilgisi' },
];

const ASIA_PACIFIC_ENTRIES = [
    { name: 'Çin', href: '/vize/cin', presetKey: 'china', subtitle: 'Vize Bilgisi' },
    { name: 'Arap Emirlikleri', href: '/vize/bae', presetKey: 'uae', subtitle: 'Vize Bilgisi' },
    { name: 'Avustralya', href: '/vize/avustralya', presetKey: 'australia', subtitle: 'Vize Bilgisi' },
];

export default function VizelerPage() {
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

            <SchengenCountryGrid hideHeader />

            {/* ── 2. Amerika Kıtası ── */}
            <div className="container mt-20">
                <div className="flex justify-between items-end flex-wrap gap-4 border-b border-border pb-7">
                    <h2 className="font-serif font-bold text-[clamp(28px,4vw,56px)] leading-none tracking-[-0.03em]">
                        Amerika Kıtası
                    </h2>
                </div>
                <RegionGrid entries={AMERICA_ENTRIES} />
            </div>

            {/* ── 3. Asya ve Pasifik ── */}
            <div className="container mt-20 mb-20">
                <div className="flex justify-between items-end flex-wrap gap-4 border-b border-border pb-7">
                    <h2 className="font-serif font-bold text-[clamp(28px,4vw,56px)] leading-none tracking-[-0.03em]">
                        Asya ve Pasifik
                    </h2>
                </div>
                <RegionGrid entries={ASIA_PACIFIC_ENTRIES} />
            </div>
        </>
    );
}
