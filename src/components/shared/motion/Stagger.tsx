"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { STAGGER_GAP, VIEWPORT } from "./constants";

type Tag = "div" | "section" | "ul" | "ol" | "article";

type StaggerProps = {
  children: ReactNode;
  gap?: number;
  delayChildren?: number;
  as?: Tag;
  className?: string;
  /** Above-the-fold: start immediately instead of waiting to scroll into view.
      Pair with `priority` on the child StaggerItems. See FadeIn. */
  priority?: boolean;
};

export default function Stagger({
  children,
  gap = STAGGER_GAP,
  delayChildren = 0,
  as = "div",
  className,
  priority = false,
}: StaggerProps) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  if (reduced) {
    const Plain = as as "div";
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <MotionTag
      initial="hidden"
      {...(priority ? { animate: 'show' } : { whileInView: 'show', viewport: VIEWPORT })}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: gap, delayChildren } },
      }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
