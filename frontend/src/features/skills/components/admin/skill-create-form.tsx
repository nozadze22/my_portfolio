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
import { AdminRhfCheckbox, AdminRhfInput, adminInputClass } from "@/features/admin/components/admin-rhf-field";
import { cn } from "@/lib/utils";
import { SkillIconCover } from "../../components/skill-icon-cover";
import { CATEGORY_LABEL } from "../../components/skill-category-labels";
import {
  nextSkillSortOrder,
  resolveSkillIconUrl,
  slugifySkillName,
} from "../../lib/skill-form-auto";
import type { Skill } from "../../schema/skill.schema";
import { useCreateSkill, useSkills, useUpdateSkillEntry } from "../../hooks/skills";
import {
  skillCreateFormDefaults,
  skillCreateFormSchema,
  skillCreateFormToPayload,
  skillToFormValues,
  type SkillCreateFormValues,
} from "../../schema/skill-create-form.schema";
import { SKILL_CATALOG_CATEGORIES } from "../../schema/skill.schema";
const EMPTY_SKILLS: Skill[] = [];

type SkillCreateFormProps = {
  editing?: Skill | null;
  onCancelEdit?: () => void;
};

export function SkillCreateForm({ editing = null, onCancelEdit }: SkillCreateFormProps) {
  const isEditing = Boolean(editing);
  const create = useCreateSkill();
  const update = useUpdateSkillEntry();
  const { data: listData } = useSkills({ limit: 500 });
  const skills = listData?.data ?? EMPTY_SKILLS;
  const nextSort = useMemo(() => nextSkillSortOrder(skills), [skills]);

  const [error, setError] = useState<string | null>(null);

  const form = useForm<SkillCreateFormValues>({
    resolver: zodResolver(skillCreateFormSchema),
    defaultValues: skillCreateFormDefaults,
    mode: "onTouched",
  });

  useEffect(() => {
    if (editing) {
      form.reset(skillToFormValues(editing));
    } else {
      form.reset(skillCreateFormDefaults);
    }
    setError(null);
  }, [editing, form]);

  const name = form.watch("name");
  const category = form.watch("category");
  const previewSlug = slugifySkillName(name);
  const previewIconUrl = name.trim()
    ? resolveSkillIconUrl(name) ?? editing?.iconUrl
    : editing?.iconUrl;
  const categoryMeta = CATEGORY_LABEL[category];

  async function onSubmit(values: SkillCreateFormValues) {
    setError(null);
    try {
      if (editing) {
        await update.mutateAsync({
          id: editing.id,
          data: skillCreateFormToPayload(values, "update"),
        });
        onCancelEdit?.();
        form.reset(skillCreateFormDefaults);
      } else {
        await create.mutateAsync(skillCreateFormToPayload(values, "create", nextSort));
        form.reset(skillCreateFormDefaults);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    }
  }

  function handleClearOrCancel() {
    if (isEditing) {
      onCancelEdit?.();
    } else {
      form.reset(skillCreateFormDefaults);
    }
    setError(null);
  }

  const pending = form.formState.isSubmitting || create.isPending || update.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FieldGroup className="gap-6">
          {isEditing ? (
            <p className="rounded-xl border border-primary/25 bg-primary/5 px-3 py-2 text-sm text-on-surface">
              Editing <span className="font-semibold text-primary">{editing?.name}</span>. Slug and icon
              refresh from the name when you save.
            </p>
          ) : null}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_min(100%,17rem)] lg:items-start">
            <div className="space-y-5">
              <AdminRhfInput
                control={form.control}
                name="name"
                label="Skill name"
                requiredMark
                placeholder="e.g. JavaScript"
                autoComplete="off"
              />

              <div className="rounded-xl border border-surface-variant/60 bg-surface-container-low/40 px-4 py-3">
                <p className="font-label-code text-[11px] uppercase tracking-wider text-on-surface-variant">Auto slug</p>
                <p className="mt-1 font-mono text-sm text-on-surface">{previewSlug || editing?.slug || "—"}</p>
                <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">
                  Slug and icon are created from the name — you don’t enter them manually.
                </p>
              </div>

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="max-w-md">
                    <FormLabel className="font-body-sm text-body-sm text-on-surface">Category</FormLabel>
                    <FormControlInput>
                      <select {...field} className={cn(adminInputClass, "w-full cursor-pointer")}>
                        {SKILL_CATALOG_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {CATEGORY_LABEL[cat].title}
                          </option>
                        ))}
                      </select>
                    </FormControlInput>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isEditing ? (
                <FormField
                  control={form.control}
                  name="sortOrder"
                  render={({ field }) => (
                    <FormItem className="max-w-xs">
                      <FormLabel className="font-body-sm text-body-sm text-on-surface">
                        List order<span className="text-destructive"> *</span>
                      </FormLabel>
                      <FormControlInput>
                        <input
                          type="number"
                          min={0}
                          step={1}
                          className={adminInputClass}
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(e.target.value === "" ? 0 : e.target.valueAsNumber)
                          }
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControlInput>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <p className="text-xs text-on-surface-variant">
                  New skill will be listed at position{" "}
                  <strong className="text-on-surface">#{nextSort + 1}</strong> (sort order {nextSort}).
                </p>
              )}
            </div>

            <aside className="rounded-2xl border border-surface-variant/70 bg-surface-container-low p-space-md shadow-sm">
              <p className="mb-3 font-label-code text-[11px] uppercase tracking-wider text-on-surface-variant">
                Preview
              </p>
              <div className="flex items-center gap-3">
                <SkillIconCover
                  name={name.trim() || editing?.name || "?"}
                  category={category}
                  iconUrl={previewIconUrl}
                  color={editing?.color}
                  size="lg"
                />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-on-surface">{name.trim() || "Skill name"}</p>
                  <p className="text-xs text-on-surface-variant">{categoryMeta.title}</p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-on-surface-variant">
                {previewIconUrl
                  ? "Devicon logo when available; otherwise the cover above is used on the list."
                  : name.trim()
                    ? "No Devicon match — cover placeholder with initial is used."
                    : "Enter a name to see cover preview."}
              </p>
            </aside>
          </div>

          <FieldSeparator className="my-1 bg-surface-variant/40">Visibility</FieldSeparator>

          <AdminRhfCheckbox control={form.control} name="published" label="Published on portfolio" />

          {error ? (
            <p className="rounded-lg border border-destructive/25 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Button type="button" variant="outline" className="h-11 rounded-xl" onClick={handleClearOrCancel}>
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
                  Update skill
                  <MaterialSymbol name="save" className="text-[18px]" />
                </>
              ) : (
                <>
                  Save skill
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