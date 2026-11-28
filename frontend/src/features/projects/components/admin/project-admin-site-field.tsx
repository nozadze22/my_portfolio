"use client";

import type { UseFormReturn } from "react-hook-form";
import {
  FormControlInput,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { siteInputClass } from "@/features/site/components/admin/form-styles";
import type { ProjectCreateFormValues } from "@/features/projects/schema/project-create-form.schema";

const fieldInputClass = cn(
  siteInputClass,
  "h-auto rounded-lg bg-surface-container-low px-space-sm py-2 font-body-sm text-body-sm text-on-surface",
  "focus-visible:bg-surface-container-lowest",
);

export function ProjectAdminSiteField({
  control,
  name,
  label,
  ...inputProps
}: {
  control: UseFormReturn<ProjectCreateFormValues>["control"];
  name: keyof ProjectCreateFormValues;
  label: string;
} & Omit<React.ComponentProps<typeof Input>, "name">) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm">{label}</FormLabel>
          <FormControlInput>
            <Input {...field} {...inputProps} value={String(field.value ?? "")} className={fieldInputClass} />
          </FormControlInput>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}