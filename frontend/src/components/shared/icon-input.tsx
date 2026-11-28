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
  /** Inset icon rail — avoids overlapping typed text (auth forms) */
  inset?: boolean;
  invalid?: boolean;
  endAdornment?: React.ReactNode;
};

/** Input with left icon — works with react-hook-form `{...field}` inside FormControl. */
export const IconInput = React.forwardRef<HTMLInputElement, IconInputProps>(function IconInput(
  {
    symbol,
    icon: Icon,
    className,
    wrapperClassName,
    type,
    inset = false,
    invalid,
    endAdornment,
    ...props
  },
  ref,
) {
  const hasIcon = Boolean(symbol || Icon);
  const hasEnd = Boolean(endAdornment);

  if (inset && hasIcon) {
    return (
      <div
        className={cn(
          "flex h-11 w-full items-stretch overflow-hidden rounded-xl border bg-surface-container-low shadow-inner transition-[border-color,box-shadow] duration-200",
          invalid
            ? "border-destructive/80 ring-[3px] ring-destructive/15"
            : "border-outline-variant/45 focus-within:border-primary/45 focus-within:ring-[3px] focus-within:ring-primary/12",
          wrapperClassName,
        )}
      >
        <div
          className="flex w-11 shrink-0 items-center justify-center border-r border-outline-variant/30 bg-surface-container/80 text-on-surface-variant"
          aria-hidden
        >
          {symbol ? (
            <MaterialSymbol name={symbol} className="text-[20px]" />
          ) : Icon ? (
            <Icon className="size-5" />
          ) : null}
        </div>
        <Input
          ref={ref}
          type={type}
          className={cn(
            "h-full min-h-0 flex-1 rounded-none border-0 bg-transparent px-3 shadow-none ring-0",
            "focus-visible:border-0 focus-visible:ring-0 focus-visible:ring-offset-0",
            "aria-invalid:border-0 aria-invalid:ring-0",
            hasEnd && "pr-1",
            className,
          )}
          {...props}
        />
        {hasEnd ? (
          <div className="flex shrink-0 items-center pr-1.5 text-on-surface-variant">{endAdornment}</div>
        ) : null}
      </div>
    );
  }

  return (
    <div className={cn("relative flex w-full items-center", wrapperClassName)}>
      {symbol ? (
        <MaterialSymbol
          name={symbol}
          className="pointer-events-none absolute left-3.5 z-10 text-[20px] text-outline"
        />
      ) : Icon ? (
        <Icon className="pointer-events-none absolute left-3.5 z-10 size-5 text-outline" aria-hidden />
      ) : null}
      <Input
        ref={ref}
        type={type}
        className={cn(hasIcon && "pl-11", hasEnd && "pr-11", className)}
        {...props}
      />
    </div>
  );
});