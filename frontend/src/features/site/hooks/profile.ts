import { useQuery } from "@tanstack/react-query";
import { getSiteProfile } from "../api/profile";

export function useSiteProfile() {
  return useQuery({
    queryKey: ["site-profile"],
    queryFn: getSiteProfile,
    staleTime: 5 * 60_000,
  });
}