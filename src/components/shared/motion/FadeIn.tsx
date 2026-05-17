"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { DEFAULT_Y, DUR_BASE, EASE_OUT_EXPO, VIEWPORT } from "./constants";

type Tag = "div" | "section" | "span" | "li" | "ul" | "header" | "footer" | "article" | "aside" | "p";

type FadeInProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  as?: Tag;
  className?: string;
};

export default function FadeIn({
  children,
  delay = 0,
  y = DEFAULT_Y,
  duration = DUR_BASE,
  as = "div",
  className,
}: FadeInProps) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  if (reduced) {
    const Plain = as as "div";
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <MotionTag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration, delay, ease: EASE_OUT_EXPO }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
