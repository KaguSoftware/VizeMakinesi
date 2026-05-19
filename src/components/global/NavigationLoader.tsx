"use client";

import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

type Pending = { target: string; startUrl: string };

function Loader() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [pending, setPending] = useState<Pending | null>(null);

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (
                e.defaultPrevented ||
                e.button !== 0 ||
                e.metaKey ||
                e.ctrlKey ||
                e.shiftKey ||
                e.altKey
            ) {
                return;
            }
            const link = (e.target as Element).closest(
                "a[href]"
            ) as HTMLAnchorElement | null;
            if (!link) return;
            if (link.target === "_blank" || link.hasAttribute("download")) return;

            try {
                const url = new URL(link.href, window.location.origin);
                if (
                    url.origin === window.location.origin &&
                    url.pathname !== window.location.pathname
                ) {
                    setPending({
                        target: url.pathname,
                        startUrl:
                            window.location.pathname + window.location.search,
                    });
                }
            } catch {
                // invalid URL — skip
            }
        };

        const onReset = () => setPending(null);

        document.addEventListener("click", onClick, true);
        window.addEventListener("popstate", onReset);
        window.addEventListener("pageshow", onReset);
        return () => {
            document.removeEventListener("click", onClick, true);
            window.removeEventListener("popstate", onReset);
            window.removeEventListener("pageshow", onReset);
        };
    }, []);

    // Safety net: never trap the UI for more than 10s.
    useEffect(() => {
        if (pending === null) return;
        const t = setTimeout(() => setPending(null), 10000);
        return () => clearTimeout(t);
    }, [pending]);

    // Show the loader only while the URL is still the one captured at click time.
    // Any URL change — forward, back, or query swap — flips currentUrl and clears it.
    const qs = searchParams?.toString() ?? "";
    const currentUrl = qs ? `${pathname}?${qs}` : pathname;
    const loading = pending !== null && currentUrl === pending.startUrl;

    if (!loading) return null;

    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-white/70 backdrop-blur-sm animate-[fadeIn_0.15s_ease_0.15s_both]">
            <div className="flex flex-col items-center gap-4">
                <div className="relative w-28 h-28 flex items-center justify-center">
                    <Image
                        src="/Logo_yazisiz.png"
                        alt="Yükleniyor"
                        width={80}
                        height={80}
                        priority
                        className="w-20 h-20 object-contain relative z-10"
                    />
                    <svg
                        className="absolute inset-0 w-full h-full animate-[ringSpin_1s_linear_infinite]"
                        viewBox="0 0 100 100"
                        aria-hidden="true"
                    >
                        <circle
                            cx="50"
                            cy="50"
                            r="46"
                            fill="none"
                            stroke="#309c9b"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeDasharray="72 289"
                        />
                    </svg>
                </div>
                <p className="text-navy text-sm font-medium tracking-wide font-sans animate-pulse">
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
