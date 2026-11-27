import { api } from "@/lib/api";
import {
  educationListResponseSchema,
  educationSchema,
  type CreateEducationInput,
  type Education,
  type UpdateEducationInput,
} from "../schema/education.schema";

export type EducationListQuery = {
  page?: number;
  limit?: number;
};

export async function getEducationList(query: EducationListQuery = {}) {
  const params = new URLSearchParams();
  params.set("page", String(query.page ?? 1));
  params.set("limit", String(query.limit ?? 10));

  const raw = await api<unknown>(`/education?${params.toString()}`);
  return educationListResponseSchema.parse(raw);
}

export async function createEducation(data: CreateEducationInput) {
  const raw = await api<unknown>("/education", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return educationSchema.parse(raw);
}

export async function updateEducation(id: string, data: UpdateEducationInput) {
  const raw = await api<unknown>(`/education/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return educationSchema.parse(raw);
}

export async function deleteEducation(id: string) {
  const raw = await api<unknown>(`/education/${id}`, {
    method: "DELETE",
  });
  return educationSchema.parse(raw);
}