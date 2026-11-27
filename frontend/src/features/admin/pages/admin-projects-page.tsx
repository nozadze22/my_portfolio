"use client";

import { useMemo, useState } from "react";
import Wrapper from "@/components/shared/wrapper";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { AdminPageChrome } from "@/features/admin/layout/admin-console-layout";
import { ProjectCreateForm } from "@/features/projects/components/admin/project-create-form";
import { ProjectEditDialog } from "@/features/projects/components/admin/project-edit-dialog";
import { ProjectAdminRow } from "@/features/projects/components/admin/project-admin-row";
import { useDeleteProjectEntry, useGetProjects, useUpdateProjectEntry } from "@/features/projects/hooks/projects";
import type { Project } from "@/features/projects/schema/project_schema";

const EMPTY_PROJECTS: Project[] = [];

export function AdminProjectsPage() {
  const { data, isLoading, isError } = useGetProjects({ limit: 50, page: 1 });
  const removeProject = useDeleteProjectEntry();
  const updateEntry = useUpdateProjectEntry();
  const projects = data?.data ?? EMPTY_PROJECTS;
  const total = data?.meta.total ?? projects.length;
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  }, [projects, search]);

  function onDelete(id: string) {
    if (!confirm("Delete this project?")) return;
    removeProject.mutate(id);
  }

  function toggleFeatured(project: Project) {
    updateEntry.mutate({ id: project.id, data: { featured: !project.featured } });
  }

  const busy = removeProject.isPending || updateEntry.isPending;

  return (
    <AdminPageChrome
      breadcrumb={["Admin Console", "Content", "Projects"]}
      title="Projects & case studies"
      description={`Create and publish portfolio projects — ${total} in API. Featured items appear on the home page.`}
    >
      <Wrapper variant="admin" className="flex w-full max-w-page flex-col gap-space-xl px-0 sm:px-0 lg:px-0">
      <div className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-sm shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-md">
          <MaterialSymbol name="search" className="absolute left-3 top-2.5 text-[20px] text-outline" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, slug, description…"
            className="w-full rounded-lg bg-surface-container-low py-2 pl-10 pr-space-md font-body-sm text-body-sm placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-1 rounded-lg bg-primary-container px-space-md py-2 font-body-sm text-body-sm font-semibold text-on-primary"
        >
          <MaterialSymbol name={showForm ? "expand_less" : "add"} className="text-[18px]" />
          {showForm ? "Hide form" : "New project"}
        </button>
      </div>

      {showForm ? <ProjectCreateForm /> : null}

      <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
        <div className="flex items-center justify-between bg-surface-container-low px-space-md py-space-sm">
          <span className="font-label-badge text-label-badge uppercase tracking-wider text-on-surface-variant">
            Active projects ({filtered.length})
          </span>
        </div>
        {isLoading ? (
          <p className="p-space-md text-sm text-on-surface-variant">Loading projects…</p>
        ) : isError ? (
          <p className="p-space-md text-sm text-destructive">Could not load projects.</p>
        ) : (
          <CardList>
            {filtered.map((project, index) => (
              <ProjectAdminRow
                key={project.id}
                project={project}
                index={index + 1}
                busy={busy}
                onDelete={() => onDelete(project.id)}
                onToggleFeatured={() => toggleFeatured(project)}
                onEdit={() => setEditing(project)}
              />
            ))}
            {filtered.length === 0 ? (
              <p className="p-space-md text-center text-sm text-on-surface-variant">No projects match.</p>
            ) : null}
          </CardList>
        )}
      </div>
      </Wrapper>

      <ProjectEditDialog
        project={editing}
        open={editing !== null}
        onOpenChange={(open) => {
          if (!open) setEditing(null);
        }}
      />
    </AdminPageChrome>
  );
}

function CardList({ children }: { children: React.ReactNode }) {
  return <div className="divide-y divide-surface-variant">{children}</div>;
}