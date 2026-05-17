import Link from "next/link";
import Image from "next/image";
import {
    FOOTER_COLUMNS,
    FOOTER_TAGLINE,
    FOOTER_COPYRIGHT,
    FOOTER_REG,
} from "./constants";
import { SITE } from "@/data/site";

export default function Footer() {
    return (
        <footer className="border-t border-border pt-20 pb-8 bg-navy text-white relative overflow-hidden">
            <div className="container relative z-10">
                {/* Mark */}
                <div className="flex justify-between items-baseline flex-wrap gap-4 mb-16">
                    <div className="font-serif font-bold text-[36px] tracking-[-0.01em] text-cream">
                        Vize Makinesi
                    </div>
                    <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-cream">
                        {FOOTER_TAGLINE}
                    </div>
                </div>



                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    {FOOTER_COLUMNS.map((col) => (
                        <div key={col.eyebrow} className="min-w-0">
                            <h5 className="font-mono font-bold text-[13px] uppercase tracking-[0.18em] text-coral mb-6">
                                {col.eyebrow}
                            </h5>
                            <ul className="flex flex-col gap-2.5 list-none">
                                {col.links.map((l) => (
                                    <li key={l.label} className="min-w-0">
                                        <Link
                                            href={l.href}
                                            className="font-serif text-[15px] md:text-[18px] font-medium tracking-[-0.005em] text-white/60 hover:text-coral transition-colors duration-150 break-all"
                                        >
                                            {l.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Address */}
                    <div className="min-w-0">
                        <h5 className="font-mono font-bold text-[13px] uppercase tracking-[0.18em] text-coral mb-6">
                            — 04 / Adres
                        </h5>
                        <a
                            href="https://maps.google.com/?q=Gezi+Makinesi,+Levent,+Istanbul"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[14px] text-white/60 leading-[1.7] hover:text-coral transition-colors duration-150 wrap-break-word"
                        >
                            {SITE.address.street},<br />
                            {SITE.address.suite}
                            <br />
                            {SITE.address.city}
                        </a>
                    </div>
                </div>

                {/* Rule */}
                <div className="border-t border-border/60 mt-[72px] pt-6 font-mono text-[10px] tracking-[0.12em] uppercase text-white/40 flex justify-between flex-wrap gap-4 relative z-10">
                    <div className="flex flex-col gap-1.5">
                        <span>{FOOTER_COPYRIGHT}</span>
                        <span>Tüm hakları saklıdır · Kagu Software</span>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                        <span>{FOOTER_REG}</span>
                        <span className="flex items-center gap-2 text-white/25">
                            <Image
                                src="/KaguSoftwareLogo.png"
                                alt="Kagu Software"
                                width={100}
                                height={100}
                                sizes="100px"
                                className="invert"
                            />
                            Built by Kagu Software
                        </span>
                    </div>
                </div>
            </div>

            {/* Watermark */}
            <div className="footer-watermark font-serif">VİZE·MAKİNESİ</div>
        </footer>
    );
}
