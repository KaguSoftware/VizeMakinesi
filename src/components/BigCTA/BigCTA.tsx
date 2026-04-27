import type { BigCTAProps } from "./types";
import {
    CTA_EYEBROW,
    CTA_PHONE,
    CTA_PHONE_HREF,
    CTA_WHATSAPP_HREF,
} from "./constants";

export default function BigCTA({ title }: BigCTAProps) {
    return (
        <section className="cta-block mt-[120px] bg-navy text-white">
            <div className="container">
                <div className="cta-inner py-[120px] relative z-10">
                    <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-coral mb-12 pb-4 border-b border-white/30">
                        {CTA_EYEBROW}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-20 items-end">
                        <div>
                            <h2 className="font-serif font-bold text-[clamp(48px,6vw,96px)] leading-[0.96] tracking-[-0.035em] text-white">
                                {title ?? (
                                    <>
                                        Speak to a consultant{" "}
                                        <em className="text-coral font-normal italic">
                                            this afternoon.
                                        </em>
                                    </>
                                )}
                            </h2>
                        </div>
                        <div>
                            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/65 mb-4">
                                Call us now
                            </div>
                            <a
                                href={CTA_PHONE_HREF}
                                className="block font-serif font-bold text-[48px] tracking-[-0.025em] text-white mb-9 hover:text-coral transition-colors duration-200 leading-none"
                            >
                                {CTA_PHONE}
                            </a>
                            <div className="flex flex-col gap-3 items-start">
                                <a
                                    className="inline-flex items-center gap-2 font-sans font-medium text-[13px] uppercase tracking-[0.1em] px-8 py-[22px] bg-coral border border-coral text-navy hover:bg-transparent hover:text-coral transition-all duration-200"
                                    href={CTA_WHATSAPP_HREF}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    WhatsApp Our Office →
                                </a>
                                <a
                                    className="inline-flex items-center gap-2 font-sans font-medium text-[13px] uppercase tracking-[0.1em] px-8 py-[22px] border border-white/55 text-white hover:bg-coral hover:text-navy hover:border-coral transition-all duration-200"
                                    href={CTA_PHONE_HREF}
                                >
                                    Call {CTA_PHONE}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
