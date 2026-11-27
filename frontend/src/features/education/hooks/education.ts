import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEducation,
  deleteEducation,
  getEducationList,
  updateEducation,
  type EducationListQuery,
} from "../api/education";
import type {
  CreateEducationInput,
  UpdateEducationInput,
} from "../schema/education.schema";
import { toast } from "sonner";

export function useEducationList(query: EducationListQuery = {}) {
  return useQuery({
    queryKey: ["education", query],
    queryFn: () => getEducationList(query),
  });
}

export function useCreateEducation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEducationInput) => createEducation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education"] });
      toast.success("Education saved");
    },
    onError: () => toast.error("Failed to save education"),
  });
}

export function useUpdateEducation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateEducationInput) => updateEducation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education"] });
      toast.success("Education updated");
    },
    onError: () => toast.error("Failed to update education"),
  });
}

export function useDeleteEducation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteEducation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education"] });
      toast.success("Education removed");
    },
    onError: () => toast.error("Failed to remove education"),
  });
}

export function useUpdateEducationEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEducationInput }) =>
      updateEducation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education"] });
      toast.success("Education updated");
    },
    onError: () => toast.error("Failed to update education"),
  });
}

/** List screens: pass id per call */
export function useDeleteEducationEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteEducation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education"] });
      toast.success("Education removed");
    },
    onError: () => toast.error("Failed to remove education"),
  });
}