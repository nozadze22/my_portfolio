import { api } from "@/lib/api";
import {
  employmentTypeOptionsResponseSchema,
} from "../schema/employment-type.schema";
import {
  experienceListResponseSchema,
  experienceSchema,
  type Experience,
} from "../schema/experience.schema";

export type ExperienceListQuery = {
  page?: number;
  limit?: number;
};

export async function getExperienceEmploymentTypes() {
  const raw = await api<unknown>("/experience/employment-types");
  return employmentTypeOptionsResponseSchema.parse(raw);
}

export async function getExperiences(query: ExperienceListQuery = {}) {
  const params = new URLSearchParams();
  params.set("page", String(query.page ?? 1));
  params.set("limit", String(query.limit ?? 20));

  const raw = await api<unknown>(`/experience?${params.toString()}`);
  return experienceListResponseSchema.parse(raw);
}

export type CreateExperienceInput = {
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  location?: string;
  employmentType?: string;
  featured?: boolean;
  published?: boolean;
  projectIds?: string[];
};

export async function createExperience(data: CreateExperienceInput) {
  const raw = await api<unknown>("/experience", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return experienceSchema.parse(raw);
}

export type UpdateExperienceInput = Partial<CreateExperienceInput> & {
  projectIds?: string[];
};

export async function updateExperience(id: string, data: UpdateExperienceInput) {
  const raw = await api<unknown>(`/experience/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return experienceSchema.parse(raw);
}

export async function deleteExperience(id: string) {
  const raw = await api<unknown>(`/experience/${id}`, { method: "DELETE" });
  return experienceSchema.parse(raw);
}