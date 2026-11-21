import { z } from 'zod';

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

  featured: z.boolean(),
  published: z.boolean(),

  sortOrder: z.number(),

  startedAt: z.coerce.date().nullable(),
  completedAt: z.coerce.date().nullable(),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type ProjectSchema = z.infer<typeof projectSchema>;