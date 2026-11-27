import type { Project } from "@/features/projects/schema/project_schema";

export function projectThumbnail(project: Project): string | null {
  return project.imageUrl ?? project.galleryUrls?.[0] ?? null;
}

export function projectPublicHref(project: Project): string | null {
  if (project.demoUrl?.trim()) return project.demoUrl.trim();
  if (project.repoUrl?.trim()) return project.repoUrl.trim();
  return null;
}