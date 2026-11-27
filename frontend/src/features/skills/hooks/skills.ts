import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSkill,
  deleteSkill,
  getSkillOptions,
  getSkills,
  updateSkill,
} from "../api/skills";
import type {
  CreateSkillInput,
  UpdateSkillInput,
} from "../schema/skill.schema";
import type { SkillListQuery } from "../schema/list.schema";
import { toast } from "sonner";

/** For multi-select: grouped catalog by category */
export function useSkillOptions() {
  return useQuery({
    queryKey: ["skills", "options"],
    queryFn: getSkillOptions,
    staleTime: 60_000,
  });
}

export function useSkills(query: SkillListQuery = {}) {
  return useQuery({
    queryKey: ["skills", query],
    queryFn: () => getSkills(query),
  });
}

export function useCreateSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSkillInput) => createSkill(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast.success("Skill created");
    },
    onError: () => toast.error("Failed to create skill"),
  });
}

export function useUpdateSkill(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSkillInput) => updateSkill(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast.success("Skill updated");
    },
    onError: () => toast.error("Failed to update skill"),
  });
}

export function useDeleteSkill(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteSkill(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast.success("Skill deleted");
    },
    onError: () => toast.error("Failed to delete skill"),
  });
}