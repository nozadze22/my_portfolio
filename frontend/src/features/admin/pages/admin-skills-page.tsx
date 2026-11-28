"use client";

import { useCallback, useRef, useState } from "react";
import { AdminPageChrome } from "@/features/admin/layout/admin-console-layout";
import { AdminFullFormPage } from "@/features/admin/layout/admin-full-form-page";
import { AdminSkillsInfiniteList } from "@/features/skills/components/admin/admin-skills-infinite-list";
import { SkillCreateForm } from "@/features/skills/components/admin/skill-create-form";
import type { Skill } from "@/features/skills/schema/skill.schema";
import { useDeleteSkillEntry } from "@/features/skills/hooks/skills";

export function AdminSkillsPage() {
  const formAnchorRef = useRef<HTMLDivElement>(null);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [listMeta, setListMeta] = useState({ loaded: 0, total: 0 });
  const remove = useDeleteSkillEntry();

  const onLoadedMeta = useCallback((info: { loaded: number; total: number }) => {
    setListMeta(info);
  }, []);

  const total = listMeta.total;
  const recordsTitle =
    listMeta.total > 0
      ? listMeta.loaded < listMeta.total
        ? `Your skills (${listMeta.loaded} of ${listMeta.total})`
        : `Your skills (${listMeta.total})`
      : "Your skills";

  function startEdit(skill: Skill) {
    setEditing(skill);
    formAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <AdminPageChrome
      breadcrumb={["Admin Console", "Content", "Skills"]}
      title="Skills & technologies"
      description={`Catalog for projects and experience — ${total} skill${total === 1 ? "" : "s"} in the API.`}
    >
      <div ref={formAnchorRef} />
      <AdminFullFormPage
        formTitle={editing ? "Edit skill" : "Add skill"}
        formHint="Type the technology name — slug, icon, and list order are filled automatically. Required fields are marked with *."
        formIcon={editing ? "edit" : "psychology"}
        form={<SkillCreateForm editing={editing} onCancelEdit={() => setEditing(null)} />}
        recordsTitle={recordsTitle}
        records={
          <AdminSkillsInfiniteList
            editingId={editing?.id}
            onEdit={startEdit}
            deleting={remove.isPending}
            onLoadedMeta={onLoadedMeta}
            onDelete={(skill) => {
              if (!confirm(`Delete “${skill.name}”?`)) return;
              if (editing?.id === skill.id) setEditing(null);
              remove.mutate(skill.id);
            }}
          />
        }
      />
    </AdminPageChrome>
  );
}