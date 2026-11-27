"use client";

import { MaterialSymbol } from "@/components/ui/material-symbol";
import { getProjectTagLabels } from "../../lib/project-tags";
import type { Project } from "../../schema/project_schema";

export function ProjectAdminRow({
  project,
  index,
  onDelete,
  onToggleFeatured,
  onEdit,
  busy,
}: {
  project: Project;
  index: number;
  onDelete: () => void;
  onToggleFeatured: () => void;
  onEdit: () => void;
  busy?: boolean;
}) {
  const tags = getProjectTagLabels(project);

  return (
    <article className="flex flex-col justify-between gap-space-md p-space-md transition-colors hover:bg-surface-container-low/40 lg:flex-row lg:items-center">
      <div className="flex min-w-0 items-start gap-space-md">
        <div className="flex h-16 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-container shadow-sm">
          {project.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={project.imageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <MaterialSymbol name="image" className="text-outline" />
          )}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="truncate font-headline-sm text-headline-sm font-semibold">{project.title}</h4>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-label-badge text-[11px] text-emerald-800">
              published
            </span>
            {project.featured ? (
              <span className="rounded-full bg-surface-container-high px-2 py-0.5 font-label-badge text-label-badge text-primary">
                featured
              </span>
            ) : null}
            <span className="font-label-code text-label-code text-outline">#{index}</span>
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-on-surface-variant">{project.description}</p>
          <div className="mt-2 flex flex-wrap gap-1 font-label-code text-[11px] text-on-surface-variant">
            {tags.slice(0, 6).map((t) => (
              <span key={t} className="rounded bg-surface-container-low px-1.5 py-0.5">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
      <ProjectRowActions
        onToggleFeatured={onToggleFeatured}
        onEdit={onEdit}
        onDelete={onDelete}
        featured={project.featured}
        disabled={busy}
      />
    </article>
  );
}

function ProjectRowActions({
  onToggleFeatured,
  onEdit,
  onDelete,
  featured,
  disabled,
}: {
  onToggleFeatured: () => void;
  onEdit: () => void;
  onDelete: () => void;
  featured: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="flex shrink-0 items-center gap-space-xs">
      <button
        type="button"
        title="Edit project"
        disabled={disabled}
        onClick={onEdit}
        className="rounded-lg bg-surface-container-low p-2 text-on-surface-variant transition-colors hover:text-primary disabled:opacity-50"
      >
        <MaterialSymbol name="edit" className="text-[20px]" />
      </button>
      <button
        type="button"
        title="Toggle featured"
        disabled={disabled}
        onClick={onToggleFeatured}
        className="rounded-lg bg-surface-container-low p-2 text-primary transition-colors hover:bg-surface-container disabled:opacity-50"
      >
        <MaterialSymbol name="star" fill={featured} className="text-[20px]" />
      </button>
      <button
        type="button"
        title="Delete"
        disabled={disabled}
        onClick={onDelete}
        className="rounded-lg bg-surface-container-low p-2 text-on-surface-variant transition-colors hover:text-error disabled:opacity-50"
      >
        <MaterialSymbol name="delete" className="text-[20px]" />
      </button>
    </div>
  );
}