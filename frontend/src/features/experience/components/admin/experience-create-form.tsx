"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { Button } from "@/components/ui/button";
import { FieldGroup, FieldSeparator } from "@/components/ui/field";
import {
  Form,
  FormControlInput,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AdminRhfCheckbox, AdminRhfInput, AdminRhfTextarea, adminInputClass } from "@/features/admin/components/admin-rhf-field";
import { cn } from "@/lib/utils";
import { AdminRhfDatePopover } from "@/features/admin/components/admin-popover-fields";
import { useCurrentClearsEndDate } from "@/features/admin/hooks/use-current-clears-end-date";
import {
  experienceCreateFormDefaults,
  experienceCreateFormSchema,
  experienceCreateFormToPayload,
  experienceToFormValues,
  type ExperienceCreateFormValues,
} from "../../schema/experience-create-form.schema";
import type { Experience } from "../../schema/experience.schema";
import { useCreateExperience, useExperienceEmploymentTypes, useUpdateExperience } from "../../hooks/experience";
import { useGetProjects } from "@/features/projects/hooks/projects";
import { ExperienceLinkedProjects } from "./experience-linked-projects";
import { ExperienceProjectPickerDialog } from "./experience-project-picker-dialog";

type ExperienceCreateFormProps = {
  editing?: Experience | null;
  onCancelEdit?: () => void;
};

export function ExperienceCreateForm({ editing = null, onCancelEdit }: ExperienceCreateFormProps) {
  const isEditing = Boolean(editing);
  const create = useCreateExperience();
  const update = useUpdateExperience();
  const { data: employmentTypes } = useExperienceEmploymentTypes();
  const [error, setError] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const form = useForm<ExperienceCreateFormValues>({
    resolver: zodResolver(experienceCreateFormSchema),
    defaultValues: experienceCreateFormDefaults,
    mode: "onTouched",
  });

  useEffect(() => {
    if (editing) {
      form.reset(experienceToFormValues(editing));
    } else {
      form.reset(experienceCreateFormDefaults);
    }
    setError(null);
  }, [editing, form]);

  const isCurrent = form.watch("current");
  const projectIds = form.watch("projectIds");
  useCurrentClearsEndDate(form, isCurrent);

  const { data: projectsList } = useGetProjects({ page: 1, limit: 50 });
  const linkedProjects = useMemo(() => {
    const all = projectsList?.data ?? [];
    return projectIds
      .map((id) => all.find((p) => p.id === id))
      .filter((p): p is NonNullable<typeof p> => Boolean(p));
  }, [projectIds, projectsList?.data]);

  async function onSubmit(values: ExperienceCreateFormValues) {
    setError(null);
    try {
      if (editing) {
        await update.mutateAsync({
          id: editing.id,
          data: experienceCreateFormToPayload(values, "update"),
        });
        onCancelEdit?.();
        form.reset(experienceCreateFormDefaults);
      } else {
        await create.mutateAsync(experienceCreateFormToPayload(values, "create"));
        form.reset(experienceCreateFormDefaults);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    }
  }

  function handleClearOrCancel() {
    if (isEditing) {
      onCancelEdit?.();
    } else {
      form.reset(experienceCreateFormDefaults);
    }
    setError(null);
  }

  const pending = form.formState.isSubmitting || create.isPending || update.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FieldGroup className="gap-5">
          {isEditing ? (
            <p className="rounded-xl border border-primary/25 bg-primary/5 px-3 py-2 text-sm text-on-surface">
              Editing <span className="font-semibold text-primary">{editing?.position}</span> at{" "}
              <span className="font-semibold">{editing?.company}</span>. Save to apply changes or cancel
              to stop editing.
            </p>
          ) : null}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <AdminRhfInput
              control={form.control}
              name="company"
              label="Company"
              requiredMark
              placeholder="e.g. Acme Corp"
              autoComplete="organization"
            />
            <AdminRhfInput
              control={form.control}
              name="position"
              label="Position"
              requiredMark
              placeholder="e.g. Senior Frontend Engineer"
            />
            <AdminRhfInput
              control={form.control}
              name="location"
              label="Location"
              placeholder="City or country — optional"
            />
            <FormField
              control={form.control}
              name="employmentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-body-sm text-body-sm text-on-surface">Work type</FormLabel>
                  <FormControlInput>
                    <select
                      {...field}
                      value={field.value ?? ""}
                      className={cn(adminInputClass, "w-full cursor-pointer")}
                    >
                      <option value="">Select type — optional</option>
                      {(employmentTypes?.data ?? []).map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </FormControlInput>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FieldSeparator className="my-1 bg-surface-variant/40">Timeline</FieldSeparator>

          <AdminRhfCheckbox control={form.control} name="current" label="Current role" />

          {isCurrent ? (
            <div className="max-w-sm">
              <AdminRhfDatePopover
                control={form.control}
                name="startDate"
                label="Start date"
                requiredMark
              />
            </div>
          ) : (
            <div className="grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
              <AdminRhfDatePopover
                control={form.control}
                name="startDate"
                label="Start date"
                requiredMark
              />
              <AdminRhfDatePopover
                control={form.control}
                name="endDate"
                label="End date"
                requiredMark
              />
            </div>
          )}

          {isCurrent ? (
            <p className="text-xs leading-relaxed text-on-surface-variant">
              End date is not required for your current role.
            </p>
          ) : null}

          <FieldSeparator className="my-1 bg-surface-variant/40">Details</FieldSeparator>

          <AdminRhfTextarea
            control={form.control}
            name="description"
            label="Description"
            rows={4}
            requiredMark
          />

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-on-surface">Projects during this role</p>
                <p className="text-xs text-on-surface-variant">
                  Link portfolio work you did in this period.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="h-10 gap-2 rounded-xl"
                onClick={() => setPickerOpen(true)}
              >
                <MaterialSymbol name="add" className="text-[18px]" />
                Add projects
              </Button>
            </div>
            <ExperienceLinkedProjects
              projects={linkedProjects}
              onRemove={(id) =>
                form.setValue(
                  "projectIds",
                  projectIds.filter((x) => x !== id),
                  { shouldDirty: true },
                )
              }
            />
            {projectIds.length > 0 && linkedProjects.length === 0 ? (
              <p className="text-xs text-on-surface-variant">
                {projectIds.length} selected — refresh project list if names do not appear.
              </p>
            ) : null}
          </div>

          <ExperienceProjectPickerDialog
            open={pickerOpen}
            onOpenChange={setPickerOpen}
            selectedIds={projectIds}
            onConfirm={(ids) => form.setValue("projectIds", ids, { shouldDirty: true })}
          />

          <AdminRhfCheckbox control={form.control} name="featured" label="Featured on portfolio" />

          {error ? (
            <p className="rounded-lg border border-destructive/25 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-xl"
              onClick={handleClearOrCancel}
            >
              {isEditing ? "Cancel editing" : "Clear form"}
            </Button>
            <Button
              type="submit"
              disabled={pending}
              className="h-11 min-w-[12rem] gap-2 rounded-xl bg-primary-container font-semibold text-on-primary shadow-sm hover:bg-primary"
            >
              {pending ? (
                <>
                  <MaterialSymbol name="progress_activity" className="animate-spin text-[18px]" />
                  Saving…
                </>
              ) : isEditing ? (
                <>
                  Update experience
                  <MaterialSymbol name="save" className="text-[18px]" />
                </>
              ) : (
                <>
                  Save experience
                  <MaterialSymbol name="save" className="text-[18px]" />
                </>
              )}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </Form>
  );
}