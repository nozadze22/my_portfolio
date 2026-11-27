"use client";

import { MaterialSymbol } from "@/components/ui/material-symbol";
import { Button } from "@/components/ui/button";
import { SkillIconCover } from "@/features/skills/components/skill-icon-cover";
import { CATEGORY_LABEL } from "@/features/skills/components/skill-category-labels";
import type { SkillOption } from "@/features/skills/schema/skill.schema";

export function ProjectLinkedSkills({
  skills,
  onRemove,
  readOnly = false,
}: {
  skills: SkillOption[];
  onRemove?: (id: string) => void;
  readOnly?: boolean;
}) {
  if (!skills?.length) return null;

  return (
    <ul className="flex flex-wrap gap-2">
      {skills.map((skill) => {
        const meta = CATEGORY_LABEL[skill.category];
        return (
          <li
            key={skill.id}
            className="inline-flex max-w-full items-center gap-2 rounded-full border border-surface-variant/70 bg-surface-container-low/50 py-1 pl-1.5 pr-1"
          >
            <SkillIconCover
              name={skill.name}
              category={skill.category}
              iconUrl={skill.iconUrl}
              color={skill.color}
              size="sm"
              rounded="full"
            />
            <span className="truncate text-sm font-medium text-on-surface">{skill.name}</span>
            <span className="hidden text-xs text-on-surface-variant sm:inline">{meta.title}</span>
            {readOnly ? null : (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                title="Remove"
                className="h-7 w-7 shrink-0 text-outline hover:text-destructive"
                onClick={() => onRemove?.(skill.id)}
              >
                <MaterialSymbol name="close" className="text-[16px]" />
              </Button>
            )}
          </li>
        );
      })}
    </ul>
  );
}