import type { Easing } from "framer-motion";

export const EASE_OUT_EXPO: Easing = [0.22, 1, 0.36, 1];

export const DUR_FAST = 0.25;
export const DUR_BASE = 0.4;
export const DUR_SLOW = 0.55;

export const DEFAULT_Y = 16;
export const STAGGER_GAP = 0.06;

export const VIEWPORT = { once: true, margin: "-10% 0px" } as const;
