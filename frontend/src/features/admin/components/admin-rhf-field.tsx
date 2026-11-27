"use client";

import type { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControlInput,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { siteInputClass, siteTextareaClass } from "@/features/site/components/admin/form-styles";

export const adminInputClass = cn(
  siteInputClass,
  "h-auto rounded-lg bg-surface-container-low px-space-sm py-2 font-body-sm text-body-sm text-on-surface",
  "focus-visible:bg-surface-container-lowest",
);

type AdminRhfInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  itemClassName?: string;
  /** Shows required asterisk in label (validation still from Zod) */
  requiredMark?: boolean;
} & Omit<React.ComponentProps<typeof Input>, "name" | "value" | "defaultValue" | "onChange" | "onBlur" | "ref">;

export function AdminRhfInput<T extends FieldValues>({
  control,
  name,
  label,
  itemClassName,
  requiredMark,
  className,
  ...inputProps
}: AdminRhfInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={itemClassName}>
          <FormLabel className="font-body-sm text-body-sm text-on-surface">
            {label}
            {requiredMark ? <span className="text-destructive"> *</span> : null}
          </FormLabel>
          <FormControlInput>
            <Input
              {...field}
              {...inputProps}
              value={field.value ?? ""}
              className={cn(adminInputClass, className)}
            />
          </FormControlInput>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function AdminRhfTextarea<T extends FieldValues>({
  control,
  name,
  label,
  rows = 4,
  itemClassName,
  requiredMark,
}: {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  rows?: number;
  itemClassName?: string;
  requiredMark?: boolean;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={itemClassName}>
          <FormLabel className="font-body-sm text-body-sm text-on-surface">
            {label}
            {requiredMark ? <span className="text-destructive"> *</span> : null}
          </FormLabel>
          <FormControlInput>
            <Textarea
              {...field}
              rows={rows}
              value={field.value ?? ""}
              className={cn(siteTextareaClass, "resize-y font-body-sm text-body-sm")}
            />
          </FormControlInput>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function AdminRhfCheckbox<T extends FieldValues>({
  control,
  name,
  label,
  itemClassName,
}: {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  itemClassName?: string;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-1.5", itemClassName)}>
          <div className="flex items-center gap-2.5 rounded-lg border border-surface-variant/50 bg-surface-container-low/50 px-3 py-2.5">
            <FormControlInput>
              <input
                type="checkbox"
                className="h-4 w-4 accent-primary"
                checked={Boolean(field.value)}
                onChange={(e) => field.onChange(e.target.checked)}
                onBlur={field.onBlur}
                ref={field.ref}
              />
            </FormControlInput>
            <FormLabel className="cursor-pointer font-body-sm text-body-sm font-medium leading-snug">{label}</FormLabel>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}