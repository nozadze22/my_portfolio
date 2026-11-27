import { cn } from "@/lib/utils";

/** Auth console inputs — matches shadcn Input + portfolio surfaces */
export const authInputClass = cn(
  "h-11 w-full rounded-lg border border-outline-variant/40 bg-surface-container-low px-3 text-base text-on-surface shadow-inner md:text-sm",
  "transition-[border-color,box-shadow,background-color] duration-200",
  "placeholder:text-outline-variant",
  "focus-visible:border-primary/40 focus-visible:bg-surface-container-lowest focus-visible:shadow-md focus-visible:ring-[3px] focus-visible:ring-primary/15",
  "disabled:pointer-events-none disabled:opacity-50",
  "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
);

export const authInputWithIconClass = cn(authInputClass, "pl-11");