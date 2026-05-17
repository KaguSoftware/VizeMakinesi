"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function PassportIcon() {
    return (
        <svg
            viewBox="0 0 80 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-20"
        >
            {/* Cover */}
            <rect
                x="4"
                y="2"
                width="72"
                height="96"
                rx="6"
                fill="#1a5c5b"
            />
            {/* Spine highlight */}
            <rect x="4" y="2" width="10" height="96" rx="6" fill="#154e4d" />
            {/* Page edges */}
            <rect x="14" y="6" width="58" height="88" rx="3" fill="#fdfbe5" />

            {/* Globe emblem */}
            <circle cx="43" cy="38" r="14" stroke="#1a5c5b" strokeWidth="2" fill="none" />
            <ellipse cx="43" cy="38" rx="7" ry="14" stroke="#1a5c5b" strokeWidth="1.5" fill="none" />
            <line x1="29" y1="38" x2="57" y2="38" stroke="#1a5c5b" strokeWidth="1.5" />
            <line x1="31" y1="30" x2="55" y2="30" stroke="#1a5c5b" strokeWidth="1" />
            <line x1="31" y1="46" x2="55" y2="46" stroke="#1a5c5b" strokeWidth="1" />

            {/* MRZ lines */}
            <rect x="20" y="62" width="46" height="3.5" rx="1.5" fill="#309c9b" opacity="0.4" />
            <rect x="20" y="69" width="46" height="3.5" rx="1.5" fill="#309c9b" opacity="0.4" />
            <rect x="20" y="76" width="30" height="3.5" rx="1.5" fill="#309c9b" opacity="0.3" />

            {/* Star/emblem accent */}
            <text
                x="43"
                y="57"
                textAnchor="middle"
                fontSize="9"
                fill="#1a5c5b"
                fontFamily="sans-serif"
                fontWeight="bold"
            >
                ★
            </text>
        </svg>
    );
}

function Loader() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const link = (e.target as Element).closest(
                "a[href]"
            ) as HTMLAnchorElement | null;
            if (!link) return;

            try {
                const url = new URL(link.href, window.location.origin);
                if (
                    url.origin === window.location.origin &&
                    url.pathname !== window.location.pathname
                ) {
                    setLoading(true);
                }
            } catch {
                // invalid URL — skip
            }
        };

        document.addEventListener("click", handleClick, true);
        return () =>
            document.removeEventListener("click", handleClick, true);
    }, []);

    useEffect(() => {
        setLoading(false);
    }, [pathname, searchParams]);

    if (!loading) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-sm animate-[fadeIn_0.15s_ease_0.15s_both]">
            <div className="flex flex-col items-center gap-4">
                <div className="relative flex items-center justify-center w-28 h-28">
                    {/* Spinning ring — square container ensures perfect circle */}
                    <div className="absolute inset-0 rounded-full border-4 border-coral/20 border-t-coral animate-spin" />
                    <div className="animate-[passportBounce_0.8s_ease-in-out_infinite]">
                        <PassportIcon />
                    </div>
                </div>
                <p className="text-[#1a5c5b] text-sm font-medium tracking-wide font-sans animate-pulse">
                    Yükleniyor...
                </p>
            </div>
        </div>
    );
}

export default function NavigationLoader() {
    return (
        <Suspense>
            <Loader />
        </Suspense>
    );
}
