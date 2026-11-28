"use client";

import { EmptyHint } from "@/features/portfolio/components/empty-hint";
import { SectionHeader } from "@/features/portfolio/components/section-header";
import { SectionShell } from "@/features/portfolio/components/section-shell";
import { useExperiences } from "../hooks/experience";
import { ExperienceCard } from "./experience-card";

export function ExperienceSection() {
  const { data, isLoading, isError } = useExperiences({ limit: 20 });
  const items = data?.data ?? [];

  return (
    <SectionShell id="experience" className="bg-surface-container-lowest" containerClassName="max-w-5xl">
      <SectionHeader
        badge="Journey"
        title="Professional experience"
        description="Roles, companies, and skills applied in production."
      />
      {isLoading ? (
        <p className="text-center text-on-surface-variant">Loading experience…</p>
      ) : isError || items.length === 0 ? (
        <EmptyHint
          icon="work_history"
          title="No experience entries"
          hint="Add roles with POST /experience and link skills with skillIds."
        />
      ) : (
        <div className="relative ml-4 space-y-space-xl border-l-2 border-surface-variant pl-6 md:ml-32 md:pl-10">
          {items.map((exp, index) => (
            <ExperienceCard key={exp.id} exp={exp} accent={index === 0} />
          ))}
        </div>
      )}
    </SectionShell>
  );
}