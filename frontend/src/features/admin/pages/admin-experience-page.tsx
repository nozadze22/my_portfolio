"use client";

import { useRef, useState } from "react";
import { AdminPageChrome } from "@/features/admin/layout/admin-console-layout";
import { AdminFullFormPage } from "@/features/admin/layout/admin-full-form-page";
import { ExperienceAdminCard } from "@/features/experience/components/admin/experience-admin-card";
import { ExperienceCreateForm } from "@/features/experience/components/admin/experience-create-form";
import { useDeleteExperience, useExperiences } from "@/features/experience/hooks/experience";
import type { Experience } from "@/features/experience/schema/experience.schema";

export function AdminExperiencePage() {
  const formAnchorRef = useRef<HTMLDivElement>(null);
  const [editing, setEditing] = useState<Experience | null>(null);
  const { data, isLoading, isError } = useExperiences({ limit: 50 });
  const remove = useDeleteExperience();
  const items = data?.data ?? [];
  const total = data?.meta.total ?? items.length;

  function startEdit(exp: Experience) {
    setEditing(exp);
    formAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <AdminPageChrome
      breadcrumb={["Admin Console", "Content", "Experience"]}
      title="Professional experience"
      description={`Jobs and roles — ${total} entr${total === 1 ? "y" : "ies"} from the API.`}
    >
      <div ref={formAnchorRef} />
      <AdminFullFormPage
        formTitle={editing ? "Edit experience" : "Add experience"}
        formHint="Type company and role yourself. Dates open in a calendar popover. Required fields are marked with *."
        formIcon={editing ? "edit" : "work_history"}
        form={<ExperienceCreateForm editing={editing} onCancelEdit={() => setEditing(null)} />}
        recordsTitle={`Your experience (${items.length})`}
        records={
          isLoading ? (
            <p className="text-sm text-on-surface-variant">Loading experience…</p>
          ) : isError ? (
            <p className="rounded-xl border border-destructive/30 bg-destructive/5 p-space-md text-sm text-destructive">
              Could not load experience list.
            </p>
          ) : items.length === 0 ? (
            <p className="rounded-xl border border-dashed border-outline-variant/45 bg-surface-container-low/35 p-space-lg text-center text-sm text-on-surface-variant">
              No records yet — submit the form above to add your first entry.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-space-md lg:grid-cols-2">
              {items.map((exp) => (
                <ExperienceAdminCard
                  key={exp.id}
                  exp={exp}
                  isEditing={editing?.id === exp.id}
                  onEdit={() => startEdit(exp)}
                  deleting={remove.isPending}
                  onDelete={() => {
                    if (!confirm("Delete this experience entry?")) return;
                    if (editing?.id === exp.id) setEditing(null);
                    remove.mutate(exp.id);
                  }}
                />
              ))}
            </div>
          )
        }
      />
    </AdminPageChrome>
  );
}