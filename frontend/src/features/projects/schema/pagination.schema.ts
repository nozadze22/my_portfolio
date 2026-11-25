import { z } from "zod";
import { projectSchema } from "./project_schema";

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
  
  export type ProjectListSchema = z.infer<typeof projectListSchema>;