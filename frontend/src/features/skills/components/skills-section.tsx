"use client";

import { EmptyHint } from "@/features/portfolio/components/empty-hint";
import { SectionHeader } from "@/features/portfolio/components/section-header";
import { SectionShell } from "@/features/portfolio/components/section-shell";
import type { SkillCategory } from "../schema/skill.schema";
import { useSkillOptions } from "../hooks/skills";
import { SkillCategoryCard } from "./skill-category-card";

export function SkillsSection() {
  const { data, isLoading, isError } = useSkillOptions();
  const byCategory = data?.byCategory;

  return (
    <SectionShell id="skills" className="bg-surface-container-lowest">
      <SectionHeader
        badge="Toolkit"
        title="Technical skills"
        description="Grouped by category — select the same catalog when linking projects and experience."
      />
      {isLoading ? (
        <p className="text-center text-on-surface-variant">Loading skills…</p>
      ) : isError || !byCategory || Object.keys(byCategory).length === 0 ? (
        <EmptyHint
          icon="build"
          title="No skills yet"
          hint="Add skills with POST /skills, then attach them to projects via skillIds."
        />
      ) : (
        <div className="grid gap-space-lg md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {(Object.entries(byCategory) as [SkillCategory, { name: string }[]][]).map(
            ([category, items]) => (
              <SkillCategoryCard key={category} category={category} items={items} />
            ),
          )}
        </div>
      )}
    </SectionShell>
  );
}