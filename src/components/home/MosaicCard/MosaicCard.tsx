import Link from "next/link";
import FlagBG from "@/components/shared/FlagBG/FlagBG";
import type { MosaicCardProps } from "./types";

export default function MosaicCard({
    country,
    index,
    span,
    rowIndex,
}: MosaicCardProps) {
    return (
        <Link
            href={`/visa/${country.slug}`}
            data-mosaic-row={rowIndex}
            className={`mosaic-cell ${span} border-b border-r border-border flex flex-col justify-between min-h-90 cursor-pointer relative bg-cream overflow-hidden`}
        >
            <FlagBG presetKey={country.flag_preset_key} imageUrl={country.flag_image_url} className="flag-svg" />
            <div className="flag-overlay-light" />
            <div className="flag-overlay-dark" />

            <div className="absolute top-7 right-8 font-mono text-[11px] tracking-[0.18em] text-muted uppercase z-10 hv-white transition-colors duration-700">
                — {String(index + 1).padStart(2, "0")} / 10
            </div>
            <div className="relative z-10 p-2 pt-20">
                <h3 className="font-serif font-semibold text-[32px] leading-[1.05] mb-1.5 tracking-[-0.02em] hv-white transition-colors duration-700">
                    {country.name}
                </h3>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-coral mb-5 hv-coral transition-colors duration-700">
                    — {country.visa_type}
                </div>
                <p className="text-[14.5px] text-muted leading-[1.65] mb-6 max-w-95 hv-white transition-colors duration-700">
                    {country.summary}
                </p>
            </div>

            <div className="cell-price-row relative z-10 p-2 flex justify-end items-baseline border-t border-border pt-5 transition-colors duration-700">
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-navy hv-white transition-colors duration-700">
                    View →
                </div>
            </div>
        </Link>
    );
}
