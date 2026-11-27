"use client";

import { MaterialSymbol } from "@/components/ui/material-symbol";
import { ProjectLinkedSkills } from "@/features/projects/components/admin/project-linked-skills";
import { cn } from "@/lib/utils";
import { formatEducationDates } from "../education-card";
import type { Education } from "../../schema/education.schema";

export function EducationAdminCard({
  edu,
  onEdit,
  onDelete,
  deleting,
  isEditing,
}: {
  edu: Education;
  onEdit: () => void;
  onDelete: () => void;
  deleting?: boolean;
  isEditing?: boolean;
}) {
  const period = formatEducationDates(edu) || "—";

  return (
    <article
      className={cn(
        "flex flex-col gap-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-sm transition-shadow hover:shadow-md",
        isEditing && "ring-2 ring-primary/40",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex gap-space-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-container-high text-primary">
            <MaterialSymbol name="school" className="text-[22px]" />
          </div>
          <div>
            <h4 className="font-headline-sm font-semibold">{edu.institution}</h4>
            <p className="text-sm font-medium text-primary">
              {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(" · ") || "—"}
            </p>
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
      <span className="font-label-code text-label-code text-on-surface-variant">{period}</span>
      {edu.description ? <p className="text-sm text-on-surface-variant">{edu.description}</p> : null}
      {edu.skills && edu.skills.length > 0 ? (
        <div className="mt-1">
          <ProjectLinkedSkills skills={edu.skills} readOnly />
        </div>
      ) : null}
    </article>
  );
}