"use client";

import { useMemo, useState } from "react";
import { format, isValid, parse } from "date-fns";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { adminInputClass } from "./admin-rhf-field";

function parseIsoDate(value: string): Date | undefined {
  if (!value.trim()) return undefined;
  const d = parse(value, "yyyy-MM-dd", new Date());
  return isValid(d) ? d : undefined;
}

function toIsoDate(date: Date | undefined): string {
  if (!date || !isValid(date)) return "";
  return format(date, "yyyy-MM-dd");
}

type AdminRhfDatePopoverProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  requiredMark?: boolean;
  disabled?: boolean;
  placeholder?: string;
  itemClassName?: string;
};

export function AdminRhfDatePopover<T extends FieldValues>({
  control,
  name,
  label,
  requiredMark,
  disabled,
  placeholder = "Pick a date",
  itemClassName,
}: AdminRhfDatePopoverProps<T>) {
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selected = parseIsoDate(String(field.value ?? ""));
        const labelText = selected ? format(selected, "MMM d, yyyy") : placeholder;

        return (
          <FormItem className={itemClassName}>
            <FormLabel className="font-body-sm text-body-sm text-on-surface">
              {label}
              {requiredMark ? <span className="text-destructive"> *</span> : null}
            </FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger
                type="button"
                disabled={disabled}
                className={cn(
                  adminInputClass,
                  "flex w-full items-center justify-between gap-2 text-left font-normal",
                  disabled && "cursor-not-allowed opacity-50",
                  !selected && "text-on-surface-variant",
                )}
              >
                <span className="truncate">{labelText}</span>
                <MaterialSymbol name="calendar_month" className="shrink-0 text-[20px] text-outline" />
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <PopoverHeader className="border-b border-border px-3 py-2">
                  <PopoverTitle className="text-sm font-semibold">{label}</PopoverTitle>
                </PopoverHeader>
                <Calendar
                  mode="single"
                  selected={selected}
                  onSelect={(date) => {
                    field.onChange(toIsoDate(date));
                    setOpen(false);
                  }}
                  defaultMonth={selected}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

type AdminRhfSuggestPopoverProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  suggestions: string[];
  requiredMark?: boolean;
  placeholder?: string;
  popoverTitle?: string;
  itemClassName?: string;
};

export function AdminRhfSuggestPopover<T extends FieldValues>({
  control,
  name,
  label,
  suggestions,
  requiredMark,
  placeholder = "Choose or type…",
  popoverTitle,
  itemClassName,
}: AdminRhfSuggestPopoverProps<T>) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const uniqueSuggestions = useMemo(
    () => [...new Set(suggestions.map((s) => s.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [suggestions],
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const value = String(field.value ?? "");
        const filtered = uniqueSuggestions.filter((s) =>
          s.toLowerCase().includes(query.trim().toLowerCase()),
        );
        const display = value || placeholder;

        return (
          <FormItem className={itemClassName}>
            <FormLabel className="font-body-sm text-body-sm text-on-surface">
              {label}
              {requiredMark ? <span className="text-destructive"> *</span> : null}
            </FormLabel>
            <Popover
              open={open}
              onOpenChange={(next) => {
                setOpen(next);
                if (next) setQuery(value);
              }}
            >
              <PopoverTrigger
                type="button"
                className={cn(
                  adminInputClass,
                  "flex w-full items-center justify-between gap-2 text-left font-normal",
                  !value && "text-on-surface-variant",
                )}
              >
                <span className="truncate">{display}</span>
                <MaterialSymbol name="expand_more" className="shrink-0 text-[20px] text-outline" />
              </PopoverTrigger>
              <PopoverContent className="w-[min(100vw-2rem,22rem)] p-0" align="start">
                <PopoverHeader className="gap-2 border-b border-border px-3 py-2.5">
                  <PopoverTitle className="text-sm font-semibold">
                    {popoverTitle ?? label}
                  </PopoverTitle>
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search or type new…"
                    className="h-9"
                  />
                </PopoverHeader>
                <div className="max-h-52 overflow-y-auto p-1.5">
                  {filtered.length === 0 ? (
                    <p className="px-2 py-3 text-center text-xs text-on-surface-variant">
                      No matches — use custom value below.
                    </p>
                  ) : (
                    filtered.map((item) => (
                      <button
                        key={item}
                        type="button"
                        className={cn(
                          "flex w-full rounded-md px-2.5 py-2 text-left text-sm transition-colors hover:bg-muted",
                          value === item && "bg-primary/10 font-medium text-primary",
                        )}
                        onClick={() => {
                          field.onChange(item);
                          setQuery("");
                          setOpen(false);
                        }}
                      >
                        {item}
                      </button>
                    ))
                  )}
                </div>
                <div className="flex gap-2 border-t border-border p-2.5">
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Custom name"
                    className="h-9 flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const next = query.trim();
                        if (next) {
                          field.onChange(next);
                          setQuery("");
                          setOpen(false);
                        }
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    className="h-9 shrink-0"
                    onClick={() => {
                      const next = query.trim();
                      if (!next) return;
                      field.onChange(next);
                      setQuery("");
                      setOpen(false);
                    }}
                  >
                    Use
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}