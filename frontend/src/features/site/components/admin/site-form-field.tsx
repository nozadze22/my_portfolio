"use client";

import type { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControlInput,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { siteInputClass, siteTextareaClass } from "./form-styles";

type SiteFormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  hint?: string;
  itemClassName?: string;
} & Omit<React.ComponentProps<typeof Input>, "name" | "value" | "defaultValue" | "onChange" | "onBlur" | "ref">;

export function SiteFormField<T extends FieldValues>({
  control,
  name,
  label,
  hint,
  itemClassName,
  className,
  ...inputProps
}: SiteFormFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={itemClassName}>
          <FormLabel className="text-on-surface">{label}</FormLabel>
          {hint ? <FormDescription className="text-on-surface-variant">{hint}</FormDescription> : null}
          <FormControlInput>
            <Input
              {...field}
              {...inputProps}
              value={field.value ?? ""}
              className={cn(siteInputClass, className)}
            />
          </FormControlInput>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

type SiteFormTextareaProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  hint?: string;
  rows?: number;
  itemClassName?: string;
};

export function SiteFormTextarea<T extends FieldValues>({
  control,
  name,
  label,
  hint,
  rows = 4,
  itemClassName,
}: SiteFormTextareaProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={itemClassName}>
          <FormLabel className="text-on-surface">{label}</FormLabel>
          {hint ? <FormDescription className="text-on-surface-variant">{hint}</FormDescription> : null}
          <FormControlInput>
            <Textarea
              {...field}
              rows={rows}
              value={field.value ?? ""}
              className={siteTextareaClass}
            />
          </FormControlInput>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}