import { z } from "zod";
import { projectSchema } from "./project_schema";

export const projectListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  featured: z.coerce.boolean().optional(),
  search: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  skillId: z.string().optional(),
  skillSlug: z.string().optional(),
});

export type ProjectListQuery = z.infer<typeof projectListQuerySchema>;

export const projectListSchema = z.object({
  data: z.array(projectSchema),

  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean(),
  }),
});

export type ProjectListResponse = z.infer<typeof projectListSchema>;