"use client";

import { MaterialSymbol } from "@/components/ui/material-symbol";
import type { SkillCategory, SkillOption } from "../schema/skill.schema";
import { SkillIconCover } from "./skill-icon-cover";
import { CATEGORY_LABEL } from "./skill-category-labels";

type SkillTagItem = Pick<SkillOption, "id" | "name" | "category" | "iconUrl" | "color">;

export function SkillCategoryCard({
  category,
  items,
}: {
  category: SkillCategory;
  items: SkillTagItem[];
}) {
  const meta = CATEGORY_LABEL[category] ?? CATEGORY_LABEL.OTHER;

  return (
    <div className="flex flex-col rounded-2xl border border-surface-variant bg-surface-container-lowest p-space-lg shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] transition-shadow hover:shadow-md">
      <div className="mb-space-md flex items-center gap-space-sm border-b border-surface-variant pb-space-sm">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container text-primary">
          <MaterialSymbol name={meta.icon} className="text-[20px]" />
        </div>
        <h3 className="font-headline-sm text-on-surface">{meta.title}</h3>
      </div>
      <SkillTags items={items} />
    </div>
  );
}

function SkillTags({ items }: { items: SkillTagItem[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((skill) => (
        <span
          key={skill.id}
          className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-surface-variant bg-surface-container-low py-1 pl-1 pr-2.5 font-label-code text-[12px] text-on-surface"
          style={skill.color ? { borderColor: skill.color, color: skill.color } : undefined}
        >
          {skill.iconUrl?.trim() ? (
            <SkillIconCover
              name={skill.name}
              category={skill.category}
              iconUrl={skill.iconUrl}
              color={skill.color}
              size="xs"
              rounded="full"
              className="shrink-0 border-0 bg-transparent"
            />
          ) : null}
          <span className="truncate">{skill.name}</span>
        </span>
      ))}
    </div>
  );
}