import { MaterialSymbol } from "@/components/ui/material-symbol";
import { getProjectTagLabels } from "../lib/project-tags";
import type { Project } from "../schema/project_schema";

export function ProjectCard({ project }: { project: Project }) {
  const tags =
    getProjectTagLabels(project);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-surface-variant bg-surface-container-lowest shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-56 w-full overflow-hidden bg-surface-container">
        {project.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.imageUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-outline">
            <MaterialSymbol name="image" className="text-[48px]" />
          </div>
        )}
        {project.featured ? (
          <span className="absolute top-3 left-3 rounded-full bg-primary px-space-sm py-1 font-label-badge text-on-primary">
            Featured
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-space-lg">
        <h3 className="mb-space-xs font-headline-sm text-on-surface group-hover:text-primary">
          {project.title}
        </h3>
        {project.subtitle ? (
          <p className="mb-space-xs text-sm text-primary">{project.subtitle}</p>
        ) : null}
        <p className="mb-space-md flex-1 text-sm leading-relaxed text-on-surface-variant line-clamp-4">
          {project.description}
        </p>
        <div className="mb-space-md flex flex-wrap gap-1.5">
          {tags.slice(0, 6).map((t) => (
            <span
              key={t}
              className="rounded bg-surface-container-low px-2 py-0.5 font-label-code text-[11px] text-on-surface-variant"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-space-md border-t border-surface-variant/60 pt-space-sm">
          {project.demoUrl ? (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary"
            >
              Demo
              <MaterialSymbol name="open_in_new" className="text-[16px]" />
            </a>
          ) : null}
          {project.repoUrl ? (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-on-surface"
            >
              <MaterialSymbol name="code" className="text-[16px]" />
              Source
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}