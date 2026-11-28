import { z } from "zod";
import { contactMessageSchema } from "./conatct.schema";

export const contactListResponseSchema = z.object({
  data: z.array(contactMessageSchema),
  meta: z.object({
    total: z.number(),
    unread: z.number().optional().default(0),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean(),
  }),
});

export type ContactListResponseParsed = z.infer<typeof contactListResponseSchema>;