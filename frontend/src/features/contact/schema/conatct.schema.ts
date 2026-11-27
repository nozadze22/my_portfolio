import { z } from "zod";

/** POST /contact/send — matches backend CreateContactDto */
export const sendContactInputSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email().max(254),
  phone: z
    .string()
    .min(9)
    .max(30)
    .regex(/^\+?[0-9\s()-]+$/),
  message: z.string().min(10).max(2000),
});

export type SendContactInput = z.infer<typeof sendContactInputSchema>;

/** Contact message as returned from the API */
export const contactMessageSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  message: z.string(),
  createdAt: z.coerce.date(),
});

export type ContactMessage = z.infer<typeof contactMessageSchema>;