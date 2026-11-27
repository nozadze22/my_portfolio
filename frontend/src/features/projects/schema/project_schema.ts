import { z } from "zod";
import { skillOptionSchema } from "@/features/skills/schema/skill.schema";

const experienceSummarySchema = z.object({
  id: z.string(),
  company: z.string(),
  position: z.string(),
  description: z.string(),
  location: z.string().nullable(),
  employmentType: z
    .enum(["FULL_TIME", "PART_TIME", "CONTRACT", "FREELANCE", "INTERNSHIP"])
    .nullable(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable(),
  current: z.boolean(),
  technologies: z.array(z.string()),
  featured: z.boolean(),
  published: z.boolean(),
  sortOrder: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const projectSchema = z.object({
  id: z.string(),

  title: z.string(),
  slug: z.string(),
  subtitle: z.string().nullable(),
  description: z.string(),

  category: z.string().nullable(),
  role: z.string().nullable(),
  year: z.number().nullable(),

  imageUrl: z.string().nullable(),
  repoUrl: z.string().nullable(),
  demoUrl: z.string().nullable(),

  tags: z.array(z.string()),
  technologies: z.array(z.string()),
  skills: z.array(skillOptionSchema).optional(),

  featured: z.boolean(),
  published: z.boolean(),

  sortOrder: z.number(),

  startedAt: z.coerce.date().nullable(),
  completedAt: z.coerce.date().nullable(),

  experiences: z.array(experienceSummarySchema).optional(),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Project = z.infer<typeof projectSchema>;

export const createProjectInputSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  subtitle: z.string().optional(),
  description: z.string().min(1),
  category: z.string().optional(),
  role: z.string().optional(),
  year: z.number().int().optional(),
  imageUrl: z.string().url().optional(),
  repoUrl: z.string().url().optional(),
  demoUrl: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  technologies: z.array(z.string()).optional(),
  skillIds: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectInputSchema>;

export const updateProjectInputSchema = createProjectInputSchema.partial();

export type UpdateProjectInput = z.infer<typeof updateProjectInputSchema>;