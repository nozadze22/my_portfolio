import { z } from "zod";

import type { SiteProfile } from "./profile.schema";

/** Admin profile editor — string fields; empty → null on submit */
export const siteProfileFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  shortLabel: z.string(),
  roleTitle: z.string(),
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  aboutBody: z.string(),
  email: z.string().email("Enter a valid email"),
  phone: z.string(),
  location: z.string(),
  availability: z.string(),
  githubUrl: z.string(),
  linkedinUrl: z.string(),
});

export type SiteProfileFormValues = z.infer<typeof siteProfileFormSchema>;

export const siteProfileFormEmptyValues: SiteProfileFormValues = {
  fullName: "",
  shortLabel: "",
  roleTitle: "",
  heroTitle: "",
  heroSubtitle: "",
  aboutBody: "",
  email: "",
  phone: "",
  location: "",
  availability: "",
  githubUrl: "",
  linkedinUrl: "",
};

function strOrNull(value: string) {
  const t = value.trim();
  return t || null;
}

export function siteProfileToFormValues(profile: SiteProfile): SiteProfileFormValues {
  return {
    fullName: profile.fullName,
    shortLabel: profile.shortLabel ?? "",
    roleTitle: profile.roleTitle ?? "",
    heroTitle: profile.heroTitle ?? "",
    heroSubtitle: profile.heroSubtitle ?? "",
    aboutBody: profile.aboutBody ?? "",
    email: profile.email,
    phone: profile.phone ?? "",
    location: profile.location ?? "",
    availability: profile.availability ?? "",
    githubUrl: profile.githubUrl ?? "",
    linkedinUrl: profile.linkedinUrl ?? "",
  };
}

export function siteProfileFormToPayload(values: SiteProfileFormValues) {
  return {
    fullName: values.fullName.trim(),
    shortLabel: strOrNull(values.shortLabel),
    roleTitle: strOrNull(values.roleTitle),
    heroTitle: strOrNull(values.heroTitle),
    heroSubtitle: strOrNull(values.heroSubtitle),
    aboutBody: strOrNull(values.aboutBody),
    email: values.email.trim(),
    phone: strOrNull(values.phone),
    location: strOrNull(values.location),
    availability: strOrNull(values.availability),
    githubUrl: strOrNull(values.githubUrl),
    linkedinUrl: strOrNull(values.linkedinUrl),
    avatarUrl: null,
    twitterUrl: null,
    websiteUrl: null,
  };
}