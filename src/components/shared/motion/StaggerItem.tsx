"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { DEFAULT_Y, DUR_BASE, EASE_OUT_EXPO } from "./constants";

type Tag = "div" | "li" | "article" | "section" | "span";

type StaggerItemProps = {
  children: ReactNode;
  y?: number;
  duration?: number;
  as?: Tag;
  className?: string;
};

export default function StaggerItem({
  children,
  y = DEFAULT_Y,
  duration = DUR_BASE,
  as = "div",
  className,
}: StaggerItemProps) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  if (reduced) {
    const Plain = as as "div";
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <MotionTag
      variants={{
        hidden: { opacity: 0, y },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration, ease: EASE_OUT_EXPO },
        },
      }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
