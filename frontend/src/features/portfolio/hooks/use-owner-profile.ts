"use client";

import { useSiteProfile } from "@/features/site/hooks/profile";

/** Owner profile from GET /profile — no env or mock fallback. */
export function useOwnerProfile() {
  return useSiteProfile();
}