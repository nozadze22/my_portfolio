import { api } from "@/lib/api";
import type {
  CreateSkillInput,
  Skill,
  SkillOptionsResponse,
  UpdateSkillInput,
} from "../schema/skill.schema";
import type { SkillListQuery, SkillListResponse } from "../schema/list.schema";

export async function getSkillOptions() {
  return api<SkillOptionsResponse>("/skills/options");
}

export async function getSkills(query: SkillListQuery = {}) {
  const params = new URLSearchParams();

  if (query.page !== undefined) params.set("page", String(query.page));
  if (query.limit !== undefined) params.set("limit", String(query.limit));
  if (query.category) params.set("category", query.category);
  if (query.search) params.set("search", query.search);
  if (query.published !== undefined) {
    params.set("published", String(query.published));
  }
  if (query.sortOrder) params.set("sortOrder", query.sortOrder);

  const qs = params.toString();
  return api<SkillListResponse>(qs ? `/skills?${qs}` : "/skills");
}

export async function createSkill(data: CreateSkillInput) {
  return api<Skill>("/skills", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateSkill(id: string, data: UpdateSkillInput) {
  return api<Skill>(`/skills/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteSkill(id: string) {
  return api<Skill>(`/skills/${id}`, {
    method: "DELETE",
  });
}