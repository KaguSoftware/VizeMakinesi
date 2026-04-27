"use client";

import { useEffect } from "react";

export default function MosaicRowObserver() {
    useEffect(() => {
        if (!window.matchMedia("(hover: none)").matches) return;

        const rowMap = new Map<string, HTMLElement[]>();
        document.querySelectorAll<HTMLElement>("[data-mosaic-row]").forEach((el, i) => {
            const key = String(i);
            rowMap.set(key, [el]);
        });

        const observers: IntersectionObserver[] = [];

        rowMap.forEach((cards) => {
            // Track how many cards in this row are currently visible
            const visibleSet = new Set<Element>();

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((e) => {
                        if (e.intersectionRatio >= 0.70) visibleSet.add(e.target);
                        else visibleSet.delete(e.target);
                    });
                    const active = visibleSet.size > 0;
                    cards.forEach((c) => c.classList.toggle("is-active", active));
                },
                { threshold: [0, 0.70] }
            );

            // Observe every card in the row
            cards.forEach((c) => observer.observe(c));
            observers.push(observer);
        });

        return () => observers.forEach((o) => o.disconnect());
    }, []);

    return null;
}
