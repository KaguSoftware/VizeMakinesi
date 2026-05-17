import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sayfa Bulunamadı",
    description: "Aradığınız sayfa taşınmış veya hiç var olmamış olabilir.",
};

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-cream text-navy font-sans">
            <div className="container max-w-2xl flex flex-col items-start gap-8 py-32">
                <div>
                    <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-coral mb-4">— 404</p>
                    <h1 className="font-serif font-bold text-[clamp(48px,6vw,80px)] leading-none tracking-[-0.03em] mb-6">
                        Bu sayfayı<br />
                        <em className="font-normal italic text-coral">bulamadık.</em>
                    </h1>
                    <p className="font-serif text-[18px] text-navy/60 leading-relaxed max-w-md">
                        Aradığınız sayfa taşınmış, ismi değişmiş veya hiç var olmamış olabilir. Ana sayfadan devam edebilir ya da bizimle iletişime geçebilirsiniz.
                    </p>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                    <Link
                        href="/"
                        className="font-mono text-[11px] tracking-widest uppercase px-6 py-3 bg-coral border border-coral text-navy hover:bg-navy hover:text-white hover:border-navy transition-colors duration-150 rounded-2xl"
                    >
                        Ana Sayfa
                    </Link>
                    <Link
                        href="/danisma-al"
                        className="font-mono text-[11px] tracking-widest uppercase px-6 py-3 border border-navy text-navy hover:bg-navy hover:text-white transition-colors duration-150 rounded-2xl"
                    >
                        Danışma Al →
                    </Link>
                </div>
            </div>
        </div>
    );
}
