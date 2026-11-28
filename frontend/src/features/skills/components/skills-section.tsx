"use client";

import { EmptyHint } from "@/features/portfolio/components/empty-hint";
import { SectionHeader } from "@/features/portfolio/components/section-header";
import { SectionShell } from "@/features/portfolio/components/section-shell";
import { SKILL_CATALOG_CATEGORIES } from "../schema/skill.schema";
import { mergeOptionsByCategory } from "../lib/skill-catalog-groups";
import { useSkillOptions } from "../hooks/skills";
import { SkillCategoryCard } from "./skill-category-card";

export function SkillsSection() {
  const { data, isLoading, isError } = useSkillOptions();
  const byCategory = data?.byCategory ? mergeOptionsByCategory(data.byCategory) : undefined;

  return (
    <SectionShell id="skills" className="bg-surface-container-lowest">
      <SectionHeader
        badge="Toolkit"
        title="Technical skills"
        description="Grouped by category — select the same catalog when linking projects and experience."
      />
      {isLoading ? (
        <p className="text-center text-on-surface-variant">Loading skills…</p>
      ) : isError ||
        !byCategory ||
        !SKILL_CATALOG_CATEGORIES.some((c) => (byCategory[c]?.length ?? 0) > 0) ? (
        <EmptyHint
          icon="build"
          title="No skills yet"
          hint="Add skills with POST /skills, then attach them to projects via skillIds."
        />
      ) : (
        <div className="grid gap-space-lg md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {SKILL_CATALOG_CATEGORIES.map((category) => {
            const items = byCategory[category];
            if (!items?.length) return null;
            return <SkillCategoryCard key={category} category={category} items={items} />;
          })}
        </div>
      )}
    </SectionShell>
  );
}