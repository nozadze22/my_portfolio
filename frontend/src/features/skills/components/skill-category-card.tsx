import { MaterialSymbol } from "@/components/ui/material-symbol";
import type { SkillCategory } from "../schema/skill.schema";
import { CATEGORY_LABEL } from "./skill-category-labels";

export function SkillCategoryCard({
  category,
  items,
}: {
  category: SkillCategory;
  items: { name: string; color?: string | null }[];
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

function SkillTags({ items }: { items: { name: string; color?: string | null }[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((skill) => (
        <span
          key={skill.name}
          className="rounded-full border border-surface-variant bg-surface-container-low px-3 py-1 font-label-code text-[12px] text-on-surface"
          style={skill.color ? { borderColor: skill.color, color: skill.color } : undefined}
        >
          {skill.name}
        </span>
      ))}
    </div>
  );
}