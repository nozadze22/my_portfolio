import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createExperience,
  deleteExperience,
  getExperienceEmploymentTypes,
  getExperiences,
  updateExperience,
  type CreateExperienceInput,
  type ExperienceListQuery,
  type UpdateExperienceInput,
} from "../api/experience";

export function useExperienceEmploymentTypes() {
  return useQuery({
    queryKey: ["experience", "employment-types"],
    queryFn: getExperienceEmploymentTypes,
    staleTime: 60 * 60 * 1000,
  });
}

export function useExperiences(query: ExperienceListQuery = {}) {
  return useQuery({
    queryKey: ["experience", query],
    queryFn: () => getExperiences(query),
  });
}

export function useCreateExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateExperienceInput) => createExperience(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experience"] });
      toast.success("Experience saved");
    },
    onError: () => toast.error("Failed to save experience"),
  });
}

export function useUpdateExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExperienceInput }) =>
      updateExperience(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experience"] });
      toast.success("Experience updated");
    },
    onError: () => toast.error("Failed to update experience"),
  });
}

export function useDeleteExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteExperience(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experience"] });
      toast.success("Experience removed");
    },
    onError: () => toast.error("Failed to remove experience"),
  });
}