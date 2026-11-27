"use client";

import { MaterialSymbol } from "@/components/ui/material-symbol";
import { Button } from "@/components/ui/button";
import type { Project } from "@/features/projects/schema/project_schema";
import { projectPublicHref, projectThumbnail } from "../../lib/project-display";

export function ExperienceLinkedProjects({
  projects,
  onRemove,
}: {
  projects: Project[];
  onRemove: (id: string) => void;
}) {
  if (projects.length === 0) return null;

  return (
    <ul className="flex flex-col gap-2">
      {projects.map((project) => {
        const thumb = projectThumbnail(project);
        const href = projectPublicHref(project);
        return (
          <li
            key={project.id}
            className="flex items-center gap-3 rounded-xl border border-surface-variant/60 bg-surface-container-low/40 p-2.5"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-container-high">
              {thumb ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumb} alt="" className="h-full w-full object-cover" />
              ) : (
                <MaterialSymbol name="image" className="text-[22px] text-outline" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-body-sm text-body-sm font-semibold text-on-surface">
                {project.title}
              </p>
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-0.5 block truncate text-xs text-primary hover:underline"
                >
                  {href.replace(/^https?:\/\//, "")}
                </a>
              ) : (
                <p className="mt-0.5 truncate text-xs text-on-surface-variant">/{project.slug}</p>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              title="Remove"
              className="shrink-0 text-outline hover:text-destructive"
              onClick={() => onRemove(project.id)}
            >
              <MaterialSymbol name="close" className="text-[18px]" />
            </Button>
          </li>
        );
      })}
    </ul>
  );
}