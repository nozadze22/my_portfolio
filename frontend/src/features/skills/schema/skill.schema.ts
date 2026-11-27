import { z } from "zod";

export const skillCategorySchema = z.enum([
  "LANGUAGE",
  "FRAMEWORK",
  "LIBRARY",
  "DATABASE",
  "TOOL",
  "PLATFORM",
  "OTHER",
]);

export type SkillCategory = z.infer<typeof skillCategorySchema>;

export const skillSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  category: skillCategorySchema,
  iconUrl: z.string().nullable(),
  color: z.string().nullable(),
  published: z.boolean(),
  sortOrder: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Skill = z.infer<typeof skillSchema>;

export const skillOptionSchema = skillSchema.pick({
  id: true,
  name: true,
  slug: true,
  category: true,
  iconUrl: true,
  color: true,
});

export type SkillOption = z.infer<typeof skillOptionSchema>;

export const createSkillInputSchema = z.object({
  name: z.string().min(1).max(80),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  category: skillCategorySchema.optional(),
  iconUrl: z.string().url().optional(),
  color: z
    .string()
    .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/)
    .optional(),
  published: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export type CreateSkillInput = z.infer<typeof createSkillInputSchema>;

export const updateSkillInputSchema = createSkillInputSchema.partial();

export type UpdateSkillInput = z.infer<typeof updateSkillInputSchema>;

export const skillOptionsResponseSchema = z.object({
  data: z.array(skillOptionSchema),
  byCategory: z.record(skillCategorySchema, z.array(skillOptionSchema)),
});

export type SkillOptionsResponse = z.infer<typeof skillOptionsResponseSchema>;