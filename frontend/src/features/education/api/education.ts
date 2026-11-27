import { api } from "@/lib/api";
import type {
  CreateEducationInput,
  Education,
  EducationListResponse,
  UpdateEducationInput,
} from "../schema/education.schema";

export type EducationListQuery = {
  page?: number;
  limit?: number;
};

export async function getEducationList(query: EducationListQuery = {}) {
  const params = new URLSearchParams();
  params.set("page", String(query.page ?? 1));
  params.set("limit", String(query.limit ?? 10));

  return api<EducationListResponse>(`/education?${params.toString()}`);
}

export async function createEducation(data: CreateEducationInput) {
  return api<Education>("/education", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateEducation(id: string, data: UpdateEducationInput) {
  return api<Education>(`/education/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteEducation(id: string) {
  return api<Education>(`/education/${id}`, {
    method: "DELETE",
  });
}