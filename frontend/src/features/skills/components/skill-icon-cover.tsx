"use client";

import { useState } from "react";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { cn } from "@/lib/utils";
import { CATEGORY_LABEL } from "./skill-category-labels";
import type { SkillCategory } from "../schema/skill.schema";

type SkillIconCoverProps = {
  name: string;
  category: SkillCategory;
  iconUrl?: string | null;
  color?: string | null;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  rounded?: "xl" | "lg" | "full";
};

const SIZE = {
  xs: { box: "h-4 w-4", img: "h-3.5 w-3.5", symbol: "text-[12px]", initial: "text-[7px]" },
  sm: { box: "h-7 w-7", img: "h-4 w-4", symbol: "text-[18px]", initial: "text-[10px]" },
  md: { box: "h-10 w-10", img: "h-7 w-7", symbol: "text-[22px]", initial: "text-xs" },
  lg: { box: "h-12 w-12", img: "h-8 w-8", symbol: "text-[26px]", initial: "text-sm" },
} as const;

/** Logo image when URL works; gradient cover only when URL was set but failed to load; plain category icon when no URL. */
export function SkillIconCover({
  name,
  category,
  iconUrl,
  color,
  size = "md",
  className,
  rounded = "xl",
}: SkillIconCoverProps) {
  const [brokenUrl, setBrokenUrl] = useState<string | null>(null);

  const meta = CATEGORY_LABEL[category];
  const dims = SIZE[size];
  const url = iconUrl?.trim();
  const hasUrl = Boolean(url);
  const broken = hasUrl && brokenUrl === url;
  const showImg = hasUrl && !broken;
  const showCover = hasUrl && broken;
  const initial = (name.trim().charAt(0) || "?").toUpperCase();
  const accent = color?.trim();

  const roundedClass =
    rounded === "full" ? "rounded-full" : rounded === "lg" ? "rounded-lg" : "rounded-xl";

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden border",
        roundedClass,
        dims.box,
        showImg && "border-surface-variant/50 bg-surface-container-lowest",
        showCover &&
          "border-surface-variant/60 bg-gradient-to-br from-primary-container/40 via-surface-container-high to-surface-container-low",
        !hasUrl && "border-transparent bg-surface-container-high text-primary",
        className,
      )}
      style={
        showCover && accent
          ? {
              borderColor: `${accent}66`,
              background: `linear-gradient(145deg, ${accent}30 0%, ${accent}10 100%)`,
            }
          : undefined
      }
    >
      {showImg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt=""
          className={cn(dims.img, "object-contain")}
          onError={() => setBrokenUrl(url ?? null)}
        />
      ) : showCover ? (
        <>
          <MaterialSymbol
            name={meta.icon}
            className={cn("pointer-events-none absolute opacity-20 text-primary", dims.symbol)}
          />
          <span
            className={cn("relative z-[1] font-bold leading-none text-primary", dims.initial)}
            style={accent ? { color: accent } : undefined}
          >
            {initial}
          </span>
        </>
      ) : (
        <MaterialSymbol name={meta.icon} className={cn("text-primary", dims.symbol)} />
      )}
    </div>
  );
}