import { cn } from "@/lib/utils";

/** Shadcn inputs aligned with portfolio surface tokens */
export const siteInputClass = cn(
  "h-10 w-full rounded-xl border border-outline-variant/60 bg-surface-container-low px-3 text-sm text-on-surface shadow-sm",
  "transition-[border-color,box-shadow,background-color]",
  "placeholder:text-on-surface-variant/70",
  "focus-visible:border-primary/50 focus-visible:bg-surface-container-lowest focus-visible:ring-[3px] focus-visible:ring-primary/20",
  "disabled:pointer-events-none disabled:opacity-50",
);

export const siteTextareaClass = cn(
  siteInputClass,
  "min-h-[6.5rem] py-2.5 leading-relaxed",
);