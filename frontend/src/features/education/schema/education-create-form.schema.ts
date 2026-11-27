import { format } from "date-fns";
import { z } from "zod";

import { refineEndDateUnlessCurrent } from "@/features/admin/lib/current-end-date-rules";
import type { CreateEducationInput, Education, UpdateEducationInput } from "./education.schema";

export const educationCreateFormSchema = z
  .object({
    institution: z.string().min(1, "Institution is required"),
    degree: z.string(),
    fieldOfStudy: z.string(),
    location: z.string(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string(),
    current: z.boolean(),
    description: z.string(),
    featured: z.boolean(),
    skillIds: z.array(z.string()),
  })
  .superRefine((data, ctx) => {
    refineEndDateUnlessCurrent(data, ctx, {
      endDateRequired: "End date is required unless currently studying",
      endBeforeStart: "End date must be on or after start date",
    });
  });

export type EducationCreateFormValues = z.infer<typeof educationCreateFormSchema>;

export const educationCreateFormDefaults: EducationCreateFormValues = {
  institution: "",
  degree: "",
  fieldOfStudy: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
  featured: false,
  skillIds: [],
};

function dateToFormField(value: Date | string | null | undefined): string {
  if (value == null) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return format(d, "yyyy-MM-dd");
}

export function educationToFormValues(edu: Education): EducationCreateFormValues {
  return {
    institution: edu.institution,
    degree: edu.degree ?? "",
    fieldOfStudy: edu.fieldOfStudy ?? "",
    location: edu.location ?? "",
    startDate: dateToFormField(edu.startDate),
    endDate: dateToFormField(edu.endDate),
    current: edu.current,
    description: edu.description ?? "",
    featured: edu.featured,
    skillIds: edu.skills?.map((s) => s.id) ?? [],
  };
}

export function educationCreateFormToPayload(
  values: EducationCreateFormValues,
  mode: "create",
): CreateEducationInput;
export function educationCreateFormToPayload(
  values: EducationCreateFormValues,
  mode: "update",
): UpdateEducationInput;
export function educationCreateFormToPayload(
  values: EducationCreateFormValues,
  mode: "create" | "update",
): CreateEducationInput | UpdateEducationInput {
  const base = {
    institution: values.institution.trim(),
    degree: values.degree.trim() || undefined,
    fieldOfStudy: values.fieldOfStudy.trim() || undefined,
    description: values.description.trim() || undefined,
    location: values.location.trim() || undefined,
    startDate: values.startDate,
    endDate: values.current ? undefined : values.endDate.trim() || undefined,
    current: values.current,
    featured: values.featured,
    published: true as const,
  };

  if (mode === "update") {
    return { ...base, skillIds: values.skillIds };
  }

  return {
    ...base,
    ...(values.skillIds.length > 0 ? { skillIds: values.skillIds } : {}),
  };
}