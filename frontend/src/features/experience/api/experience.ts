import { api } from "@/lib/api";
import type { ExperienceListResponse } from "../schema/experience.schema";

export type ExperienceListQuery = {
  page?: number;
  limit?: number;
};

export async function getExperiences(query: ExperienceListQuery = {}) {
  const params = new URLSearchParams();
  params.set("page", String(query.page ?? 1));
  params.set("limit", String(query.limit ?? 20));

  return api<ExperienceListResponse>(`/experience?${params.toString()}`);
}