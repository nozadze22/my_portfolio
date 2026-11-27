import { api } from "@/lib/api";
import {
  type ProjectListQuery,
  type ProjectListResponse,
} from "../schema/pagination.schema";
import {
  type CreateProjectInput,
  type Project,
  type UpdateProjectInput,
} from "../schema/project_schema";

export async function getProjects(query: ProjectListQuery = {}) {
  const params = new URLSearchParams();

  params.set("page", String(query.page ?? 1));
  params.set("limit", String(query.limit ?? 10));

  if (query.featured !== undefined) {
    params.set("featured", String(query.featured));
  }
  if (query.search) {
    params.set("search", query.search);
  }
  if (query.sortOrder) {
    params.set("sortOrder", query.sortOrder);
  }
  if (query.skillId) {
    params.set("skillId", query.skillId);
  }
  if (query.skillSlug) {
    params.set("skillSlug", query.skillSlug);
  }

  return api<ProjectListResponse>(`/projects?${params.toString()}`);
}

export async function getProjectDetail(id: string) {
  return api<Project>(`/projects/${id}`);
}

export async function createProject(data: CreateProjectInput) {
  return api<Project>("/projects", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProject(id: string, data: UpdateProjectInput) {
  return api<Project>(`/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteProject(id: string) {
  return api<Project>(`/projects/${id}`, {
    method: "DELETE",
  });
}