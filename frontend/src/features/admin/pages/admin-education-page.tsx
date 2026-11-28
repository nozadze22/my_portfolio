"use client";

import { useRef, useState } from "react";
import { AdminPageChrome } from "@/features/admin/layout/admin-console-layout";
import { AdminFullFormPage } from "@/features/admin/layout/admin-full-form-page";
import { EducationAdminCard } from "@/features/education/components/admin/education-admin-card";
import { EducationCreateForm } from "@/features/education/components/admin/education-create-form";
import { useDeleteEducationEntry, useEducationList } from "@/features/education/hooks/education";
import type { Education } from "@/features/education/schema/education.schema";

export function AdminEducationPage() {
  const formAnchorRef = useRef<HTMLDivElement>(null);
  const [editing, setEditing] = useState<Education | null>(null);
  const { data, isLoading, isError } = useEducationList({ limit: 50 });
  const remove = useDeleteEducationEntry();
  const items = data?.data ?? [];
  const total = data?.meta.total ?? items.length;

  function startEdit(edu: Education) {
    setEditing(edu);
    formAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <AdminPageChrome
      breadcrumb={["Admin Console", "Content", "Education"]}
      title="Education & credentials"
      description={`Degrees and certifications — ${total} record${total === 1 ? "" : "s"} from the API.`}
    >
      <div ref={formAnchorRef} />
      <AdminFullFormPage
        formTitle={editing ? "Edit education" : "Add education"}
        formHint="Type school name and location yourself. Link skills you learned during this period. Required fields are marked with *."
        formIcon={editing ? "edit" : "school"}
        form={<EducationCreateForm editing={editing} onCancelEdit={() => setEditing(null)} />}
        recordsTitle={`Your education (${items.length})`}
        records={
          isLoading ? (
            <p className="text-sm text-on-surface-variant">Loading education…</p>
          ) : isError ? (
            <p className="rounded-xl border border-destructive/30 bg-destructive/5 p-space-md text-sm text-destructive">
              Could not load education list.
            </p>
          ) : items.length === 0 ? (
            <p className="rounded-xl border border-dashed border-outline-variant/45 bg-surface-container-low/35 p-space-lg text-center text-sm text-on-surface-variant">
              No records yet — submit the form above to add your first entry.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-space-md lg:grid-cols-2">
              {items.map((edu) => (
                <EducationAdminCard
                  key={edu.id}
                  edu={edu}
                  isEditing={editing?.id === edu.id}
                  onEdit={() => startEdit(edu)}
                  deleting={remove.isPending}
                  onDelete={() => {
                    if (!confirm("Delete this education entry?")) return;
                    if (editing?.id === edu.id) setEditing(null);
                    remove.mutate(edu.id);
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