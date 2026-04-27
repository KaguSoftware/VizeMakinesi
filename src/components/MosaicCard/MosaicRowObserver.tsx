"use client";

import { useEffect } from "react";

export default function MosaicRowObserver() {
    useEffect(() => {
        if (!window.matchMedia("(hover: none)").matches) return;

        const rowMap = new Map<string, HTMLElement[]>();
        document.querySelectorAll<HTMLElement>("[data-mosaic-row]").forEach((el) => {
            const row = el.dataset.mosaicRow!;
            if (!rowMap.has(row)) rowMap.set(row, []);
            rowMap.get(row)!.push(el);
        });

        const observers: IntersectionObserver[] = [];

        rowMap.forEach((cards) => {
            // Track how many cards in this row are currently visible
            const visibleSet = new Set<Element>();

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((e) => {
                        if (e.isIntersecting) visibleSet.add(e.target);
                        else visibleSet.delete(e.target);
                    });
                    // Activate the whole row if any card is on screen
                    const active = visibleSet.size > 0;
                    cards.forEach((c) => c.classList.toggle("is-active", active));
                },
                { threshold: 0.15 }
            );

            // Observe every card in the row
            cards.forEach((c) => observer.observe(c));
            observers.push(observer);
        });

        return () => observers.forEach((o) => o.disconnect());
    }, []);

    return null;
}
