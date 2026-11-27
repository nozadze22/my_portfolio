import type { Project } from "../schema/project_schema";

export function getProjectTagLabels(project: Project): string[] {
  const fromSkills = project.skills?.map((s) => s.name);
  if (fromSkills && fromSkills.length > 0) return fromSkills;
  if (project.technologies?.length) return project.technologies;
  if (project.tags?.length) return project.tags;
  return [];
}