import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSiteProfile, updateSiteProfile, type UpdateSiteProfileInput } from "../api/profile";
import { siteProfileSchema } from "../schema/profile.schema";

export function useSiteProfile() {
  return useQuery({
    queryKey: ["site-profile"],
    queryFn: getSiteProfile,
    staleTime: 5 * 60_000,
    select: (data) => siteProfileSchema.parse(data),
  });
}

export function useUpdateSiteProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateSiteProfileInput) => updateSiteProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-profile"] });
      toast.success("Profile saved");
    },
    onError: () => toast.error("Could not save profile"),
  });
}