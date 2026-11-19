"use client";

import { Link, type LinkProps, useMatchRoute } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";

type MotionNavLinkProps = LinkProps & {
  children: React.ReactNode;
  className?: string;
};

export function MotionNavLink({
  children,
  className,
  to,
  ...linkProps
}: MotionNavLinkProps) {
  const reduceMotion = useReducedMotion();
  const matchRoute = useMatchRoute();
  const isActive = Boolean(matchRoute({ to, fuzzy: false }));

  return (
    <Link
      to={to}
      {...linkProps}
      className={`relative inline-flex items-center transition-colors hover:text-zinc-600 dark:hover:text-zinc-300 ${
        isActive ? "text-zinc-950 dark:text-white" : ""
      } ${className ?? ""}`}
    >
      <motion.span
        whileHover={reduceMotion ? undefined : { y: -1 }}
        whileTap={reduceMotion ? undefined : { scale: 0.97 }}
      >
        {children}
      </motion.span>
      {isActive && !reduceMotion ? (
        <motion.span
          layoutId="nav-active"
          className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-zinc-900 dark:bg-white"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      ) : null}
    </Link>
  );
}