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
import { CATEGORY_LABEL } from "@/features/skills/components/skill-category-labels";
import { SkillIconCover } from "@/features/skills/components/skill-icon-cover";
import { useSkills } from "@/features/skills/hooks/skills";
import type { SkillOption } from "@/features/skills/schema/skill.schema";
import { cn } from "@/lib/utils";

function SkillPickerSkeleton() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <li
          key={i}
          className="flex flex-col items-center gap-2 rounded-2xl border border-border/60 bg-surface p-4"
        >
          <div className="h-14 w-14 animate-pulse rounded-2xl bg-muted" />
          <div className="h-4 w-20 animate-pulse rounded-md bg-muted" />
          <div className="h-3 w-16 animate-pulse rounded-md bg-muted" />
        </li>
      ))}
    </ul>
  );
}

type ProjectSkillPickerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIds?: string[];
  onConfirm: (ids: string[]) => void;
  title?: string;
  description?: string;
};

type ProjectSkillPickerBodyProps = {
  selectedIds: string[];
  catalog: SkillOption[];
  isLoading: boolean;
  isError: boolean;
  title: string;
  description: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: (ids: string[]) => void;
};

function ProjectSkillPickerBody({
  selectedIds,
  catalog,
  isLoading,
  isError,
  title,
  description,
  onOpenChange,
  onConfirm,
}: ProjectSkillPickerBodyProps) {
  const [draftIds, setDraftIds] = useState(selectedIds);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return catalog;
    return catalog.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.slug.toLowerCase().includes(q) ||
        CATEGORY_LABEL[s.category].title.toLowerCase().includes(q),
    );
  }, [catalog, search]);

  function toggle(id: string) {
    setDraftIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function clearSelection() {
    setDraftIds([]);
  }

  return (
    <>
      <div className="relative border-b border-border/70 bg-gradient-to-br from-primary-container/35 via-surface to-surface px-5 pb-5 pt-6 sm:px-8 sm:pb-6 sm:pt-7">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-on-primary shadow-sm">
            <MaterialSymbol name="psychology" className="text-[26px]" />
          </div>
          <div className="min-w-0 flex-1 space-y-1 pr-8">
            <DialogTitle className="font-heading text-xl font-semibold tracking-tight text-on-surface sm:text-2xl">
              {title}
            </DialogTitle>
            <DialogDescription className="max-w-xl text-sm leading-relaxed text-on-surface-variant">
              {description}
            </DialogDescription>
          </div>
        </div>

        <IconInput
          symbol="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, slug, or category…"
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

      <div className="min-h-[min(20rem,42vh)] flex-1 overflow-y-auto bg-surface-container-lowest/50 px-4 py-4 sm:px-6 sm:py-5">
        {isLoading ? (
          <SkillPickerSkeleton />
        ) : isError ? (
          <div className="flex min-h-[16rem] flex-col items-center justify-center gap-3 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <MaterialSymbol name="cloud_off" className="text-[32px]" />
            </div>
            <p className="text-base font-medium text-on-surface">Could not load skills</p>
          </div>
        ) : catalog.length === 0 ? (
          <div className="flex min-h-[16rem] flex-col items-center justify-center gap-4 px-4 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-surface-container-high">
              <MaterialSymbol name="hub" className="text-[40px] text-outline" />
            </div>
            <p className="text-lg font-semibold text-on-surface">No skills in catalog</p>
            <Link
              to="/admin/dashboard/skills"
              className={cn(buttonVariants({ variant: "default" }), "h-10 gap-2 rounded-xl")}
            >
              Go to Skills
              <MaterialSymbol name="arrow_forward" className="text-[18px]" />
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex min-h-[12rem] flex-col items-center justify-center gap-2 text-center">
            <MaterialSymbol name="manage_search" className="text-[40px] text-outline" />
            <p className="text-base font-medium text-on-surface">No matches</p>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((skill) => {
              const checked = draftIds.includes(skill.id);
              const meta = CATEGORY_LABEL[skill.category];
              return (
                <li key={skill.id}>
                  <button
                    type="button"
                    onClick={() => toggle(skill.id)}
                    className={cn(
                      "group relative flex w-full flex-col items-center gap-2 rounded-2xl border bg-surface px-3 pb-4 pt-4 text-center shadow-sm transition-all",
                      "hover:border-primary/35 hover:shadow-md",
                      checked ? "border-primary ring-2 ring-primary/30" : "border-border/70",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg border shadow-sm transition-colors",
                        checked
                          ? "border-primary bg-primary text-on-primary"
                          : "border-border/80 bg-surface/95 text-transparent group-hover:text-outline",
                      )}
                    >
                      <MaterialSymbol name="check" className="text-[18px]" />
                    </span>
                    <SkillIconCover
                      name={skill.name}
                      category={skill.category}
                      iconUrl={skill.iconUrl}
                      color={skill.color}
                      size="lg"
                      rounded="xl"
                    />
                    <span className="min-w-0 w-full px-1">
                      <span className="block truncate text-sm font-semibold text-on-surface">
                        {skill.name}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-on-surface-variant">
                        {meta.title}
                      </span>
                    </span>
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
            ? "Pick one or more skills, then confirm."
            : `${draftIds.length} skill${draftIds.length === 1 ? "" : "s"} will be linked.`}
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
              onConfirm(draftIds);
              onOpenChange(false);
            }}
          >
            <MaterialSymbol name="add_link" className="text-[18px]" />
            Link {draftIds.length > 0 ? draftIds.length : ""} skill
            {draftIds.length === 1 ? "" : "s"}
          </Button>
        </div>
      </DialogFooter>
    </>
  );
}

export function ProjectSkillPickerDialog({
  open,
  onOpenChange,
  selectedIds = [],
  onConfirm,
  title = "Add skills to project",
  description = "Choose technologies from your catalog. Selected skills appear on the form and link when you save the project.",
}: ProjectSkillPickerDialogProps) {
  const { data, isLoading, isError } = useSkills({ limit: 200, published: true });
  const catalog = useMemo(() => (data?.data ?? []) as SkillOption[], [data?.data]);

  const sessionKey = open ? selectedIds.join("\0") : "closed";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className={cn(
          "flex max-h-[min(92vh,52rem)] w-[min(56rem,calc(100vw-1.5rem))] max-w-none flex-col gap-0 overflow-hidden p-0",
          "rounded-2xl border-0 shadow-2xl ring-1 ring-foreground/8 sm:max-w-none",
        )}
      >
        {open ? (
          <ProjectSkillPickerBody
            key={sessionKey}
            selectedIds={selectedIds}
            catalog={catalog}
            isLoading={isLoading}
            isError={isError}
            title={title}
            description={description}
            onOpenChange={onOpenChange}
            onConfirm={onConfirm}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}