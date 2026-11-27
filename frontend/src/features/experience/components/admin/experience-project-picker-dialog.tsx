"use client";

import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { IconInput } from "@/components/shared/icon-input";
import { useGetProjects } from "@/features/projects/hooks/projects";
import type { Project } from "@/features/projects/schema/project_schema";
import { projectPublicHref, projectThumbnail } from "../../lib/project-display";
import { cn } from "@/lib/utils";

type ExperienceProjectPickerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIds: string[];
  onConfirm: (ids: string[], projects: Project[]) => void;
};

function ProjectPickerSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-border/60 bg-surface-container-lowest"
        >
          <div className="aspect-[16/10] animate-pulse bg-muted" />
          <div className="space-y-2 p-3">
            <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted" />
            <div className="h-3 w-1/2 animate-pulse rounded-md bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

type ExperienceProjectPickerBodyProps = {
  selectedIds: string[];
  projects: Project[];
  isLoading: boolean;
  isError: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (ids: string[], projects: Project[]) => void;
};

function ExperienceProjectPickerBody({
  selectedIds,
  projects,
  isLoading,
  isError,
  onOpenChange,
  onConfirm,
}: ExperienceProjectPickerBodyProps) {
  const [draftIds, setDraftIds] = useState(selectedIds);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  }, [projects, search]);

  const selectedProjects = useMemo(
    () => projects.filter((p) => draftIds.includes(p.id)),
    [projects, draftIds],
  );

  function toggle(id: string) {
    setDraftIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function clearSelection() {
    setDraftIds([]);
  }

  return (
    <>
      <div className="relative border-b border-border/70 bg-gradient-to-br from-primary-container/35 via-surface to-surface px-5 pb-5 pt-6 sm:px-8 sm:pb-6 sm:pt-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-on-primary shadow-sm">
              <MaterialSymbol name="work" className="text-[26px]" />
            </div>
            <div className="min-w-0 space-y-1 pr-8">
              <DialogTitle className="font-heading text-xl font-semibold tracking-tight text-on-surface sm:text-2xl">
                Link portfolio projects
              </DialogTitle>
              <DialogDescription className="max-w-2xl text-sm leading-relaxed text-on-surface-variant">
                Choose the projects you worked on during this role. They appear on the form with
                preview, link, and connect when you save experience.
              </DialogDescription>
            </div>
          </div>
        </div>

        <IconInput
          symbol="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, slug, or description…"
          className="mt-5 h-11 rounded-xl border-border/80 bg-surface/90 shadow-sm backdrop-blur-sm"
        />

        {draftIds.length > 0 ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/12 px-3 py-1 text-xs font-medium text-primary">
              <MaterialSymbol name="check_circle" className="text-[16px]" />
              {draftIds.length} selected
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 rounded-lg text-xs text-on-surface-variant hover:text-destructive"
              onClick={clearSelection}
            >
              Clear all
            </Button>
          </div>
        ) : null}
      </div>

      <div className="min-h-[min(22rem,45vh)] flex-1 overflow-y-auto bg-surface-container-lowest/50 px-4 py-4 sm:px-6 sm:py-5">
        {isLoading ? (
          <ProjectPickerSkeleton />
        ) : isError ? (
          <div className="flex min-h-[18rem] flex-col items-center justify-center gap-3 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <MaterialSymbol name="cloud_off" className="text-[32px]" />
            </div>
            <p className="text-base font-medium text-on-surface">Could not load projects</p>
            <p className="max-w-sm text-sm text-on-surface-variant">
              Check your connection and try again.
            </p>
          </div>
        ) : projects.length === 0 ? (
          <div className="flex min-h-[18rem] flex-col items-center justify-center gap-4 px-4 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-surface-container-high">
              <MaterialSymbol name="folder_open" className="text-[40px] text-outline" />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-on-surface">No projects yet</p>
              <p className="max-w-md text-sm leading-relaxed text-on-surface-variant">
                Create projects in the admin dashboard first, then come back to link them to this
                experience.
              </p>
            </div>
            <Link
              to="/admin/dashboard/projects"
              className={cn(buttonVariants({ variant: "default" }), "h-10 gap-2 rounded-xl")}
            >
              Go to Projects
              <MaterialSymbol name="arrow_forward" className="text-[18px]" />
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex min-h-[14rem] flex-col items-center justify-center gap-2 text-center">
            <MaterialSymbol name="manage_search" className="text-[40px] text-outline" />
            <p className="text-base font-medium text-on-surface">No matches</p>
            <p className="text-sm text-on-surface-variant">Try a different search term.</p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((project) => {
              const checked = draftIds.includes(project.id);
              const thumb = projectThumbnail(project);
              const href = projectPublicHref(project);
              return (
                <li key={project.id}>
                  <button
                    type="button"
                    onClick={() => toggle(project.id)}
                    className={cn(
                      "group flex h-full w-full flex-col overflow-hidden rounded-2xl border bg-surface text-left shadow-sm transition-all",
                      "hover:border-primary/35 hover:shadow-md",
                      checked ? "border-primary ring-2 ring-primary/30" : "border-border/70",
                    )}
                  >
                    <div className="relative aspect-[16/10] w-full bg-surface-container-high">
                      {thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={thumb}
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <MaterialSymbol name="image" className="text-[36px] text-outline" />
                        </div>
                      )}
                      <span
                        className={cn(
                          "absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-lg border shadow-sm transition-colors",
                          checked
                            ? "border-primary bg-primary text-on-primary"
                            : "border-border/80 bg-surface/95 text-transparent group-hover:text-outline",
                        )}
                      >
                        <MaterialSymbol name="check" className="text-[18px]" />
                      </span>
                    </div>
                    <h3 className="line-clamp-2 px-3 pt-3 text-sm font-semibold leading-snug text-on-surface">
                      {project.title}
                    </h3>
                    <p className="mt-1 px-3 pb-3 text-xs text-on-surface-variant">
                      {href ? (
                        <span className="line-clamp-1">{href.replace(/^https?:\/\//, "")}</span>
                      ) : (
                        <span className="line-clamp-1">/{project.slug}</span>
                      )}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <DialogFooter className="mx-0 mb-0 flex-col gap-3 border-t border-border/70 bg-surface px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-5">
        <p className="text-left text-sm text-on-surface-variant">
          {draftIds.length === 0
            ? "Pick one or more projects, then confirm."
            : `${draftIds.length} project${draftIds.length === 1 ? "" : "s"} will be linked.`}
        </p>
        <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-xl sm:min-w-[7rem]"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="h-11 min-w-[10rem] gap-2 rounded-xl bg-primary-container font-semibold text-on-primary shadow-sm hover:bg-primary"
            onClick={() => {
              onConfirm(draftIds, selectedProjects);
              onOpenChange(false);
            }}
          >
            <MaterialSymbol name="add_link" className="text-[18px]" />
            Link {draftIds.length > 0 ? draftIds.length : ""} project
            {draftIds.length === 1 ? "" : "s"}
          </Button>
        </div>
      </DialogFooter>
    </>
  );
}

export function ExperienceProjectPickerDialog({
  open,
  onOpenChange,
  selectedIds,
  onConfirm,
}: ExperienceProjectPickerDialogProps) {
  const { data, isLoading, isError } = useGetProjects({ page: 1, limit: 50 });
  const projects = useMemo(() => data?.data ?? [], [data?.data]);

  const sessionKey = open ? selectedIds.join("\0") : "closed";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className={cn(
          "flex max-h-[min(92vh,52rem)] w-[min(72rem,calc(100vw-1.5rem))] max-w-none flex-col gap-0 overflow-hidden p-0",
          "rounded-2xl border-0 shadow-2xl ring-1 ring-foreground/8 sm:max-w-none",
        )}
      >
        {open ? (
          <ExperienceProjectPickerBody
            key={sessionKey}
            selectedIds={selectedIds}
            projects={projects}
            isLoading={isLoading}
            isError={isError}
            onOpenChange={onOpenChange}
            onConfirm={onConfirm}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}