import { api } from "@/lib/api";
import { siteProfileSchema, type SiteProfile } from "../schema/profile.schema";

export async function getSiteProfile() {
  const raw = await api<unknown>("/profile");
  return siteProfileSchema.parse(raw);
}

export type UpdateSiteProfileInput = Partial<
  Pick<
    SiteProfile,
    | "fullName"
    | "shortLabel"
    | "roleTitle"
    | "heroTitle"
    | "heroSubtitle"
    | "aboutBody"
    | "email"
    | "phone"
    | "location"
    | "avatarUrl"
    | "availability"
    | "githubUrl"
    | "linkedinUrl"
    | "twitterUrl"
    | "websiteUrl"
  >
>;

export async function updateSiteProfile(data: UpdateSiteProfileInput) {
  const raw = await api<unknown>("/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return siteProfileSchema.parse(raw);
}