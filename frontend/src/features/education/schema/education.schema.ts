import { z } from "zod";
import { skillOptionSchema } from "@/features/skills/schema/skill.schema";

export const educationSchema = z.object({
  id: z.string(),
  institution: z.string(),
  degree: z.string().nullable(),
  fieldOfStudy: z.string().nullable(),
  description: z.string().nullable(),
  location: z.string().nullable(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable(),
  current: z.boolean(),
  skills: z.array(skillOptionSchema).optional(),
  featured: z.boolean(),
  published: z.boolean(),
  sortOrder: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Education = z.infer<typeof educationSchema>;

export const createEducationInputSchema = z.object({
  institution: z.string().min(1),
  degree: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  skillIds: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export type CreateEducationInput = z.infer<typeof createEducationInputSchema>;

export const updateEducationInputSchema = createEducationInputSchema.partial();

export type UpdateEducationInput = z.infer<typeof updateEducationInputSchema>;

export const educationListResponseSchema = z.object({
  data: z.array(educationSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean(),
  }),
});

export type EducationListResponse = z.infer<typeof educationListResponseSchema>;