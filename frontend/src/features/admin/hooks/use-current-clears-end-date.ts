import { useEffect } from "react";
import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";

/** When `current` is true: clear + disable end date and drop its errors; when false, re-validate end date. */
export function useCurrentClearsEndDate<T extends FieldValues & { current: boolean; endDate: string }>(
  form: UseFormReturn<T>,
  isCurrent: boolean,
) {
  useEffect(() => {
    if (isCurrent) {
      form.setValue("endDate" as FieldPath<T>, "" as T[FieldPath<T>], {
        shouldValidate: false,
        shouldDirty: true,
      });
      form.clearErrors("endDate" as FieldPath<T>);
    } else {
      void form.trigger("endDate" as FieldPath<T>);
    }
  }, [isCurrent, form]);
}