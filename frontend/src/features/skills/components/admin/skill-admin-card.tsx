"use client";

import { MaterialSymbol } from "@/components/ui/material-symbol";
import { cn } from "@/lib/utils";
import { SkillIconCover } from "../../components/skill-icon-cover";
import { CATEGORY_LABEL } from "../../components/skill-category-labels";
import type { Skill } from "../../schema/skill.schema";

export function SkillAdminCard({
  skill,
  onEdit,
  onDelete,
  deleting,
  isEditing,
}: {
  skill: Skill;
  onEdit: () => void;
  onDelete: () => void;
  deleting?: boolean;
  isEditing?: boolean;
}) {
  const meta = CATEGORY_LABEL[skill.category];

  return (
    <article
      className={cn(
        "flex flex-col gap-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-sm transition-shadow hover:shadow-md",
        isEditing && "ring-2 ring-primary/40",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex gap-space-sm">
          <SkillIconCover
            name={skill.name}
            category={skill.category}
            iconUrl={skill.iconUrl}
            color={skill.color}
            size="md"
          />
          <div>
            <h4 className="font-headline-sm font-semibold">{skill.name}</h4>
            <p className="text-sm text-on-surface-variant">
              {meta.title}
              <span className="font-label-code text-label-code"> · {skill.slug}</span>
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
      <div className="flex flex-wrap items-center gap-2">
        {skill.published ? (
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
            Published
          </span>
        ) : (
          <span className="rounded-full bg-surface-container-high px-2 py-0.5 text-xs text-on-surface-variant">
            Draft
          </span>
        )}
        <span className="font-label-code text-label-code text-on-surface-variant">
          Order {skill.sortOrder}
        </span>
      </div>
    </article>
  );
}