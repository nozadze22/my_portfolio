import { z } from "zod";
import { skillOptionSchema } from "@/features/skills/schema/skill.schema";
import { employmentTypeSchema } from "./employment-type.schema";

const projectStubSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
});

export const experienceSchema = z.object({
  id: z.string(),
  company: z.string(),
  position: z.string(),
  description: z.string(),
  location: z.string().nullable(),
  employmentType: employmentTypeSchema.nullable(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable(),
  current: z.boolean(),
  technologies: z.array(z.string()),
  skills: z.array(skillOptionSchema).optional(),
  projects: z.array(projectStubSchema).optional(),
  featured: z.boolean(),
  published: z.boolean(),
  sortOrder: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Experience = z.infer<typeof experienceSchema>;

export const experienceListResponseSchema = z.object({
  data: z.array(experienceSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean(),
  }),
});

export type ExperienceListResponse = z.infer<typeof experienceListResponseSchema>;