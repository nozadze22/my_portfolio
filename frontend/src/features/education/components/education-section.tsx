"use client";

import { EmptyHint } from "@/features/portfolio/components/empty-hint";
import { SectionHeader } from "@/features/portfolio/components/section-header";
import { SectionShell } from "@/features/portfolio/components/section-shell";
import { useEducationList } from "../hooks/education";
import { EducationCard } from "./education-card";

export function EducationSection() {
  const { data, isLoading, isError } = useEducationList({ limit: 20 });
  const items = data?.data ?? [];

  return (
    <SectionShell id="education" className="bg-surface-container-low">
      <SectionHeader
        badge="Education"
        title="Studies & training"
        description="Formal education and programs — with linked skills from your catalog."
      />
      {isLoading ? (
        <p className="text-center text-on-surface-variant">Loading education…</p>
      ) : isError || items.length === 0 ? (
        <EmptyHint
          icon="school"
          title="No education records"
          hint="Add entries with POST /education and optional skillIds."
        />
      ) : (
        <div className="grid gap-space-lg md:grid-cols-2">
          {items.map((edu) => (
            <EducationCard key={edu.id} edu={edu} />
          ))}
        </div>
      )}
    </SectionShell>
  );
}