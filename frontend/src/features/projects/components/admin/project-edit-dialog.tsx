"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { FieldGroup, FieldSeparator } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { cn } from "@/lib/utils";
import {
  AdminRhfCheckbox,
  AdminRhfTextarea,
} from "@/features/admin/components/admin-rhf-field";
import { useUpdateProjectEntry } from "@/features/projects/hooks/projects";
import {
  projectCreateFormDefaults,
  projectCreateFormSchema,
  type ProjectCreateFormValues,
} from "@/features/projects/schema/project-create-form.schema";
import type { Project } from "@/features/projects/schema/project_schema";
import { uploadProjectImages } from "@/features/uploads/api/uploads";
import { useSkills } from "@/features/skills/hooks/skills";
import type { SkillOption } from "@/features/skills/schema/skill.schema";
import { ProjectLinkedSkills } from "./project-linked-skills";
import { ProjectSkillPickerDialog } from "./project-skill-picker-dialog";
import { MultiImageUpload } from "./multi-image-upload";
import { ProjectAdminSiteField } from "./project-admin-site-field";

const EMPTY_SKILL_IDS: string[] = [];

function valuesFromProject(project: Project): ProjectCreateFormValues {
  return {
    title: project.title,
    slug: project.slug,
    subtitle: project.subtitle ?? "",
    description: project.description,
    demoUrl: project.demoUrl ?? "",
    repoUrl: project.repoUrl ?? "",
    featured: project.featured,
    skillIds: project.skills?.map((s) => s.id) ?? [],
  };
}

function projectGalleryUrls(project: Project): string[] {
  if (project.galleryUrls?.length) return project.galleryUrls;
  return project.imageUrl ? [project.imageUrl] : [];
}

export function ProjectEditDialog({
  project,
  open,
  onOpenChange,
}: {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const updateProject = useUpdateProjectEntry();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ProjectCreateFormValues>({
    resolver: zodResolver(projectCreateFormSchema),
    defaultValues: projectCreateFormDefaults,
    mode: "onTouched",
  });

  useEffect(() => {
    if (open && project) {
      form.reset(valuesFromProject(project));
      setImageFiles([]);
      setError(null);
    }
  }, [open, project, form]);

  const skillIds = form.watch("skillIds") ?? EMPTY_SKILL_IDS;
  const { data: skillsList } = useSkills({ limit: 200 });
  const linkedSkills = useMemo(() => {
    const all = (skillsList?.data ?? []) as SkillOption[];
    return skillIds
      .map((id) => all.find((s) => s.id === id))
      .filter((s): s is SkillOption => Boolean(s));
  }, [skillIds, skillsList?.data]);

  const existingGallery = useMemo(
    () => (project ? projectGalleryUrls(project) : []),
    [project],
  );

  async function onSubmit(values: ProjectCreateFormValues) {
    if (!project) return;
    setError(null);
    try {
      let galleryUrls: string[] | undefined;
      let imageUrl: string | undefined;
      if (imageFiles.length > 0) {
        const uploaded = await uploadProjectImages(imageFiles);
        if (uploaded.storage === "local") {
          setError(
            "Images saved on server disk only. Set R2_PUBLIC_BASE_URL and R2 keys in backend .env, restart API, then upload again.",
          );
          return;
        }
        galleryUrls = [...existingGallery, ...uploaded.urls].slice(0, 12);
        imageUrl = galleryUrls[0];
      }
      const slug = values.slug.trim().toLowerCase().replace(/\s+/g, "-");
      await updateProject.mutateAsync({
        id: project.id,
        data: {
          title: values.title.trim(),
          slug,
          description: values.description.trim(),
          subtitle: values.subtitle.trim() || undefined,
          demoUrl: values.demoUrl.trim() || undefined,
          repoUrl: values.repoUrl.trim() || undefined,
          featured: values.featured,
          skillIds: values.skillIds,
          ...(galleryUrls ? { galleryUrls, imageUrl } : {}),
        },
      });
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
    }
  }

  const pending = form.formState.isSubmitting || updateProject.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className={cn(
          "flex max-h-[min(92vh,52rem)] w-[min(48rem,calc(100vw-1.5rem))] max-w-none flex-col gap-0 overflow-hidden p-0",
          "rounded-2xl border-0 shadow-2xl ring-1 ring-foreground/8 sm:max-w-none",
        )}
      >
        <div className="relative shrink-0 border-b border-border/70 bg-gradient-to-br from-primary-container/30 via-surface to-surface-container-lowest px-5 pb-5 pt-6 sm:px-8 sm:pb-6 sm:pt-7">
          <div className="flex gap-4 pr-8">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-on-primary shadow-sm">
              <MaterialSymbol name="edit_note" className="text-[26px]" />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <DialogTitle className="font-heading text-xl font-semibold tracking-tight text-on-surface sm:text-2xl">
                Edit project
              </DialogTitle>
              <DialogDescription className="max-w-xl text-sm leading-relaxed text-on-surface-variant">
                {project ? (
                  <>
                    Update details for{" "}
                    <span className="font-medium text-on-surface">{project.title}</span>. Changes appear on
                    your portfolio after you save.
                  </>
                ) : null}
              </DialogDescription>
            </div>
          </div>

          {project && (project.imageUrl || project.featured) ? (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {project.imageUrl ? (
                <div className="flex min-w-0 items-center gap-3 rounded-xl border border-surface-variant/60 bg-surface/90 p-2 pr-4 shadow-sm backdrop-blur-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.imageUrl}
                    alt=""
                    className="h-12 w-20 shrink-0 rounded-lg border border-surface-variant/40 object-cover"
                  />
                  <div className="min-w-0">
                    <p className="font-label-code text-[10px] uppercase tracking-wide text-on-surface-variant">
                      Cover
                    </p>
                    <p className="truncate text-sm font-medium text-on-surface">{project.slug}</p>
                  </div>
                </div>
              ) : null}
              {project.featured ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/12 px-3 py-1.5 text-xs font-medium text-primary">
                  <MaterialSymbol name="star" className="text-[16px]" />
                  Featured
                </span>
              ) : null}
            </div>
          ) : null}
        </div>

        {project ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex min-h-0 flex-1 flex-col">
              <div className="min-h-0 flex-1 overflow-y-auto bg-surface-container-lowest/40 px-5 py-5 sm:px-8 sm:py-6">
                <FieldGroup className="gap-5">
                  <FieldSeparator className="my-0 bg-surface-variant/40">Basics</FieldSeparator>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <ProjectAdminSiteField control={form.control} name="title" label="Title" required />
                    <ProjectAdminSiteField control={form.control} name="slug" label="Slug" required />
                    <div className="sm:col-span-2">
                      <ProjectAdminSiteField control={form.control} name="subtitle" label="Subtitle" />
                    </div>
                  </div>

                  <AdminRhfCheckbox
                    control={form.control}
                    name="featured"
                    label="Featured on portfolio"
                    itemClassName="sm:col-span-2"
                  />

                  <FieldSeparator className="my-0 bg-surface-variant/40">Links</FieldSeparator>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <ProjectAdminSiteField control={form.control} name="demoUrl" label="Demo URL" type="url" />
                    <ProjectAdminSiteField control={form.control} name="repoUrl" label="Repo URL" type="url" />
                  </div>

                  <FieldSeparator className="my-0 bg-surface-variant/40">Story</FieldSeparator>

                  <AdminRhfTextarea
                    control={form.control}
                    name="description"
                    label="Description"
                    rows={5}
                    itemClassName="w-full"
                    requiredMark
                  />

                  <FieldSeparator className="my-0 bg-surface-variant/40">Skills</FieldSeparator>

                  <div className="space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-on-surface">Skills & technologies</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-on-surface-variant">
                          Shown as tags on the portfolio project card.
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-10 shrink-0 gap-2 rounded-xl border-primary/25 bg-surface shadow-sm hover:bg-primary-container/20"
                        onClick={() => setPickerOpen(true)}
                      >
                        <MaterialSymbol name="psychology" className="text-[18px] text-primary" />
                        {skillIds.length > 0 ? "Edit skills" : "Add skills"}
                      </Button>
                    </div>

                    <div className="rounded-2xl border border-surface-variant/55 bg-surface-container-low/45 p-4">
                      {linkedSkills.length > 0 ? (
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
                      ) : skillIds.length > 0 ? (
                        <p className="py-2 text-center text-sm text-on-surface-variant">
                          {skillIds.length} selected — reload the catalog if names do not appear.
                        </p>
                      ) : (
                        <div className="flex flex-col items-center gap-2 py-6 text-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-container-high">
                            <MaterialSymbol name="hub" className="text-[26px] text-outline" />
                          </div>
                          <p className="text-sm font-medium text-on-surface">No skills linked</p>
                          <p className="max-w-xs text-xs text-on-surface-variant">
                            Pick from your catalog so visitors see the stack at a glance.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <ProjectSkillPickerDialog
                    open={pickerOpen}
                    onOpenChange={setPickerOpen}
                    selectedIds={skillIds}
                    onConfirm={(ids) => form.setValue("skillIds", ids, { shouldDirty: true })}
                  />

                  <FieldSeparator className="my-0 bg-surface-variant/40">Gallery</FieldSeparator>

                  <MultiImageUpload
                    files={imageFiles}
                    onChange={setImageFiles}
                    existingUrls={existingGallery}
                    label="Photos"
                    description={
                      imageFiles.length > 0
                        ? "New uploads replace the gallery on save."
                        : "Upload new images to replace the gallery; leave empty to keep the current cover."
                    }
                  />
                </FieldGroup>
              </div>

              <DialogFooter className="mx-0 mb-0 flex shrink-0 flex-col gap-3 border-t border-border/70 bg-surface px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-5">
                <div className="min-h-5 text-left text-sm">
                  {error ? (
                    <p className="flex items-center gap-1.5 text-destructive">
                      <MaterialSymbol name="error" className="text-[18px]" />
                      {error}
                    </p>
                  ) : (
                    <p className="text-on-surface-variant">
                      {form.formState.isDirty ? "Unsaved changes" : "All changes saved when you submit."}
                    </p>
                  )}
                </div>
                <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 rounded-xl sm:min-w-[7rem]"
                    onClick={() => onOpenChange(false)}
                    disabled={pending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={pending}
                    className="h-11 min-w-[10rem] gap-2 rounded-xl bg-primary-container font-semibold text-on-primary shadow-sm hover:bg-primary"
                  >
                    <MaterialSymbol name="save" className="text-[18px]" />
                    {pending ? "Saving…" : "Save changes"}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}