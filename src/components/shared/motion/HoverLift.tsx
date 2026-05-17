"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_OUT_EXPO } from "./constants";

type Tag = "div" | "span" | "li" | "article" | "section";

type HoverLiftProps = {
  children: ReactNode;
  scale?: number;
  y?: number;
  as?: Tag;
  className?: string;
};

export default function HoverLift({
  children,
  scale = 1.03,
  y = -2,
  as = "div",
  className,
}: HoverLiftProps) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  if (reduced) {
    const Plain = as as "div";
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <MotionTag
      whileHover={{ scale, y }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.18, ease: EASE_OUT_EXPO }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
