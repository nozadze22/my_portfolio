"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { cn } from "@/lib/utils";

export type IconInputProps = React.ComponentProps<typeof Input> & {
  /** Material Symbols name (portfolio default) */
  symbol?: string;
  /** Lucide icon (optional, e.g. Mail from lucide-react) */
  icon?: LucideIcon;
  wrapperClassName?: string;
};

/** Input with left icon — works with react-hook-form `{...field}` inside FormControl. */
export const IconInput = React.forwardRef<HTMLInputElement, IconInputProps>(function IconInput(
  { symbol, icon: Icon, className, wrapperClassName, type, ...props },
  ref,
) {
  const hasIcon = Boolean(symbol || Icon);

  return (
    <div className={cn("relative flex w-full items-center", wrapperClassName)}>
      {symbol ? (
        <MaterialSymbol
          name={symbol}
          className="pointer-events-none absolute left-3.5 text-[20px] text-outline"
        />
      ) : Icon ? (
        <Icon className="pointer-events-none absolute left-3.5 size-5 text-outline" aria-hidden />
      ) : null}
      <Input
        ref={ref}
        type={type}
        className={cn(hasIcon && "pl-11", className)}
        {...props}
      />
    </div>
  );
});