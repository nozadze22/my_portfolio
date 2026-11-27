"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

import { enterTransition } from "@/lib/motion";

type FadeInProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...enterTransition, delay }}
    >
      {children}
    </motion.div>
  );
}