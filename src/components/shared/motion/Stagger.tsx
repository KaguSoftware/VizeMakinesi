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
};

export default function Stagger({
  children,
  gap = STAGGER_GAP,
  delayChildren = 0,
  as = "div",
  className,
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
      whileInView="show"
      viewport={VIEWPORT}
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
