"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { Button } from "@/components/ui/button";
import { FieldGroup, FieldSeparator } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { AdminRhfCheckbox, AdminRhfInput, AdminRhfTextarea } from "@/features/admin/components/admin-rhf-field";
import { AdminRhfDatePopover } from "@/features/admin/components/admin-popover-fields";
import { useCurrentClearsEndDate } from "@/features/admin/hooks/use-current-clears-end-date";
import { ProjectLinkedSkills } from "@/features/projects/components/admin/project-linked-skills";
import { ProjectSkillPickerDialog } from "@/features/projects/components/admin/project-skill-picker-dialog";
import { useSkills } from "@/features/skills/hooks/skills";
import type { Skill } from "@/features/skills/schema/skill.schema";
import type { Education } from "../../schema/education.schema";
import {
  educationCreateFormDefaults,
  educationCreateFormSchema,
  educationCreateFormToPayload,
  educationToFormValues,
  type EducationCreateFormValues,
} from "../../schema/education-create-form.schema";
import { useCreateEducation, useUpdateEducationEntry } from "../../hooks/education";

const EMPTY_SKILLS: Skill[] = [];
const EMPTY_SKILL_IDS: string[] = [];

type EducationCreateFormProps = {
  editing?: Education | null;
  onCancelEdit?: () => void;
};

export function EducationCreateForm({ editing = null, onCancelEdit }: EducationCreateFormProps) {
  const isEditing = Boolean(editing);
  const create = useCreateEducation();
  const update = useUpdateEducationEntry();
  const [error, setError] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const form = useForm<EducationCreateFormValues>({
    resolver: zodResolver(educationCreateFormSchema),
    defaultValues: educationCreateFormDefaults,
    mode: "onTouched",
  });

  useEffect(() => {
    if (editing) {
      form.reset(educationToFormValues(editing));
    } else {
      form.reset(educationCreateFormDefaults);
    }
    setError(null);
  }, [editing, form]);

  const isCurrent = form.watch("current");
  const skillIds = form.watch("skillIds") ?? EMPTY_SKILL_IDS;
  useCurrentClearsEndDate(form, isCurrent);

  const { data: skillsList } = useSkills({ limit: 200 });
  const linkedSkills = useMemo(() => {
    const all = skillsList?.data ?? EMPTY_SKILLS;
    return skillIds
      .map((id) => all.find((s) => s.id === id))
      .filter((s): s is Skill => Boolean(s));
  }, [skillIds, skillsList?.data]);

  async function onSubmit(values: EducationCreateFormValues) {
    setError(null);
    try {
      if (editing) {
        await update.mutateAsync({
          id: editing.id,
          data: educationCreateFormToPayload(values, "update"),
        });
        onCancelEdit?.();
        form.reset(educationCreateFormDefaults);
      } else {
        await create.mutateAsync(educationCreateFormToPayload(values, "create"));
        form.reset(educationCreateFormDefaults);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    }
  }

  function handleClearOrCancel() {
    if (isEditing) {
      onCancelEdit?.();
    } else {
      form.reset(educationCreateFormDefaults);
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
              Editing <span className="font-semibold text-primary">{editing?.institution}</span>. Save to
              apply changes or cancel to stop editing.
            </p>
          ) : null}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <AdminRhfInput
              control={form.control}
              name="institution"
              label="Institution (where you studied)"
              requiredMark
              placeholder="e.g. Tbilisi State University"
              autoComplete="organization"
            />
            <AdminRhfInput
              control={form.control}
              name="degree"
              label="Degree"
              placeholder="e.g. Bachelor's in Computer Science"
            />
            <AdminRhfInput
              control={form.control}
              name="fieldOfStudy"
              label="Field of study"
              placeholder="e.g. Software Engineering"
            />
            <AdminRhfInput
              control={form.control}
              name="location"
              label="Location"
              placeholder="City or country — optional"
            />
          </div>

          <FieldSeparator className="my-1 bg-surface-variant/40">Timeline</FieldSeparator>

          <AdminRhfCheckbox control={form.control} name="current" label="Currently studying" />

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
              End date is not required while you are still studying here.
            </p>
          ) : null}

          <FieldSeparator className="my-1 bg-surface-variant/40">Details</FieldSeparator>

          <AdminRhfTextarea control={form.control} name="description" label="Description" rows={4} />
          <AdminRhfCheckbox control={form.control} name="featured" label="Featured on portfolio" />

          <FieldSeparator className="my-1 bg-surface-variant/40">Skills</FieldSeparator>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-on-surface">Skills learned during this period</p>
                <p className="text-xs text-on-surface-variant">
                  Link technologies you studied or practiced at this institution.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="h-10 gap-2 rounded-xl"
                onClick={() => setPickerOpen(true)}
              >
                <MaterialSymbol name="add" className="text-[18px]" />
                Add skills
              </Button>
            </div>
            <ProjectLinkedSkills
              skills={linkedSkills}
              onRemove={(id) =>
                form.setValue(
                  "skillIds",
                  skillIds.filter((x) => x !== id),
                  { shouldDirty: true },
                )
              }
            />
            {linkedSkills.length === 0 ? (
              <p className="rounded-xl border border-dashed border-outline-variant/45 bg-surface-container-low/35 px-3 py-3 text-center text-xs text-on-surface-variant">
                No skills linked yet — pick from your catalog.
              </p>
            ) : null}
          </div>

          <ProjectSkillPickerDialog
            open={pickerOpen}
            onOpenChange={setPickerOpen}
            selectedIds={skillIds}
            title="Skills for this education"
            description="Select what you learned during this study period. They will show on the public education card."
            onConfirm={(ids) => {
              form.setValue("skillIds", ids, { shouldDirty: true });
              setPickerOpen(false);
            }}
          />

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
                  Update education
                  <MaterialSymbol name="save" className="text-[18px]" />
                </>
              ) : (
                <>
                  Save education
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