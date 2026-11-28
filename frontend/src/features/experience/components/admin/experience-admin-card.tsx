"use client";

import { MaterialSymbol } from "@/components/ui/material-symbol";
import { formatEmploymentType } from "../../lib/employment-type-labels";
import { formatExperiencePeriod } from "../experience-utils";
import type { Experience } from "../../schema/experience.schema";

import { cn } from "@/lib/utils";

export function ExperienceAdminCard({
  exp,
  onEdit,
  onDelete,
  deleting,
  isEditing,
}: {
  exp: Experience;
  onEdit: () => void;
  onDelete: () => void;
  deleting?: boolean;
  isEditing?: boolean;
}) {
  const period = formatExperiencePeriod(exp) || "—";
  const workType = formatEmploymentType(exp.employmentType);

  return (
    <article
      className={cn(
        "rounded-xl bg-surface-container-lowest p-space-md shadow-sm transition-shadow hover:shadow-md",
        isEditing && "ring-2 ring-primary/40",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex gap-space-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-high text-primary">
            <MaterialSymbol name="work" className="text-[22px]" />
          </div>
          <div>
            <h4 className="font-headline-sm font-semibold">{exp.position}</h4>
            <p className="text-sm font-medium text-primary">
              {exp.company}
              {exp.location ? ` · ${exp.location}` : ""}
              {workType ? ` · ${workType}` : ""}
            </p>
            <span className="font-label-code text-label-code text-on-surface-variant">{period}</span>
          </div>
        </div>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            disabled={deleting}
            onClick={onEdit}
            className="rounded-lg bg-surface-container-low p-1.5 text-on-surface-variant hover:text-primary disabled:opacity-50"
            title="Edit"
          >
            <MaterialSymbol name="edit" className="text-[18px]" />
          </button>
          <button
            type="button"
            disabled={deleting}
            onClick={onDelete}
            className="rounded-lg bg-surface-container-low p-1.5 text-on-surface-variant hover:text-error disabled:opacity-50"
            title="Delete"
          >
            <MaterialSymbol name="delete" className="text-[18px]" />
          </button>
        </div>
      </div>
      <p className="mt-2 line-clamp-3 text-sm text-on-surface-variant">{exp.description}</p>
    </article>
  );
}