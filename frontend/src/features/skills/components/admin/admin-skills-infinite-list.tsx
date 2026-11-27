"use client";

import { useEffect, useRef } from "react";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { SkillAdminCard } from "./skill-admin-card";
import type { Skill } from "../../schema/skill.schema";
import { useInfiniteSkills } from "../../hooks/skills";

const EMPTY_SKILLS: Skill[] = [];

type AdminSkillsInfiniteListProps = {
  editingId?: string | null;
  onEdit: (skill: Skill) => void;
  onDelete: (skill: Skill) => void;
  deleting?: boolean;
  onLoadedMeta?: (info: { loaded: number; total: number }) => void;
};

export function AdminSkillsInfiniteList({
  editingId,
  onEdit,
  onDelete,
  deleting,
  onLoadedMeta,
}: AdminSkillsInfiniteListProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteSkills({ sortOrder: "asc" });

  const items = data?.pages.flatMap((p) => p.data) ?? EMPTY_SKILLS;
  const total = data?.pages[0]?.meta.total ?? items.length;

  useEffect(() => {
    onLoadedMeta?.({ loaded: items.length, total });
  }, [items.length, total, onLoadedMeta]);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: "240px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) {
    return <p className="text-sm text-on-surface-variant">Loading skills…</p>;
  }

  if (isError) {
    return (
      <p className="rounded-xl border border-destructive/30 bg-destructive/5 p-space-md text-sm text-destructive">
        Could not load skills list.
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-outline-variant/45 bg-surface-container-low/35 p-space-lg text-center text-sm text-on-surface-variant">
        No skills yet — add your first technology above.
      </p>
    );
  }

  return (
    <div className="space-y-space-md">
      <div className="grid grid-cols-1 gap-space-md lg:grid-cols-2">
        {items.map((skill) => (
          <SkillAdminCard
            key={skill.id}
            skill={skill}
            isEditing={editingId === skill.id}
            onEdit={() => onEdit(skill)}
            deleting={deleting}
            onDelete={() => onDelete(skill)}
          />
        ))}
      </div>

      <div ref={loadMoreRef} className="flex min-h-8 items-center justify-center py-2">
        {isFetchingNextPage ? (
          <span className="inline-flex items-center gap-2 text-sm text-on-surface-variant">
            <MaterialSymbol name="progress_activity" className="animate-spin text-[18px]" />
            Loading more…
          </span>
        ) : hasNextPage ? (
          <span className="text-xs text-on-surface-variant">Scroll for more skills</span>
        ) : items.length > 0 ? (
          <span className="text-xs text-on-surface-variant">
            All {total} skill{total === 1 ? "" : "s"} loaded
          </span>
        ) : null}
      </div>
    </div>
  );
}