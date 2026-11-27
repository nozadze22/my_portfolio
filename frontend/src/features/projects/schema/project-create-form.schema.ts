import { z } from "zod";

export const projectCreateFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  subtitle: z.string(),
  description: z.string().min(1, "Description is required"),
  demoUrl: z.string(),
  repoUrl: z.string(),
  featured: z.boolean(),
  skillIds: z.array(z.string()),
});

export type ProjectCreateFormValues = z.infer<typeof projectCreateFormSchema>;

export const projectCreateFormDefaults: ProjectCreateFormValues = {
  title: "",
  slug: "",
  subtitle: "",
  description: "",
  demoUrl: "",
  repoUrl: "",
  featured: false,
  skillIds: [],
};