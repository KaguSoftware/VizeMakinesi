import type { BigCTAProps } from "./types";
import { FadeIn } from "@/components/shared/motion";
import Link from "next/link";
import {
    CTA_EYEBROW,
    CTA_PHONE,
    CTA_PHONE_HREF,
    CTA_FORM_HREF,
} from "./constants";

export default function BigCTA({ title }: BigCTAProps) {
    return (
        <section className="cta-block mt-15 bg-cream text-navy border-t border-border">
            <div className="container">
                <div className="cta-inner py-[120px] relative z-10">
                    <FadeIn as="div" duration={0.4}>
                        <div className="font-mono text-[13px] tracking-[0.2em] uppercase text-coral mb-12 pb-4">
                            {CTA_EYEBROW}
                        </div>
                    </FadeIn>
                    <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-20 items-end">
                        <FadeIn as="div" delay={0.1} duration={0.5}>
                            <h2 className="font-serif font-bold text-[clamp(34px,4.25vw,68px)] leading-[0.96] tracking-[-0.035em] text-navy whitespace-pre-line">
                                {title ?? "Vize sürecinizi hemen\nbaşlatmak ve detaylı\nbilgi almak için\nbize ulaşın."}
                            </h2>
                        </FadeIn>
                        <FadeIn as="div" delay={0.2} duration={0.5}>
                            <div className="font-mono text-[13px] tracking-[0.2em] uppercase text-muted mb-4">
                                — Hemen arayın
                            </div>
                            <a
                                href={CTA_PHONE_HREF}
                                className="block font-serif font-bold text-[48px] tracking-[-0.025em] text-navy mb-9 hover:text-coral transition-colors duration-200 leading-none rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2"
                            >
                                {CTA_PHONE}
                            </a>
                            <div className="flex flex-col gap-3 w-full">
                                <Link
                                    className="inline-flex items-center justify-center gap-3 font-sans font-medium text-[16px] uppercase tracking-[0.1em] px-[44px] py-[31px] bg-coral border border-coral text-white hover:bg-transparent hover:text-coral active:scale-[0.98] transition-all duration-200 rounded-2xl whitespace-nowrap w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2"
                                    href={CTA_FORM_HREF}
                                >
                                    Danışma Formunu Doldurun →
                                </Link>
                                <a
                                    className="inline-flex items-center justify-center gap-2 font-sans font-medium text-[16px] uppercase tracking-[0.1em] px-11 py-[28px] border border-navy text-navy hover:bg-navy hover:text-white hover:border-navy active:scale-[0.98] transition-all duration-200 rounded-2xl w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2"
                                    href={CTA_PHONE_HREF}
                                >
                                    Ara: {CTA_PHONE}
                                </a>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </div>
        </section>
    );
}
