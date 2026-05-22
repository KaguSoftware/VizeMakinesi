"use client";

import { useEffect, type RefObject, type DependencyList } from "react";

export function useMosaicScrollReveal(
  rootRef: RefObject<HTMLElement | null>,
  deps: DependencyList = [],
) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasFinePointer = window.matchMedia("(hover: hover)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (hasFinePointer || reducedMotion) return;

    const root = rootRef.current;
    if (!root) return;

    const cells = Array.from(root.querySelectorAll<HTMLElement>(".mosaic-cell"));
    if (cells.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.classList.add("is-active");
          } else {
            el.classList.remove("is-active");
          }
        }
      },
      { threshold: 0.55, rootMargin: "-20% 0px -20% 0px" },
    );

    cells.forEach((cell) => observer.observe(cell));

    return () => {
      observer.disconnect();
      cells.forEach((cell) => cell.classList.remove("is-active"));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
