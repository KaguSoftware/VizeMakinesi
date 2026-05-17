"use client";

import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

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
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-white/70 backdrop-blur-sm animate-[fadeIn_0.15s_ease_0.15s_both]">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-[logoJump_0.9s_ease-in-out_infinite]">
                    <div className="animate-[logoSpin_1.4s_linear_infinite]">
                        <Image
                            src="/Logo_yazisiz.png"
                            alt="Yükleniyor"
                            width={80}
                            height={80}
                            priority
                            className="w-20 h-20 object-contain"
                        />
                    </div>
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
