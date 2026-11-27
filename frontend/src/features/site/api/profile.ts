import { api } from "@/lib/api";
import type { SiteProfile } from "../schema/profile.schema";

export async function getSiteProfile() {
  return api<SiteProfile>("/profile");
}