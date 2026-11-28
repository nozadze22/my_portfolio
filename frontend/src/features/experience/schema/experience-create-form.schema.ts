import { format } from "date-fns";
import { z } from "zod";

import { refineEndDateUnlessCurrent } from "@/features/admin/lib/current-end-date-rules";
import { employmentTypeSchema } from "./employment-type.schema";
import type { Experience } from "./experience.schema";

export const experienceCreateFormSchema = z
  .object({
    company: z.string().min(1, "Company is required"),
    position: z.string().min(1, "Position is required"),
    location: z.string(),
    employmentType: z.union([employmentTypeSchema, z.literal("")]),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string(),
    current: z.boolean(),
    description: z.string().min(1, "Description is required"),
    featured: z.boolean(),
    projectIds: z.array(z.string()),
  })
  .superRefine((data, ctx) => {
    refineEndDateUnlessCurrent(data, ctx, {
      endDateRequired: "End date is required unless this is your current role",
      endBeforeStart: "End date must be on or after start date",
    });
  });

export type ExperienceCreateFormValues = z.infer<typeof experienceCreateFormSchema>;

export const experienceCreateFormDefaults: ExperienceCreateFormValues = {
  company: "",
  position: "",
  location: "",
  employmentType: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
  featured: false,
  projectIds: [],
};

function dateToFormField(value: Date | string | null | undefined): string {
  if (value == null) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return format(d, "yyyy-MM-dd");
}

export function experienceToFormValues(exp: Experience): ExperienceCreateFormValues {
  return {
    company: exp.company,
    position: exp.position,
    location: exp.location ?? "",
    employmentType: exp.employmentType ?? "",
    startDate: dateToFormField(exp.startDate),
    endDate: dateToFormField(exp.endDate),
    current: exp.current,
    description: exp.description,
    featured: exp.featured,
    projectIds: exp.projects?.map((p) => p.id) ?? [],
  };
}

export function experienceCreateFormToPayload(
  values: ExperienceCreateFormValues,
  mode: "create" | "update" = "create",
) {
  const base = {
    company: values.company.trim(),
    position: values.position.trim(),
    description: values.description.trim(),
    location: values.location.trim() || undefined,
    employmentType: values.employmentType || undefined,
    startDate: values.startDate,
    endDate: values.current ? undefined : values.endDate.trim() || undefined,
    current: values.current,
    featured: values.featured,
    published: true as const,
  };

  if (mode === "update") {
    return { ...base, projectIds: values.projectIds };
  }

  return {
    ...base,
    ...(values.projectIds.length > 0 ? { projectIds: values.projectIds } : {}),
  };
}