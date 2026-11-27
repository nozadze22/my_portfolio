"use client";

import { EmptyHint } from "@/features/portfolio/components/empty-hint";
import { SectionHeader } from "@/features/portfolio/components/section-header";
import { SectionShell } from "@/features/portfolio/components/section-shell";
import { useGetProjects } from "../hooks/projects";
import { ProjectCard } from "./project-card";

export function ProjectsSection() {
  const { data, isLoading, isError } = useGetProjects({
    limit: 12,
    featured: undefined,
  });

  const projects = data?.data ?? [];

  return (
    <SectionShell id="projects" className="bg-surface-container-low">
      <SectionHeader
        badge="Case studies"
        title="Projects & products"
        description="Real work from your API — featured flag, skills, and links to demo or repo."
        align="left"
      />
      {isLoading ? (
        <p className="text-on-surface-variant">Loading projects…</p>
      ) : isError || projects.length === 0 ? (
        <EmptyHint
          icon="folder_open"
          title="No projects yet"
          hint="Create projects via POST /projects and attach skillIds from your catalog."
        />
      ) : (
        <div className="grid grid-cols-1 gap-space-lg md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </SectionShell>
  );
}