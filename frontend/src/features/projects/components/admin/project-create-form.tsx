"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControlInput,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { siteTextareaClass } from "@/features/site/components/admin/form-styles";
import { ProjectAdminSiteField } from "./project-admin-site-field";
import { useCreateProject } from "@/features/projects/hooks/projects";
import {
  projectCreateFormDefaults,
  projectCreateFormSchema,
  type ProjectCreateFormValues,
} from "@/features/projects/schema/project-create-form.schema";
import { uploadProjectImages } from "@/features/uploads/api/uploads";
import { MultiImageUpload } from "./multi-image-upload";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { Button } from "@/components/ui/button";
import { useSkills } from "@/features/skills/hooks/skills";
import type { SkillOption } from "@/features/skills/schema/skill.schema";
import { ProjectLinkedSkills } from "./project-linked-skills";
import { ProjectSkillPickerDialog } from "./project-skill-picker-dialog";

export function ProjectCreateForm() {
  const createProject = useCreateProject();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ProjectCreateFormValues>({
    resolver: zodResolver(projectCreateFormSchema),
    defaultValues: projectCreateFormDefaults,
    mode: "onTouched",
  });

  const skillIds = form.watch("skillIds");
  const { data: skillsList } = useSkills({ limit: 200 });
  const linkedSkills = useMemo(() => {
    const all = (skillsList?.data ?? []) as SkillOption[];
    return skillIds
      .map((id) => all.find((s) => s.id === id))
      .filter((s): s is SkillOption => Boolean(s));
  }, [skillIds, skillsList?.data]);

  async function onSubmit(values: ProjectCreateFormValues) {
    setError(null);
    try {
      let galleryUrls: string[] | undefined;
      if (imageFiles.length > 0) {
        const uploaded = await uploadProjectImages(imageFiles);
        if (uploaded.storage === "local") {
          setError(
            "Images saved on server disk only. Configure R2 in backend .env (including R2_PUBLIC_BASE_URL), restart the API, and try again.",
          );
          return;
        }
        galleryUrls = uploaded.urls;
      }
      const slug = values.slug.trim().toLowerCase().replace(/\s+/g, "-");
      await createProject.mutateAsync({
        title: values.title.trim(),
        slug,
        description: values.description.trim(),
        subtitle: values.subtitle.trim() || undefined,
        demoUrl: values.demoUrl.trim() || undefined,
        repoUrl: values.repoUrl.trim() || undefined,
        featured: values.featured,
        galleryUrls,
        imageUrl: galleryUrls?.[0],
        ...(values.skillIds.length > 0 ? { skillIds: values.skillIds } : {}),
      });
      form.reset(projectCreateFormDefaults);
      setImageFiles([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    }
  }

  const pending = form.formState.isSubmitting || createProject.isPending;

  return (
    <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-md">
      <h2 className="mb-space-md font-headline-sm text-headline-sm text-on-surface">Create project</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="grid grid-cols-1 gap-space-md lg:grid-cols-2">
          <ProjectAdminSiteField control={form.control} name="title" label="Title" required />
          <ProjectAdminSiteField
            control={form.control}
            name="slug"
            label="Slug"
            placeholder="my-project"
            required
          />
          <ProjectAdminSiteField control={form.control} name="subtitle" label="Subtitle" />
          <ProjectAdminSiteField control={form.control} name="demoUrl" label="Demo URL" type="url" />
          <ProjectAdminSiteField control={form.control} name="repoUrl" label="Repo URL" type="url" />
          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2 space-y-0">
                <FormControlInput>
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-primary"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    onBlur={field.onBlur}
                    ref={field.ref}
                  />
                </FormControlInput>
                <FormLabel className="font-body-sm text-body-sm font-normal">Featured on portfolio</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="lg:col-span-2">
                <FormLabel>Description</FormLabel>
                <FormControlInput>
                  <Textarea
                    {...field}
                    rows={5}
                    required
                    className={cn(siteTextareaClass, "resize-y font-body-sm text-body-sm")}
                  />
                </FormControlInput>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-3 lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-on-surface">Skills & technologies</p>
                <p className="text-xs text-on-surface-variant">
                  Link items from your skills catalog to this project.
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
            {skillIds.length > 0 && linkedSkills.length === 0 ? (
              <p className="text-xs text-on-surface-variant">
                {skillIds.length} selected — reload if names do not appear.
              </p>
            ) : null}
          </div>

          <ProjectSkillPickerDialog
            open={pickerOpen}
            onOpenChange={setPickerOpen}
            selectedIds={skillIds}
            onConfirm={(ids) => form.setValue("skillIds", ids, { shouldDirty: true })}
          />

          <MultiImageUpload
            className="lg:col-span-2"
            label="Project photos"
            files={imageFiles}
            onChange={setImageFiles}
          />
          {error ? <p className="text-sm text-destructive lg:col-span-2">{error}</p> : null}
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-primary-container px-space-md py-2.5 font-semibold text-on-primary disabled:opacity-60 lg:col-span-2 lg:w-fit"
          >
            {pending ? "Saving…" : "Save project"}
          </button>
        </form>
      </Form>
    </div>
  );
}