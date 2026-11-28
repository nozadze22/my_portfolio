import { cn } from "@/lib/utils";

/** Plain auth inputs (no inset rail) */
export const authInputClass = cn(
  "h-11 w-full rounded-xl border border-outline-variant/45 bg-surface-container-low px-3 text-base text-on-surface shadow-inner md:text-sm",
  "transition-[border-color,box-shadow,background-color] duration-200",
  "placeholder:text-outline-variant",
  "focus-visible:border-primary/45 focus-visible:bg-surface-container-lowest focus-visible:shadow-md focus-visible:ring-[3px] focus-visible:ring-primary/12",
  "disabled:pointer-events-none disabled:opacity-50",
  "aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/15",
);

/** Inner input when using IconInput inset — border lives on the wrapper */
export const authInsetInputClass = cn(
  "text-base text-on-surface md:text-sm",
  "placeholder:text-outline-variant",
  "disabled:pointer-events-none disabled:opacity-50",
);