import Link from 'next/link';

interface Props {
    /** Vize türü sayfası; verilmezse kart tıklanabilir olmaz. */
    href?: string;
    /** Katalogdan gelen emoji ikon. */
    icon?: string;
    title: string;
    /** "Tip C" / "Tip D" rozeti. */
    tag?: string;
    /** "Kısa" / "Uzun" rozeti. */
    duration?: string;
    description: string;
}

const CARD_CLASS =
    'group flex items-center gap-4 px-5 py-4 rounded-2xl border border-navy/10 bg-white hover:border-coral/30 hover:bg-coral/5 transition-colors duration-200';

/**
 * /vize-turleri listesindeki ve ülke sayfasındaki "Hangi Vize Türüne
 * Başvurmalısınız?" bölümündeki ortak vize türü kartı.
 */
export default function VisaTypeCard({ href, icon, title, tag, duration, description }: Props) {
    const body = (
        <>
            {icon && (
                <div className="shrink-0 w-9 h-9 rounded-lg bg-coral/10 flex items-center justify-center text-base">
                    {icon}
                </div>
            )}

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className="font-sans font-semibold text-[15px] text-navy group-hover:text-coral transition-colors">
                        {title}
                    </p>
                    {tag && (
                        <span className="shrink-0 font-mono text-[9px] tracking-widest uppercase text-coral border border-coral/30 bg-coral/8 rounded px-1.5 py-0.5">
                            {tag}
                        </span>
                    )}
                    {duration && (
                        <span className="shrink-0 font-mono text-[9px] tracking-widest uppercase text-navy/60 border border-navy/20 bg-navy/5 rounded px-1.5 py-0.5">
                            {duration}
                        </span>
                    )}
                </div>
                <p className="font-sans text-[13px] text-navy/55 leading-snug mt-1">
                    {description}
                </p>
            </div>

            {href && (
                <span className="shrink-0 text-coral text-[13px] transition-transform duration-200 group-hover:translate-x-1">
                    →
                </span>
            )}
        </>
    );

    if (!href) return <div className={CARD_CLASS}>{body}</div>;

    return (
        <Link href={href} className={CARD_CLASS}>
            {body}
        </Link>
    );
}
