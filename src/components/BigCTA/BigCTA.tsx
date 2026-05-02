import type { BigCTAProps } from "./types";
import {
    CTA_EYEBROW,
    CTA_PHONE,
    CTA_PHONE_HREF,
    CTA_WHATSAPP_HREF,
} from "./constants";

export default function BigCTA({ title }: BigCTAProps) {
    return (
        <section className="cta-block mt-[120px] bg-cream text-navy border-t border-border">
            <div className="container">
                <div className="cta-inner py-[120px] relative z-10">
                    <div className="font-mono text-[13px] tracking-[0.2em] uppercase text-coral mb-12 pb-4 border-b border-border">
                        {CTA_EYEBROW}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-20 items-end">
                        <div>
                            <h2 className="font-serif font-bold text-[clamp(48px,6vw,96px)] leading-[0.96] tracking-[-0.035em] text-navy">
                                {title ?? "Bugün sekreterimizle görüşme yapın."}
                            </h2>
                        </div>
                        <div>
                            <div className="font-mono text-[13px] tracking-[0.2em] uppercase text-muted mb-4">
                                — Hemen arayın
                            </div>
                            <a
                                href={CTA_PHONE_HREF}
                                className="block font-serif font-bold text-[48px] tracking-[-0.025em] text-navy mb-9 hover:text-coral transition-colors duration-200 leading-none"
                            >
                                {CTA_PHONE}
                            </a>
                            <div className="flex flex-col gap-3 w-full">
                                <a
                                    className="inline-flex items-center justify-center gap-3 font-sans font-medium text-[16px] uppercase tracking-[0.1em] px-[44px] py-[31px] bg-[#25D366] border border-[#25D366] text-white hover:bg-transparent hover:text-[#25D366] transition-all duration-200 rounded-2xl whitespace-nowrap w-full"
                                    href={CTA_WHATSAPP_HREF}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.114 1.522 5.847L.057 23.882a.5.5 0 0 0 .638.605l6.256-1.643A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.893a9.875 9.875 0 0 1-5.031-1.375l-.36-.214-3.733.979.997-3.639-.235-.374A9.855 9.855 0 0 1 2.107 12C2.107 6.58 6.58 2.107 12 2.107S21.893 6.58 21.893 12 17.42 21.893 12 21.893z"/>
                                    </svg>
                                    Ofisimize WhatsApp'tan Yazın →
                                </a>
                                <a
                                    className="inline-flex items-center justify-center gap-2 font-sans font-medium text-[16px] uppercase tracking-[0.1em] px-11 py-[28px] border border-navy text-navy hover:bg-navy hover:text-white hover:border-navy transition-all duration-200 rounded-2xl w-full"
                                    href={CTA_PHONE_HREF}
                                >
                                    Ara: {CTA_PHONE}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
