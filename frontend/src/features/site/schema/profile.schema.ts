import { z } from "zod";

export const siteProfileSchema = z.object({
  id: z.literal("owner"),
  fullName: z.string(),
  shortLabel: z.string().nullable(),
  roleTitle: z.string().nullable(),
  heroTitle: z.string().nullable(),
  heroSubtitle: z.string().nullable(),
  aboutBody: z.string().nullable(),
  email: z.string(),
  phone: z.string().nullable(),
  location: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  availability: z.string().nullable(),
  githubUrl: z.string().nullable(),
  linkedinUrl: z.string().nullable(),
  twitterUrl: z.string().nullable(),
  websiteUrl: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type SiteProfile = z.infer<typeof siteProfileSchema>;