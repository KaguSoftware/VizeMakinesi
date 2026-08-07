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
  /**
   * For above-the-fold content (page heroes).
   *
   * The default entrance starts at `opacity: 0` — and because that style is in
   * the server-rendered HTML, the text is invisible until React hydrates and
   * the animation runs. On a hero that is the largest element on screen, so it
   * pushes LCP out by ~700ms and the page *feels* slow even though the HTML
   * arrived in 20ms.
   *
   * With `priority`, the element is painted at full opacity from the very first
   * frame and only its position animates. Transform-driven movement doesn't
   * count towards layout shift, so this costs nothing in CLS. It also runs off
   * `animate` rather than `whileInView`, so it never waits on an intersection
   * observer — pointless for something already in view.
   */
  priority?: boolean;
};

export default function FadeIn({
  children,
  delay = 0,
  y = DEFAULT_Y,
  duration = DUR_BASE,
  as = "div",
  className,
  priority = false,
}: FadeInProps) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  if (reduced) {
    const Plain = as as "div";
    return <Plain className={className}>{children}</Plain>;
  }

  const transition = { duration, delay, ease: EASE_OUT_EXPO };

  if (priority) {
    return (
      <MotionTag
        initial={{ opacity: 1, y }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
        className={className}
      >
        {children}
      </MotionTag>
    );
  }

  return (
    <MotionTag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={transition}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
