"use client";

import { useState, type ReactNode } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { IconInput } from "@/components/shared/icon-input";
import {
  FormControlInput,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { cn } from "@/lib/utils";
import { authInputClass } from "./auth-form-styles";

type AuthFormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  hint?: string;
  labelAside?: ReactNode;
  symbol?: string;
  itemClassName?: string;
  hideLabel?: boolean;
} & Omit<React.ComponentProps<typeof IconInput>, "name" | "value" | "defaultValue" | "onChange" | "onBlur" | "ref">;

export function AuthFormField<T extends FieldValues>({
  control,
  name,
  label,
  hint,
  labelAside,
  symbol,
  itemClassName,
  hideLabel,
  className: inputClassName,
  ...inputProps
}: AuthFormFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={itemClassName}>
          {hideLabel ? null : (
            <FormLabel className="flex w-full items-center justify-between font-label-code text-label-code font-semibold">
              <span>{label}</span>
              {labelAside ? (
                <span className="text-[11px] font-normal text-outline">{labelAside}</span>
              ) : hint ? (
                <span className="text-[11px] font-normal text-outline">{hint}</span>
              ) : null}
            </FormLabel>
          )}
          <FormControlInput>
            <IconInput
              {...field}
              {...inputProps}
              symbol={symbol}
              value={typeof field.value === "string" ? field.value : String(field.value ?? "")}
              className={cn(authInputClass, inputClassName)}
            />
          </FormControlInput>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function AuthFormEmailField<T extends FieldValues>({
  control,
  name,
  label = "Email",
  placeholder = "you@example.com",
  hint = "Primary directory",
  ...rest
}: {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  hint?: string;
} & Omit<AuthFormFieldProps<T>, "control" | "name" | "label" | "hint" | "symbol" | "type">) {
  return (
    <AuthFormField
      {...rest}
      control={control}
      name={name}
      label={label}
      hint={hint}
      symbol="alternate_email"
      type="email"
      autoComplete="email"
      placeholder={placeholder}
      required
    />
  );
}

type AuthFormPasswordFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  labelAside?: ReactNode;
  showToggle?: boolean;
  confirm?: boolean;
  minLength?: number;
  required?: boolean;
  itemClassName?: string;
};

export function AuthFormPasswordField<T extends FieldValues>({
  control,
  name,
  label = "Password",
  labelAside,
  showToggle = true,
  confirm = false,
  minLength = 8,
  required = true,
  itemClassName,
}: AuthFormPasswordFieldProps<T>) {
  const [visible, setVisible] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={itemClassName}>
          <FormLabel className="flex w-full items-center justify-between font-label-code text-label-code font-semibold">
            <span>{label}</span>
            {labelAside ? (
              <span className="text-[11px] font-normal text-outline">{labelAside}</span>
            ) : null}
          </FormLabel>
          <div className="relative">
            <FormControlInput>
              <IconInput
                {...field}
                symbol="key"
                type={visible ? "text" : "password"}
                required={required}
                minLength={minLength}
                autoComplete={confirm ? "new-password" : "current-password"}
                placeholder="••••••••••••"
                value={field.value ?? ""}
                className={cn(authInputClass, showToggle && "pr-12")}
              />
            </FormControlInput>
            {showToggle ? (
              <button
                type="button"
                aria-label="Toggle password visibility"
                className="absolute right-3.5 top-1/2 flex -translate-y-1/2 items-center justify-center p-1 text-outline transition-colors hover:text-on-surface"
                onClick={() => setVisible((v) => !v)}
              >
                <MaterialSymbol name={visible ? "visibility_off" : "visibility"} className="text-[20px]" />
              </button>
            ) : null}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function AuthFormTermsField<T extends FieldValues & { terms: boolean }>({
  control,
  label,
}: {
  control: Control<T>;
  label: ReactNode;
}) {
  return (
    <FormField
      control={control}
      name={"terms" as FieldPath<T>}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start gap-3 space-y-0 pt-2">
          <FormControlInput>
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 accent-primary"
              checked={field.value === true}
              onChange={(e) => field.onChange(e.target.checked)}
              onBlur={field.onBlur}
              ref={field.ref}
            />
          </FormControlInput>
          <div className="space-y-1 leading-none">
            <FormLabel className="cursor-pointer font-body-sm text-body-sm font-normal leading-relaxed text-on-surface-variant">
              {label}
            </FormLabel>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}