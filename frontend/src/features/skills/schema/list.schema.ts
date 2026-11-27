import { z } from "zod";
import { skillSchema, skillCategorySchema } from "./skill.schema";

export const skillListQuerySchema = z.object({
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(500).optional(),
  category: skillCategorySchema.optional(),
  search: z.string().optional(),
  published: z.boolean().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type SkillListQuery = z.infer<typeof skillListQuerySchema>;

export const skillListResponseSchema = z.object({
  data: z.array(skillSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean(),
  }),
});

export type SkillListResponse = z.infer<typeof skillListResponseSchema>;